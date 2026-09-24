import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { ORG, ROSTER } from "@/lib/roster";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roster")({ component: RosterPage });

function RosterPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">10 / {ORG.name}</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">El roster todavía se escribe.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {ORG.game} · {ORG.region} · fundada {ORG.founded}. Capa CROSAIM. Los asientos OPEN se cubren por tryouts, no por pago.
      </p>
      <div className="mt-12 overflow-hidden border border-line">
        <div className="grid grid-cols-[48px_1fr_auto] gap-x-4 border-b border-line bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:grid-cols-[64px_1fr_1.2fr_auto]">
          <span>ID</span>
          <span>Rol</span>
          <span className="hidden sm:block">Nota</span>
          <span>Estado</span>
        </div>
        {ROSTER.map((seat) => (
          <div
            key={seat.code}
            className="grid grid-cols-[48px_1fr_auto] items-center gap-x-4 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[64px_1fr_1.2fr_auto]"
          >
            <span className="font-mono text-[11px] text-accent">{seat.code}</span>
            <span>
              <span className="block font-medium">{seat.role}</span>
              <span className="text-sm text-muted">{seat.handle ?? "Sin asignar"}</span>
            </span>
            <span className="hidden text-sm text-muted sm:block">{seat.note}</span>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.14em]",
                seat.status === "open" ? "text-warn" : "text-ok",
              )}
            >
              {seat.status}
            </span>
          </div>
        ))}
      </div>
      <Link to="/apply" className={cn(buttonVariants(), "mt-10")}>
        Postularme a un asiento
      </Link>
    </main>
  );
}
