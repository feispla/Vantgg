import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PlanCard({ plan }: { plan: Plan }) {
  const ctaClass = cn(
    buttonVariants({ variant: plan.featured ? "primary" : "ghost" }),
    "mt-8 w-full",
  );

  return (
    <article
      className={cn(
        "flex flex-col border border-line bg-surface p-6 sm:p-7",
        plan.featured && "border-accent/70 bg-accent/5",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {plan.code} / {plan.name}
        </span>
        {plan.featured && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
            Recomendado
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">{plan.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{plan.tagline}</p>
      <p className="mt-6 flex items-end gap-2">
        <span className="font-display text-4xl font-semibold tracking-[-0.05em] tabular-nums">
          {plan.priceLabel}
        </span>
        <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          {plan.priceHint}
        </span>
      </p>
      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-fg">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>
      {plan.id === "scout" ? (
        <Link to="/apply" className={ctaClass}>
          {plan.cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link to="/join/$planId" params={{ planId: plan.id }} className={ctaClass}>
          {plan.cta}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
