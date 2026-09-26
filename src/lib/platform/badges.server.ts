import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { enqueueSyncEvent } from "@/lib/platform/vant-sync.server";

export type VerifiedBadge = {
  userId: string;
  badgeType: string;
  badgeTier: string;
  icon: string;
  color: string;
  title: string | null;
  description: string | null;
  awardedAt: string;
  active: boolean;
};

export const getMyBadge = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<VerifiedBadge[]>`
      select user_id, badge_type, badge_tier, icon, color, title, description, awarded_at, active
      from verified_badges
      where user_id = ${context.userId} and active = true
      limit 1
    `;
    return { badge: rows[0] ?? null };
  });

export const getBadge = createServerFn({ method: "GET" })
  .validator(z.object({ userId: z.string().min(2).max(60) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<VerifiedBadge[]>`
      select user_id, badge_type, badge_tier, icon, color, title, description, awarded_at, active
      from verified_badges
      where user_id = ${data.userId} and active = true
      limit 1
    `;
    return { badge: rows[0] ?? null };
  });

export const listBadges = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ userId: string; badgeTier: string; title: string | null }[]>`
    select user_id, badge_tier, title
    from verified_badges
    where active = true
    order by awarded_at desc
    limit 50
  `;
  return { badges: rows };
});

export const awardBadge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    userId: z.string().min(2).max(60),
    badgeTier: z.string().max(40).default("bronze"),
    icon: z.string().max(40).default("shield"),
    color: z.string().max(20).default("#cd7f32"),
    title: z.string().max(120).optional(),
    description: z.string().max(500).optional(),
  }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into verified_badges (user_id, badge_type, badge_tier, icon, color, title, description, awarded_by)
      values (${data.userId}, 'verified', ${data.badgeTier}, ${data.icon}, ${data.color},
        ${data.title ?? null}, ${data.description ?? null}, ${context.userId})
      on conflict (user_id) do update set
        badge_tier = excluded.badge_tier,
        icon = excluded.icon,
        color = excluded.color,
        title = excluded.title,
        description = excluded.description,
        active = true,
        awarded_at = now()
    `;

    await enqueueSyncEvent({
      eventType: "badge.awarded",
      idempotencyKey: `badge:award:${data.userId}`,
      payload: { userId: data.userId, tier: data.badgeTier, title: data.title },
    });

    return { ok: true };
  });

export const revokeBadge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(2).max(60) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      update verified_badges set active = false
      where user_id = ${data.userId}
    `;
    return { ok: true };
  });
