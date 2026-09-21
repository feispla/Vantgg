import { rankAsset, rankByKey, type RankKey } from "@/lib/ranks";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "size-6",
  md: "size-10",
  lg: "size-16",
  xl: "size-24",
  hero: "size-40 sm:size-48",
} as const;

const TONE_CLASS: Record<RankKey, string> = {
  unranked: "text-rank-unranked",
  "bronze-1": "text-rank-bronze",
  "bronze-2": "text-rank-bronze",
  "bronze-3": "text-rank-bronze",
  "silver-1": "text-rank-silver",
  "silver-2": "text-rank-silver",
  "silver-3": "text-rank-silver",
  "gold-1": "text-rank-gold",
  "gold-2": "text-rank-gold",
  "gold-3": "text-rank-gold",
  "platinum-1": "text-rank-platinum",
  "platinum-2": "text-rank-platinum",
  "platinum-3": "text-rank-platinum",
  "diamond-1": "text-rank-diamond",
  "diamond-2": "text-rank-diamond",
  "diamond-3": "text-rank-diamond",
  "grand-champion-1": "text-rank-gc",
  "grand-champion-2": "text-rank-gc",
  "grand-champion-3": "text-rank-gc",
  "legends-1": "text-rank-legends",
  "legends-2": "text-rank-legends",
  "legends-3": "text-rank-legends",
};

export function RankInsignia({
  rankKey,
  size = "md",
  className,
  title,
}: {
  rankKey: string;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  title?: string;
}) {
  const rank = rankByKey(rankKey);
  return (
    <img
      src={rankAsset(rank.key)}
      alt={title ?? `Insignia ${rank.label}`}
      title={title ?? rank.label}
      width={size === "hero" ? 192 : size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 40 : 24}
      height={size === "hero" ? 192 : size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 40 : 24}
      className={cn("shrink-0 object-contain", SIZE_CLASS[size], className)}
      draggable={false}
    />
  );
}

export function RankChip({
  rankKey,
  points,
  size = "sm",
  className,
}: {
  rankKey: string;
  points?: number;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  const rank = rankByKey(rankKey);
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]",
        TONE_CLASS[rank.key],
        className,
      )}
    >
      <RankInsignia rankKey={rank.key} size={size} />
      <span className="truncate">
        {rank.label}
        {typeof points === "number" ? ` · ${points} MMR` : null}
      </span>
    </span>
  );
}

export function RankShowcase({
  rankKey,
  points,
  className,
}: {
  rankKey: string;
  points?: number;
  className?: string;
}) {
  const rank = rankByKey(rankKey);
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <RankInsignia rankKey={rank.key} size="hero" className="rank-float" />
      <p className={cn("mt-3 font-display text-2xl font-semibold tracking-[-0.04em]", TONE_CLASS[rank.key])}>
        {rank.label}
      </p>
      {typeof points === "number" ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{points} MMR</p>
      ) : null}
    </div>
  );
}
