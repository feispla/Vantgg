import { r as getSql } from "./db-B12kHszo.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { n as TICKET_PRODUCTS, o as productById } from "./avatar-DYTTtK-m.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { i as ensureProfile } from "./profiles-D-Lv5pW_.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-D_WyVEKa.js
var getCommerceStatus_createServerFn_handler = createServerRpc({
	id: "0313f1f92c4a9a9a92ae669bc3c5611b9ffa336a97a0ffb9569be33d9c4e6aa4",
	name: "getCommerceStatus",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => getCommerceStatus.__executeServer(opts));
var getCommerceStatus = createServerFn({ method: "GET" }).handler(getCommerceStatus_createServerFn_handler, async () => {
	const { readStripeStatus } = await import("./stripe.server-ficCO77n.mjs").then((n) => n.n);
	return readStripeStatus();
});
var listTicketCatalog_createServerFn_handler = createServerRpc({
	id: "09ae8ffc62a44ace3161344c13714a4570bd6fa5905ebcecbff8b8131de015d8",
	name: "listTicketCatalog",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => listTicketCatalog.__executeServer(opts));
var listTicketCatalog = createServerFn({ method: "GET" }).handler(listTicketCatalog_createServerFn_handler, async () => {
	const { readStripeStatus } = await import("./stripe.server-ficCO77n.mjs").then((n) => n.n);
	const status = await readStripeStatus();
	return {
		products: TICKET_PRODUCTS,
		stripe: status
	};
});
var startCheckout_createServerFn_handler = createServerRpc({
	id: "0e0a608f7b7dc2264ade929ad32f6ef961e859ba23c2db5d69e4b56450c97a6c",
	name: "startCheckout",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => startCheckout.__executeServer(opts));
var startCheckout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ productId: string().min(2).max(40) })).handler(startCheckout_createServerFn_handler, async ({ context, data }) => {
	const product = productById(data.productId);
	if (!product) throw new Error("Producto no encontrado.");
	await ensureProfile(context.userId);
	const users = await (await getSql())`
      select email from "user" where id = ${context.userId} limit 1
    `;
	const { createCheckoutSession } = await import("./stripe.server-ficCO77n.mjs").then((n) => n.n);
	return createCheckoutSession({
		userId: context.userId,
		email: users[0]?.email ?? null,
		productId: product.id
	});
});
var getMyPurchaseBySession_createServerFn_handler = createServerRpc({
	id: "209eac29ea7338ffaed563ab43d10203a0e16a313f959a0970b5a90449b787f0",
	name: "getMyPurchaseBySession",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => getMyPurchaseBySession.__executeServer(opts));
var getMyPurchaseBySession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ sessionId: string().min(4).max(200) })).handler(getMyPurchaseBySession_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	let rows = await sql`
      select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at, stripe_session_id
      from purchases
      where stripe_session_id = ${data.sessionId} and user_id = ${context.userId}
      limit 1
    `;
	if (rows[0]?.status === "pending") try {
		const { reconcileSession } = await import("./stripe.server-ficCO77n.mjs").then((n) => n.n);
		await reconcileSession(data.sessionId, context.userId);
		rows = await sql`
          select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at, stripe_session_id
          from purchases
          where stripe_session_id = ${data.sessionId} and user_id = ${context.userId}
          limit 1
        `;
	} catch {}
	const purchase = rows[0];
	if (!purchase) return {
		purchase: null,
		ticket: null,
		product: null
	};
	return {
		purchase,
		ticket: (purchase.ticket_code ? await sql`
          select id, code, tier, status, product_id from tickets
          where user_id = ${context.userId} and (purchase_id = ${purchase.id} or code = ${purchase.ticket_code})
          limit 1
        ` : [])[0] ?? null,
		product: productById(purchase.product_id ?? purchase.plan_id)
	};
});
var getMyTickets_createServerFn_handler = createServerRpc({
	id: "36e92c4fe1c1f63d1f3e3fef2573c2fedce094bf164b2f64baa339f31cce0f12",
	name: "getMyTickets",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => getMyTickets.__executeServer(opts));
var getMyTickets = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyTickets_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets where user_id = ${context.userId}
      order by created_at desc
    `;
});
var getMyTicket_createServerFn_handler = createServerRpc({
	id: "b0ea07bd565d6dea1a77b3809d67d433341919c3d2ac319519cafa2923dffff9",
	name: "getMyTicket",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => getMyTicket.__executeServer(opts));
var getMyTicket = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().min(4).max(40) })).handler(getMyTicket_createServerFn_handler, async ({ context, data }) => {
	const ticket = (await (await getSql())`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets
      where user_id = ${context.userId} and code = ${data.code}
      limit 1
    `)[0];
	if (!ticket) return {
		ticket: null,
		product: null
	};
	return {
		ticket,
		product: productById(ticket.product_id)
	};
});
var verifyPurchasePublic_createServerFn_handler = createServerRpc({
	id: "b2d70e095fcf736cc3c94f52d0cb7e5803d731bbce2323d43105cec2aa31e6ab",
	name: "verifyPurchasePublic",
	filename: "src/lib/platform/commerce.ts"
}, (opts) => verifyPurchasePublic.__executeServer(opts));
var verifyPurchasePublic = createServerFn({ method: "POST" }).validator(object({ query: string().trim().min(3).max(80) })).handler(verifyPurchasePublic_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const q = data.query.trim();
	const ticket = (await sql`
      select code, product_id, tier, status, purchase_id
      from tickets
      where code = ${q} or purchase_id = ${q} or id = ${q}
      limit 1
    `)[0];
	if (ticket) return {
		valid: ticket.status === "PAID",
		found: true,
		productName: productById(ticket.product_id)?.name ?? ticket.product_id,
		ticketCode: ticket.code,
		status: ticket.status,
		purchaseId: ticket.purchase_id
	};
	const p = (await sql`
      select id, product_id, plan_id, status, ticket_code
      from purchases
      where id = ${q} or ticket_code = ${q} or stripe_session_id = ${q}
      limit 1
    `)[0];
	if (!p) return {
		valid: false,
		found: false
	};
	return {
		valid: p.status === "paid",
		found: true,
		productName: productById(p.product_id ?? p.plan_id)?.name ?? p.plan_id,
		ticketCode: p.ticket_code,
		status: p.status,
		purchaseId: p.id
	};
});
//#endregion
export { getCommerceStatus_createServerFn_handler, getMyPurchaseBySession_createServerFn_handler, getMyTicket_createServerFn_handler, getMyTickets_createServerFn_handler, listTicketCatalog_createServerFn_handler, startCheckout_createServerFn_handler, verifyPurchasePublic_createServerFn_handler };
