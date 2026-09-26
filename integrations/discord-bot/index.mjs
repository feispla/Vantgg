/**
 * VANTBOT — Discord bot for the VANT ecosystem.
 *
 * Commands:
 *   /ranked entrar|placement|perfil|estado|leaderboard|historial|partida|cancelar|resultado|reglas
 *   /jugador perfil|buscar|estadisticas|comparar|verificar|desconectar
 *   /jugadores activos
 *   /cuenta crear|perfil|conectar|desconectar|privacidad
 *   /torneo lista|ver|registrar|cancelar|participantes|bracket|partida|resultado
 *   /ticket crear|cerrar|reclamar|agregar|remover|categoria
 *   /evento lista|ver|registrar|cancelar|participantes|recordatorio|calendario
 *   /temporada actual|ranking|estadisticas|records
 *   /admin temporada|cerrar|rango|mmr|validar|anular|torneo|evento|leaderboard
 *   /menu
 *
 * Admin commands check ManageGuild permission before executing.
 * First /cuenta crear auto-starts Season 1 if no season exists.
 * Leaderboard starts empty until valid matches exist.
 *
 * Env vars:
 *   DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, VANT_WEB_BASE_URL, VANT_BOT_SYNC_SECRET
 */
import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from "discord.js";
import { createHmac, createHash } from "node:crypto";
import { rankedCommand, handleRanked } from "./commands/ranked.mjs";
import { jugadorCommand, jugadoresCommand, cuentaCommand, handleJugador, handleJugadores, handleCuenta } from "./commands/jugadores.mjs";
import { torneoCommand, ticketCommand, eventoCommand, handleTorneo, handleTicket, handleEvento } from "./commands/torneos.mjs";
import { temporadaCommand, adminCommand, menuCommand, handleTemporada, handleAdmin, handleMenu } from "./commands/admin.mjs";

// ── Config ──────────────────────────────────────────────────────────────────
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const WEB_BASE_URL = (process.env.VANT_WEB_BASE_URL || "https://vantgg.vercel.app").replace(/\/+$/, "");
const SYNC_SECRET = process.env.VANT_BOT_SYNC_SECRET || "";

if (!BOT_TOKEN) { console.error("Falta DISCORD_BOT_TOKEN"); process.exit(1); }
if (!GUILD_ID) { console.error("Falta DISCORD_GUILD_ID"); process.exit(1); }

// ── API client ───────────────────────────────────────────────────────────────
async function apiGet(path) {
  const res = await fetch(`${WEB_BASE_URL}${path}`, {
    method: "GET",
    headers: signedHeaders("GET", path, ""),
  });
  if (!res.ok) return { error: `API ${res.status}` };
  return res.json();
}

async function apiPost(path, body) {
  const bodyStr = JSON.stringify(body);
  const res = await fetch(`${WEB_BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...signedHeaders("POST", path, bodyStr) },
    body: bodyStr,
  });
  if (!res.ok) return { error: `API ${res.status}` };
  return res.json();
}

function signedHeaders(method, path, body) {
  const headers = {};
  if (SYNC_SECRET) {
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).slice(2);
    const bodyHash = createHash("sha256").update(body).digest("hex");
    const payload = [method.toUpperCase(), path, String(timestamp), nonce, bodyHash].join("\n");
    const signature = createHmac("sha256", SYNC_SECRET).update(payload).digest("hex");
    headers["x-vant-sync-secret"] = SYNC_SECRET;
    headers["x-vant-sync-timestamp"] = String(timestamp);
    headers["x-vant-sync-nonce"] = nonce;
    headers["x-vant-sync-body-sha256"] = bodyHash;
    headers["x-vant-sync-signature"] = signature;
  }
  return headers;
}

const api = { get: apiGet, post: apiPost };

// ── Discord client ───────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

// ── Register slash commands ──────────────────────────────────────────────────
const allCommands = [
  rankedCommand,
  jugadorCommand,
  jugadoresCommand,
  cuentaCommand,
  torneoCommand,
  ticketCommand,
  eventoCommand,
  temporadaCommand,
  adminCommand,
  menuCommand,
];

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(client.user.id, GUILD_ID), {
      body: allCommands.map((c) => c.toJSON()),
    });
    console.log(`[VANTBOT] ${allCommands.length} slash commands registrados`);
  } catch (err) {
    console.error("[VANTBOT] Error registrando comandos:", err.message);
  }
}

// ── Command dispatcher ───────────────────────────────────────────────────────
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = interaction.commandName;

  try {
    switch (cmd) {
      case "ranked": await handleRanked(interaction, api); break;
      case "jugador": await handleJugador(interaction, api); break;
      case "jugadores": await handleJugadores(interaction, api); break;
      case "cuenta": await handleCuenta(interaction, api); break;
      case "torneo": await handleTorneo(interaction, api); break;
      case "ticket": await handleTicket(interaction, api); break;
      case "evento": await handleEvento(interaction, api); break;
      case "temporada": await handleTemporada(interaction, api); break;
      case "admin": await handleAdmin(interaction, api); break;
      case "menu": await handleMenu(interaction, api); break;
      default: await interaction.reply({ content: "❌ Comando no reconocido.", ephemeral: true });
    }
  } catch (err) {
    console.error(`[VANTBOT] Error en /${cmd}:`, err.message);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: "❌ Error al procesar el comando.", ephemeral: true });
    } else {
      await interaction.reply({ content: "❌ Error al procesar el comando.", ephemeral: true });
    }
  }
});

// ── Lifecycle ────────────────────────────────────────────────────────────────
client.once("ready", async () => {
  console.log(`[VANTBOT] Logueado como ${client.user.tag}`);
  try {
    await registerCommands();
  } catch (err) {
    console.error("[VANTBOT] Setup error:", err.message);
  }
});

client.on("error", (err) => console.error("[VANTBOT] Discord error:", err.message));

client.login(BOT_TOKEN);
