import { createFileRoute, Link } from "@tanstack/react-router";
import { PlanCard } from "@/components/plan-card";
import { PLANS, STRIPE_ACCOUNT } from "@/lib/plans";
import { STRIPE_LIVE } from "@/lib/stripe-status";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">04 / Planes</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
        Entra. Opera. Cobra.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
        Precios en EUR. Cobro live con Stripe ({STRIPE_ACCOUNT} · cuenta {STRIPE_LIVE.account}). Cancela Operator o Command cuando quieras. Founding Mark no se duplica.
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ok">
        {STRIPE_LIVE.products} productos live · {STRIPE_LIVE.customers} clientes · sync {STRIPE_LIVE.syncedAt}
      </p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="mt-10 text-sm text-muted">
        Reembolsos y cancelación en{" "}
        <Link to="/legal/$slug" params={{ slug: "reembolsos" }} className="text-fg underline">
          /legal/reembolsos
        </Link>
        .
      </p>
    </main>
  );
}
