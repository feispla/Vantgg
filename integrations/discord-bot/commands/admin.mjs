/**
 * /temporada subcommands: actual, ranking, estadisticas, records
 * /admin subcommands: temporada iniciar, temporada cerrar, rango asignar, mmr ajustar,
 *   partida validar, partida anular, torneo crear, evento crear, leaderboard actualizar
 * /menu — Panel principal de control
 */
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const temporadaCommand = new SlashCommandBuilder()
  .setName("temporada")
  .setDescription("Gestión de temporadas")
  .addSubcommand((sc) => sc.setName("actual").setDescription("Ver temporada actual"))
  .addSubcommand((sc) => sc.setName("ranking").setDescription("Ranking de la temporada"))
  .addSubcommand((sc) => sc.setName("estadisticas").setDescription("Estadísticas de la temporada"))
  .addSubcommand((sc) => sc.setName("records").setDescription("Records históricos"));

export const adminCommand = new SlashCommandBuilder()
  .setName("admin")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDescription("Comandos administrativos")
  .addSubcommand((sc) => sc.setName("temporda").setDescription("Iniciar nueva temporada")
    .addStringOption((o) => o.setName("nombre").setDescription("Nombre de la temporada").setRequired(true)))
  .addSubcommand((sc) => sc.setName("cerrar").setDescription("Cerrar temporada actual"))
  .addSubcommand((sc) => sc.setName("rango").setDescription("Asignar rango a jugador")
    .addUserOption((o) => o.setName("usuario").setDescription("Jugador").setRequired(true))
    .addStringOption((o) => o.setName("rango").setDescription("Rango a asignar").setRequired(true).addChoices(
      { name: "Iron", value: "iron" }, { name: "Bronze", value: "bronze" }, { name: "Silver", value: "silver" },
      { name: "Gold", value: "gold" }, { name: "Platinum", value: "platinum" }, { name: "Diamond", value: "diamond" },
      { name: "Ascendant", value: "ascendant" }, { name: "Immortal", value: "immortal" }, { name: "Radiant", value: "radiant" })))
  .addSubcommand((sc) => sc.setName("mmr").setDescription("Ajustar MMR de jugador")
    .addUserOption((o) => o.setName("usuario").setDescription("Jugador").setRequired(true))
    .addIntegerOption((o) => o.setName("mmr").setDescription("Nuevo MMR").setRequired(true)))
  .addSubcommand((sc) => sc.setName("validar").setDescription("Validar resultado de partida")
    .addStringOption((o) => o.setName("id").setDescription("ID de la partida").setRequired(true)))
  .addSubcommand((sc) => sc.setName("anular").setDescription("Anular partida")
    .addStringOption((o) => o.setName("id").setDescription("ID de la partida").setRequired(true)))
  .addSubcommand((sc) => sc.setName("torneo").setDescription("Crear torneo")
    .addStringOption((o) => o.setName("nombre").setDescription("Nombre del torneo").setRequired(true))
    .addIntegerOption((o) => o.setName("cupos").setDescription("Número de cupos").setRequired(true))
    .addStringOption((o) => o.setName("premio").setDescription("Premio del torneo").setRequired(false)))
  .addSubcommand((sc) => sc.setName("evento").setDescription("Crear evento")
    .addStringOption((o) => o.setName("titulo").setDescription("Título del evento").setRequired(true))
    .addStringOption((o) => o.setName("tipo").setDescription("Tipo de evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("leaderboard").setDescription("Actualizar leaderboard"));

export const menuCommand = new SlashCommandBuilder()
  .setName("menu")
  .setDescription("Panel principal de control VANT");

export async function handleTemporada(interaction, api) {
  const sub = interaction.options.getSubcommand();

  switch (sub) {
    case "actual": {
      const res = await api.get("/api/season/current");
      if (!res.season) return interaction.reply({ content: "📋 No hay temporada activa.", ephemeral: true });
      const s = res.season;
      await interaction.reply({
        embeds: [{
          title: `🗓️ Temporada ${s.name}`,
          color: 0x00d4aa,
          fields: [
            { name: "Estado", value: s.status, inline: true },
            { name: "Inicio", value: `<t:${Math.floor(new Date(s.startsAt).getTime() / 1000)}:R>`, inline: true },
            { name: "Fin", value: s.endsAt ? `<t:${Math.floor(new Date(s.endsAt).getTime() / 1000)}:R>` : "Indefinido", inline: true },
          ],
        }],
      });
      break;
    }
    case "ranking": {
      const res = await api.get("/api/season/ranking");
      const players = res.players ?? [];
      if (players.length === 0) return interaction.reply({ content: "📋 Ranking vacío. Aún no hay partidas válidas.", ephemeral: true });
      const lines = players.slice(0, 10).map((p, i) => `**#${i + 1}** ${p.gamertag ?? p.userId} — ${p.rankKey ?? "Unranked"} · ${p.points ?? 0} pts · ${p.wins ?? 0}W/${p.losses ?? 0}L`);
      await interaction.reply({ embeds: [{ title: "🏆 Ranking de temporada", color: 0xffd700, description: lines.join("\n") }] });
      break;
    }
    case "estadisticas": {
      const res = await api.get("/api/season/stats");
      if (!res.stats) return interaction.reply({ content: "📋 Sin estadísticas.", ephemeral: true });
      const s = res.stats;
      await interaction.reply({
        embeds: [{
          title: "📊 Estadísticas de temporada",
          color: 0x00d4aa,
          fields: [
            { name: "Partidas jugadas", value: `${s.totalMatches ?? 0}`, inline: true },
            { name: "Jugadores activos", value: `${s.activePlayers ?? 0}`, inline: true },
            { name: "Win rate promedio", value: `${s.avgWinRate ?? 0}%`, inline: true },
          ],
        }],
      });
      break;
    }
    case "records": {
      const res = await api.get("/api/season/records");
      const records = res.records ?? {};
      await interaction.reply({
        embeds: [{
          title: "🏅 Records históricos",
          color: 0xffd700,
          fields: [
            { name: "Mayor racha", value: records.longestStreak ? `${records.longestStreak.player}: ${records.longestStreak.value}` : "N/A", inline: false },
            { name: "Mayor K/D", value: records.bestKD ? `${records.bestKD.player}: ${records.bestKD.value}` : "N/A", inline: false },
            { name: "Más partidas", value: records.mostMatches ? `${records.mostMatches.player}: ${records.mostMatches.value}` : "N/A", inline: false },
            { name: "Mayor MMR", value: records.highestMMR ? `${records.highestMMR.player}: ${records.highestMMR.value}` : "N/A", inline: false },
          ],
        }],
      });
      break;
    }
  }
}

export async function handleAdmin(interaction, api) {
  const sub = interaction.options.getSubcommand();

  // Check admin permissions
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    return interaction.reply({ content: "❌ No tienes permisos para usar comandos administrativos.", ephemeral: true });
  }

  switch (sub) {
    case "temporda": {
      const name = interaction.options.getString("nombre");
      const res = await api.post("/api/admin/season/start", { name, discordId: interaction.user.id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Temporada **${name}** iniciada.`, ephemeral: true });
      break;
    }
    case "cerrar": {
      const res = await api.post("/api/admin/season/close", { discordId: interaction.user.id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Temporada cerrada.", ephemeral: true });
      break;
    }
    case "rango": {
      const user = interaction.options.getUser("usuario");
      const rank = interaction.options.getString("rango");
      const res = await api.post("/api/admin/rank/assign", { discordId: user.id, rank });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Rango **${rank}** asignado a ${user.username}.`, ephemeral: true });
      break;
    }
    case "mmr": {
      const user = interaction.options.getUser("usuario");
      const mmr = interaction.options.getInteger("mmr");
      const res = await api.post("/api/admin/mmr/adjust", { discordId: user.id, mmr });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ MMR de ${user.username} ajustado a **${mmr}**.`, ephemeral: true });
      break;
    }
    case "validar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/admin/match/validate", { matchId: id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Partida \`${id}\` validada.`, ephemeral: true });
      break;
    }
    case "anular": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/admin/match/invalidate", { matchId: id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Partida \`${id}\` anulada.`, ephemeral: true });
      break;
    }
    case "torneo": {
      const name = interaction.options.getString("nombre");
      const cupos = interaction.options.getInteger("cupos");
      const premio = interaction.options.getString("premio");
      const res = await api.post("/api/admin/tournament/create", { name, capacity: cupos, prize: premio });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Torneo **${name}** creado con ${cupos} cupos.`, ephemeral: true });
      break;
    }
    case "evento": {
      const titulo = interaction.options.getString("titulo");
      const tipo = interaction.options.getString("tipo");
      const res = await api.post("/api/admin/event/create", { title: titulo, type: tipo });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Evento **${titulo}** creado.`, ephemeral: true });
      break;
    }
    case "leaderboard": {
      const res = await api.post("/api/admin/leaderboard/update");
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Leaderboard actualizado.", ephemeral: true });
      break;
    }
  }
}

export async function handleMenu(interaction) {
  await interaction.reply({
    embeds: [{
      title: "🎮 VANTBOT — Panel de Control",
      color: 0x00d4aa,
      description: [
        "Bienvenido al panel principal de VANTBOT.",
        "",
        "**Comandos disponibles:**",
        "📊 `/ranked` — Sistema ranked (entrar, perfil, leaderboard)",
        "👤 `/jugador` — Gestión de jugadores (perfil, buscar, comparar)",
        "👥 `/jugadores activos` — Lista de jugadores activos",
        "🔐 `/cuenta` — Gestión de cuenta (crear, perfil, privacidad)",
        "🏆 `/torneo` — Torneos (lista, registrar, bracket)",
        "🎫 `/ticket` — Soporte (crear, cerrar, reclamar)",
        "📅 `/evento` — Eventos (lista, registrar, calendario)",
        "🗓️ `/temporada` — Temporada (actual, ranking, records)",
        "⚙️ `/admin` — Administración (requiere permisos)",
        "",
        "**Rangos:** Iron → Bronze → Silver → Gold → Platinum → Diamond → Ascendant → Immortal → Radiant",
      ].join("\n"),
    }],
  });
}
