import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/cancel")({
  validateSearch: (s: Record<string, unknown>) => ({
    product: typeof s.product === "string" ? s.product : "vant-pro",
  }),
  component: CancelPage,
});

function CancelPage() {
  const { product } = Route.useSearch();
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warn">Pago</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">El pago no fue completado.</h1>
      <p className="mt-3 text-muted">Nada se ha cobrado. Puedes intentarlo de nuevo cuando quieras.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/checkout/$productId" params={{ productId: product }} className={buttonVariants()}>
          Intentar nuevamente
        </Link>
        <Link to="/tickets" className={cn(buttonVariants({ variant: "ghost" }))}>
          Volver a tickets
        </Link>
        <Link to="/support" className={cn(buttonVariants({ variant: "quiet" }))}>
          Contactar soporte
        </Link>
      </div>
    </main>
  );
}
