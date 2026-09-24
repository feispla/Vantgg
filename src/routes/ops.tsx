import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusPill } from "@/components/status-pill";
import { ECOSYSTEM } from "@/lib/ecosystem";
import { STRIPE_LIVE } from "@/lib/stripe-status";

export const Route = createFileRoute("/ops")({ component: OpsPage });

function OpsPage() {
  const live = ECOSYSTEM.filter((n) => n.status === "LIVE").length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">06 / Ecosistema</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Nodos conectados.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        {live} nodos LIVE. Stripe {STRIPE_LIVE.account} en modo {STRIPE_LIVE.mode}: {STRIPE_LIVE.products} productos, {STRIPE_LIVE.customers} clientes, {STRIPE_LIVE.subscriptions} suscripciones. Sync {STRIPE_LIVE.syncedAt}.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-4">
        {STRIPE_LIVE.productsLive.map((p) => (
          <div key={p.id} className="border border-line bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ok">{p.status}</p>
            <p className="mt-2 text-sm font-medium">{p.name}</p>
            <p className="mt-1 font-mono text-[10px] text-subtle">{p.id}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 overflow-hidden border border-line">
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-line bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:grid-cols-[64px_1fr_1.4fr_auto]">
          <span>ID</span>
          <span>Nodo</span>
          <span className="hidden sm:block">Función</span>
          <span>Estado</span>
        </div>
        {ECOSYSTEM.map((node) => (
          <Link
            key={node.repo}
            to={node.href as never}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line px-4 py-4 last:border-b-0 hover:bg-elevated sm:grid-cols-[64px_1fr_1.4fr_auto]"
          >
            <span className="font-mono text-[11px] text-accent">{node.code}</span>
            <span>
              <span className="block font-medium">{node.name}</span>
              <span className="font-mono text-[10px] text-subtle">{node.repo}</span>
            </span>
            <span className="hidden text-sm text-muted sm:block">{node.role}</span>
            <StatusPill status={node.status} />
          </Link>
        ))}
      </div>
    </main>
  );
}
