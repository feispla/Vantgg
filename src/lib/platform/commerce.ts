import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { productById, TICKET_PRODUCTS } from "@/lib/catalog";
import { ensureProfile } from "@/lib/platform/profiles";

export const getCommerceStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { readStripeStatus } = await import("@/lib/platform/stripe.server");
  return readStripeStatus();
});

export const listTicketCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { readStripeStatus } = await import("@/lib/platform/stripe.server");
  const status = await readStripeStatus();
  return { products: TICKET_PRODUCTS, stripe: status };
});

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ productId: z.string().min(2).max(40) }))
  .handler(async ({ context, data }) => {
    const product = productById(data.productId);
    if (!product) throw new Error("Producto no encontrado.");
    await ensureProfile(context.userId);
    const sql = await getSql();
    const users = await sql<{ email: string | null }>`
      select email from "user" where id = ${context.userId} limit 1
    `;
    const { createCheckoutSession } = await import("@/lib/platform/stripe.server");
    return createCheckoutSession({
      userId: context.userId,
      email: users[0]?.email ?? null,
      productId: product.id,
    });
  });

export const getMyPurchaseBySession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ sessionId: z.string().min(4).max(200) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    let rows = await sql<{
      id: string;
      plan_id: string;
      product_id: string | null;
      amount_total: number | null;
      currency: string | null;
      status: string;
      payment_method: string | null;
      ticket_code: string | null;
      created_at: string;
      stripe_session_id: string | null;
    }>`
      select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at, stripe_session_id
      from purchases
      where stripe_session_id = ${data.sessionId} and user_id = ${context.userId}
      limit 1
    `;
    if (rows[0]?.status === "pending") {
      try {
        const { reconcileSession } = await import("@/lib/platform/stripe.server");
        await reconcileSession(data.sessionId, context.userId);
        rows = await sql`
          select id, plan_id, product_id, amount_total, currency, status, payment_method, ticket_code, created_at, stripe_session_id
          from purchases
          where stripe_session_id = ${data.sessionId} and user_id = ${context.userId}
          limit 1
        `;
      } catch {
        /* webhook remains source of truth if Stripe retrieve fails */
      }
    }
    const purchase = rows[0];
    if (!purchase) return { purchase: null, ticket: null, product: null };
    const tickets = purchase.ticket_code
      ? await sql<{ id: string; code: string; tier: string; status: string; product_id: string }>`
          select id, code, tier, status, product_id from tickets
          where user_id = ${context.userId} and (purchase_id = ${purchase.id} or code = ${purchase.ticket_code})
          limit 1
        `
      : [];
    return {
      purchase,
      ticket: tickets[0] ?? null,
      product: productById(purchase.product_id ?? purchase.plan_id),
    };
  });

export const getMyTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      code: string;
      product_id: string;
      tier: string;
      status: string;
      purchase_id: string;
      created_at: string;
    }>`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const getMyTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ code: z.string().min(4).max(40) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      code: string;
      product_id: string;
      tier: string;
      status: string;
      purchase_id: string;
      created_at: string;
    }>`
      select id, code, product_id, tier, status, purchase_id, created_at
      from tickets
      where user_id = ${context.userId} and code = ${data.code}
      limit 1
    `;
    const ticket = rows[0];
    if (!ticket) return { ticket: null, product: null };
    return { ticket, product: productById(ticket.product_id) };
  });

export const verifyPurchasePublic = createServerFn({ method: "POST" })
  .validator(
    z.object({
      query: z.string().trim().min(3).max(80),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const q = data.query.trim();
    const tickets = await sql<{
      code: string;
      product_id: string;
      tier: string;
      status: string;
      purchase_id: string;
    }>`
      select code, product_id, tier, status, purchase_id
      from tickets
      where code = ${q} or purchase_id = ${q} or id = ${q}
      limit 1
    `;
    const ticket = tickets[0];
    if (ticket) {
      return {
        valid: ticket.status === "PAID",
        found: true,
        productName: productById(ticket.product_id)?.name ?? ticket.product_id,
        ticketCode: ticket.code,
        status: ticket.status,
        purchaseId: ticket.purchase_id,
      };
    }
    const purchases = await sql<{
      id: string;
      product_id: string | null;
      plan_id: string;
      status: string;
      ticket_code: string | null;
    }>`
      select id, product_id, plan_id, status, ticket_code
      from purchases
      where id = ${q} or ticket_code = ${q} or stripe_session_id = ${q}
      limit 1
    `;
    const p = purchases[0];
    if (!p) return { valid: false, found: false };
    return {
      valid: p.status === "paid",
      found: true,
      productName: productById(p.product_id ?? p.plan_id)?.name ?? p.plan_id,
      ticketCode: p.ticket_code,
      status: p.status,
      purchaseId: p.id,
    };
  });
