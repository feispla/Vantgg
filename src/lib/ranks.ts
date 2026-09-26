/**
 * Rank definitions and display for the VANT ranked system.
 * Matches the Valorant rank ladder: Iron → Radiant.
 */

export type RankKey =
  | "unranked"
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "ascendant"
  | "immortal"
  | "radiant";

export type RankDef = {
  key: RankKey;
  name: string;
  tier: string;
  color: string;
  icon: string;
  minMmr: number;
  maxMmr: number;
  sortOrder: number;
};

export const RANKS: RankDef[] = [
  { key: "unranked", name: "Sin rango", tier: "none", color: "#808080", icon: "○", minMmr: 0, maxMmr: 0, sortOrder: 0 },
  { key: "iron", name: "Iron", tier: "iron", color: "#8b8b8b", icon: "🛡", minMmr: 1, maxMmr: 499, sortOrder: 1 },
  { key: "bronze", name: "Bronze", tier: "bronze", color: "#cd7f32", icon: "🛡", minMmr: 500, maxMmr: 999, sortOrder: 2 },
  { key: "silver", name: "Silver", tier: "silver", color: "#c0c0c0", icon: "🛡", minMmr: 1000, maxMmr: 1499, sortOrder: 3 },
  { key: "gold", name: "Gold", tier: "gold", color: "#ffd700", icon: "🛡", minMmr: 1500, maxMmr: 1999, sortOrder: 4 },
  { key: "platinum", name: "Platinum", tier: "platinum", color: "#00d4aa", icon: "🛡", minMmr: 2000, maxMmr: 2499, sortOrder: 5 },
  { key: "diamond", name: "Diamond", tier: "diamond", color: "#00b4d8", icon: "🛡", minMmr: 2500, maxMmr: 2999, sortOrder: 6 },
  { key: "ascendant", name: "Ascendant", tier: "ascendant", color: "#00ff88", icon: "🛡", minMmr: 3000, maxMmr: 3499, sortOrder: 7 },
  { key: "immortal", name: "Immortal", tier: "immortal", color: "#a855f7", icon: "🛡", minMmr: 3500, maxMmr: 3999, sortOrder: 8 },
  { key: "radiant", name: "Radiant", tier: "radiant", color: "#ff4d4d", icon: "👑", minMmr: 4000, maxMmr: 99999, sortOrder: 9 },
];

export function getRankByKey(key: string | null | undefined): RankDef {
  return RANKS.find((r) => r.key === key) ?? RANKS[0];
}

export function getRankByMmr(mmr: number): RankDef {
  return RANKS.find((r) => mmr >= r.minMmr && mmr <= (r.maxMmr ?? 99999)) ?? RANKS[0];
}

export function getNextRank(key: string | null | undefined): RankDef | null {
  const current = getRankByKey(key);
  const next = RANKS.find((r) => r.sortOrder === current.sortOrder + 1);
  return next ?? null;
}
