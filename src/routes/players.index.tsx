import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankChip, RankInsignia } from "@/components/rank-insignia";
import { buttonVariants } from "@/components/ui/button";
import { RANK_TIERS } from "@/lib/catalog";
import { listPublicPlayers, type PublicPlayer } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/players/")({ component: PlayersPage });

function PlayersPage() {
  const [players, setPlayers] = useState<PublicPlayer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    withTimeout(listPublicPlayers(), 8000)
      .then((rows) => {
        if (live) setPlayers(rows);
      })
      .catch((err) => {
        if (live) setError(err instanceof Error ? err.message : "No se pudo cargar.");
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">01 / Roster vivo</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Jugadores</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Solo cuentas registradas. Cada rango tiene insignia. Al crear tu perfil naces Unranked y subes con puntos reales.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {RANK_TIERS.map((tier) => (
          <li
            key={tier.id}
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5"
          >
            <RankInsignia rankKey={tier.keys[tier.keys.length - 1]} size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{tier.label}</span>
          </li>
        ))}
      </ul>

      {error ? <p className="mt-8 text-sm text-danger">{error}</p> : null}

      {!players ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="mt-10 glass-card rounded-2xl p-8">
          <p className="text-sm text-muted">
            Aún no hay perfiles públicos. No sembramos jugadores falsos: crea una cuenta y serás el primero.
          </p>
          <Link to="/register" className={cn(buttonVariants(), "mt-6")}>
            Crear cuenta
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((p) => (
            <li key={p.username}>
              <Link
                to="/players/$username"
                params={{ username: p.username }}
                className="glass-card flex min-h-24 items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-elevated"
              >
                <div className="relative">
                  <PlayerAvatar src={p.avatar_url} name={p.username} size={56} />
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-bg p-0.5">
                    <RankInsignia rankKey={p.rank.key} size="sm" />
                  </span>
                </div>
                <span className="min-w-0">
                  <span className="block truncate font-display text-lg font-semibold">
                    #{p.position} {p.username}
                  </span>
                  <RankChip rankKey={p.rank.key} points={p.points} className="mt-1" />
                  <span className="mt-1 block truncate text-xs text-subtle">
                    {p.country ?? "—"} · {p.wins}W {p.losses}L
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
