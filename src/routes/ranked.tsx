import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankChip, RankInsignia, RankShowcase } from "@/components/rank-insignia";
import { RankedPlay } from "@/components/ranked-play";
import { buttonVariants } from "@/components/ui/button";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { nextRank, RANK_TIERS, rankFromPoints } from "@/lib/catalog";
import { getRankedBoard } from "@/lib/platform/compete";
import { listPublicPlayers, type PublicPlayer } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranked")({ component: RankedPage });

type BoardRow = {
  position: number;
  username: string;
  avatarUrl: string | null;
  rankKey: string;
  rank: string;
  points: number;
  isYou: boolean;
};

function RankedPage() {
  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && Boolean(user) && !user?.isDevFallback;
  const [mine, setMine] = useState<Awaited<ReturnType<typeof getRankedBoard>> | null>(null);
  const [board, setBoard] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        if (signedIn) {
          const data = await withTimeout(getRankedBoard(), 10000);
          if (!live) return;
          setMine(data);
          setBoard(
            data.board.map((row) => ({
              position: row.position,
              username: row.username,
              avatarUrl: row.avatarUrl,
              rankKey: row.rankKey,
              rank: row.rank,
              points: row.points,
              isYou: row.isYou,
            })),
          );
          return;
        }
        const rows = await withTimeout(listPublicPlayers(), 8000);
        if (!live) return;
        setBoard(
          rows.map((p: PublicPlayer) => ({
            position: p.position,
            username: p.username,
            avatarUrl: p.avatar_url,
            rankKey: p.rank.key,
            rank: p.rank.label,
            points: p.points,
            isYou: false,
          })),
        );
      } catch {
        if (live) setError(true);
      }
    };
    if (!isPending) void load();
    return () => {
      live = false;
    };
  }, [isPending, signedIn, tick]);

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-danger">No se pudo cargar Ranked.</p>
      </main>
    );
  }

  if (isPending || board === null) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }

  const me = mine?.me;
  const upcoming = me ? nextRank(me.points) : null;
  const placing = (me?.placementsLeft ?? 0) > 0 && me?.points === 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">01 / Circuito</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">VANT Ranked</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Temporada 1. Cinco rondas de call contra el circuito. Placement, MMR y promoción por divisiones.
      </p>

      {me ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <RankShowcase rankKey={placing ? "unranked" : me.rank.key} points={placing ? undefined : me.points} />
          <div>
            <div className="glass-card rounded-3xl p-6">
              <p className="font-display text-2xl font-semibold">
                {placing ? `Placement ${5 - me.placementsLeft}/5` : me.rank.label}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                #{me.position} · racha {me.streak} · pico {me.peakRankKey.replaceAll("-", " ")}
              </p>
              {placing ? (
                <p className="mt-3 text-sm text-muted">Cierra cinco series para recibir insignia.</p>
              ) : upcoming ? (
                <p className="mt-3 text-sm text-muted">
                  {upcoming.remaining} MMR para {upcoming.label}
                </p>
              ) : (
                <p className="mt-3 text-sm text-rank-legends">Techo de Temporada 1.</p>
              )}
              {upcoming && !placing ? (
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full origin-left rounded-full bg-accent transition-transform duration-200"
                    style={{ transform: `scaleX(${upcoming.progress})` }}
                  />
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className={buttonVariants()} onClick={() => setPlaying(true)}>
                  Jugar Ranked
                </button>
                <Link to="/tournaments" className={buttonVariants({ variant: "ghost" })}>
                  Torneos
                </Link>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="MMR" value={String(me.points)} />
              <Stat label="Win rate" value={`${me.winRate}%`} />
              <Stat label="Wins" value={String(me.wins)} />
              <Stat label="Losses" value={String(me.losses)} />
            </div>
          </div>
        </section>
      ) : (
        <div className="mt-10 glass-card rounded-3xl p-6">
          <p className="text-sm leading-6 text-muted">
            Mira el circuito ahora. Tus puntos, placement e historial aparecen cuando creas una cuenta.
          </p>
          <Link to="/register" className={cn(buttonVariants(), "mt-5")}>
            Crear cuenta y jugar
          </Link>
        </div>
      )}

      <h2 className="mt-16 font-display text-2xl font-semibold">Insignias</h2>
      <ul className="mt-6 space-y-4">
        {RANK_TIERS.map((tier) => (
          <li key={tier.id} className="flex flex-wrap items-center gap-3">
            <span className="font-mono w-36 text-[10px] uppercase tracking-[0.16em] text-subtle">{tier.label}</span>
            {tier.keys.map((key) => (
              <span key={key} className="flex flex-col items-center gap-1">
                <RankInsignia rankKey={key} size="lg" />
              </span>
            ))}
          </li>
        ))}
      </ul>

      <h2 className="mt-16 font-display text-2xl font-semibold">Leaderboard</h2>
      {board.length === 0 ? (
        <div className="mt-4 glass-card rounded-2xl p-6">
          <p className="text-sm text-muted">Nadie se ha registrado todavía. El primero abre Temporada 1.</p>
          <Link to="/register" className={cn(buttonVariants({ variant: "ghost" }), "mt-5")}>
            Registrarme
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {board.map((row) => {
            const rank = rankFromPoints(row.points);
            return (
              <li
                key={`${row.position}-${row.username}`}
                className={cn("flex items-center justify-between gap-3 py-3 text-sm", row.isYou && "text-accent")}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="font-mono w-8 shrink-0 text-xs text-subtle">#{row.position}</span>
                  <RankInsignia rankKey={row.rankKey || rank.key} size="md" />
                  <PlayerAvatar src={row.avatarUrl} name={row.username} size={36} className="rounded-xl" />
                  <Link
                    to="/players/$username"
                    params={{ username: row.username }}
                    className="truncate hover:underline"
                  >
                    {row.username}
                    {row.isYou ? " · tú" : ""}
                  </Link>
                </span>
                <RankChip rankKey={row.rankKey || rank.key} points={row.points} className="shrink-0" />
              </li>
            );
          })}
        </ul>
      )}

      {mine ? (
        <>
          <h2 className="mt-16 font-display text-2xl font-semibold">Historial</h2>
          {mine.history.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Todavía no hay series registradas.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {mine.history.map((h) => (
                <li key={h.id} className="flex justify-between gap-3 border-b border-line py-2">
                  <span>
                    {h.title} · {h.result}
                  </span>
                  <span className="font-mono tabular-nums text-muted">
                    {h.points_delta >= 0 ? "+" : ""}
                    {h.points_delta}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {playing && me ? (
        <RankedPlay
          meName={me.username ?? user?.displayName ?? "Tú"}
          meAvatar={me.avatar_url}
          meRankKey={placing ? "unranked" : me.rank.key}
          onClose={() => {
            setPlaying(false);
            setTick((n) => n + 1);
          }}
          onFinished={() => {
            setTick((n) => n + 1);
          }}
        />
      ) : null}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
