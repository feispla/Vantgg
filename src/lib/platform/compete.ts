import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { avatarDataUrl } from "@/lib/avatar";
import { rankFromPoints, tierMeets, type TicketTier } from "@/lib/catalog";
import { meanReactionMs, PLACEMENT_MATCHES, PLACEMENT_MMR, rankByKey } from "@/lib/ranks";
import { ensureProfile } from "@/lib/platform/profiles";
import { hitRateLimit } from "@/lib/platform/rate-limit";
import { newId } from "@/lib/utils";

const CIRCUIT = [
  "KAEL",
  "NOX",
  "ASHER",
  "KIRO",
  "NYX",
  "ORION",
  "LUMEN",
  "HEXA",
  "SABLE",
  "PULSE",
  "DRIFT",
  "ECHO",
  "FANG",
  "GRID",
  "HUSH",
  "ION",
  "MIRA",
  "QUILL",
  "RUNE",
  "TORQ",
  "ZEPHYR",
  "RHO",
  "SIGMA",
  "CALLER",
] as const;

export type RankedOpponent = {
  name: string;
  rankKey: string;
  mmr: number;
};

export type RankedMatchResult = {
  won: boolean;
  roundsWon: number;
  roundsLost: number;
  mmrDelta: number;
  points: number;
  rankKey: string;
  rankLabel: string;
  promoted: boolean;
  placed: boolean;
  placementsLeft: number;
  streak: number;
  opponent: RankedOpponent;
};

function gauss(mean: number, std: number) {
  const u = Math.max(0.0001, Math.random());
  const v = Math.max(0.0001, Math.random());
  const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + n * std;
}

function ghostTimes(mmr: number): number[] {
  const mean = meanReactionMs(mmr);
  return Array.from({ length: 5 }, () => Math.round(Math.min(520, Math.max(168, gauss(mean, 28)))));
}

async function userTier(userId: string): Promise<TicketTier | null> {
  const sql = await getSql();
  const rows = await sql<{ key: string }>`
    select key from entitlements
    where user_id = ${userId} and key in ('ticket.basic','ticket.pro','ticket.elite')
  `;
  const keys = new Set(rows.map((r) => r.key));
  if (keys.has("ticket.elite")) return "elite";
  if (keys.has("ticket.pro")) return "pro";
  if (keys.has("ticket.basic")) return "basic";
  return null;
}

async function assertVerifiedPlayer(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ email_verified: boolean }>`
    select "emailVerified" as email_verified
    from "user"
    where id = ${userId}
    limit 1
  `;
  if (!rows[0]?.email_verified) {
    throw new Error("Verifica tu correo antes de competir en Ranked.");
  }
}

export const getRankedBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await assertVerifiedPlayer(context.userId);
    const profile = await ensureProfile(context.userId);
    const me = rankFromPoints(profile.points);
    const board = await sql<{
      user_id: string;
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
      rank_key: string;
      points: number;
      xp: number;
      wins: number;
      losses: number;
    }>`
      select p.user_id, p.username, p.display_name, p.avatar_url, p.rank_key, p.points, p.xp, p.wins, p.losses
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
      order by p.points desc, p.xp desc
      limit 50
    `;
    const history = await sql<{
      id: string;
      title: string;
      result: string;
      points_delta: number;
      created_at: string;
    }>`
      select id, title, result, points_delta, created_at
      from ranked_history where user_id = ${context.userId}
      order by created_at desc limit 15
    `;
    const positionRows = await sql<{ n: number }>`
      select count(*)::int as n
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
        and p.points > ${profile.points}
    `;
    const extra = profile as typeof profile & {
      placements_left?: number;
      placement_wins?: number;
      streak?: number;
      peak_rank_key?: string;
    };
    return {
      me: {
        ...profile,
        rank: me,
        position: (positionRows[0]?.n ?? 0) + 1,
        winRate:
          profile.wins + profile.losses === 0
            ? 0
            : Math.round((profile.wins / (profile.wins + profile.losses)) * 100),
        tier: await userTier(context.userId),
        placementsLeft: extra.placements_left ?? PLACEMENT_MATCHES,
        streak: extra.streak ?? 0,
        peakRankKey: extra.peak_rank_key ?? me.key,
      },
      board: board.map((row, i) => {
        const rank = rankFromPoints(row.points);
        return {
          position: i + 1,
          username: row.username ?? row.display_name ?? "player",
          avatarUrl:
            row.avatar_url && row.avatar_url.length > 8
              ? row.avatar_url
              : avatarDataUrl(row.username ?? row.user_id),
          rankKey: rank.key,
          rank: rank.label,
          points: row.points,
          xp: row.xp,
          wins: row.wins,
          losses: row.losses,
          isYou: row.user_id === context.userId,
        };
      }),
      history,
    };
  });

export const listTournaments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const tier = await userTier(context.userId);
    const rows = await sql<{
      id: string;
      name: string;
      blurb: string;
      status: string;
      starts_at: string;
      capacity: number;
      prize: string | null;
      entry_label: string | null;
      min_tier: string;
      is_private: boolean;
    }>`
      select id, name, blurb, status, starts_at, capacity, prize, entry_label, min_tier, is_private
      from tournaments
      where is_private = false
      order by starts_at asc
    `;
    const counts = await sql<{ tournament_id: string; n: number }>`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `;
    const mine = await sql<{ tournament_id: string }>`
      select tournament_id from tournament_entries where user_id = ${context.userId}
    `;
    const countMap = new Map(counts.map((c) => [c.tournament_id, c.n]));
    const mineSet = new Set(mine.map((m) => m.tournament_id));
    return {
      tier,
      tournaments: rows.map((t) => ({
        ...t,
        participants: countMap.get(t.id) ?? 0,
        registered: mineSet.has(t.id),
        eligible: tierMeets(tier, (t.min_tier as TicketTier) || "basic"),
      })),
    };
  });

export const getPrivateTournament = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const tier = await userTier(context.userId);
    if (!tierMeets(tier, "pro")) {
      return { allowed: false as const, reason: "Necesitas un ticket PRO o ELITE." };
    }
    const rows = await sql<{
      id: string;
      name: string;
      blurb: string;
      status: string;
      starts_at: string;
      capacity: number;
      prize: string | null;
      entry_label: string | null;
      min_tier: string;
    }>`
      select id, name, blurb, status, starts_at, capacity, prize, entry_label, min_tier
      from tournaments where is_private = true order by starts_at asc
    `;
    const counts = await sql<{ tournament_id: string; n: number }>`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `;
    const mine = await sql<{ tournament_id: string }>`
      select tournament_id from tournament_entries where user_id = ${context.userId}
    `;
    const countMap = new Map(counts.map((c) => [c.tournament_id, c.n]));
    const mineSet = new Set(mine.map((m) => m.tournament_id));
    return {
      allowed: true as const,
      tier,
      tournaments: rows.map((t) => ({
        ...t,
        participants: countMap.get(t.id) ?? 0,
        registered: mineSet.has(t.id),
      })),
    };
  });

export const registerForTournament = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tournamentId: z.string().min(2).max(80) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const tours = await sql<{
      id: string;
      name: string;
      capacity: number;
      min_tier: string;
      is_private: boolean;
      status: string;
    }>`
      select id, name, capacity, min_tier, is_private, status
      from tournaments where id = ${data.tournamentId} limit 1
    `;
    const tour = tours[0];
    if (!tour || tour.status !== "open") throw new Error("Torneo no disponible.");
    const tier = await userTier(context.userId);
    if (!tierMeets(tier, (tour.min_tier as TicketTier) || "basic")) {
      throw new Error("Necesitas un ticket compatible.");
    }
    const count = await sql<{ n: number }>`
      select count(*)::int as n from tournament_entries where tournament_id = ${tour.id}
    `;
    if ((count[0]?.n ?? 0) >= tour.capacity) throw new Error("Cupo completo.");
    const tickets = await sql<{ id: string }>`
      select id from tickets
      where user_id = ${context.userId} and status = 'PAID'
      order by created_at desc
      limit 1
    `;
    const id = newId();
    await sql`
      insert into tournament_entries (id, tournament_id, user_id, ticket_id, status)
      values (${id}, ${tour.id}, ${context.userId}, ${tickets[0]?.id ?? null}, 'registered')
      on conflict (tournament_id, user_id) do nothing
    `;
    const users = await sql<{ email: string | null }>`
      select email from "user" where id = ${context.userId} limit 1
    `;
    if (users[0]?.email) {
      try {
        const { queueEmail } = await import("@/lib/platform/email.server");
        await queueEmail({
          to: users[0].email,
          template: "tournament",
          body: `Inscripción confirmada en ${tour.name}.`,
        });
      } catch {
        // inscription is already stored
      }
    }
    return { ok: true };
  });

export const startRankedQueue = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertVerifiedPlayer(context.userId);
    const limited = await hitRateLimit(`ranked-q:${context.userId}`, 12, 60 * 1000);
    if (!limited.ok) throw new Error("Cola saturada. Espera un momento.");
    const sql = await getSql();
    const profile = await ensureProfile(context.userId);
    const mmr = Math.max(0, profile.points);
    const jitter = Math.round(gauss(0, 140));
    const oppMmr = Math.max(160, mmr < 1 ? 420 + jitter : mmr + jitter);
    const oppRank = rankFromPoints(oppMmr);
    const name = CIRCUIT[Math.abs((Date.now() + context.userId.length) * 13) % CIRCUIT.length];
    const times = ghostTimes(oppMmr);
    const id = newId();
    await sql`delete from ranked_queue where user_id = ${context.userId}`;
    await sql`
      insert into ranked_queue (id, user_id, opponent_name, opponent_rank_key, opponent_mmr, opponent_times)
      values (${id}, ${context.userId}, ${name}, ${oppRank.key}, ${oppMmr}, ${JSON.stringify(times)})
    `;
    const opponent: RankedOpponent = { name, rankKey: oppRank.key, mmr: oppMmr };
    return { matchId: id, opponent };
  });

export const submitRankedMatch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      matchId: z.string().min(8).max(80),
      times: z.array(z.number().nullable()).min(3).max(5),
    }),
  )
  .handler(async ({ context, data }): Promise<RankedMatchResult> => {
    await assertVerifiedPlayer(context.userId);
    const sql = await getSql();
    const profile = await ensureProfile(context.userId);
    const queued = await sql<{
      id: string;
      opponent_name: string;
      opponent_rank_key: string;
      opponent_mmr: number;
      opponent_times: string;
    }>`
      select id, opponent_name, opponent_rank_key, opponent_mmr, opponent_times
      from ranked_queue
      where id = ${data.matchId} and user_id = ${context.userId}
      limit 1
    `;
    const match = queued[0];
    if (!match) throw new Error("La cola expiró. Busca de nuevo.");
    await sql`delete from ranked_queue where id = ${match.id}`;

    let oppTimes: number[] = [];
    try {
      const parsed = JSON.parse(match.opponent_times) as unknown;
      if (Array.isArray(parsed)) oppTimes = parsed.map((n) => Number(n)).filter((n) => Number.isFinite(n));
    } catch {
      oppTimes = ghostTimes(match.opponent_mmr);
    }

    let roundsWon = 0;
    let roundsLost = 0;
    data.times.forEach((raw, i) => {
      const them = oppTimes[i] ?? 280;
      const clean = raw !== null && raw >= 118 && raw <= 1100 ? raw : null;
      if (clean !== null && clean <= them) roundsWon += 1;
      else roundsLost += 1;
    });
    while (roundsWon < 3 && roundsLost < 3 && roundsWon + roundsLost < 5) {
      roundsLost += 1;
    }
    const won = roundsWon > roundsLost;
    const extra = profile as typeof profile & {
      placements_left?: number;
      placement_wins?: number;
      streak?: number;
      peak_rank_key?: string;
    };
    let placementsLeft = extra.placements_left ?? PLACEMENT_MATCHES;
    let placementWins = extra.placement_wins ?? 0;
    const beforeRank = rankFromPoints(profile.points);
    let points = profile.points;
    let placed = false;

    if (placementsLeft > 0) {
      placementsLeft -= 1;
      if (won) placementWins += 1;
      if (placementsLeft === 0) {
        points = PLACEMENT_MMR[Math.min(placementWins, PLACEMENT_MMR.length - 1)] ?? 160;
        placed = true;
      }
    } else {
      const expected = 1 / (1 + 10 ** ((match.opponent_mmr - Math.max(points, 1)) / 400));
      const k = 32;
      const delta = Math.round(k * ((won ? 1 : 0) - expected));
      points = Math.max(1, points + delta);
    }

    const afterRank = rankFromPoints(points);
    const mmrDelta = points - profile.points;
    const streak = won ? (extra.streak ?? 0) + 1 : 0;
    const peak = rankByKey(extra.peak_rank_key);
    const peakRankKey = afterRank.min >= peak.min ? afterRank.key : peak.key;
    const wins = profile.wins + (won ? 1 : 0);
    const losses = profile.losses + (won ? 0 : 1);
    const xp = profile.xp + (won ? 40 : 12);

    await sql`
      update profiles
      set points = ${points},
          rank_key = ${afterRank.key},
          xp = ${xp},
          wins = ${wins},
          losses = ${losses},
          placements_left = ${placementsLeft},
          placement_wins = ${placementWins},
          streak = ${streak},
          peak_rank_key = ${peakRankKey},
          updated_at = now()
      where user_id = ${context.userId}
    `;

    const hid = newId();
    const title = `vs ${match.opponent_name}`;
    await sql`
      insert into ranked_history (id, user_id, title, result, points_delta)
      values (${hid}, ${context.userId}, ${title}, ${won ? "W" : "L"}, ${mmrDelta})
    `;

    return {
      won,
      roundsWon,
      roundsLost,
      mmrDelta,
      points,
      rankKey: afterRank.key,
      rankLabel: afterRank.label,
      promoted: afterRank.min > beforeRank.min,
      placed,
      placementsLeft,
      streak,
      opponent: {
        name: match.opponent_name,
        rankKey: match.opponent_rank_key,
        mmr: match.opponent_mmr,
      },
    };
  });
