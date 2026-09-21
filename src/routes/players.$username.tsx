import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankChip, RankInsignia } from "@/components/rank-insignia";
import { buttonVariants } from "@/components/ui/button";
import { nextRank } from "@/lib/catalog";
import { getPublicPlayer } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/players/$username")({ component: PublicProfile });

function PublicProfile() {
  const { username } = Route.useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof getPublicPlayer>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    withTimeout(getPublicPlayer({ data: { username } }), 8000)
      .then((d) => {
        if (live) setData(d);
      })
      .catch((err) => {
        if (live) setError(err instanceof Error ? err.message : "No se pudo cargar.");
      });
    return () => {
      live = false;
    };
  }, [username]);

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-danger">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }

  if (!data.player) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Jugador no encontrado</h1>
        <p className="mt-3 text-sm text-muted">Solo se publican cuentas registradas.</p>
        <Link to="/players" className={cn(buttonVariants({ variant: "ghost" }), "mt-8")}>
          Volver al roster
        </Link>
      </main>
    );
  }

  const p = data.player;
  const rank = data.rank ?? p.rank;
  const upcoming = nextRank(p.points);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Perfil público</p>
      <div className="mt-8 glass-card flex flex-wrap items-center gap-6 rounded-3xl p-6">
        <div className="relative">
          <PlayerAvatar src={p.avatar_url} name={p.username} size={96} className="rounded-3xl" />
          <span className="absolute -bottom-2 -right-2 rounded-full bg-bg p-1">
            <RankInsignia rankKey={rank.key} size="md" />
          </span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">{p.username}</h1>
          <p className="mt-2 text-muted">{p.display_name}</p>
          <RankChip rankKey={rank.key} points={p.points} size="sm" className="mt-3" />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            #{data.position} · {p.country ?? "—"} · {p.wins}W / {p.losses}L
          </p>
          {upcoming ? (
            <p className="mt-2 text-sm text-muted">
              {upcoming.remaining} pts para insignia {upcoming.label}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/players" className={buttonVariants({ variant: "ghost" })}>
          Todos los jugadores
        </Link>
        <Link to="/ranked" className={buttonVariants({ variant: "ghost" })}>
          Ranked
        </Link>
      </div>
    </main>
  );
}
