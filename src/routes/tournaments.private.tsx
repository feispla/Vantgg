import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPrivateTournament, registerForTournament } from "@/lib/platform/compete";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tournaments/private")({ component: PrivatePage });

function PrivatePage() {
  return (
    <RequireAuth>
      <Body />
    </RequireAuth>
  );
}

function Body() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getPrivateTournament>> | null>(null);

  useEffect(() => {
    getPrivateTournament().then(setData);
  }, []);

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="h-32 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }

  if (!data.allowed) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warn">Privado</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Acceso denegado</h1>
        <p className="mt-3 text-muted">{data.reason}</p>
        <Link to="/tickets" className={cn(buttonVariants(), "mt-8")}>
          Comprar ticket
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">Sala privada</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Scrims Operator</h1>
      <div className="mt-8 space-y-4">
        {data.tournaments.map((t) => (
          <article key={t.id} className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-2xl">{t.name}</h2>
            <p className="mt-2 text-sm text-muted">{t.blurb}</p>
            <p className="mt-3 text-sm">
              {t.participants}/{t.capacity} · {t.prize}
            </p>
            <Button
              className="mt-4"
              disabled={t.registered}
              onClick={() => void registerForTournament({ data: { tournamentId: t.id } }).then(() => getPrivateTournament().then(setData))}
            >
              {t.registered ? "Inscrito" : "Inscribirme"}
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}
