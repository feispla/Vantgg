import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { avatarDataUrl, isAvatarUrl, newAvatarSeed } from "@/lib/avatar";
import { getSql } from "@/lib/db";
import { COUNTRIES, rankFromPoints, type TicketTier } from "@/lib/catalog";
import { getAppUrl } from "@/lib/app-url";
import { hitRateLimit } from "@/lib/platform/rate-limit";
import { randomToken, sha256 } from "@/lib/platform/crypto";
import { newId } from "@/lib/utils";

export type ProfileRow = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  country: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  verification_status: string;
  verification_note: string | null;
  rank_key: string;
  xp: number;
  points: number;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
};

export type PublicPlayer = {
  username: string;
  display_name: string | null;
  country: string | null;
  avatar_url: string | null;
  rank_key: string;
  points: number;
  wins: number;
  losses: number;
  rank: ReturnType<typeof rankFromPoints>;
  position: number;
};

async function persistAvatar(userId: string, avatar: string) {
  const sql = await getSql();
  await sql`
    update profiles set avatar_url = ${avatar}, updated_at = now() where user_id = ${userId}
  `;
  await sql`
    update "user" set image = ${avatar} where id = ${userId}
  `;
}

export async function ensureProfile(userId: string, seed?: { name?: string | null; image?: string | null }) {
  const sql = await getSql();
  const existing = await sql<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  if (existing[0]) {
    if (!existing[0].avatar_url) {
      const generated = seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(userId);
      await persistAvatar(userId, generated);
      existing[0].avatar_url = generated;
    }
    return existing[0];
  }
  const display = seed?.name ?? null;
  const username = display
    ? display
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "")
        .slice(0, 16) || null
    : null;
  const avatar =
    seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(`${userId}:${newAvatarSeed()}`);
  await sql`
    insert into profiles (user_id, username, display_name, avatar_url)
    values (${userId}, ${username}, ${display}, ${avatar})
    on conflict (user_id) do nothing
  `;
  await sql`
    update "user" set image = coalesce(image, ${avatar}) where id = ${userId}
  `;
  const created = await sql<ProfileRow>`select * from profiles where user_id = ${userId} limit 1`;
  return created[0]!;
}

async function bestTier(userId: string): Promise<TicketTier | null> {
  const sql = await getSql();
  const rows = await sql<{ key: string }>`
    select key from entitlements
    where user_id = ${userId} and key in ('ticket.basic','ticket.pro','ticket.elite')
  `;
  const keys = new Set(rows.map((r) => r.key));
  if (keys.has("ticket.elite")) return "elite";
  if (keys.has("ticket.pro")) return "pro";
  if (keys.has("ticket.basic")) return "basic";
  return null;
}

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const users = await sql<{
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      createdAt: string;
      emailVerified: boolean | null;
    }>`
      select id, name, email, image, "createdAt", "emailVerified"
      from "user" where id = ${context.userId} limit 1
    `;
    const user = users[0];
    const profile = await ensureProfile(context.userId, { name: user?.name, image: user?.image });
    const rank = rankFromPoints(profile.points);
    if (rank.key !== profile.rank_key) {
      await sql`update profiles set rank_key = ${rank.key}, updated_at = now() where user_id = ${context.userId}`;
      profile.rank_key = rank.key;
    }
    const purchases = await sql<{
      id: string;
      plan_id: string;
      product_id: string | null;
      amount_total: number | null;
      currency: string | null;
      status: string;
      payment_method: string | null;
      ticket_code: string | null;
      created_at: string;
    }>`
      select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at
      from purchases where user_id = ${context.userId}
      order by created_at desc
    `;
    const tickets = await sql<{
      id: string;
      code: string;
      product_id: string;
      tier: string;
      status: string;
      purchase_id: string;
      created_at: string;
    }>`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets where user_id = ${context.userId}
      order by created_at desc
    `;
    const entries = await sql<{ tournament_id: string; status: string }>`
      select tournament_id, status from tournament_entries where user_id = ${context.userId}
    `;
    const history = await sql<{
      id: string;
      title: string;
      result: string;
      points_delta: number;
      created_at: string;
    }>`
      select id, title, result, points_delta, created_at
      from ranked_history where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
    const positionRows = await sql<{ n: number }>`
      select count(*)::int as n
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and p.user_id not like 'seed-%'
        and p.points > ${profile.points}
    `;
    return {
      user: {
        id: context.userId,
        name: user?.name ?? profile.display_name,
        email: user?.email ?? null,
        image: profile.avatar_url ?? user?.image ?? avatarDataUrl(context.userId),
        createdAt: user?.createdAt ?? profile.created_at,
        emailVerified: Boolean(user?.emailVerified || profile.email_verified),
      },
      profile,
      rank,
      tier: await bestTier(context.userId),
      position: (positionRows[0]?.n ?? 0) + 1,
      purchases,
      tickets,
      entries,
      history,
      winRate:
        profile.wins + profile.losses === 0
          ? 0
          : Math.round((profile.wins / (profile.wins + profile.losses)) * 100),
    };
  });

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  username: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  country: z.string().trim().min(2).max(40),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(profileSchema)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const taken = await sql<{ user_id: string }>`
      select user_id from profiles
      where lower(username) = ${data.username.toLowerCase()} and user_id <> ${context.userId}
      limit 1
    `;
    if (taken.length) throw new Error("Ese username ya está en uso.");
    if (!COUNTRIES.includes(data.country as (typeof COUNTRIES)[number]) && data.country !== "Otro") {
      throw new Error("País no válido.");
    }
    await sql`
      update profiles
      set display_name = ${data.displayName},
          username = ${data.username},
          country = ${data.country},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    await sql`
      update "user" set name = ${data.displayName} where id = ${context.userId}
    `;
    return { ok: true };
  });

export const updateMyAvatar = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      avatarUrl: z.string().min(24).max(180000),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!isAvatarUrl(data.avatarUrl)) throw new Error("Formato de logo no válido.");
    await ensureProfile(context.userId);
    await persistAvatar(context.userId, data.avatarUrl);
    return { ok: true, avatarUrl: data.avatarUrl };
  });

export const rerollMyAvatar = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const avatar = avatarDataUrl(`${context.userId}:${newAvatarSeed()}`);
    await persistAvatar(context.userId, avatar);
    return { ok: true, avatarUrl: avatar };
  });

export const listPublicPlayers = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    username: string;
    display_name: string | null;
    country: string | null;
    avatar_url: string | null;
    rank_key: string;
    points: number;
    wins: number;
    losses: number;
  }>`
    select p.username, p.display_name, p.country, p.avatar_url, p.rank_key, p.points, p.wins, p.losses
    from profiles p
    inner join "user" u on u.id = p.user_id
    where p.username is not null
      and btrim(p.username) <> ''
      and u."emailVerified" = true
      and p.user_id not like 'seed-%'
    order by p.points desc, p.created_at asc
    limit 80
  `;
  return rows.map((p, i) => {
    const rank = rankFromPoints(p.points);
    return {
      ...p,
      rank_key: rank.key,
      rank,
      position: i + 1,
      avatar_url: p.avatar_url && p.avatar_url.length > 8 ? p.avatar_url : avatarDataUrl(p.username),
    };
  });
});

export const getPublicPlayer = createServerFn({ method: "GET" })
  .validator(z.object({ username: z.string().trim().min(2).max(20) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{
      username: string;
      display_name: string | null;
      country: string | null;
      avatar_url: string | null;
      rank_key: string;
      points: number;
      wins: number;
      losses: number;
      created_at: string;
    }>`
      select p.username, p.display_name, p.country, p.avatar_url, p.rank_key, p.points, p.wins, p.losses, p.created_at
      from profiles p
      inner join "user" u on u.id = p.user_id
      where lower(p.username) = ${data.username.toLowerCase()}
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
      limit 1
    `;
    const row = rows[0];
    if (!row) return { player: null as PublicPlayer | null, rank: null, position: null as number | null };
    if (!row.avatar_url || row.avatar_url.length < 8) {
      row.avatar_url = avatarDataUrl(row.username);
    }
    const rank = rankFromPoints(row.points);
    const ahead = await sql<{ n: number }>`
      select count(*)::int as n
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
        and p.points > ${row.points}
    `;
    const player: PublicPlayer = {
      ...row,
      rank_key: rank.key,
      rank,
      position: (ahead[0]?.n ?? 0) + 1,
    };
    return { player, rank, position: player.position };
  });

export const requestEmailVerification = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const limited = await hitRateLimit(`verify:${context.userId}`, 5, 60 * 60 * 1000);
    if (!limited.ok) throw new Error("Demasiados envíos. Espera un poco.");
    const sql = await getSql();
    const users = await sql<{ email: string | null; name: string | null }>`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
    const email = users[0]?.email;
    if (!email) throw new Error("Tu cuenta no tiene email.");
    const token = randomToken();
    await sql`
      insert into auth_tokens (id, user_id, email, type, token_hash, expires_at)
      values (${newId()}, ${context.userId}, ${email}, 'email_verify', ${sha256(token)}, now() + interval '24 hours')
    `;
    const url = `${getAppUrl()}/verify-email?token=${token}`;
    const { queueEmail } = await import("@/lib/platform/email.server");
    const mailed = await queueEmail({
      to: email,
      template: "verify",
      body: `Hola ${users[0]?.name ?? ""}.\n\nConfirma tu cuenta VANT con este enlace (24h).`,
      actionUrl: url,
    });
    return {
      queued: true,
      delivered: mailed.delivered,
      previewUrl: mailed.delivered ? null : url,
    };
  });

export const confirmEmailToken = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(16) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const hash = sha256(data.token);
    const rows = await sql<{ id: string; user_id: string | null; expires_at: string; used_at: string | null }>`
      select id, user_id, expires_at, used_at from auth_tokens
      where token_hash = ${hash} and type = 'email_verify' limit 1
    `;
    const row = rows[0];
    if (!row || row.used_at) throw new Error("Enlace no válido.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("El enlace ha caducado.");
    if (row.user_id) {
      await sql`update profiles set email_verified = true, updated_at = now() where user_id = ${row.user_id}`;
      await sql`update "user" set "emailVerified" = true where id = ${row.user_id}`;
    }
    await sql`update auth_tokens set used_at = now() where id = ${row.id}`;
    return { ok: true };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().trim().email() }))
  .handler(async ({ data }) => {
    const limited = await hitRateLimit(`reset:${data.email.toLowerCase()}`, 5, 60 * 60 * 1000);
    if (!limited.ok) return { ok: true };
    const sql = await getSql();
    const users = await sql<{ id: string; email: string | null }>`
      select id, email from "user" where lower(email) = ${data.email.toLowerCase()} limit 1
    `;
    const user = users[0];
    if (!user?.email) return { ok: true };
    const token = randomToken();
    await sql`
      insert into auth_tokens (id, user_id, email, type, token_hash, expires_at)
      values (${newId()}, ${user.id}, ${user.email}, 'password_reset', ${sha256(token)}, now() + interval '1 hour')
    `;
    const url = `${getAppUrl()}/reset-password?token=${token}`;
    const { queueEmail } = await import("@/lib/platform/email.server");
    await queueEmail({
      to: user.email,
      template: "reset",
      body: "Usa este enlace para elegir una nueva contraseña. Caduca en 1 hora. Si no lo pediste, ignóralo.",
      actionUrl: url,
    });
    return { ok: true };
  });

export const resetPasswordWithToken = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(16),
      password: z.string().min(8).max(128),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const hash = sha256(data.token);
    const rows = await sql<{ id: string; user_id: string | null; expires_at: string; used_at: string | null }>`
      select id, user_id, expires_at, used_at from auth_tokens
      where token_hash = ${hash} and type = 'password_reset' limit 1
    `;
    const row = rows[0];
    if (!row?.user_id || row.used_at) throw new Error("Enlace no válido.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("El enlace ha caducado.");
    const { auth } = await import("@/lib/auth/server");
    const ctx = await auth.$context;
    const passwordHash = await ctx.password.hash(data.password);
    await ctx.internalAdapter.updatePassword(row.user_id, passwordHash);
    await sql`update auth_tokens set used_at = now() where id = ${row.id}`;
    return { ok: true };
  });

export const completeRegistration = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      username: z
        .string()
        .trim()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/),
      country: z.string().trim().min(2).max(40),
      displayName: z.string().trim().min(2).max(60),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const avatar = avatarDataUrl(`${context.userId}:${data.username}:${newAvatarSeed()}`);
    await ensureProfile(context.userId, { name: data.displayName, image: avatar });
    const taken = await sql<{ user_id: string }>`
      select user_id from profiles
      where lower(username) = ${data.username.toLowerCase()} and user_id <> ${context.userId}
      limit 1
    `;
    if (taken.length) throw new Error("Ese username ya está en uso.");
    await sql`
      update profiles
      set username = ${data.username},
          country = ${data.country},
          display_name = ${data.displayName},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    await persistAvatar(context.userId, avatar);
    await sql`
      update "user" set name = ${data.displayName} where id = ${context.userId}
    `;
    const users = await sql<{ email: string | null }>`
      select email from "user" where id = ${context.userId} limit 1
    `;
    if (users[0]?.email) {
      try {
        const { queueEmail } = await import("@/lib/platform/email.server");
        await queueEmail({
          to: users[0].email,
          template: "register",
          body: `Cuenta creada. Username: ${data.username}. Verifica tu email para desbloquear todo VANT.`,
        });
      } catch {
        // registration still succeeds if mail is down
      }
    }
    return { ok: true };
  });

export const getVerificationPreview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const users = await sql<{ email: string | null }>`
      select email from "user" where id = ${context.userId} limit 1
    `;
    if (!users[0]?.email) return { preview: null as string | null };
    const { latestPreviewLink } = await import("@/lib/platform/email.server");
    const row = await latestPreviewLink(users[0].email, "verify");
    return { preview: row?.action_url ?? null, status: row?.status ?? null };
  });

export const requestKycReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ note: z.string().trim().max(500).optional() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    await sql`
      update profiles
      set verification_status = 'REVIEW',
          verification_note = ${data.note ?? null},
          updated_at = now()
      where user_id = ${context.userId} and verification_status in ('PENDING','REJECTED')
    `;
    return { ok: true, status: "REVIEW" as const };
  });
