import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { CONTACT_EMAIL, OPS_EMAIL, OPS_EMAIL_ALT } from "@/lib/plans";

const ADMIN_EMAILS = new Set([OPS_EMAIL.toLowerCase(), OPS_EMAIL_ALT.toLowerCase(), CONTACT_EMAIL.toLowerCase()]);

async function requireAdmin(userId: string) {
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

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const applications = await sql<{
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
      order by created_at desc
      limit 50
    `;
    const purchases = await sql<{
      id: string;
      plan_id: string;
      discord_username: string | null;
      email: string | null;
      amount_total: number | null;
      currency: string | null;
      status: string;
      created_at: string;
    }>`
      select id, plan_id, discord_username, email, amount_total, currency, status, created_at
      from purchases
      order by created_at desc
      limit 50
    `;
    const rsvps = await sql<{ event_id: string; n: number }>`
      select event_id, count(*)::int as n from event_rsvps group by event_id
    `;
    const users = await sql<{ n: number }>`select count(*)::int as n from "user"`;
    return {
      applications,
      purchases,
      rsvps,
      userCount: users[0]?.n ?? 0,
    };
  });

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      await requireAdmin(context.userId);
      return { isAdmin: true };
    } catch {
      return { isAdmin: false };
    }
  });
