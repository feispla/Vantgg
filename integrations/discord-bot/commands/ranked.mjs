/**
 * /ranked subcommands: entrar, placement, perfil, estado, leaderboard, historial, partida, cancelar, resultado, reglas
 */
import { SlashCommandBuilder } from "discord.js";

export const rankedCommand = new SlashCommandBuilder()
  .setName("ranked")
  .setDescription("Sistema Ranked VANT")
  .addSubcommand((sc) => sc.setName("entrar").setDescription("Entrar a la cola Ranked"))
  .addSubcommand((sc) => sc.setName("placement").setDescription("Ver partidas de placement restantes"))
  .addSubcommand((sc) => sc.setName("perfil").setDescription("Ver tu perfil ranked")
    .addUserOption((o) => o.setName("usuario").setDescription("Ver perfil de otro usuario").setRequired(false)))
  .addSubcommand((sc) => sc.setName("estado").setDescription("Ver estado actual de la cola"))
  .addSubcommand((sc) => sc.setName("leaderboard").setDescription("Top 10 jugadores ranked"))
  .addSubcommand((sc) => sc.setName("historial").setDescription("Tu historial de partidas ranked")
    .addUserOption((o) => o.setName("usuario").setDescription("Historial de otro usuario").setRequired(false)))
  .addSubcommand((sc) => sc.setName("partida").setDescription("Ver detalles de una partida")
    .addStringOption((o) => o.setName("id").setDescription("ID de la partida").setRequired(true)))
  .addSubcommand((sc) => sc.setName("cancelar").setDescription("Cancelar tu búsqueda de partida"))
  .addSubcommand((sc) => sc.setName("resultado").setDescription("Reportar resultado de partida")
    .addStringOption((o) => o.setName("resultado").setDescription("win o loss").setRequired(true).addChoices(
      { name: "Victoria", value: "win" }, { name: "Derrota", value: "loss" }
    )))
  .addSubcommand((sc) => sc.setName("reglas").setDescription("Ver reglas del sistema ranked"));

export async function handleRanked(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "entrar": {
      const res = await api.post("/api/ranked/queue", { discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ En cola Ranked. Buscando partida...`, ephemeral: true });
      break;
    }
    case "placement": {
      const res = await api.get(`/api/ranked/placement?discordId=${userId}`);
      await interaction.reply({ content: `📊 Partidas de placement restantes: **${res.remaining ?? 0}**`, ephemeral: true });
      break;
    }
    case "perfil": {
      const target = interaction.options.getUser("usuario") ?? interaction.user;
      const res = await api.get(`/api/ranked/profile?discordId=${target.id}`);
      if (!res.profile) return interaction.reply({ content: "❌ Perfil no encontrado.", ephemeral: true });
      const p = res.profile;
      await interaction.reply({
        embeds: [{
          title: `📊 Perfil Ranked — ${target.username}`,
          color: 0x00d4aa,
          fields: [
            { name: "Rango", value: `**${p.rankKey ?? "Unranked"}**`, inline: true },
            { name: "MMR", value: `${p.mmr ?? 0}`, inline: true },
            { name: "Puntos", value: `${p.points ?? 0}`, inline: true },
            { name: "Victorias", value: `${p.wins ?? 0}`, inline: true },
            { name: "Derrotas", value: `${p.losses ?? 0}`, inline: true },
            { name: "Racha", value: `${p.streak ?? 0}`, inline: true },
          ],
          footer: { text: "VANT Ranked" },
        }],
      });
      break;
    }
    case "estado": {
      const res = await api.get("/api/ranked/status");
      await interaction.reply({
        embeds: [{
          title: "📊 Estado de la cola Ranked",
          color: 0x00d4aa,
          fields: [
            { name: "Jugadores en cola", value: `${res.inQueue ?? 0}`, inline: true },
            { name: "Partidas activas", value: `${res.activeMatches ?? 0}`, inline: true },
            { name: "Temporada", value: res.season ?? "No iniciada", inline: true },
          ],
        }],
      });
      break;
    }
    case "leaderboard": {
      const res = await api.get("/api/ranked/leaderboard?limit=10");
      const players = res.players ?? [];
      if (players.length === 0) return interaction.reply({ content: "📋 Leaderboard vacío. Aún no hay partidas válidas.", ephemeral: true });
      const lines = players.map((p, i) => `**#${i + 1}** ${p.username ?? p.userId} — ${p.rankKey ?? "Unranked"} · ${p.points ?? 0} pts`);
      await interaction.reply({ embeds: [{ title: "🏆 Leaderboard Ranked", color: 0xffd700, description: lines.join("\n") }] });
      break;
    }
    case "historial": {
      const target = interaction.options.getUser("usuario") ?? interaction.user;
      const res = await api.get(`/api/ranked/history?discordId=${target.id}&limit=10`);
      const matches = res.matches ?? [];
      if (matches.length === 0) return interaction.reply({ content: "📋 Sin partidas registradas.", ephemeral: true });
      const lines = matches.map((m) => `${m.result === "win" ? "✅" : "❌"} ${m.title} · ${m.pointsDelta > 0 ? "+" : ""}${m.pointsDelta} pts · <t:${Math.floor(new Date(m.createdAt).getTime() / 1000)}:R>`);
      await interaction.reply({ embeds: [{ title: `📜 Historial — ${target.username}`, color: 0x00d4aa, description: lines.join("\n") }] });
      break;
    }
    case "partida": {
      const matchId = interaction.options.getString("id");
      const res = await api.get(`/api/ranked/match/${matchId}`);
      if (!res.match) return interaction.reply({ content: "❌ Partida no encontrada.", ephemeral: true });
      const m = res.match;
      await interaction.reply({
        embeds: [{
          title: `🎮 Partida ${m.id.slice(0, 8)}`,
          color: 0x00d4aa,
          fields: [
            { name: "Resultado", value: m.result === "win" ? "✅ Victoria" : "❌ Derrota", inline: true },
            { name: "Puntos", value: `${m.pointsDelta > 0 ? "+" : ""}${m.pointsDelta}`, inline: true },
            { name: "Oponente", value: m.opponentName ?? "Desconocido", inline: true },
          ],
        }],
      });
      break;
    }
    case "cancelar": {
      const res = await api.post("/api/ranked/cancel", { discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Búsqueda cancelada.", ephemeral: true });
      break;
    }
    case "resultado": {
      const result = interaction.options.getString("resultado");
      const res = await api.post("/api/ranked/result", { discordId: userId, result });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Resultado registrado: ${result === "win" ? "Victoria" : "Derrota"}. ${res.pointsDelta ? `${res.pointsDelta > 0 ? "+" : ""}${res.pointsDelta} pts` : ""}`, ephemeral: true });
      break;
    }
    case "reglas": {
      await interaction.reply({
        embeds: [{
          title: "📋 Reglas del sistema Ranked",
          color: 0x00d4aa,
          description: [
            "**Placement:** 5 partidas iniciales para determinar tu rango.",
            "**Rangos:** Iron → Bronze → Silver → Gold → Platinum → Diamond → Ascendant → Immortal → Radiant",
            "**Puntos:** +10 por victoria, 0 por derrota (sujeto a cambios por temporada).",
            "**Emparejamiento:** Por MMR similar, primer jugador en entrar inicia la temporada.",
            "**Validación:** Los resultados deben confirmarse por ambos jugadores o por un admin.",
          ].join("\n\n"),
        }],
      });
      break;
    }
  }
}
