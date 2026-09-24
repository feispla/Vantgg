import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-BkEjZ3VT.js
var getCommerceStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("0313f1f92c4a9a9a92ae669bc3c5611b9ffa336a97a0ffb9569be33d9c4e6aa4"));
createServerFn({ method: "GET" }).handler(createSsrRpc("09ae8ffc62a44ace3161344c13714a4570bd6fa5905ebcecbff8b8131de015d8"));
var startCheckout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productId: string().min(2).max(40) })).handler(createSsrRpc("0e0a608f7b7dc2264ade929ad32f6ef961e859ba23c2db5d69e4b56450c97a6c"));
var getMyPurchaseBySession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ sessionId: string().min(4).max(200) })).handler(createSsrRpc("209eac29ea7338ffaed563ab43d10203a0e16a313f959a0970b5a90449b787f0"));
var getMyTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36e92c4fe1c1f63d1f3e3fef2573c2fedce094bf164b2f64baa339f31cce0f12"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().min(4).max(40) })).handler(createSsrRpc("b0ea07bd565d6dea1a77b3809d67d433341919c3d2ac319519cafa2923dffff9"));
var verifyPurchasePublic = createServerFn({ method: "POST" }).validator(object({ query: string().trim().min(3).max(80) })).handler(createSsrRpc("b2d70e095fcf736cc3c94f52d0cb7e5803d731bbce2323d43105cec2aa31e6ab"));
//#endregion
export { verifyPurchasePublic as a, startCheckout as i, getMyPurchaseBySession as n, getMyTickets as r, getCommerceStatus as t };
