import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankInsignia } from "@/components/rank-insignia";
import { RequireAuth } from "@/components/require-auth";
import { buttonVariants } from "@/components/ui/button";
import { getMyAccount } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardBody />
    </RequireAuth>
  );
}

function DashboardBody() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyAccount>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    withTimeout(getMyAccount(), 10000)
      .then((d) => {
        if (live) setData(d);
      })
      .catch((err) => {
        if (live) setError(err instanceof Error ? err.message : "No se pudo cargar.");
      });
    return () => {
      live = false;
    };
  }, []);

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-danger">{error}</p>
      </main>
    );
  }
  if (!data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }

  const verified = data.user.emailVerified;
  return (
    <AppShell title={data.profile.username ?? data.user.name ?? "Operator"} kicker="Overview">
      <div className="flex flex-wrap items-center gap-4">
        <PlayerAvatar
          src={data.profile.avatar_url ?? data.user.image}
          name={data.profile.username ?? "VANT"}
          seed={data.user.id}
          size={64}
        />
        <div>
          <p className="text-sm text-muted">{data.user.email}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            {verified ? "Email verificado" : "Email pendiente"} · {data.profile.verification_status}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <RankInsignia rankKey={data.rank.key} size="md" />
            <span className="text-sm text-muted">
              {data.rank.label} · #{data.position}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">Rango VANT</p>
          <div className="mt-2 flex items-center gap-3">
            <RankInsignia rankKey={data.rank.key} size="lg" />
            <p className="font-display text-2xl font-semibold">{data.rank.label}</p>
          </div>
        </div>
        <Stat label="Puntos Ranked" value={String(data.profile.points)} />
        <Stat label="Tickets" value={String(data.tickets.length)} />
        <Stat label="Compras" value={String(data.purchases.length)} />
      </div>
      <div className="mt-4">
        <Link to="/ranked" className={buttonVariants()}>
          Jugar Ranked
        </Link>
      </div>

      <section className="mt-10" id="compras">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Compras</h2>
          <Link to="/tickets" className="text-xs text-accent underline">
            Comprar ticket
          </Link>
        </div>
        {data.purchases.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Todavía no hay compras confirmadas por Stripe.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.purchases.map((p) => (
              <li key={p.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                <span>
                  {p.product_id ?? p.plan_id} · {p.status}
                </span>
                <span className="font-mono text-[10px] text-subtle">{p.id.slice(0, 8)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Torneos</h2>
        {data.entries.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Sin inscripciones.{" "}
            <Link to="/tournaments" className="underline">
              Ver torneos
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {data.entries.map((e) => (
              <li key={e.tournament_id}>
                {e.tournament_id} · {e.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/profile" className={buttonVariants({ variant: "ghost" })}>
          Editar perfil y logo
        </Link>
        <Link to="/players" className={buttonVariants({ variant: "ghost" })}>
          Ver jugadores
        </Link>
        <Link to="/settings" className={cn(buttonVariants({ variant: "ghost" }))}>
          Configuración
        </Link>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
