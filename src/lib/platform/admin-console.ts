import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { CONTACT_EMAIL, OPS_EMAIL, OPS_EMAIL_ALT } from "@/lib/plans";

const ADMIN_EMAILS = new Set([OPS_EMAIL.toLowerCase(), OPS_EMAIL_ALT.toLowerCase(), CONTACT_EMAIL.toLowerCase()]);

export async function requireAdmin(userId: string) {
  const sql = await getSql();
  const roles = await sql<{ role_id: string }>`
    select role_id from user_roles where user_id = ${userId} and role_id = 'admin'
  `;
  if (roles.length > 0) return;
  const users = await sql<{ email: string | null }>`
    select email from "user" where id = ${userId} limit 1
  `;
  const email = (users[0]?.email ?? "").toLowerCase();
  if (ADMIN_EMAILS.has(email)) {
    await sql`
      insert into user_roles (user_id, role_id)
      values (${userId}, 'admin')
      on conflict (user_id, role_id) do nothing
    `;
    return;
  }
  throw new Error("Forbidden");
}

export const getAdminConsole = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const users = await sql<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
      username: string | null;
      verification_status: string | null;
      points: number | null;
      rank_key: string | null;
    }>`
      select u.id, u.name, u.email, u."createdAt",
             p.username, p.verification_status, p.points, p.rank_key
      from "user" u
      left join profiles p on p.user_id = u.id
      order by u."createdAt" desc
      limit 100
    `;
    const purchases = await sql<{
      id: string;
      user_id: string | null;
      plan_id: string;
      product_id: string | null;
      email: string | null;
      amount_total: number | null;
      currency: string | null;
      status: string;
      payment_method: string | null;
      created_at: string;
    }>`
      select id, user_id, plan_id, product_id, email, amount_total, currency, status, payment_method, created_at
      from purchases order by created_at desc limit 80
    `;
    const tickets = await sql<{
      id: string;
      code: string;
      product_id: string;
      tier: string;
      status: string;
      user_id: string;
      created_at: string;
    }>`
      select id, code, product_id, tier, status, user_id, created_at
      from tickets order by created_at desc limit 80
    `;
    const events = await sql<{
      event_id: string;
      type: string;
      status: string | null;
      amount: number | null;
      created_at: string;
    }>`
      select event_id, type, status, amount, created_at
      from stripe_events order by created_at desc limit 40
    `;
    const tournaments = await sql<{ id: string; name: string; status: string; capacity: number }>`
      select id, name, status, capacity from tournaments order by starts_at
    `;
    const entries = await sql<{ tournament_id: string; n: number }>`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `;
    const verifications = await sql<{
      user_id: string;
      username: string | null;
      verification_status: string;
      verification_note: string | null;
    }>`
      select user_id, username, verification_status, verification_note
      from profiles
      where verification_status in ('REVIEW','VERIFIED','REJECTED')
      order by updated_at desc
      limit 50
    `;
    const rankings = await sql<{
      username: string | null;
      display_name: string | null;
      points: number;
      rank_key: string;
    }>`
      select p.username, p.display_name, p.points, p.rank_key
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and p.user_id not like 'seed-%'
      order by p.points desc
      limit 20
    `;
    const support = await sql<{
      id: string;
      name: string;
      email: string;
      category: string;
      status: string;
      created_at: string;
    }>`
      select id, name, email, category, status, created_at
      from support_tickets order by created_at desc limit 40
    `;
    const applications = await sql<{
      gamertag: string;
      discord_username: string;
      role: string;
      game: string;
      status: string;
    }>`
      select gamertag, discord_username, role, game, status
      from tryout_applications order by created_at desc limit 40
    `;
    return {
      users,
      purchases,
      tickets,
      events,
      tournaments,
      entries,
      verifications,
      rankings,
      support,
      applications,
    };
  });

export const setVerificationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      status: z.enum(["PENDING", "REVIEW", "VERIFIED", "REJECTED"]),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`
      update profiles
      set verification_status = ${data.status}, updated_at = now()
      where user_id = ${data.userId}
    `;
    return { ok: true };
  });
