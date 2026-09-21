import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/success")({ component: SuccessPage });

function SuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Checkout</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em]">Vuelve a la confirmación</h1>
      <p className="mt-4 text-muted">
        El estado real del pago está en /checkout/success con el session_id de Stripe. Esta pantalla no marca un pago como cobrado.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/my-tickets" className={buttonVariants()}>
          Ver mis tickets
        </Link>
        <Link to="/dashboard" className={cn(buttonVariants({ variant: "ghost" }))}>
          Dashboard
        </Link>
      </div>
    </main>
  );
}
