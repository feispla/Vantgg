/**
 * VANTBOT — Discord bot for the VANT ecosystem.
 *
 * Connects to Discord, polls the web app (vantgg.vercel.app) for pending
 * sync events, and delivers them to the appropriate Discord channels.
 *
 * Env vars:
 *   DISCORD_BOT_TOKEN     — Discord bot token (from Discord Developer Portal)
 *   DISCORD_GUILD_ID      — The VANT Discord server ID
 *   VANT_WEB_BASE_URL     — Web app base URL (default: https://vantgg.vercel.app)
 *   VANT_BOT_SYNC_SECRET  — Shared secret for HMAC-signed sync requests
 *   VANT_SYNC_INTERVAL_MS — Poll interval (default: 5000)
 *
 * Channels (auto-discovered by name in the guild):
 *   #tryouts, #roster, #announcements, #bot-logs
 *
 * Run: node index.mjs
 */
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Partials,
} from "discord.js";

// ── Config ──────────────────────────────────────────────────────────────────
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const WEB_BASE_URL = (process.env.VANT_WEB_BASE_URL || "https://vantgg.vercel.app").replace(/\/+$/, "");
const SYNC_SECRET = process.env.VANT_BOT_SYNC_SECRET || "";
const POLL_INTERVAL = Number(process.env.VANT_SYNC_INTERVAL_MS) || 5000;

if (!BOT_TOKEN) { console.error("Falta DISCORD_BOT_TOKEN"); process.exit(1); }
if (!GUILD_ID) { console.error("Falta DISCORD_GUILD_ID"); process.exit(1); }
if (!SYNC_SECRET) { console.error("Falta VANT_BOT_SYNC_SECRET"); process.exit(1); }

// ── Channel name mapping ────────────────────────────────────────────────────
const CHANNEL_MAP = {
  "application.submitted": "tryouts",
  "user.registered": "bot-logs",
  "user.linked_discord": "roster",
  "ticket.purchased": "announcements",
  "rank.updated": "roster",
  "tournament.created": "announcements",
  "tournament.joined": "bot-logs",
  "system_error": "bot-logs",
};

// ── Discord client ──────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

let guild = null;
const channels = new Map();

async function resolveChannels() {
  guild = await client.guilds.fetch(GUILD_ID);
  const allChannels = await guild.channels.fetch();
  for (const ch of allChannels.values()) {
    if (ch.isTextBased()) channels.set(ch.name, ch);
  }
  console.log(`[VANTBOT] Conectado a ${guild.name} — ${channels.size} canales`);
}

function getChannel(name) {
  return channels.get(name) || channels.get(`#${name}`) || null;
}

// ── HMAC signing for sync requests ──────────────────────────────────────────
import { createHmac } from "node:crypto";

function signPayload(method, path, timestamp, nonce, bodyHash) {
  const payload = [method.toUpperCase(), path, String(timestamp), nonce, bodyHash].join("\n");
  return createHmac("sha256", SYNC_SECRET).update(payload).digest("hex");
}

// ── Event processing ────────────────────────────────────────────────────────
function buildEmbed(event) {
  const { type, payload } = event;
  const color = {
    "application.submitted": 0x0099ff,
    "user.registered": 0x00ff00,
    "user.linked_discord": 0x00ff00,
    "ticket.purchased": 0xffd700,
    "rank.updated": 0x9b59b6,
    "tournament.created": 0xe74c3c,
    "tournament.joined": 0x1abc9c,
    "system_error": 0xff0000,
  }[type] ?? 0x95a5a6;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "VANTBOT", iconURL: client.user?.displayAvatarURL() });

  switch (type) {
    case "application.submitted":
      embed.setTitle("📋 Nueva postulación")
        .addFields(
          { name: "Usuario", value: payload.discordUsername || payload.userId || "Desconocido", inline: true },
          { name: "Rol", value: payload.rol || "No especificado", inline: true },
          { name: "Rango", value: payload.rango || "No especificado", inline: true },
          { name: "Región", value: payload.region || "No especificada", inline: true },
        );
      if (payload.descripcion) embed.setDescription(payload.descripcion);
      break;
    case "user.registered":
      embed.setTitle("👤 Nuevo usuario registrado")
        .addFields(
          { name: "Email", value: payload.email || "No disponible", inline: true },
          { name: "Discord", value: payload.discordId ? `<@${payload.discordId}>` : "No vinculado", inline: true },
        );
      break;
    case "user.linked_discord":
      embed.setTitle("🔗 Discord vinculado")
        .addFields(
          { name: "Usuario", value: `<@${payload.discordId}>`, inline: true },
        );
      break;
    case "ticket.purchased":
      embed.setTitle("🎟️ Ticket comprado")
        .addFields(
          { name: "Código", value: `\`${payload.ticketCode}\``, inline: true },
          { name: "Tier", value: payload.tier?.toUpperCase() || "N/A", inline: true },
        );
      break;
    case "rank.updated":
      embed.setTitle("📊 Rango actualizado")
        .addFields(
          { name: "Nuevo rango", value: payload.newRank || "N/A", inline: true },
          { name: "MMR", value: String(payload.mmr ?? "N/A"), inline: true },
        );
      break;
    case "tournament.created":
      embed.setTitle("🏆 Torneo creado")
        .addFields(
          { name: "Nombre", value: payload.name || "Sin nombre", inline: true },
        );
      break;
    case "tournament.joined":
      embed.setTitle("🎮 Inscripción a torneo")
        .addFields(
          { name: "Usuario", value: `<@${payload.userId}>`, inline: true },
          { name: "Torneo", value: payload.tournamentId || "N/A", inline: true },
        );
      break;
    default:
      embed.setTitle(`📌 ${type}`).setDescription("```json\n" + JSON.stringify(payload, null, 2).slice(0, 1000) + "\n```");
  }
  return embed;
}

// ── Sync: poll and deliver events ────────────────────────────────────────────
async function pollAndDeliver() {
  try {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).slice(2);
    const bodyHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // empty body SHA-256
    const path = "/api/discord/events";
    const signature = signPayload("GET", path, timestamp, nonce, bodyHash);

    const res = await fetch(`${WEB_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "x-vant-sync-secret": SYNC_SECRET,
        "x-vant-sync-timestamp": String(timestamp),
        "x-vant-sync-nonce": nonce,
        "x-vant-sync-body-sha256": bodyHash,
        "x-vant-sync-signature": signature,
      },
    });

    if (!res.ok) {
      if (res.status !== 503) console.warn(`[VANTBOT] Sync API ${res.status}`);
      return;
    }

    const data = await res.json();
    const events = data.events || [];
    if (events.length === 0) return;

    console.log(`[VANTBOT] ${events.length} evento(s) pendiente(s)`);

    for (const event of events) {
      const channelName = CHANNEL_MAP[event.event_type] || "bot-logs";
      const channel = getChannel(channelName);
      if (!channel) {
        console.warn(`[VANTBOT] Canal #${channelName} no encontrado`);
        continue;
      }

      try {
        const embed = buildEmbed({ type: event.event_type, payload: typeof event.payload === "string" ? JSON.parse(event.payload) : event.payload });
        await channel.send({ embeds: [embed] });
        console.log(`[VANTBOT] Evento ${event.event_type} entregado a #${channelName}`);
      } catch (err) {
        console.error(`[VANTBOT] Error entregando evento ${event.id}:`, err.message);
      }

      // ACK the event
      await ackEvent(event.id);
    }
  } catch (err) {
    console.error("[VANTBOT] Poll error:", err.message);
  }
}

async function ackEvent(eventId) {
  try {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).slice(2);
    const body = JSON.stringify({ eventId, status: "delivered" });
    const bodyHash = (await import("node:crypto")).createHash("sha256").update(body).digest("hex");
    const path = "/api/discord/ack";
    const signature = signPayload("POST", path, timestamp, nonce, bodyHash);

    await fetch(`${WEB_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-vant-sync-secret": SYNC_SECRET,
        "x-vant-sync-timestamp": String(timestamp),
        "x-vant-sync-nonce": nonce,
        "x-vant-sync-body-sha256": bodyHash,
        "x-vant-sync-signature": signature,
      },
      body,
    });
  } catch {
    // Non-fatal — the event will be re-leased on next poll
  }
}

// ── Slash commands ──────────────────────────────────────────────────────────
async function registerCommands() {
  if (!guild) return;
  await guild.commands.set([
    {
      name: "ping",
      description: "Verificar que el bot está activo",
    },
    {
      name: "sync",
      description: "Forzar sincronización de eventos pendientes",
    },
    {
      name: "ticket",
      description: "Verificar un ticket por código",
      options: [{
        type: 3, // STRING
        name: "codigo",
        description: "Código del ticket",
        required: true,
      }],
    },
  ]);
  console.log("[VANTBOT] Slash commands registrados");
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    switch (interaction.commandName) {
      case "ping":
        await interaction.reply({ content: "🏓 Pong! VANTBOT está activo.", ephemeral: true });
        break;
      case "sync":
        await interaction.deferReply({ ephemeral: true });
        await pollAndDeliver();
        await interaction.editReply({ content: "✅ Sincronización completada." });
        break;
      case "ticket":
        await interaction.deferReply({ ephemeral: true });
        const code = interaction.options.getString("codigo");
        await interaction.editReply({ content: `🔍 Verificando ticket \`${code}\`... (usa /api/verify en la web)` });
        break;
    }
  } catch (err) {
    console.error("[VANTBOT] Command error:", err.message);
    if (interaction.deferred) await interaction.editReply({ content: "❌ Error al procesar el comando." });
    else await interaction.reply({ content: "❌ Error al procesar el comando.", ephemeral: true });
  }
});

// ── Lifecycle ────────────────────────────────────────────────────────────────
client.once("ready", async () => {
  console.log(`[VANTBOT] Logueado como ${client.user.tag}`);
  try {
    await resolveChannels();
    await registerCommands();
  } catch (err) {
    console.error("[VANTBOT] Setup error:", err.message);
  }

  // Start polling
  console.log(`[VANTBOT] Polling cada ${POLL_INTERVAL}ms`);
  setInterval(pollAndDeliver, POLL_INTERVAL);
  // Initial poll
  pollAndDeliver();
});

client.on("error", (err) => console.error("[VANTBOT] Discord error:", err.message));

client.login(BOT_TOKEN);
