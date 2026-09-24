import { n as newId } from "./utils-DG8erAqy.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as avatarDataUrl, s as tierMeets } from "./avatar-DYTTtK-m.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { i as ensureProfile } from "./profiles-D-Lv5pW_.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { o as rankByKey, r as meanReactionMs, s as rankFromPoints, t as PLACEMENT_MMR } from "./ranks-CBPR_Saa.mjs";
import { t as hitRateLimit } from "./rate-limit-Bayl4Gyc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compete-BJAhr-VF.js
var CIRCUIT = [
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
	"CALLER"
];
function gauss(mean, std) {
	const u = Math.max(1e-4, Math.random());
	const v = Math.max(1e-4, Math.random());
	return mean + Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * std;
}
function ghostTimes(mmr) {
	const mean = meanReactionMs(mmr);
	return Array.from({ length: 5 }, () => Math.round(Math.min(520, Math.max(168, gauss(mean, 28)))));
}
async function userTier(userId) {
	const rows = await (await getSql())`
    select key from entitlements
    where user_id = ${userId} and key in ('ticket.basic','ticket.pro','ticket.elite')
  `;
	const keys = new Set(rows.map((r) => r.key));
	if (keys.has("ticket.elite")) return "elite";
	if (keys.has("ticket.pro")) return "pro";
	if (keys.has("ticket.basic")) return "basic";
	return null;
}
async function assertVerifiedPlayer(userId) {
	if (!(await (await getSql())`
    select "emailVerified" as email_verified
    from "user"
    where id = ${userId}
    limit 1
  `)[0]?.email_verified) throw new Error("Verifica tu correo antes de competir en Ranked.");
}
var getRankedBoard_createServerFn_handler = createServerRpc({
	id: "ea2c23950c9c60563a0c35201182234662c07c83d2510ef0f3c335f11d9a082c",
	name: "getRankedBoard",
	filename: "src/lib/platform/compete.ts"
}, (opts) => getRankedBoard.__executeServer(opts));
var getRankedBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getRankedBoard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await assertVerifiedPlayer(context.userId);
	const profile = await ensureProfile(context.userId);
	const me = rankFromPoints(profile.points);
	const board = await sql`
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
	const history = await sql`
      select id, title, result, points_delta, created_at
      from ranked_history where user_id = ${context.userId}
      order by created_at desc limit 15
    `;
	const positionRows = await sql`
      select count(*)::int as n
      from profiles p
      inner join "user" u on u.id = p.user_id
      where p.username is not null
        and btrim(p.username) <> ''
        and u."emailVerified" = true
        and p.user_id not like 'seed-%'
        and p.points > ${profile.points}
    `;
	const extra = profile;
	return {
		me: {
			...profile,
			rank: me,
			position: (positionRows[0]?.n ?? 0) + 1,
			winRate: profile.wins + profile.losses === 0 ? 0 : Math.round(profile.wins / (profile.wins + profile.losses) * 100),
			tier: await userTier(context.userId),
			placementsLeft: extra.placements_left ?? 5,
			streak: extra.streak ?? 0,
			peakRankKey: extra.peak_rank_key ?? me.key
		},
		board: board.map((row, i) => {
			const rank = rankFromPoints(row.points);
			return {
				position: i + 1,
				username: row.username ?? row.display_name ?? "player",
				avatarUrl: row.avatar_url && row.avatar_url.length > 8 ? row.avatar_url : avatarDataUrl(row.username ?? row.user_id),
				rankKey: rank.key,
				rank: rank.label,
				points: row.points,
				xp: row.xp,
				wins: row.wins,
				losses: row.losses,
				isYou: row.user_id === context.userId
			};
		}),
		history
	};
});
var listTournaments_createServerFn_handler = createServerRpc({
	id: "8066898a3074d182ab5cf2bb038169288502edd708c176ecad6797becdb236cc",
	name: "listTournaments",
	filename: "src/lib/platform/compete.ts"
}, (opts) => listTournaments.__executeServer(opts));
var listTournaments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTournaments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	const tier = await userTier(context.userId);
	const rows = await sql`
      select id, name, blurb, status, starts_at, capacity, prize, entry_label, min_tier, is_private
      from tournaments
      where is_private = false
      order by starts_at asc
    `;
	const counts = await sql`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `;
	const mine = await sql`
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
			eligible: tierMeets(tier, t.min_tier || "basic")
		}))
	};
});
var getPrivateTournament_createServerFn_handler = createServerRpc({
	id: "f64879c1f1017d7b4ed4c282c47dfb42c717338f85c7ac0648f41dbcac518761",
	name: "getPrivateTournament",
	filename: "src/lib/platform/compete.ts"
}, (opts) => getPrivateTournament.__executeServer(opts));
var getPrivateTournament = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPrivateTournament_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const tier = await userTier(context.userId);
	if (!tierMeets(tier, "pro")) return {
		allowed: false,
		reason: "Necesitas un ticket PRO o ELITE."
	};
	const rows = await sql`
      select id, name, blurb, status, starts_at, capacity, prize, entry_label, min_tier
      from tournaments where is_private = true order by starts_at asc
    `;
	const counts = await sql`
      select tournament_id, count(*)::int as n from tournament_entries group by tournament_id
    `;
	const mine = await sql`
      select tournament_id from tournament_entries where user_id = ${context.userId}
    `;
	const countMap = new Map(counts.map((c) => [c.tournament_id, c.n]));
	const mineSet = new Set(mine.map((m) => m.tournament_id));
	return {
		allowed: true,
		tier,
		tournaments: rows.map((t) => ({
			...t,
			participants: countMap.get(t.id) ?? 0,
			registered: mineSet.has(t.id)
		}))
	};
});
var registerForTournament_createServerFn_handler = createServerRpc({
	id: "e2a1686076b43e5c6482bd531e3769c5b39c27dc1852a09f9d614f44b04bdda3",
	name: "registerForTournament",
	filename: "src/lib/platform/compete.ts"
}, (opts) => registerForTournament.__executeServer(opts));
var registerForTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ tournamentId: string().min(2).max(80) })).handler(registerForTournament_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	const tour = (await sql`
      select id, name, capacity, min_tier, is_private, status
      from tournaments where id = ${data.tournamentId} limit 1
    `)[0];
	if (!tour || tour.status !== "open") throw new Error("Torneo no disponible.");
	const tier = await userTier(context.userId);
	if (!tierMeets(tier, tour.min_tier || "basic")) throw new Error("Necesitas un ticket compatible.");
	if (((await sql`
      select count(*)::int as n from tournament_entries where tournament_id = ${tour.id}
    `)[0]?.n ?? 0) >= tour.capacity) throw new Error("Cupo completo.");
	const tickets = await sql`
      select id from tickets
      where user_id = ${context.userId} and status = 'PAID'
      order by created_at desc
      limit 1
    `;
	await sql`
      insert into tournament_entries (id, tournament_id, user_id, ticket_id, status)
      values (${newId()}, ${tour.id}, ${context.userId}, ${tickets[0]?.id ?? null}, 'registered')
      on conflict (tournament_id, user_id) do nothing
    `;
	const users = await sql`
      select email from "user" where id = ${context.userId} limit 1
    `;
	if (users[0]?.email) try {
		const { queueEmail } = await import("./email.server-DO3567x7.mjs").then((n) => n.t).then((n) => n.t);
		await queueEmail({
			to: users[0].email,
			template: "tournament",
			body: `Inscripción confirmada en ${tour.name}.`
		});
	} catch {}
	return { ok: true };
});
var startRankedQueue_createServerFn_handler = createServerRpc({
	id: "954d99dacb06f930638f189333832e5044ce4ed4e81fa71cf8c84f1cc7498956",
	name: "startRankedQueue",
	filename: "src/lib/platform/compete.ts"
}, (opts) => startRankedQueue.__executeServer(opts));
var startRankedQueue = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(startRankedQueue_createServerFn_handler, async ({ context }) => {
	await assertVerifiedPlayer(context.userId);
	if (!(await hitRateLimit(`ranked-q:${context.userId}`, 12, 6e4)).ok) throw new Error("Cola saturada. Espera un momento.");
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
	return {
		matchId: id,
		opponent: {
			name,
			rankKey: oppRank.key,
			mmr: oppMmr
		}
	};
});
var submitRankedMatch_createServerFn_handler = createServerRpc({
	id: "97d8bc4449e8adf7f196afae7917144385783303082d3f0feb80126b948c940c",
	name: "submitRankedMatch",
	filename: "src/lib/platform/compete.ts"
}, (opts) => submitRankedMatch.__executeServer(opts));
var submitRankedMatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	matchId: string().min(8).max(80),
	times: array(number().nullable()).min(3).max(5)
})).handler(submitRankedMatch_createServerFn_handler, async ({ context, data }) => {
	await assertVerifiedPlayer(context.userId);
	const sql = await getSql();
	const profile = await ensureProfile(context.userId);
	const match = (await sql`
      select id, opponent_name, opponent_rank_key, opponent_mmr, opponent_times
      from ranked_queue
      where id = ${data.matchId} and user_id = ${context.userId}
      limit 1
    `)[0];
	if (!match) throw new Error("La cola expiró. Busca de nuevo.");
	await sql`delete from ranked_queue where id = ${match.id}`;
	let oppTimes = [];
	try {
		const parsed = JSON.parse(match.opponent_times);
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
	while (roundsWon < 3 && roundsLost < 3 && roundsWon + roundsLost < 5) roundsLost += 1;
	const won = roundsWon > roundsLost;
	const extra = profile;
	let placementsLeft = extra.placements_left ?? 5;
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
		const delta = Math.round(32 * ((won ? 1 : 0) - expected));
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
			mmr: match.opponent_mmr
		}
	};
});
//#endregion
export { getPrivateTournament_createServerFn_handler, getRankedBoard_createServerFn_handler, listTournaments_createServerFn_handler, registerForTournament_createServerFn_handler, startRankedQueue_createServerFn_handler, submitRankedMatch_createServerFn_handler };
