import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as hitRateLimit } from "./rate-limit-Bayl4Gyc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbound-CDO0G_Nh.js
var contactSchema = object({
	name: string().trim().min(2).max(80),
	email: string().trim().email().max(120),
	subject: string().trim().max(120).optional(),
	message: string().trim().min(8).max(4e3),
	source: string().trim().max(40).optional(),
	discord: string().trim().max(80).optional()
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "8be87644d5916e3944545662c263dcd5b73d29e93f45411b91fff684be65c048",
	name: "submitContact",
	filename: "src/lib/platform/inbound.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).validator(contactSchema).handler(submitContact_createServerFn_handler, async ({ data }) => {
	if (!(await hitRateLimit(`contact:${data.email.toLowerCase()}`, 6, 36e5)).ok) throw new Error("Demasiados envíos. Espera un poco.");
	const [{ getSessionUser }, { deliverInbound }] = await Promise.all([import("./verify.server-0FBZDGev.mjs"), import("./inbound-delivery.server-KjBePoSb.mjs").then((n) => n.n)]);
	const session = await getSessionUser();
	return deliverInbound({
		kind: "contact",
		name: data.name,
		email: data.email,
		subject: data.subject,
		message: data.message,
		source: data.source ?? "contact",
		discord: data.discord,
		extra: { userId: session?.id ?? null }
	});
});
//#endregion
export { submitContact_createServerFn_handler };
