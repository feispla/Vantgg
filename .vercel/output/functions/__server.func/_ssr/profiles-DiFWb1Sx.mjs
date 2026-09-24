import { n as newId } from "./utils-DG8erAqy.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as sha256, t as randomToken } from "./crypto-CHRFo8dF.mjs";
import { a as newAvatarSeed, i as isAvatarUrl, r as avatarDataUrl, t as COUNTRIES } from "./avatar-DYTTtK-m.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { t as getAppUrl } from "./app-url-D20KWGKr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { s as rankFromPoints } from "./ranks-CBPR_Saa.mjs";
import { t as hitRateLimit } from "./rate-limit-Bayl4Gyc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profiles-DiFWb1Sx.js
async function persistAvatar(userId, avatar) {
	const sql = await getSql();
	await sql`
    update profiles set avatar_url = ${avatar}, updated_at = now() where user_id = ${userId}
  `;
	await sql`
    update "user" set image = ${avatar} where id = ${userId}
  `;
}
async function ensureProfile(userId, seed) {
	const sql = await getSql();
	const existing = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (existing[0]) {
		if (!existing[0].avatar_url) {
			const generated = seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(userId);
			await persistAvatar(userId, generated);
			existing[0].avatar_url = generated;
		}
		return existing[0];
	}
	const display = seed?.name ?? null;
	const username = display ? display.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 16) || null : null;
	const avatar = seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(`${userId}:${newAvatarSeed()}`);
	await sql`
    insert into profiles (user_id, username, display_name, avatar_url)
    values (${userId}, ${username}, ${display}, ${avatar})
    on conflict (user_id) do nothing
  `;
	await sql`
    update "user" set image = coalesce(image, ${avatar}) where id = ${userId}
  `;
	return (await sql`select * from profiles where user_id = ${userId} limit 1`)[0];
}
async function bestTier(userId) {
	const rows = await (await getSql())`
    select key from entitlements
    where user_id = ${userId} and key in ('ticket.basic','ticket.pro','ticket.elite')
  `;
	const keys = new Set(rows.map((r) => r.key));
	if (keys.has("ticket.elite")) return "elite";
	if (keys.has("ticket.pro")) return "pro";
	if (keys.has("ticket.basic")) return "basic";
	return null;
}
var getMyAccount_createServerFn_handler = createServerRpc({
	id: "deb3a2d4496fca2e82878f5aff1c93434ca03e1d92443fc0072d8658352010b3",
	name: "getMyAccount",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => getMyAccount.__executeServer(opts));
var getMyAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyAccount_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const user = (await sql`
      select id, name, email, image, "createdAt", "emailVerified"
      from "user" where id = ${context.userId} limit 1
    `)[0];
	const profile = await ensureProfile(context.userId, {
		name: user?.name,
		image: user?.image
	});
	const rank = rankFromPoints(profile.points);
	if (rank.key !== profile.rank_key) {
		await sql`update profiles set rank_key = ${rank.key}, updated_at = now() where user_id = ${context.userId}`;
		profile.rank_key = rank.key;
	}
	const purchases = await sql`
      select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at
      from purchases where user_id = ${context.userId}
      order by created_at desc
    `;
	const tickets = await sql`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets where user_id = ${context.userId}
      order by created_at desc
    `;
	const entries = await sql`
      select tournament_id, status from tournament_entries where user_id = ${context.userId}
    `;
	const history = await sql`
      select id, title, result, points_delta, created_at
      from ranked_history where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
	const positionRows = await sql`
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
			emailVerified: Boolean(user?.emailVerified || profile.email_verified)
		},
		profile,
		rank,
		tier: await bestTier(context.userId),
		position: (positionRows[0]?.n ?? 0) + 1,
		purchases,
		tickets,
		entries,
		history,
		winRate: profile.wins + profile.losses === 0 ? 0 : Math.round(profile.wins / (profile.wins + profile.losses) * 100)
	};
});
var profileSchema = object({
	displayName: string().trim().min(2).max(60),
	username: string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
	country: string().trim().min(2).max(40)
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "af0f64d23fee3b242de735a28a4fd49e4fd36c8174f2edd304331bd0af64f763",
	name: "updateMyProfile",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(profileSchema).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	if ((await sql`
      select user_id from profiles
      where lower(username) = ${data.username.toLowerCase()} and user_id <> ${context.userId}
      limit 1
    `).length) throw new Error("Ese username ya está en uso.");
	if (!COUNTRIES.includes(data.country) && data.country !== "Otro") throw new Error("País no válido.");
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
var updateMyAvatar_createServerFn_handler = createServerRpc({
	id: "1901095251ff239f8285ffb4744e9bab5fdeb5922965b0aba15ce23ca448d7cf",
	name: "updateMyAvatar",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => updateMyAvatar.__executeServer(opts));
var updateMyAvatar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ avatarUrl: string().min(24).max(18e4) })).handler(updateMyAvatar_createServerFn_handler, async ({ context, data }) => {
	if (!isAvatarUrl(data.avatarUrl)) throw new Error("Formato de logo no válido.");
	await ensureProfile(context.userId);
	await persistAvatar(context.userId, data.avatarUrl);
	return {
		ok: true,
		avatarUrl: data.avatarUrl
	};
});
var rerollMyAvatar_createServerFn_handler = createServerRpc({
	id: "86363557105de8797960e854ddac0b263e9ef9e01106f93a1293aea51fa8e45d",
	name: "rerollMyAvatar",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => rerollMyAvatar.__executeServer(opts));
var rerollMyAvatar = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(rerollMyAvatar_createServerFn_handler, async ({ context }) => {
	await ensureProfile(context.userId);
	const avatar = avatarDataUrl(`${context.userId}:${newAvatarSeed()}`);
	await persistAvatar(context.userId, avatar);
	return {
		ok: true,
		avatarUrl: avatar
	};
});
var listPublicPlayers_createServerFn_handler = createServerRpc({
	id: "1fa8a9906c72f4a50b48fdcdb290a726a0d0aa9f6eb4095960360e3c5da6dc69",
	name: "listPublicPlayers",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => listPublicPlayers.__executeServer(opts));
var listPublicPlayers = createServerFn({ method: "GET" }).handler(listPublicPlayers_createServerFn_handler, async () => {
	return (await (await getSql())`
    select p.username, p.display_name, p.country, p.avatar_url, p.rank_key, p.points, p.wins, p.losses
    from profiles p
    inner join "user" u on u.id = p.user_id
    where p.username is not null
      and btrim(p.username) <> ''
      and u."emailVerified" = true
      and p.user_id not like 'seed-%'
    order by p.points desc, p.created_at asc
    limit 80
  `).map((p, i) => {
		const rank = rankFromPoints(p.points);
		return {
			...p,
			rank_key: rank.key,
			rank,
			position: i + 1,
			avatar_url: p.avatar_url && p.avatar_url.length > 8 ? p.avatar_url : avatarDataUrl(p.username)
		};
	});
});
var getPublicPlayer_createServerFn_handler = createServerRpc({
	id: "a6f167651d03b3e38721a8594ae6e224afcba8693ec08bd2571bf8fec4f5d160",
	name: "getPublicPlayer",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => getPublicPlayer.__executeServer(opts));
var getPublicPlayer = createServerFn({ method: "GET" }).validator(object({ username: string().trim().min(2).max(20) })).handler(getPublicPlayer_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql`
      select p.username, p.display_name, p.country, p.avatar_url, p.rank_key, p.points, p.wins, p.losses, p.created_at
      from profiles p
      inner join "user" u on u.id = p.user_id
      where lower(p.username) = ${data.username.toLowerCase()}
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
      limit 1
    `)[0];
	if (!row) return {
		player: null,
		rank: null,
		position: null
	};
	if (!row.avatar_url || row.avatar_url.length < 8) row.avatar_url = avatarDataUrl(row.username);
	const rank = rankFromPoints(row.points);
	const ahead = await sql`
      select count(*)::int as n
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
        and p.points > ${row.points}
    `;
	const player = {
		...row,
		rank_key: rank.key,
		rank,
		position: (ahead[0]?.n ?? 0) + 1
	};
	return {
		player,
		rank,
		position: player.position
	};
});
var requestEmailVerification_createServerFn_handler = createServerRpc({
	id: "11c6d0549c71671718ee536cfaa7ed30163331642c3e320556579744f1694777",
	name: "requestEmailVerification",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => requestEmailVerification.__executeServer(opts));
var requestEmailVerification = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(requestEmailVerification_createServerFn_handler, async ({ context }) => {
	if (!(await hitRateLimit(`verify:${context.userId}`, 5, 36e5)).ok) throw new Error("Demasiados envíos. Espera un poco.");
	const sql = await getSql();
	const users = await sql`
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
	const { queueEmail } = await import("./email.server-DO3567x7.mjs").then((n) => n.t).then((n) => n.t);
	const mailed = await queueEmail({
		to: email,
		template: "verify",
		body: `Hola ${users[0]?.name ?? ""}.\n\nConfirma tu cuenta VANT con este enlace (24h).`,
		actionUrl: url
	});
	return {
		queued: true,
		delivered: mailed.delivered,
		previewUrl: mailed.delivered ? null : url
	};
});
var confirmEmailToken_createServerFn_handler = createServerRpc({
	id: "fa1d5328f8b8eec12ffe895e2d4f65b8e570d25ad58af71bd29b296a15cbceeb",
	name: "confirmEmailToken",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => confirmEmailToken.__executeServer(opts));
var confirmEmailToken = createServerFn({ method: "POST" }).validator(object({ token: string().min(16) })).handler(confirmEmailToken_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql`
      select id, user_id, expires_at, used_at from auth_tokens
      where token_hash = ${sha256(data.token)} and type = 'email_verify' limit 1
    `)[0];
	if (!row || row.used_at) throw new Error("Enlace no válido.");
	if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("El enlace ha caducado.");
	if (row.user_id) {
		await sql`update profiles set email_verified = true, updated_at = now() where user_id = ${row.user_id}`;
		await sql`update "user" set "emailVerified" = true where id = ${row.user_id}`;
	}
	await sql`update auth_tokens set used_at = now() where id = ${row.id}`;
	return { ok: true };
});
var requestPasswordReset_createServerFn_handler = createServerRpc({
	id: "acfbb6a9867654bc78f8e1b5a0a83b7200b77b7f078c7f25dc2d0ea44e16d720",
	name: "requestPasswordReset",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => requestPasswordReset.__executeServer(opts));
var requestPasswordReset = createServerFn({ method: "POST" }).validator(object({ email: string().trim().email() })).handler(requestPasswordReset_createServerFn_handler, async ({ data }) => {
	if (!(await hitRateLimit(`reset:${data.email.toLowerCase()}`, 5, 36e5)).ok) return { ok: true };
	const sql = await getSql();
	const user = (await sql`
      select id, email from "user" where lower(email) = ${data.email.toLowerCase()} limit 1
    `)[0];
	if (!user?.email) return { ok: true };
	const token = randomToken();
	await sql`
      insert into auth_tokens (id, user_id, email, type, token_hash, expires_at)
      values (${newId()}, ${user.id}, ${user.email}, 'password_reset', ${sha256(token)}, now() + interval '1 hour')
    `;
	const url = `${getAppUrl()}/reset-password?token=${token}`;
	const { queueEmail } = await import("./email.server-DO3567x7.mjs").then((n) => n.t).then((n) => n.t);
	await queueEmail({
		to: user.email,
		template: "reset",
		body: "Usa este enlace para elegir una nueva contraseña. Caduca en 1 hora. Si no lo pediste, ignóralo.",
		actionUrl: url
	});
	return { ok: true };
});
var resetPasswordWithToken_createServerFn_handler = createServerRpc({
	id: "55b1b1f36c46fae1275017a6b6f845de2e8439e5a940cd26ecfcde655d3990f4",
	name: "resetPasswordWithToken",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => resetPasswordWithToken.__executeServer(opts));
var resetPasswordWithToken = createServerFn({ method: "POST" }).validator(object({
	token: string().min(16),
	password: string().min(8).max(128)
})).handler(resetPasswordWithToken_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const row = (await sql`
      select id, user_id, expires_at, used_at from auth_tokens
      where token_hash = ${sha256(data.token)} and type = 'password_reset' limit 1
    `)[0];
	if (!row?.user_id || row.used_at) throw new Error("Enlace no válido.");
	if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("El enlace ha caducado.");
	const { auth } = await import("./server-DmcI2TpJ.mjs").then((n) => n.r);
	const ctx = await auth.$context;
	const passwordHash = await ctx.password.hash(data.password);
	await ctx.internalAdapter.updatePassword(row.user_id, passwordHash);
	await sql`update auth_tokens set used_at = now() where id = ${row.id}`;
	return { ok: true };
});
var completeRegistration_createServerFn_handler = createServerRpc({
	id: "516284c55788431ae8c2fbd52335493fc98812a0eeb83cc739f8dc48ee786302",
	name: "completeRegistration",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => completeRegistration.__executeServer(opts));
var completeRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	username: string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
	country: string().trim().min(2).max(40),
	displayName: string().trim().min(2).max(60)
})).handler(completeRegistration_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const avatar = avatarDataUrl(`${context.userId}:${data.username}:${newAvatarSeed()}`);
	await ensureProfile(context.userId, {
		name: data.displayName,
		image: avatar
	});
	if ((await sql`
      select user_id from profiles
      where lower(username) = ${data.username.toLowerCase()} and user_id <> ${context.userId}
      limit 1
    `).length) throw new Error("Ese username ya está en uso.");
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
	const users = await sql`
      select email from "user" where id = ${context.userId} limit 1
    `;
	if (users[0]?.email) try {
		const { queueEmail } = await import("./email.server-DO3567x7.mjs").then((n) => n.t).then((n) => n.t);
		await queueEmail({
			to: users[0].email,
			template: "register",
			body: `Cuenta creada. Username: ${data.username}. Verifica tu email para desbloquear todo VANT.`
		});
	} catch {}
	return { ok: true };
});
var getVerificationPreview_createServerFn_handler = createServerRpc({
	id: "a19fb881fa295077d8f467a3c326b5c8f7ad59fc6d974e9909ae77a50f3a0823",
	name: "getVerificationPreview",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => getVerificationPreview.__executeServer(opts));
var getVerificationPreview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getVerificationPreview_createServerFn_handler, async ({ context }) => {
	const users = await (await getSql())`
      select email from "user" where id = ${context.userId} limit 1
    `;
	if (!users[0]?.email) return { preview: null };
	const { latestPreviewLink } = await import("./email.server-DO3567x7.mjs").then((n) => n.t).then((n) => n.t);
	const row = await latestPreviewLink(users[0].email, "verify");
	return {
		preview: row?.action_url ?? null,
		status: row?.status ?? null
	};
});
var requestKycReview_createServerFn_handler = createServerRpc({
	id: "431bc9d5fc46497de97f6406b9b73cb4b7ef0a876f0ad389befdd1cb5f1f6527",
	name: "requestKycReview",
	filename: "src/lib/platform/profiles.ts"
}, (opts) => requestKycReview.__executeServer(opts));
var requestKycReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ note: string().trim().max(500).optional() })).handler(requestKycReview_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	await sql`
      update profiles
      set verification_status = 'REVIEW',
          verification_note = ${data.note ?? null},
          updated_at = now()
      where user_id = ${context.userId} and verification_status in ('PENDING','REJECTED')
    `;
	return {
		ok: true,
		status: "REVIEW"
	};
});
//#endregion
export { completeRegistration_createServerFn_handler, confirmEmailToken_createServerFn_handler, getMyAccount_createServerFn_handler, getPublicPlayer_createServerFn_handler, getVerificationPreview_createServerFn_handler, listPublicPlayers_createServerFn_handler, requestEmailVerification_createServerFn_handler, requestKycReview_createServerFn_handler, requestPasswordReset_createServerFn_handler, rerollMyAvatar_createServerFn_handler, resetPasswordWithToken_createServerFn_handler, updateMyAvatar_createServerFn_handler, updateMyProfile_createServerFn_handler };
