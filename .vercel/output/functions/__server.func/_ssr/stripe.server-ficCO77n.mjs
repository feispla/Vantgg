import { n as newId } from "./utils-DG8erAqy.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { t as env } from "./env.server-wS9zOhV6.mjs";
import { i as settleWithin, r as queueEmail } from "./email.server-DO3567x7.mjs";
import { r as ticketCode } from "./crypto-CHRFo8dF.mjs";
import { o as productById } from "./avatar-DYTTtK-m.mjs";
import { i as ensureProfile } from "./profiles-D-Lv5pW_.mjs";
import { t as getAppUrl } from "./app-url-D20KWGKr.mjs";
import { t as Stripe } from "../_libs/stripe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe.server-ficCO77n.js
var stripe_server_exports = /* @__PURE__ */ __exportAll({
	createCheckoutSession: () => createCheckoutSession,
	fulfillCheckoutSession: () => fulfillCheckoutSession,
	getStripe: () => getStripe,
	handleStripeWebhook: () => handleStripeWebhook,
	readStripeStatus: () => readStripeStatus,
	reconcileSession: () => reconcileSession,
	recordStripeEvent: () => recordStripeEvent,
	stripePublishableKey: () => stripePublishableKey
});
var stripeSingleton;
function getStripe() {
	if (stripeSingleton !== void 0) return stripeSingleton;
	const key = env("STRIPE_SECRET_KEY");
	if (!key) {
		stripeSingleton = null;
		return null;
	}
	stripeSingleton = new Stripe(key, {
		timeout: 8e3,
		maxNetworkRetries: 0
	});
	return stripeSingleton;
}
function stripePublishableKey() {
	return env("STRIPE_PUBLISHABLE_KEY") ?? env("VITE_STRIPE_PUBLISHABLE_KEY") ?? null;
}
var stripeStatusCache = null;
async function readStripeStatus() {
	if (stripeStatusCache && Date.now() - stripeStatusCache.at < 6e4) return stripeStatusCache.value;
	const stripe = getStripe();
	const pk = stripePublishableKey();
	if (!stripe) {
		const unset = {
			configured: false,
			mode: "unset",
			paypal: false,
			paypalMessage: "PayPal se muestra dentro de Stripe Checkout cuando el método está activo en el Dashboard de Stripe (Settings → Payment methods). No se piden credenciales de PayPal al usuario.",
			message: "Stripe no está configurado todavía. Añade STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET en el entorno de Vercel. El webhook debe apuntar a /api/stripe/webhook.",
			publishableKey: pk
		};
		stripeStatusCache = {
			at: Date.now(),
			value: unset
		};
		return unset;
	}
	const mode = env("STRIPE_SECRET_KEY")?.startsWith("sk_live") ? "live" : "test";
	let paypal = false;
	try {
		const configs = await settleWithin(stripe.paymentMethodConfigurations.list({ limit: 10 }), 2500);
		paypal = Boolean(configs?.data.some((c) => {
			const entry = c.paypal;
			return Boolean(entry?.available) || entry?.display_preference?.value === "on";
		}));
	} catch {
		paypal = false;
	}
	const value = {
		configured: true,
		mode,
		paypal,
		paypalMessage: paypal ? "PayPal está habilitado en Stripe. Aparecerá en Checkout junto a tarjeta." : "PayPal no está habilitado en esta cuenta Stripe. Actívalo en Dashboard → Settings → Payment methods. No se crea un botón PayPal falso.",
		message: `Stripe ${mode} listo. Los pagos se confirman por webhook.`,
		publishableKey: pk
	};
	stripeStatusCache = {
		at: Date.now(),
		value
	};
	return value;
}
function entitlementKey(product) {
	if (product.tier) return `ticket.${product.tier}`;
	return `membership.${product.id}`;
}
function impliedTiers(product) {
	if (product.tier === "elite") return [
		"basic",
		"pro",
		"elite"
	];
	if (product.tier === "pro") return ["basic", "pro"];
	if (product.tier === "basic") return ["basic"];
	return [];
}
async function createCheckoutSession(input) {
	const product = productById(input.productId);
	if (!product || !product.available || product.billing === "free") throw new Error("Producto no disponible.");
	const stripe = getStripe();
	if (!stripe) throw new Error("Stripe no está configurado todavía.");
	await ensureProfile(input.userId);
	const sql = await getSql();
	const purchaseId = newId();
	const origin = getAppUrl(input.request);
	await sql`
    insert into purchases (id, plan_id, product_id, user_id, email, amount_total, currency, status)
    values (
      ${purchaseId},
      ${product.id},
      ${product.id},
      ${input.userId},
      ${input.email},
      ${product.amountCents},
      ${product.currency},
      'pending'
    )
  `;
	const lineItem = product.stripePriceId ? {
		price: product.stripePriceId,
		quantity: 1
	} : {
		quantity: 1,
		price_data: {
			currency: product.currency,
			unit_amount: product.amountCents,
			product_data: {
				name: product.name,
				description: product.tagline,
				metadata: {
					product_id: product.id,
					purchase_id: purchaseId
				}
			},
			...product.billing === "month" ? { recurring: { interval: "month" } } : {}
		}
	};
	const session = await stripe.checkout.sessions.create({
		mode: product.billing === "month" ? "subscription" : "payment",
		customer_email: input.email ?? void 0,
		client_reference_id: input.userId,
		success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/checkout/cancel?product=${encodeURIComponent(product.id)}`,
		metadata: {
			user_id: input.userId,
			product_id: product.id,
			purchase_id: purchaseId
		},
		payment_intent_data: product.billing === "month" ? void 0 : { metadata: {
			user_id: input.userId,
			product_id: product.id,
			purchase_id: purchaseId
		} },
		subscription_data: product.billing === "month" ? { metadata: {
			user_id: input.userId,
			product_id: product.id,
			purchase_id: purchaseId
		} } : void 0,
		line_items: [lineItem]
	});
	await sql`
    update purchases
    set stripe_session_id = ${session.id}, stripe_customer_id = ${typeof session.customer === "string" ? session.customer : null}
    where id = ${purchaseId}
  `;
	if (!session.url) throw new Error("Stripe no devolvió URL de checkout.");
	return {
		url: session.url,
		sessionId: session.id,
		purchaseId
	};
}
async function fulfillCheckoutSession(session) {
	const sql = await getSql();
	const purchaseId = session.metadata?.purchase_id;
	const userId = session.metadata?.user_id ?? session.client_reference_id;
	const productId = session.metadata?.product_id;
	if (!purchaseId || !userId || !productId) return null;
	const row = (await sql`
    select id, status, ticket_code, email from purchases where id = ${purchaseId} limit 1
  `)[0];
	if (!row) return null;
	if (row.status === "paid") {
		const tickets = await sql`
      select id, code from tickets where purchase_id = ${purchaseId} limit 1
    `;
		return {
			purchaseId,
			ticketCode: tickets[0]?.code ?? row.ticket_code,
			ticketId: tickets[0]?.id ?? null,
			status: "paid"
		};
	}
	const product = productById(productId);
	const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";
	if (session.status === "expired") {
		await sql`update purchases set status = 'cancelled' where id = ${purchaseId} and status = 'pending'`;
		return {
			purchaseId,
			ticketCode: null,
			ticketId: null,
			status: "cancelled"
		};
	}
	if (!paid) return {
		purchaseId,
		ticketCode: null,
		ticketId: null,
		status: row.status
	};
	const method = session.payment_method_types?.includes("paypal") && session.payment_method_types.length === 1 ? "paypal" : (session.payment_method_types ?? []).join(",") || "card";
	const amount = session.amount_total ?? product?.amountCents ?? null;
	const currency = session.currency ?? product?.currency ?? "eur";
	const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
	const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
	const code = product?.tier ? ticketCode() : null;
	await sql`
    update purchases set
      status = 'paid',
      amount_total = ${amount},
      currency = ${currency},
      stripe_customer_id = ${customerId},
      stripe_payment_intent = ${paymentIntent},
      payment_method = ${method},
      ticket_code = ${code},
      email = ${session.customer_details?.email ?? row.email},
      fulfilled_at = now()
    where id = ${purchaseId}
  `;
	let ticketId = null;
	if (product?.tier && code) {
		ticketId = newId();
		await sql`
      insert into tickets (id, user_id, purchase_id, product_id, code, tier, status)
      values (${ticketId}, ${userId}, ${purchaseId}, ${product.id}, ${code}, ${product.tier}, 'PAID')
      on conflict (code) do nothing
    `;
		for (const tier of impliedTiers(product)) await sql`
        insert into entitlements (user_id, key, purchase_id)
        values (${userId}, ${`ticket.${tier}`}, ${purchaseId})
        on conflict (user_id, key) do nothing
      `;
	} else if (product) {
		await sql`
      insert into entitlements (user_id, key, purchase_id)
      values (${userId}, ${entitlementKey(product)}, ${purchaseId})
      on conflict (user_id, key) do nothing
    `;
		for (const tier of impliedTiers(product)) await sql`
        insert into entitlements (user_id, key, purchase_id)
        values (${userId}, ${`ticket.${tier}`}, ${purchaseId})
        on conflict (user_id, key) do nothing
      `;
	}
	const email = session.customer_details?.email ?? row.email;
	if (email && product) {
		await queueEmail({
			to: email,
			template: "purchase",
			body: `Compra confirmada: ${product.name}. Estado: paid. ID: ${purchaseId}.${code ? ` Ticket: ${code}.` : ""}`
		});
		if (code) await queueEmail({
			to: email,
			template: "ticket",
			body: `Tu ticket ${product.name} está listo. Código ${code}. Válido para torneos compatibles.`
		});
	}
	return {
		purchaseId,
		ticketCode: code,
		ticketId,
		status: "paid"
	};
}
async function recordStripeEvent(event, extra) {
	return (await (await getSql())`
    insert into stripe_events (
      event_id, type, payment_id, customer_id, user_id, product_id, amount, currency, status
    ) values (
      ${event.id},
      ${event.type},
      ${extra?.paymentId ?? null},
      ${extra?.customerId ?? null},
      ${extra?.userId ?? null},
      ${extra?.productId ?? null},
      ${extra?.amount ?? null},
      ${extra?.currency ?? null},
      ${extra?.status ?? null}
    )
    on conflict (event_id) do nothing
    returning event_id
  `).length > 0;
}
async function handleStripeWebhook(request) {
	const stripe = getStripe();
	const secret = env("STRIPE_WEBHOOK_SECRET");
	if (!stripe || !secret) return Response.json({ error: "Stripe webhook no configurado" }, { status: 503 });
	const signature = request.headers.get("stripe-signature");
	if (!signature) return Response.json({ error: "Missing signature" }, { status: 400 });
	const raw = await request.text();
	let event;
	try {
		event = stripe.webhooks.constructEvent(raw, signature, secret);
	} catch {
		return Response.json({ error: "Invalid signature" }, { status: 400 });
	}
	const sql = await getSql();
	if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
		const session = event.data.object;
		if (await recordStripeEvent(event, {
			userId: session.metadata?.user_id,
			productId: session.metadata?.product_id,
			paymentId: typeof session.payment_intent === "string" ? session.payment_intent : session.id,
			amount: session.amount_total,
			currency: session.currency,
			status: "paid",
			customerId: typeof session.customer === "string" ? session.customer : null
		})) await fulfillCheckoutSession(session);
	} else if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
		const session = event.data.object;
		if (await recordStripeEvent(event, {
			userId: session.metadata?.user_id,
			productId: session.metadata?.product_id,
			paymentId: session.id,
			status: event.type === "checkout.session.expired" ? "cancelled" : "failed"
		}) && session.metadata?.purchase_id) await sql`
        update purchases set status = ${event.type === "checkout.session.expired" ? "cancelled" : "failed"}
        where id = ${session.metadata.purchase_id} and status = 'pending'
      `;
	} else if (event.type === "charge.refunded") {
		const charge = event.data.object;
		if (await recordStripeEvent(event, {
			paymentId: charge.payment_intent ? String(charge.payment_intent) : charge.id,
			amount: charge.amount_refunded,
			currency: charge.currency,
			status: "refunded",
			customerId: typeof charge.customer === "string" ? charge.customer : null
		})) {
			const pi = charge.payment_intent ? String(charge.payment_intent) : null;
			if (pi) {
				const p = (await sql`
          select id, user_id from purchases where stripe_payment_intent = ${pi} limit 1
        `)[0];
				if (p) {
					await sql`update purchases set status = 'refunded' where id = ${p.id}`;
					await sql`update tickets set status = 'REFUNDED' where purchase_id = ${p.id}`;
				}
			}
		}
	} else await recordStripeEvent(event, {
		paymentId: event.id,
		status: event.type
	});
	return Response.json({ received: true });
}
async function reconcileSession(sessionId, userId) {
	const stripe = getStripe();
	if (!stripe) throw new Error("Stripe no está configurado todavía.");
	const session = await stripe.checkout.sessions.retrieve(sessionId);
	if (session.metadata?.user_id && session.metadata.user_id !== userId) throw new Error("Sesión no válida.");
	if (session.client_reference_id && session.client_reference_id !== userId) throw new Error("Sesión no válida.");
	return fulfillCheckoutSession(session);
}
//#endregion
export { stripe_server_exports as n, handleStripeWebhook as t };
