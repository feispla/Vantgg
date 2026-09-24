import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { OPS_EMAIL, planById, STRIPE_ACCOUNT } from "@/lib/plans";
import { getCommerceStatus, startCheckout } from "@/lib/platform/commerce";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join/$planId")({ component: JoinPlan });

function JoinPlan() {
  const { planId } = Route.useParams();
  const plan = planById(planId);
  const { user, isPending } = useCurrentUserState();
  const signedIn = !isPending && user && !user.isDevFallback;
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Awaited<ReturnType<typeof getCommerceStatus>> | null>(null);

  useEffect(() => {
    getCommerceStatus().then(setStripe).catch(() => setStripe(null));
  }, []);

  if (!plan || plan.id === "scout") {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Plan no encontrado</h1>
        <Link to="/pricing" className={cn(buttonVariants({ variant: "ghost" }), "mt-8")}>
          Ver planes
        </Link>
      </main>
    );
  }

  const selected = plan;

  async function pay() {
    if (!signedIn) {
      void navigate({ to: "/login", search: { next: `/join/${selected.id}` } });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await startCheckout({ data: { productId: selected.id } });
      window.location.assign(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir Stripe.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Checkout / {plan.code}</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">{plan.name}</h1>
        <p className="mt-4 text-lg text-muted">{plan.tagline}</p>
        <p className="mt-8 font-display text-5xl font-semibold tabular-nums">
          {plan.priceLabel}
          <span className="ml-3 font-mono text-sm uppercase tracking-[0.14em] text-subtle">{plan.priceHint}</span>
        </p>
        <ul className="mt-8 space-y-3 text-sm text-fg">
          {plan.features.map((feature) => (
            <li key={feature} className="border-b border-line py-3">
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <aside className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm text-muted">
          <ShieldCheck className="h-4 w-4 text-ok" />
          Pago seguro · {STRIPE_ACCOUNT} · EUR
        </div>
        <p className="mt-6 text-sm leading-6 text-muted">
          Stripe Checkout oficial. El cobro se confirma por webhook. PayPal solo si está activo en Stripe.
        </p>
        {stripe && !stripe.configured ? (
          <p className="mt-4 text-sm text-warn">{stripe.message}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <button
          type="button"
          disabled={busy || stripe?.configured === false}
          onClick={() => void pay()}
          className={cn(buttonVariants({ size: "lg" }), "mt-8 w-full")}
        >
          {busy ? "Abriendo Stripe…" : `Pagar ${plan.priceLabel} con Stripe`}
        </button>
        <a
          href={`mailto:${OPS_EMAIL}?subject=${encodeURIComponent("VANT " + plan.name)}`}
          className="mt-6 block text-center text-xs text-subtle underline"
        >
          ¿Empresa? Pedir invoice
        </a>
        <Link to="/legal/$slug" params={{ slug: "reembolsos" }} className="mt-3 block text-center text-xs text-subtle underline">
          Términos y reembolsos
        </Link>
      </aside>
    </main>
  );
}
