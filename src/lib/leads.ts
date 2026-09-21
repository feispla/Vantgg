import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";

const tryoutSchema = z.object({
  tag: z.string().trim().min(2).max(60),
  discord: z.string().trim().min(2).max(80),
  role: z.string().trim().min(2).max(40),
  game: z.string().trim().min(2).max(40),
  note: z.string().trim().max(1000).optional(),
});

export const submitTryoutApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(tryoutSchema)
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into tryout_applications (id, user_id, gamertag, discord_username, role, game, note)
      values (${id}, ${context.userId}, ${data.tag}, ${data.discord}, ${data.role}, ${data.game}, ${data.note ?? null})
    `;
    await sql`
      insert into audit_logs (id, actor_user_id, action, resource_type, resource_id)
      values (${newId()}, ${context.userId}, 'tryout.submit', 'application', ${id})
    `;
    const users = await sql<{ email: string | null; name: string | null }>`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
    const { deliverInbound } = await import("@/lib/platform/inbound-delivery.server");
    await deliverInbound({
      kind: "application",
      name: data.tag,
      email: users[0]?.email ?? "unknown@vant.ltd",
      subject: `Tryout ${data.game} · ${data.role}`,
      message: data.note || `Postulación ${data.tag} · ${data.role} · ${data.game}`,
      source: "apply",
      discord: data.discord,
      extra: { role: data.role, rank: data.game, userId: context.userId, applicationId: id },
    });
    return { id };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      gamertag: string;
      discord_username: string;
      role: string;
      game: string;
      note: string | null;
      status: string;
      created_at: string;
    }>`
      select id, gamertag, discord_username, role, game, note, status, created_at
      from tryout_applications
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
  });

const rsvpSchema = z.object({
  eventId: z.string().trim().min(2).max(80),
  displayName: z.string().trim().min(2).max(60),
  discord: z.string().trim().min(2).max(80),
});

export const rsvpEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(rsvpSchema)
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into event_rsvps (id, user_id, event_id, display_name, discord_username)
      values (${id}, ${context.userId}, ${data.eventId}, ${data.displayName}, ${data.discord})
      on conflict (user_id, event_id) do update set
        display_name = excluded.display_name,
        discord_username = excluded.discord_username
    `;
    return { id };
  });

export const listMyRsvps = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ event_id: string }>`
      select event_id from event_rsvps where user_id = ${context.userId}
    `;
  });
