import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/lib/auth/middleware";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { newId } from "@/lib/utils";
import { enqueueSyncEvent } from "@/lib/platform/vant-sync.server";
import { verifyVantSync } from "@/lib/platform/vant-sync.server";

/**
 * API endpoints for VANTBOT Discord commands.
 * All routes are HMAC-signed (verifyVantSync) — only the bot can call them.
 */

// ── /api/bot/account/create ─────────────────────────────────────────────────
async function accountCreate(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const body = JSON.parse(raw) as { discordId: string; discordUsername: string; avatarUrl?: string };

  const sql = await getSql();

  // Check if player already exists
  const existing = await sql<{ user_id: string }>`
    select user_id from player_discord_accounts where discord_id = ${body.discordId} limit 1
  `;
  if (existing.length > 0) {
    return Response.json({ error: "Ya tienes una cuenta vinculada." });
  }

  // Create player record
  const playerId = newId();
  await sql`
    insert into players (id, discord_id, discord_username, gamertag, region, main_role)
    values (${playerId}, ${body.discordId}, ${body.discordUsername}, ${body.discordUsername}, 'unknown', 'Duelist')
    on conflict (discord_id) do nothing
  `;

  // Link Discord account
  await sql`
    insert into player_discord_accounts (user_id, discord_id, discord_username, avatar_url)
    values (${playerId}, ${body.discordId}, ${body.discordUsername}, ${body.avatarUrl ?? null})
    on conflict (discord_id) do nothing
  `;

  // Check if any season exists — if not, auto-start Season 1
  const seasons = await sql<{ id: string }>`select id from seasons where status = 'active' limit 1`;
  let seasonStarted = false;
  if (seasons.length === 0) {
    const seasonId = newId();
    await sql`
      insert into seasons (id, name, status, starts_at)
      values (${seasonId}, 'Temporada 1', 'active', now())
    `;
    seasonStarted = true;
  }

  // Enqueue sync event for the bot to announce
  await enqueueSyncEvent({
    eventType: "user.registered",
    idempotencyKey: `account:create:${body.discordId}`,
    payload: { userId: playerId, discordId: body.discordId, discordUsername: body.discordUsername, seasonStarted },
  });

  return Response.json({ playerId, seasonStarted });
}

// ── /api/bot/account/profile ─────────────────────────────────────────────────
async function accountProfile(request: Request) {
  const raw = "";
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const url = new URL(request.url);
  const discordId = url.searchParams.get("discordId");
  if (!discordId) return Response.json({ error: "missing_discordId" }, { status: 400 });

  const sql = await getSql();
  const rows = await sql`
    select p.id, p.gamertag, p.discord_username, p.rank_key, p.mmr, p.wins, p.losses, p.kd_ratio, p.region,
           pda.connected_at
    from player_discord_accounts pda
    join players p on p.id = pda.user_id
    where pda.discord_id = ${discordId}
    limit 1
  `;
  if (rows.length === 0) return Response.json({ account: null });
  const p = rows[0] as any;
  return Response.json({ account: { ...p, createdAt: p.connected_at } });
}

// ── /api/bot/ranked/queue ────────────────────────────────────────────────────
async function rankedQueue(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const body = JSON.parse(raw) as { discordId: string };

  const sql = await getSql();
  const players = await sql<{ user_id: string; gamertag: string; rank_key: string; mmr: integer }>`
    select p.id as user_id, p.gamertag, p.rank_key, p.mmr
    from player_discord_accounts pda
    join players p on p.id = pda.user_id
    where pda.discord_id = ${body.discordId} limit 1
  `;
  if (players.length === 0) return Response.json({ error: "Cuenta no encontrada. Usa /cuenta crear." });

  const player = players[0] as any;
  const existing = await sql`select id from ranked_queue where user_id = ${player.user_id}`;
  if (existing.length > 0) return Response.json({ error: "Ya estás en la cola." });

  const queueId = newId();
  await sql`
    insert into ranked_queue (id, user_id, opponent_name, opponent_rank_key, opponent_mmr, opponent_times)
    values (${queueId}, ${player.user_id}, 'Buscando...', ${player.rank_key}, ${player.mmr}, now()::text)
  `;

  await enqueueSyncEvent({
    eventType: "ranked.queue.joined",
    idempotencyKey: `ranked:queue:${player.user_id}`,
    payload: { userId: player.user_id, gamertag: player.gamertag, rank: player.rank_key },
  });

  return Response.json({ queued: true });
}

// ── /api/bot/ranked/leaderboard ───────────────────────────────────────────────
async function rankedLeaderboard(request: Request) {
  const auth = await verifyVantSync(request, "");
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || "10"), 50);

  const sql = await getSql();
  const players = await sql`
    select p.user_id, p.gamertag as username, p.rank_key, p.points, p.wins, p.losses
    from profiles p
    where p.rank_key != 'unranked'
    order by p.points desc
    limit ${limit}
  `;
  return Response.json({ players });
}

// ── /api/bot/ranked/status ────────────────────────────────────────────────────
async function rankedStatus(request: Request) {
  const auth = await verifyVantSync(request, "");
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });

  const sql = await getSql();
  const queue = await sql<{ count: number }>`select count(*) from ranked_queue`;
  const matches = await sql<{ count: number }>`select count(*) from ranked_matches where match_date > now() - interval '1 hour'`;
  const seasons = await sql<{ name: string }>`select name from seasons where status = 'active' limit 1`;

  return Response.json({
    inQueue: queue[0]?.count ?? 0,
    activeMatches: matches[0]?.count ?? 0,
    season: seasons[0]?.name ?? "No iniciada",
  });
}

// ── /api/bot/ranked/history ───────────────────────────────────────────────────
async function rankedHistory(request: Request) {
  const auth = await verifyVantSync(request, "");
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const url = new URL(request.url);
  const discordId = url.searchParams.get("discordId");
  const limit = Math.min(Number(url.searchParams.get("limit") || "10"), 50);

  const sql = await getSql();
  const players = await sql<{ user_id: string }>`select user_id from player_discord_accounts where discord_id = ${discordId} limit 1`;
  if (players.length === 0) return Response.json({ matches: [] });

  const matches = await sql`
    select id, title, result, points_delta, created_at
    from ranked_history
    where user_id = ${players[0].user_id}
    order by created_at desc
    limit ${limit}
  `;
  return Response.json({ matches });
}

// ── /api/bot/ranked/result ────────────────────────────────────────────────────
async function rankedResult(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const body = JSON.parse(raw) as { discordId: string; result: "win" | "loss" };

  const sql = await getSql();
  const players = await sql<{ user_id: string }>`select user_id from player_discord_accounts where discord_id = ${body.discordId} limit 1`;
  if (players.length === 0) return Response.json({ error: "Cuenta no encontrada." });

  const pointsDelta = body.result === "win" ? 10 : 0;
  const matchId = newId();
  await sql`
    insert into ranked_history (id, user_id, title, result, points_delta)
    values (${matchId}, ${players[0].user_id}, ${body.result === "win" ? "Victoria" : "Derrota"}, ${body.result}, ${pointsDelta})
  `;
  if (body.result === "win") {
    await sql`update profiles set wins = wins + 1, points = points + ${pointsDelta} where user_id = ${players[0].user_id}`;
  } else {
    await sql`update profiles set losses = losses + 1 where user_id = ${players[0].user_id}`;
  }

  return Response.json({ matchId, pointsDelta });
}

// ── /api/bot/tournaments/active ───────────────────────────────────────────────
async function tournamentsActive(request: Request) {
  const auth = await verifyVantSync(request, "");
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });

  const sql = await getSql();
  const tournaments = await sql`
    select id, name, blurb, status, starts_at, ends_at, capacity, prize, entry_label, min_tier
    from tournaments
    where status = 'open'
    order by starts_at asc
    limit 20
  `;
  return Response.json({ tournaments });
}

// ── /api/bot/tournaments/register ─────────────────────────────────────────────
async function tournamentsRegister(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const body = JSON.parse(raw) as { tournamentId: string; discordId: string };

  const sql = await getSql();
  const players = await sql<{ user_id: string }>`select user_id from player_discord_accounts where discord_id = ${body.discordId} limit 1`;
  if (players.length === 0) return Response.json({ error: "Cuenta no encontrada." });

  const entryId = newId();
  await sql`
    insert into tournament_entries (id, tournament_id, user_id, status)
    values (${entryId}, ${body.tournamentId}, ${players[0].user_id}, 'registered')
    on conflict (tournament_id, user_id) do nothing
  `;

  await enqueueSyncEvent({
    eventType: "tournament.joined",
    idempotencyKey: `tournament:join:${body.tournamentId}:${players[0].user_id}`,
    payload: { userId: players[0].user_id, tournamentId: body.tournamentId },
  });

  return Response.json({ registered: true });
}

// ── /api/bot/tickets/create ───────────────────────────────────────────────────
async function ticketsCreate(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const body = JSON.parse(raw) as { discordId: string; category: string; message: string };

  const sql = await getSql();
  const players = await sql<{ user_id: string; gamertag: string }>`select user_id, gamertag from player_discord_accounts pda join players p on p.id = pda.user_id where pda.discord_id = ${body.discordId} limit 1`;
  if (players.length === 0) return Response.json({ error: "Cuenta no encontrada." });

  const ticketId = newId();
  await sql`
    insert into support_tickets (id, user_id, name, email, category, message)
    values (${ticketId}, ${players[0].user_id}, ${players[0].gamertag}, 'discord@vant.gg', ${body.category}, ${body.message})
  `;

  return Response.json({ ticketId });
}

// ── Route registration ────────────────────────────────────────────────────────
export const Route = createFileRoute("/api/bot/commands")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") || "status";

        const handlers: Record<string, (req: Request) => Promise<Response>> = {
          "account.create": accountCreate,
          "account.profile": accountProfile,
          "ranked.queue": rankedQueue,
          "ranked.leaderboard": rankedLeaderboard,
          "ranked.status": rankedStatus,
          "ranked.history": rankedHistory,
          "ranked.result": rankedResult,
          "tournaments.active": tournamentsActive,
          "tournaments.register": tournamentsRegister,
          "tickets.create": ticketsCreate,
        };

        const handler = handlers[action];
        if (!handler) return Response.json({ error: "unknown_action" }, { status: 400 });
        return handler(request);
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") || "";

        const handlers: Record<string, (req: Request) => Promise<Response>> = {
          "account.create": accountCreate,
          "ranked.queue": rankedQueue,
          "ranked.result": rankedResult,
          "tournaments.register": tournamentsRegister,
          "tickets.create": ticketsCreate,
        };

        const handler = handlers[action];
        if (!handler) return Response.json({ error: "unknown_action" }, { status: 400 });
        return handler(request);
      },
    },
  },
});
