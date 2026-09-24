import { r as getSql } from "./db-B12kHszo.mjs";
import { i as OPS_EMAIL_ALT, r as OPS_EMAIL, t as CONTACT_EMAIL } from "./plans-BL2SEEb7.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-console-Tgadm_Me.js
var ADMIN_EMAILS = /* @__PURE__ */ new Set([
	OPS_EMAIL.toLowerCase(),
	OPS_EMAIL_ALT.toLowerCase(),
	CONTACT_EMAIL.toLowerCase()
]);
async function requireAdmin(userId) {
	const sql = await getSql();
	if ((await sql`
    select role_id from user_roles where user_id = ${userId} and role_id = 'admin'
  `).length > 0) return;
	const email = ((await sql`
    select email from "user" where id = ${userId} limit 1
  `)[0]?.email ?? "").toLowerCase();
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
var getAdminConsole_createServerFn_handler = createServerRpc({
	id: "0b7f29839d11cdb102f7ddfa02530c545cb81b4e33aaf1a1d10d6ad13ed7f7a9",
	name: "getAdminConsole",
	filename: "src/lib/platform/admin-console.ts"
}, (opts) => getAdminConsole.__executeServer(opts));
var getAdminConsole = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminConsole_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	return {
		users: await sql`
      select u.id, u.name, u.email, u."createdAt",
             p.username, p.verification_status, p.points, p.rank_key
      from "user" u
      left join profiles p on p.user_id = u.id
      order by u."createdAt" desc
      limit 100
    `,
		purchases: await sql`
      select id, user_id, plan_id, product_id, email, amount_total, currency, status, payment_method, created_at
      from purchases order by created_at desc limit 80
    `,
		tickets: await sql`
      select id, code, product_id, tier, status, user_id, created_at
      from tickets order by created_at desc limit 80
    `,
		events: await sql`
      select event_id, type, status, amount, created_at
      from stripe_events order by created_at desc limit 40
    `,
		tournaments: await sql`
      select id, name, status, capacity from tournaments order by starts_at
    `,
		entries: await sql`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `,
		verifications: await sql`
      select user_id, username, verification_status, verification_note
      from profiles
      where verification_status in ('REVIEW','VERIFIED','REJECTED')
      order by updated_at desc
      limit 50
    `,
		rankings: await sql`
      select p.username, p.display_name, p.points, p.rank_key
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and p.user_id not like 'seed-%'
      order by p.points desc
      limit 20
    `,
		support: await sql`
      select id, name, email, category, status, created_at
      from support_tickets order by created_at desc limit 40
    `,
		applications: await sql`
      select gamertag, discord_username, role, game, status
      from tryout_applications order by created_at desc limit 40
    `
	};
});
var setVerificationStatus_createServerFn_handler = createServerRpc({
	id: "05e68b20309bb17b98ab9a94fde95d7a6dc96d521e51f7751172bfa51f4c5960",
	name: "setVerificationStatus",
	filename: "src/lib/platform/admin-console.ts"
}, (opts) => setVerificationStatus.__executeServer(opts));
var setVerificationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	status: _enum([
		"PENDING",
		"REVIEW",
		"VERIFIED",
		"REJECTED"
	])
})).handler(setVerificationStatus_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`
      update profiles
      set verification_status = ${data.status}, updated_at = now()
      where user_id = ${data.userId}
    `;
	return { ok: true };
});
//#endregion
export { getAdminConsole_createServerFn_handler, setVerificationStatus_createServerFn_handler };
