import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  handle: string | null;
  icon: string | null;
  active: boolean;
  sort_order: number;
};

export const getSocialLinks = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<SocialLink[]>`
    select id, platform, label, url, handle, icon, active, sort_order
    from social_links
    where active = true
    order by sort_order asc
  `;
  return { links: rows };
});

export const getAllSocialLinks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<SocialLink[]>`
      select id, platform, label, url, handle, icon, active, sort_order
      from social_links
      order by sort_order asc
    `;
    return { links: rows };
  });

export const upsertSocialLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    id: z.string().min(2).max(60),
    platform: z.string().min(2).max(40),
    label: z.string().min(1).max(60),
    url: z.string().url().max(500),
    handle: z.string().max(100).optional().nullable(),
    icon: z.string().max(40).optional().nullable(),
    active: z.boolean().optional().default(true),
    sort_order: z.number().int().optional().default(0),
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into social_links (id, platform, label, url, handle, icon, active, sort_order)
      values (${data.id}, ${data.platform}, ${data.label}, ${data.url}, ${data.handle ?? null}, ${data.icon ?? null}, ${data.active}, ${data.sort_order})
      on conflict (platform) do update set
        label = excluded.label,
        url = excluded.url,
        handle = excluded.handle,
        icon = excluded.icon,
        active = excluded.active,
        sort_order = excluded.sort_order,
        updated_at = now()
    `;
    return { ok: true };
  });

export const deleteSocialLink = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(2).max(60) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from social_links where id = ${data.id}`;
    return { ok: true };
  });
