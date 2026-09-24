import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-CrD0TF4E.js
var tryoutSchema = object({
	tag: string().trim().min(2).max(60),
	discord: string().trim().min(2).max(80),
	role: string().trim().min(2).max(40),
	game: string().trim().min(2).max(40),
	note: string().trim().max(1e3).optional()
});
var submitTryoutApplication = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(tryoutSchema).handler(createSsrRpc("b13543da5b6a32438f6a0c037c211af2e34004ccc88d426937936941606e3724"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3f1a7e93850560074da59a1323a3e04b517dead5dee470eb3c25c3a669ab5855"));
var rsvpSchema = object({
	eventId: string().trim().min(2).max(80),
	displayName: string().trim().min(2).max(60),
	discord: string().trim().min(2).max(80)
});
var rsvpEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(rsvpSchema).handler(createSsrRpc("0b6738f339af04cf39dfe3939c5f699a30f581498fe3e5299c6065467feeaa83"));
var listMyRsvps = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("536af5824133bdccf1031643c153f734c2f9b4b235e0d912e1dbb96461a50514"));
//#endregion
export { rsvpEvent as n, submitTryoutApplication as r, listMyRsvps as t };
