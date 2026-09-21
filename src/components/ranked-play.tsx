import { useEffect, useRef, useState } from "react";
import { RankInsignia } from "@/components/rank-insignia";
import { PlayerAvatar } from "@/components/player-avatar";
import { Button } from "@/components/ui/button";
import {
  startRankedQueue,
  submitRankedMatch,
  type RankedMatchResult,
  type RankedOpponent,
} from "@/lib/platform/compete";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Phase = "search" | "ready" | "wait" | "go" | "round" | "summary";

export function RankedPlay({
  meName,
  meAvatar,
  meRankKey,
  onClose,
  onFinished,
}: {
  meName: string;
  meAvatar: string | null;
  meRankKey: string;
  onClose: () => void;
  onFinished: (result: RankedMatchResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>("search");
  const [error, setError] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<RankedOpponent | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [lastMs, setLastMs] = useState<number | null>(null);
  const [times, setTimes] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<RankedMatchResult | null>(null);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const timesRef = useRef<(number | null)[]>([]);

  useEffect(() => {
    let live = true;
    withTimeout(startRankedQueue(), 10000)
      .then((data) => {
        if (!live) return;
        setOpponent(data.opponent);
        setMatchId(data.matchId);
        window.setTimeout(() => {
          if (live) setPhase("ready");
        }, 1200);
      })
      .catch((err) => {
        if (!live) return;
        setError(err instanceof Error ? err.message : "No se pudo encontrar rival.");
      });
    return () => {
      live = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    setCountdown(3);
    const t = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(t);
          beginRound(0);
          return 0;
        }
        return c - 1;
      });
    }, 700);
    return () => window.clearInterval(t);
  }, [phase]);

  function beginRound(index: number) {
    setRound(index);
    setLastMs(null);
    setPhase("wait");
    const delay = 900 + Math.floor(Math.random() * 1500);
    startRef.current = 0;
    timerRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
      timerRef.current = window.setTimeout(() => {
        resolveRound(null);
      }, 1100);
    }, delay);
  }

  function resolveRound(ms: number | null) {
    if (busyRef.current) return;
    busyRef.current = true;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const clean = ms !== null && ms >= 118 && ms <= 1100 ? Math.round(ms) : null;
    timesRef.current = [...timesRef.current, clean];
    setTimes(timesRef.current);
    setLastMs(clean);
    setPhase("round");
    window.setTimeout(() => {
      busyRef.current = false;
      if (timesRef.current.length >= 5) {
        void finish();
        return;
      }
      beginRound(timesRef.current.length);
    }, 850);
  }

  async function finish() {
    if (!matchId) return;
    setPhase("summary");
    try {
      const data = await withTimeout(
        submitRankedMatch({ data: { matchId, times: timesRef.current } }),
        10000,
      );
      setResult(data);
      onFinished(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el resultado.");
    }
  }

  function onArenaClick() {
    if (phase === "wait") {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      resolveRound(null);
      return;
    }
    if (phase === "go" && startRef.current) {
      resolveRound(performance.now() - startRef.current);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-bg/96 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">VANT CALL · 5 rondas</p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-xl text-muted hover:bg-elevated hover:text-fg"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>
      </div>

      {error ? (
        <div className="grid flex-1 place-items-center px-4">
          <p className="text-danger">{error}</p>
          <Button className="mt-6" onClick={onClose}>
            Volver
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="mb-8 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3">
            <PlayerCard name={meName} avatar={meAvatar} rankKey={meRankKey} align="right" you />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">vs</p>
            <PlayerCard
              name={opponent?.name ?? "…"}
              avatar={null}
              rankKey={opponent?.rankKey ?? "unranked"}
              align="left"
            />
          </div>

          {phase === "search" ? (
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Buscando rival en el circuito…</p>
          ) : null}

          {phase === "ready" ? (
            <p className="font-display text-6xl font-semibold tabular-nums">{countdown || "CALL"}</p>
          ) : null}

          {phase === "wait" || phase === "go" ? (
            <button
              type="button"
              onClick={onArenaClick}
              className={cn(
                "grid size-56 place-items-center rounded-full border transition-[border-color,background-color,transform] duration-150 sm:size-64",
                phase === "go" ? "call-pulse border-accent bg-accent/15" : "border-line bg-surface",
              )}
            >
              {phase === "go" ? (
                <img src="/vant-logo.png" alt="" className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
              ) : (
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">Espera el call</span>
              )}
            </button>
          ) : null}

          {phase === "round" ? (
            <div className="text-center">
              <p className={cn("font-display text-4xl font-semibold tabular-nums", lastMs ? "text-fg" : "text-danger")}>
                {lastMs ? `${lastMs} ms` : "False start"}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Ronda {round + 1} / 5</p>
            </div>
          ) : null}

          {phase === "summary" ? (
            <div className="text-center">
              {!result ? (
                <p className="text-muted">Cerrando serie…</p>
              ) : (
                <>
                  <p className="font-display text-5xl font-semibold tracking-[-0.05em]">
                    {result.won ? "VICTORIA" : "DERROTA"}
                  </p>
                  <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-muted">
                    {result.roundsWon}-{result.roundsLost} · {result.mmrDelta >= 0 ? "+" : ""}
                    {result.mmrDelta} MMR
                  </p>
                  <div className="mt-6 flex justify-center">
                    <RankInsignia rankKey={result.rankKey} size="xl" />
                  </div>
                  <p className="mt-3 text-lg">{result.rankLabel}</p>
                  {result.promoted ? <p className="mt-2 text-sm text-ok">Promoción</p> : null}
                  {result.placed ? <p className="mt-2 text-sm text-ok">Placement cerrado. Bienvenido al circuito.</p> : null}
                  <Button className="mt-8" onClick={onClose}>
                    Continuar
                  </Button>
                </>
              )}
            </div>
          ) : null}

          {times.length > 0 && phase !== "summary" ? (
            <ol className="mt-8 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <li
                  key={i}
                  className={cn("h-1.5 w-8 rounded-full", times[i] === undefined ? "bg-elevated" : times[i] ? "bg-fg" : "bg-danger")}
                />
              ))}
            </ol>
          ) : null}

          {phase === "wait" || phase === "go" ? (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
              Ronda {round + 1} de 5 · no pulses antes
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function PlayerCard({
  name,
  avatar,
  rankKey,
  align,
  you,
}: {
  name: string;
  avatar: string | null;
  rankKey: string;
  align: "left" | "right";
  you?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", align === "right" && "flex-row-reverse")}>
      {avatar ? (
        <PlayerAvatar src={avatar} name={name} size={48} className="rounded-xl" />
      ) : (
        <RankInsignia rankKey={rankKey} size="md" />
      )}
      <div className={cn("min-w-0", align === "right" && "text-right")}>
        <p className="truncate font-medium">
          {name}
          {you ? " · tú" : ""}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{rankKey.replaceAll("-", " ")}</p>
      </div>
    </div>
  );
}
