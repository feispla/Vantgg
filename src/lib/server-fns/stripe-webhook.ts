/**
 * Stripe Webhook Server Function
 */
import { createServerFn } from "@tanstack/react-start";
import { handleStripeWebhook } from "@/lib/platform/stripe.server";

export const stripeWebhookHandler = createServerFn({ method: "POST" }).handler(
  async ({ request }: { request: Request }) => {
    return handleStripeWebhook(request);
  }
);
