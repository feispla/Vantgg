import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlayerAvatar } from "@/components/player-avatar";
import { RankChip, RankInsignia } from "@/components/rank-insignia";
import { buttonVariants } from "@/components/ui/button";
import { RANK_TIERS, rankByKey } from "@/lib/ranks";
import { listPublicPlayers, type PublicPlayer } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

const TIER_TEXT: Record<string, string> = {
  legends: "text-rank-legends",
  "grand-champion": "text-rank-gc",
  diamond: "text-rank-diamond",
  platinum: "text-rank-platinum",
  gold: "text-rank-gold",
  silver: "text-rank-silver",
  bronze: "text-rank-bronze",
  unranked: "text-rank-unranked",
};

export function RankLadder() {
  const [players, setPlayers] = useState<PublicPlayer[] | null>(null);

  useEffect(() => {
    let live = true;
    withTimeout(listPublicPlayers(), 8000)
      .then((rows) => {
        if (live) setPlayers(rows);
      })
      .catch(() => {
        if (live) setPlayers([]);
      });
    return () => {
      live = false;
    };
  }, []);

  const top = players?.slice(0, 5) ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
      <ol className="space-y-2">
        {RANK_TIERS.map((tier) => (
          <li key={tier.id} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[10rem_1fr]">
            <span
              className={cn(
                "tier-chip font-mono text-[9px] uppercase tracking-[0.16em] sm:text-[10px]",
                TIER_TEXT[tier.id],
              )}
            >
              {tier.label}
            </span>
            <span className="flex items-center justify-start gap-2 sm:gap-4">
              {tier.keys.map((key) => {
                const rank = rankByKey(key);
                return (
                  <span key={key} className="flex flex-col items-center gap-1">
                    <RankInsignia rankKey={key} size="lg" />
                    {tier.keys.length > 1 ? (
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-subtle">
                        {["I", "II", "III"][rank.division - 1]}
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ol>

      <div className="glass-card rounded-3xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Top circuito</p>
        {!players ? (
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-2xl bg-elevated" />
            ))}
          </div>
        ) : top.length === 0 ? (
          <div className="mt-5">
            <p className="text-sm leading-6 text-muted">
              El ranking está vacío a propósito. El primero en registrarse abre Temporada 1.
            </p>
            <Link to="/register" className={cn(buttonVariants(), "mt-6")}>
              Crear cuenta
            </Link>
          </div>
        ) : (
          <ul className="mt-5 space-y-2">
            {top.map((p) => (
              <li key={p.username}>
                <Link
                  to="/players/$username"
                  params={{ username: p.username }}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-bg/60 p-3 transition-colors hover:bg-elevated"
                >
                  <span className="font-mono w-6 text-xs text-subtle">#{p.position}</span>
                  <PlayerAvatar src={p.avatar_url} name={p.username} size={40} className="rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.username}</span>
                    <RankChip rankKey={p.rank.key} points={p.points} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
