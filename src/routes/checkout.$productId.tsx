import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { Steps } from "@/components/steps";
import { Button, buttonVariants } from "@/components/ui/button";
import { productById } from "@/lib/catalog";
import { getCommerceStatus, startCheckout } from "@/lib/platform/commerce";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/$productId")({ component: CheckoutPage });

function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutBody />
    </RequireAuth>
  );
}

function CheckoutBody() {
  const { productId } = Route.useParams();
  const product = productById(productId);
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<Awaited<ReturnType<typeof getCommerceStatus>> | null>(null);

  useEffect(() => {
    getCommerceStatus().then(setStripe).catch(() => setStripe(null));
  }, []);

  if (!product || !product.available) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Producto no disponible</h1>
        <Link to="/tickets" className={cn(buttonVariants({ variant: "ghost" }), "mt-6")}>
          Volver a tickets
        </Link>
      </main>
    );
  }

  const item = product;

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const res = await startCheckout({ data: { productId: item.id } });
      window.location.assign(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo abrir Stripe.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Steps step={3} />
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Checkout</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-muted">{product.tagline}</p>

      <section className="glass-card mt-8 space-y-4 rounded-2xl p-6">
        <p className="text-sm">
          <span className="text-subtle">01 Cuenta · </span>
          {user?.primaryEmail ?? user?.displayName}
        </p>
        <p className="text-sm">
          <span className="text-subtle">02 Ticket · </span>
          {product.name} · {product.priceLabel}
        </p>
        <p className="text-sm">
          <span className="text-subtle">03 Pago · </span>
          Stripe Checkout (tarjeta{stripe?.paypal ? " + PayPal" : ""})
        </p>
      </section>

      {stripe && !stripe.configured ? (
        <p className="mt-6 rounded-2xl border border-warn/40 bg-warn/10 p-4 text-sm text-warn">{stripe.message}</p>
      ) : null}
      {stripe?.configured ? (
        <p className="mt-6 text-sm text-cyan">
          {stripe.paypal
            ? "Pagar con PayPal está disponible dentro de Stripe Checkout, junto a tarjeta."
            : stripe.paypalMessage}
        </p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button disabled={busy || stripe?.configured === false} onClick={() => void pay()}>
          {busy ? "Abriendo Stripe…" : "Pagar de forma segura"}
        </Button>
        <Link to="/tickets" className={buttonVariants({ variant: "ghost" })}>
          Volver
        </Link>
        <Link to="/support" className={buttonVariants({ variant: "quiet" })}>
          Contactar soporte
        </Link>
      </div>
      <button type="button" className="mt-6 text-xs text-subtle underline" onClick={() => navigate({ to: "/login" })}>
        Cambiar de cuenta
      </button>
    </main>
  );
}
