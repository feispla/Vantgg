export const RANK_ASSET = {
  unranked: "/ranks/unranked.png",
  "bronze-1": "/ranks/bronze-1.png",
  "bronze-2": "/ranks/bronze-2.png",
  "bronze-3": "/ranks/bronze-3.png",
  "silver-1": "/ranks/silver-1.png",
  "silver-2": "/ranks/silver-2.png",
  "silver-3": "/ranks/silver-3.png",
  "gold-1": "/ranks/gold-1.png",
  "gold-2": "/ranks/gold-2.png",
  "gold-3": "/ranks/gold-3.png",
  "platinum-1": "/ranks/platinum-1.png",
  "platinum-2": "/ranks/platinum-2.png",
  "platinum-3": "/ranks/platinum-3.png",
  "diamond-1": "/ranks/diamond-1.png",
  "diamond-2": "/ranks/diamond-2.png",
  "diamond-3": "/ranks/diamond-3.png",
  "grand-champion-1": "/ranks/grand-champion-1.png",
  "grand-champion-2": "/ranks/grand-champion-2.png",
  "grand-champion-3": "/ranks/grand-champion-3.png",
  "legends-1": "/ranks/legends-1.png",
  "legends-2": "/ranks/legends-2.png",
  "legends-3": "/ranks/legends-3.png",
} as const;

export const RANKS = [
  { key: "unranked", label: "Unranked", short: "UNR", tier: "unranked", division: 0, min: 0, tone: "rank-unranked", blurb: "Cinco partidas de placement y entras al circuito." },
  { key: "bronze-1", label: "Bronze I", short: "B I", tier: "bronze", division: 1, min: 1, tone: "rank-bronze", blurb: "El suelo del circuito. Cada call cuenta." },
  { key: "bronze-2", label: "Bronze II", short: "B II", tier: "bronze", division: 2, min: 150, tone: "rank-bronze", blurb: "Ya hay racha. Sigue leyendo el timing." },
  { key: "bronze-3", label: "Bronze III", short: "B III", tier: "bronze", division: 3, min: 300, tone: "rank-bronze", blurb: "Puerta de Silver. No falles el call." },
  { key: "silver-1", label: "Silver I", short: "S I", tier: "silver", division: 1, min: 450, tone: "rank-silver", blurb: "Nivel de scrim. Visible en el roster." },
  { key: "silver-2", label: "Silver II", short: "S II", tier: "silver", division: 2, min: 600, tone: "rank-silver", blurb: "Consistencia. El circuito te empieza a mirar." },
  { key: "silver-3", label: "Silver III", short: "S III", tier: "silver", division: 3, min: 750, tone: "rank-silver", blurb: "Un paso de Gold. Ticket BASIC cubre hasta aquí." },
  { key: "gold-1", label: "Gold I", short: "G I", tier: "gold", division: 1, min: 900, tone: "rank-gold", blurb: "Circuito abierto. Ritmo de operator." },
  { key: "gold-2", label: "Gold II", short: "G II", tier: "gold", division: 2, min: 1100, tone: "rank-gold", blurb: "Bracket medio. Las series se deciden en un frame." },
  { key: "gold-3", label: "Gold III", short: "G III", tier: "gold", division: 3, min: 1300, tone: "rank-gold", blurb: "Techo de BASIC. Pro Series espera arriba." },
  { key: "platinum-1", label: "Platinum I", short: "P I", tier: "platinum", division: 1, min: 1500, tone: "rank-platinum", blurb: "Pro Series. Prioridad de tryout." },
  { key: "platinum-2", label: "Platinum II", short: "P II", tier: "platinum", division: 2, min: 1750, tone: "rank-platinum", blurb: "Hands rápidas. El call es limpio." },
  { key: "platinum-3", label: "Platinum III", short: "P III", tier: "platinum", division: 3, min: 2000, tone: "rank-platinum", blurb: "Puerta de Diamond. Pocas cuentas llegan." },
  { key: "diamond-1", label: "Diamond I", short: "D I", tier: "diamond", division: 1, min: 2250, tone: "rank-diamond", blurb: "Bracket alto. Invitational en el radar." },
  { key: "diamond-2", label: "Diamond II", short: "D II", tier: "diamond", division: 2, min: 2550, tone: "rank-diamond", blurb: "Nivel de roster. Command te ve." },
  { key: "diamond-3", label: "Diamond III", short: "D III", tier: "diamond", division: 3, min: 2850, tone: "rank-diamond", blurb: "El aire se corta. Grand Champion está cerca." },
  { key: "grand-champion-1", label: "Grand Champion I", short: "GC I", tier: "grand-champion", division: 1, min: 3200, tone: "rank-gc", blurb: "Elite del circuito. Sala privada." },
  { key: "grand-champion-2", label: "Grand Champion II", short: "GC II", tier: "grand-champion", division: 2, min: 3600, tone: "rank-gc", blurb: "Top split. Casi nadie vive aquí." },
  { key: "grand-champion-3", label: "Grand Champion III", short: "GC III", tier: "grand-champion", division: 3, min: 4000, tone: "rank-gc", blurb: "Invitational permanente. Legends mira." },
  { key: "legends-1", label: "Legends I", short: "L I", tier: "legends", division: 1, min: 4500, tone: "rank-legends", blurb: "La insignia que cierra el año." },
  { key: "legends-2", label: "Legends II", short: "L II", tier: "legends", division: 2, min: 5100, tone: "rank-legends", blurb: "Nombre en el muro. Puntos de org." },
  { key: "legends-3", label: "Legends III", short: "L III", tier: "legends", division: 3, min: 5800, tone: "rank-legends", blurb: "Techo de VANT REALM. Temporada 1." },
] as const;

export type RankKey = (typeof RANKS)[number]["key"];
export type Rank = (typeof RANKS)[number];

export const RANK_TIERS = [
  { id: "legends", label: "Legends", tone: "rank-legends", keys: ["legends-1", "legends-2", "legends-3"] },
  { id: "grand-champion", label: "Grand Champion", tone: "rank-gc", keys: ["grand-champion-1", "grand-champion-2", "grand-champion-3"] },
  { id: "diamond", label: "Diamond", tone: "rank-diamond", keys: ["diamond-1", "diamond-2", "diamond-3"] },
  { id: "platinum", label: "Platinum", tone: "rank-platinum", keys: ["platinum-1", "platinum-2", "platinum-3"] },
  { id: "gold", label: "Gold", tone: "rank-gold", keys: ["gold-1", "gold-2", "gold-3"] },
  { id: "silver", label: "Silver", tone: "rank-silver", keys: ["silver-1", "silver-2", "silver-3"] },
  { id: "bronze", label: "Bronze", tone: "rank-bronze", keys: ["bronze-1", "bronze-2", "bronze-3"] },
  { id: "unranked", label: "Unranked", tone: "rank-unranked", keys: ["unranked"] },
] as const;

export const PLACEMENT_MATCHES = 5;

export const PLACEMENT_MMR = [160, 320, 480, 780, 1120, 1520] as const;

export function rankFromPoints(points: number): Rank {
  let current: Rank = RANKS[0];
  for (const r of RANKS) {
    if (points >= r.min) current = r;
  }
  return current;
}

export function rankByKey(key: string | null | undefined): Rank {
  return RANKS.find((r) => r.key === key) ?? RANKS[0];
}

export function nextRank(points: number) {
  const current = rankFromPoints(points);
  const idx = RANKS.findIndex((r) => r.key === current.key);
  const upcoming = RANKS[idx + 1];
  if (!upcoming) return null;
  const span = upcoming.min - current.min;
  const gained = Math.max(0, points - current.min);
  return {
    ...upcoming,
    remaining: Math.max(0, upcoming.min - points),
    progress: span <= 0 ? 1 : Math.min(1, gained / span),
  };
}

export function rankAsset(key: string | null | undefined): string {
  const rank = rankByKey(key);
  return RANK_ASSET[rank.key];
}

export function rankIndex(key: string | null | undefined): number {
  return RANKS.findIndex((r) => r.key === rankByKey(key).key);
}

export function meanReactionMs(mmr: number): number {
  const idx = rankIndex(rankFromPoints(mmr).key);
  return Math.max(188, 398 - idx * 9);
}
