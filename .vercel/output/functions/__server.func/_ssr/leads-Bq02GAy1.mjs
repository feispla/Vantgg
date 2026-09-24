import { n as newId } from "./utils-DG8erAqy.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-Bq02GAy1.js
var tryoutSchema = object({
	tag: string().trim().min(2).max(60),
	discord: string().trim().min(2).max(80),
	role: string().trim().min(2).max(40),
	game: string().trim().min(2).max(40),
	note: string().trim().max(1e3).optional()
});
var submitTryoutApplication_createServerFn_handler = createServerRpc({
	id: "b13543da5b6a32438f6a0c037c211af2e34004ccc88d426937936941606e3724",
	name: "submitTryoutApplication",
	filename: "src/lib/leads.ts"
}, (opts) => submitTryoutApplication.__executeServer(opts));
var submitTryoutApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(tryoutSchema).handler(submitTryoutApplication_createServerFn_handler, async ({ data, context }) => {
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
	const users = await sql`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
	const { deliverInbound } = await import("./inbound-delivery.server-KjBePoSb.mjs").then((n) => n.n);
	await deliverInbound({
		kind: "application",
		name: data.tag,
		email: users[0]?.email ?? "unknown@vant.ltd",
		subject: `Tryout ${data.game} · ${data.role}`,
		message: data.note || `Postulación ${data.tag} · ${data.role} · ${data.game}`,
		source: "apply",
		discord: data.discord,
		extra: {
			role: data.role,
			rank: data.game,
			userId: context.userId,
			applicationId: id
		}
	});
	return { id };
});
var listMyApplications_createServerFn_handler = createServerRpc({
	id: "3f1a7e93850560074da59a1323a3e04b517dead5dee470eb3c25c3a669ab5855",
	name: "listMyApplications",
	filename: "src/lib/leads.ts"
}, (opts) => listMyApplications.__executeServer(opts));
var listMyApplications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyApplications_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, gamertag, discord_username, role, game, note, status, created_at
      from tryout_applications
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
});
var rsvpSchema = object({
	eventId: string().trim().min(2).max(80),
	displayName: string().trim().min(2).max(60),
	discord: string().trim().min(2).max(80)
});
var rsvpEvent_createServerFn_handler = createServerRpc({
	id: "0b6738f339af04cf39dfe3939c5f699a30f581498fe3e5299c6065467feeaa83",
	name: "rsvpEvent",
	filename: "src/lib/leads.ts"
}, (opts) => rsvpEvent.__executeServer(opts));
var rsvpEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(rsvpSchema).handler(rsvpEvent_createServerFn_handler, async ({ data, context }) => {
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
var listMyRsvps_createServerFn_handler = createServerRpc({
	id: "536af5824133bdccf1031643c153f734c2f9b4b235e0d912e1dbb96461a50514",
	name: "listMyRsvps",
	filename: "src/lib/leads.ts"
}, (opts) => listMyRsvps.__executeServer(opts));
var listMyRsvps = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyRsvps_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select event_id from event_rsvps where user_id = ${context.userId}
    `;
});
//#endregion
export { listMyApplications_createServerFn_handler, listMyRsvps_createServerFn_handler, rsvpEvent_createServerFn_handler, submitTryoutApplication_createServerFn_handler };
