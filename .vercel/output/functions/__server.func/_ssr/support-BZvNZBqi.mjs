import { n as newId } from "./utils-DG8erAqy.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as hitRateLimit } from "./rate-limit-Bayl4Gyc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-BZvNZBqi.js
var CATEGORIES = [
	"Pago",
	"Login",
	"Ticket",
	"Verificación",
	"Torneo",
	"Ranked",
	"Otro"
];
var submitSupport_createServerFn_handler = createServerRpc({
	id: "18fecb8155a1e43f842b2fe11b9762ffd94fcfc477e0d7b4c8a43bb47d54c1d7",
	name: "submitSupport",
	filename: "src/lib/platform/support.ts"
}, (opts) => submitSupport.__executeServer(opts));
var submitSupport = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(2).max(80),
	email: string().trim().email(),
	category: _enum(CATEGORIES),
	purchaseId: string().trim().max(80).optional(),
	message: string().trim().min(10).max(4e3)
})).handler(submitSupport_createServerFn_handler, async ({ data }) => {
	if (!(await hitRateLimit(`support:${data.email.toLowerCase()}`, 8, 36e5)).ok) throw new Error("Demasiados mensajes. Espera un poco.");
	const { getSessionUser } = await import("./verify.server-0FBZDGev.mjs");
	const session = await getSessionUser();
	const sql = await getSql();
	const id = newId();
	await sql`
      insert into support_tickets (id, user_id, name, email, category, purchase_id, message)
      values (
        ${id},
        ${session?.id ?? null},
        ${data.name},
        ${data.email},
        ${data.category},
        ${data.purchaseId || null},
        ${data.message}
      )
    `;
	const { deliverInbound } = await import("./inbound-delivery.server-KjBePoSb.mjs").then((n) => n.n);
	await deliverInbound({
		kind: "support",
		name: data.name,
		email: data.email,
		subject: `Soporte · ${data.category}`,
		message: data.purchaseId ? `${data.message}\n\nCompra: ${data.purchaseId}` : data.message,
		source: "support",
		extra: {
			category: data.category,
			userId: session?.id ?? null
		}
	});
	return { id };
});
//#endregion
export { submitSupport_createServerFn_handler };
