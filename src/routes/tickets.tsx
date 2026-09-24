import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { TICKET_PRODUCTS } from "@/lib/catalog";
import { getCommerceStatus } from "@/lib/platform/commerce";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tickets")({ component: TicketsPage });

function TicketsPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [stripeMsg, setStripeMsg] = useState<string | null>(null);
  const signedIn = !isPending && user && !user.isDevFallback;

  useEffect(() => {
    getCommerceStatus()
      .then((s) => setStripeMsg(s.configured ? s.message : s.message))
      .catch(() => setStripeMsg(null));
  }, []);

  function buy(id: string) {
    if (isPending) return;
    if (!signedIn) {
      void navigate({ to: "/login", search: { next: `/checkout/${id}` } });
      return;
    }
    void navigate({ to: "/checkout/$productId", params: { productId: id } });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Tickets</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">VANT BASIC · PRO · ELITE</h1>
      <p className="mt-4 max-w-2xl text-muted">
        El pago se confirma por webhook de Stripe, no por el redirect del navegador. PayPal aparece en Checkout si está activo en tu cuenta Stripe.
      </p>
      {stripeMsg ? <p className="mt-4 text-sm text-cyan">{stripeMsg}</p> : null}
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {TICKET_PRODUCTS.map((p) => (
          <article
            key={p.id}
            className={cn(
              "glass-card flex flex-col rounded-3xl p-6",
              p.featured && "glow-violet border-accent/40",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              {p.code} · {p.available ? "Disponible" : "Agotado"}
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <p className="mt-6 font-display text-4xl font-semibold tabular-nums">
              {p.priceLabel}
              <span className="ml-2 font-mono text-xs uppercase text-subtle">{p.priceHint}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 text-cyan" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={!p.available}
              onClick={() => buy(p.id)}
              className={cn(buttonVariants({ variant: p.featured ? "primary" : "ghost" }), "mt-8 w-full")}
            >
              Comprar
            </button>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-subtle">
        Membresías Operator / Command siguen en{" "}
        <Link to="/pricing" className="text-fg underline">
          /pricing
        </Link>
        .
      </p>
    </main>
  );
}
