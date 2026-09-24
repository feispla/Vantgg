import { r as getSql } from "./db-B12kHszo.mjs";
import { i as OPS_EMAIL_ALT, r as OPS_EMAIL, t as CONTACT_EMAIL } from "./plans-BL2SEEb7.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bdp1ZLZD.js
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
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "2549f9a9205f79114d7d5308f3c10fc43c16e71528bf9a7cfedd24a564424c87",
	name: "getAdminOverview",
	filename: "src/lib/admin.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	return {
		applications: await sql`
      select id, gamertag, discord_username, role, game, note, status, created_at
      from tryout_applications
      order by created_at desc
      limit 50
    `,
		purchases: await sql`
      select id, plan_id, discord_username, email, amount_total, currency, status, created_at
      from purchases
      order by created_at desc
      limit 50
    `,
		rsvps: await sql`
      select event_id, count(*)::int as n from event_rsvps group by event_id
    `,
		userCount: (await sql`select count(*)::int as n from "user"`)[0]?.n ?? 0
	};
});
var checkAdmin_createServerFn_handler = createServerRpc({
	id: "7a4e9b683da1fdae3847482bc673c8aa12f5a6c4e41ad0452137b1e6b46a8733",
	name: "checkAdmin",
	filename: "src/lib/admin.ts"
}, (opts) => checkAdmin.__executeServer(opts));
var checkAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(checkAdmin_createServerFn_handler, async ({ context }) => {
	try {
		await requireAdmin(context.userId);
		return { isAdmin: true };
	} catch {
		return { isAdmin: false };
	}
});
//#endregion
export { checkAdmin_createServerFn_handler, getAdminOverview_createServerFn_handler };
