import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { FOUNDING_CAP } from "@/lib/plans";
import { STRIPE_LIVE } from "@/lib/stripe-status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/founders")({ component: FoundersPage });

function FoundersPage() {
  const remaining = Math.max(0, FOUNDING_CAP - STRIPE_LIVE.foundingSold);
  const slots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">11 / Founding wall</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">El muro está vacío a propósito.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Stripe live reporta {STRIPE_LIVE.foundingSold} Founding Marks cobradas. Quedan {remaining} de {FOUNDING_CAP}. El primer nombre no se inventa: se paga.
      </p>
      <div className="mt-12 grid grid-cols-3 gap-px bg-line sm:grid-cols-4 md:grid-cols-6">
        {slots.map((i) => (
          <div key={i} className="flex aspect-square flex-col items-center justify-center bg-bg p-3">
            <span className="font-mono text-[10px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-line">vacant</span>
          </div>
        ))}
      </div>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
        Mostrando 24 de {FOUNDING_CAP} · el resto se revela al cobro
      </p>
      <Link to="/join/$planId" params={{ planId: "founding" }} className={cn(buttonVariants({ size: "lg" }), "mt-10")}>
        Tomar la marca 01
      </Link>
    </main>
  );
}
