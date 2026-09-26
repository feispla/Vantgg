/**
 * /jugador subcommands: perfil, buscar, estadisticas, comparar, verificar, desconectar
 * /jugadores activos
 * /cuenta subcommands: crear, perfil, conectar, desconectar, privacidad
 */
import { SlashCommandBuilder } from "discord.js";

export const jugadorCommand = new SlashCommandBuilder()
  .setName("jugador")
  .setDescription("Gestión de jugadores")
  .addSubcommand((sc) => sc.setName("perfil").setDescription("Ver perfil de un jugador")
    .addUserOption((o) => o.setName("usuario").setDescription("Jugador a buscar").setRequired(false)))
  .addSubcommand((sc) => sc.setName("buscar").setDescription("Buscar jugador por nombre")
    .addStringOption((o) => o.setName("nombre").setDescription("Gamertag o username").setRequired(true)))
  .addSubcommand((sc) => sc.setName("estadisticas").setDescription("Estadísticas de un jugador")
    .addUserOption((o) => o.setName("usuario").setDescription("Jugador").setRequired(false)))
  .addSubcommand((sc) => sc.setName("comparar").setDescription("Comparar dos jugadores")
    .addUserOption((o) => o.setName("jugador1").setDescription("Primer jugador").setRequired(true))
    .addUserOption((o) => o.setName("jugador2").setDescription("Segundo jugador").setRequired(true)))
  .addSubcommand((sc) => sc.setName("verificar").setDescription("Solicitar verificación de cuenta"))
  .addSubcommand((sc) => sc.setName("desconectar").setDescription("Desconectar tu cuenta de Discord"));

export const jugadoresCommand = new SlashCommandBuilder()
  .setName("jugadores")
  .setDescription("Lista de jugadores")
  .addSubcommand((sc) => sc.setName("activos").setDescription("Jugadores activos ahora"));

export const cuentaCommand = new SlashCommandBuilder()
  .setName("cuenta")
  .setDescription("Gestión de cuenta")
  .addSubcommand((sc) => sc.setName("crear").setDescription("Crear cuenta de jugador"))
  .addSubcommand((sc) => sc.setName("perfil").setDescription("Ver tu perfil de cuenta"))
  .addSubcommand((sc) => sc.setName("conectar").setDescription("Conectar tu cuenta de Discord"))
  .addSubcommand((sc) => sc.setName("desconectar").setDescription("Desconectar tu cuenta de Discord"))
  .addSubcommand((sc) => sc.setName("privacidad").setDescription("Configurar privacidad de tu cuenta"));

export async function handleJugador(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "perfil": {
      const target = interaction.options.getUser("usuario") ?? interaction.user;
      const res = await api.get(`/api/player/profile?discordId=${target.id}`);
      if (!res.player) return interaction.reply({ content: "❌ Jugador no encontrado.", ephemeral: true });
      const p = res.player;
      await interaction.reply({
        embeds: [{
          title: `👤 ${p.gamertag ?? target.username}`,
          color: 0x0099ff,
          fields: [
            { name: "Rango", value: p.rankKey ?? "Unranked", inline: true },
            { name: "MMR", value: `${p.mmr ?? 0}`, inline: true },
            { name: "Victorias", value: `${p.wins ?? 0}`, inline: true },
            { name: "Derrotas", value: `${p.losses ?? 0}`, inline: true },
            { name: "K/D", value: `${p.kdRatio ?? 0}`, inline: true },
            { name: "Región", value: p.region ?? "N/A", inline: true },
          ],
          thumbnail: p.avatarUrl ? { url: p.avatarUrl } : undefined,
        }],
      });
      break;
    }
    case "buscar": {
      const name = interaction.options.getString("nombre");
      const res = await api.get(`/api/player/search?query=${encodeURIComponent(name)}`);
      const players = res.players ?? [];
      if (players.length === 0) return interaction.reply({ content: "❌ No se encontraron jugadores.", ephemeral: true });
      const lines = players.slice(0, 10).map((p, i) => `**#${i + 1}** ${p.gamertag} — ${p.rankKey ?? "Unranked"} · ${p.wins ?? 0}W/${p.losses ?? 0}L`);
      await interaction.reply({ embeds: [{ title: "🔍 Resultados", color: 0x0099ff, description: lines.join("\n") }] });
      break;
    }
    case "estadisticas": {
      const target = interaction.options.getUser("usuario") ?? interaction.user;
      const res = await api.get(`/api/player/stats?discordId=${target.id}`);
      if (!res.stats) return interaction.reply({ content: "❌ Sin estadísticas.", ephemeral: true });
      const s = res.stats;
      await interaction.reply({
        embeds: [{
          title: `📊 Estadísticas — ${target.username}`,
          color: 0x0099ff,
          fields: [
            { name: "Partidas", value: `${s.totalMatches ?? 0}`, inline: true },
            { name: "Win Rate", value: `${s.winRate ?? 0}%`, inline: true },
            { name: "K/D Ratio", value: `${s.kdRatio ?? 0}`, inline: true },
            { name: "Racha actual", value: `${s.streak ?? 0}`, inline: true },
            { name: "Mejor racha", value: `${s.peakStreak ?? 0}`, inline: true },
            { name: "Rango peak", value: s.peakRank ?? "N/A", inline: true },
          ],
        }],
      });
      break;
    }
    case "comparar": {
      const u1 = interaction.options.getUser("jugador1");
      const u2 = interaction.options.getUser("jugador2");
      const [r1, r2] = await Promise.all([
        api.get(`/api/player/profile?discordId=${u1.id}`),
        api.get(`/api/player/profile?discordId=${u2.id}`),
      ]);
      if (!r1.player || !r2.player) return interaction.reply({ content: "❌ Jugador(es) no encontrado(s).", ephemeral: true });
      await interaction.reply({
        embeds: [{
          title: `⚔️ ${u1.username} vs ${u2.username}`,
          color: 0xff6b6b,
          fields: [
            { name: "Rango", value: `${r1.player.rankKey ?? "?"} vs ${r2.player.rankKey ?? "?"}`, inline: false },
            { name: "MMR", value: `${r1.player.mmr ?? 0} vs ${r2.player.mmr ?? 0}`, inline: false },
            { name: "Victorias", value: `${r1.player.wins ?? 0} vs ${r2.player.wins ?? 0}`, inline: false },
            { name: "Derrotas", value: `${r1.player.losses ?? 0} vs ${r2.player.losses ?? 0}`, inline: false },
            { name: "K/D", value: `${r1.player.kdRatio ?? 0} vs ${r2.player.kdRatio ?? 0}`, inline: false },
          ],
        }],
      });
      break;
    }
    case "verificar": {
      const res = await api.post("/api/player/verify", { discordId: userId, discordUsername: interaction.user.username });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Solicitud de verificación enviada. Un admin revisará tu cuenta.", ephemeral: true });
      break;
    }
    case "desconectar": {
      const res = await api.post("/api/player/disconnect", { discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Cuenta desconectada.", ephemeral: true });
      break;
    }
  }
}

export async function handleJugadores(interaction, api) {
  const sub = interaction.options.getSubcommand();
  switch (sub) {
    case "activos": {
      const res = await api.get("/api/players/active");
      const players = res.players ?? [];
      if (players.length === 0) return interaction.reply({ content: "📋 No hay jugadores activos.", ephemeral: true });
      const lines = players.slice(0, 20).map((p, i) => `**#${i + 1}** ${p.gamertag ?? p.username} — ${p.rankKey ?? "Unranked"} · ${p.status ?? "online"}`);
      await interaction.reply({ embeds: [{ title: "🟢 Jugadores activos", color: 0x00ff00, description: lines.join("\n") }] });
      break;
    }
  }
}

export async function handleCuenta(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "crear": {
      const res = await api.post("/api/account/create", {
        discordId: userId,
        discordUsername: interaction.user.username,
        avatarUrl: interaction.user.displayAvatarURL(),
      });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      const isSeasonStart = res.seasonStarted;
      await interaction.reply({
        content: `✅ Cuenta creada para **${interaction.user.username}**.${isSeasonStart ? "\n🎉 ¡Eres el primer jugador! **Temporada 1 iniciada automáticamente.**" : ""}`,
        ephemeral: true,
      });
      break;
    }
    case "perfil": {
      const res = await api.get(`/api/account/profile?discordId=${userId}`);
      if (!res.account) return interaction.reply({ content: "❌ Cuenta no encontrada. Usa /cuenta crear primero.", ephemeral: true });
      const a = res.account;
      await interaction.reply({
        embeds: [{
          title: `👤 Cuenta — ${interaction.user.username}`,
          color: 0x0099ff,
          fields: [
            { name: "Gamertag", value: a.gamertag ?? interaction.user.username, inline: true },
            { name: "Verificado", value: a.verified ? "✅ Sí" : "❌ No", inline: true },
            { name: "Creada", value: `<t:${Math.floor(new Date(a.createdAt).getTime() / 1000)}:R>`, inline: true },
          ],
        }],
      });
      break;
    }
    case "conectar": {
      await interaction.reply({ content: "✅ Tu cuenta de Discord ya está conectada.", ephemeral: true });
      break;
    }
    case "desconectar": {
      const res = await api.post("/api/account/disconnect", { discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Cuenta desconectada de Discord.", ephemeral: true });
      break;
    }
    case "privacidad": {
      const res = await api.get(`/api/account/privacy?discordId=${userId}`);
      await interaction.reply({
        embeds: [{
          title: "🔒 Privacidad de cuenta",
          color: 0x0099ff,
          description: `Estado actual: **${res.privacy ?? "public"}**\nOpciones: public, friends, private`,
        }],
      });
      break;
    }
  }
}
