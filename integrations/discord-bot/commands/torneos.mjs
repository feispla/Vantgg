/**
 * /torneo subcommands: lista, ver, registrar, cancelar, participantes, bracket, partida, resultado
 * /ticket subcommands: crear, cerrar, reclamar, agregar, remover, categoria
 * /evento subcommands: lista, ver, registrar, cancelar, participantes, recordatorio, calendario
 */
import { SlashCommandBuilder } from "discord.js";

export const torneoCommand = new SlashCommandBuilder()
  .setName("torneo")
  .setDescription("Gestión de torneos")
  .addSubcommand((sc) => sc.setName("lista").setDescription("Lista de torneos activos"))
  .addSubcommand((sc) => sc.setName("ver").setDescription("Ver detalles de un torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID del torneo").setRequired(true)))
  .addSubcommand((sc) => sc.setName("registrar").setDescription("Registrarte en un torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID del torneo").setRequired(true)))
  .addSubcommand((sc) => sc.setName("cancelar").setDescription("Cancelar tu registro")
    .addStringOption((o) => o.setName("id").setDescription("ID del torneo").setRequired(true)))
  .addSubcommand((sc) => sc.setName("participantes").setDescription("Ver participantes de un torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID del torneo").setRequired(true)))
  .addSubcommand((sc) => sc.setName("bracket").setDescription("Ver bracket de un torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID del torneo").setRequired(true)))
  .addSubcommand((sc) => sc.setName("partida").setDescription("Ver partida de torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID de la partida").setRequired(true)))
  .addSubcommand((sc) => sc.setName("resultado").setDescription("Reportar resultado de partida de torneo")
    .addStringOption((o) => o.setName("id").setDescription("ID de la partida").setRequired(true))
    .addStringOption((o) => o.setName("resultado").setDescription("win o loss").setRequired(true).addChoices(
      { name: "Victoria", value: "win" }, { name: "Derrota", value: "loss" })));

export const ticketCommand = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Sistema de tickets de soporte")
  .addSubcommand((sc) => sc.setName("crear").setDescription("Crear ticket de soporte")
    .addStringOption((o) => o.setName("categoria").setDescription("Categoría del ticket").setRequired(true).addChoices(
      { name: "Pago", value: "pago" }, { name: "Cuenta", value: "cuenta" },
      { name: "Torneo", value: "torneo" }, { name: "Bug", value: "bug" }, { name: "Otro", value: "otro" }))
    .addStringOption((o) => o.setName("mensaje").setDescription("Describe tu problema").setRequired(true)))
  .addSubcommand((sc) => sc.setName("cerrar").setDescription("Cerrar un ticket")
    .addStringOption((o) => o.setName("id").setDescription("ID del ticket").setRequired(true)))
  .addSubcommand((sc) => sc.setName("reclamar").setDescription("Reclamar un ticket (staff)")
    .addStringOption((o) => o.setName("id").setDescription("ID del ticket").setRequired(true)))
  .addSubcommand((sc) => sc.setName("agregar").setDescription("Agregar usuario a un ticket")
    .addStringOption((o) => o.setName("id").setDescription("ID del ticket").setRequired(true))
    .addUserOption((o) => o.setName("usuario").setDescription("Usuario a agregar").setRequired(true)))
  .addSubcommand((sc) => sc.setName("remover").setDescription("Remover usuario de un ticket")
    .addStringOption((o) => o.setName("id").setDescription("ID del ticket").setRequired(true))
    .addUserOption((o) => o.setName("usuario").setDescription("Usuario a remover").setRequired(true)))
  .addSubcommand((sc) => sc.setName("categoria").setDescription("Cambiar categoría de un ticket")
    .addStringOption((o) => o.setName("id").setDescription("ID del ticket").setRequired(true))
    .addStringOption((o) => o.setName("categoria").setDescription("Nueva categoría").setRequired(true)));

export const eventoCommand = new SlashCommandBuilder()
  .setName("evento")
  .setDescription("Gestión de eventos")
  .addSubcommand((sc) => sc.setName("lista").setDescription("Próximos eventos"))
  .addSubcommand((sc) => sc.setName("ver").setDescription("Ver detalles de un evento")
    .addStringOption((o) => o.setName("id").setDescription("ID del evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("registrar").setDescription("Registrarte en un evento")
    .addStringOption((o) => o.setName("id").setDescription("ID del evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("cancelar").setDescription("Cancelar tu registro")
    .addStringOption((o) => o.setName("id").setDescription("ID del evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("participantes").setDescription("Ver participantes")
    .addStringOption((o) => o.setName("id").setDescription("ID del evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("recordatorio").setDescription("Configurar recordatorio")
    .addStringOption((o) => o.setName("id").setDescription("ID del evento").setRequired(true)))
  .addSubcommand((sc) => sc.setName("calendario").setDescription("Ver calendario de eventos"));

export async function handleTorneo(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "lista": {
      const res = await api.get("/api/tournaments/active");
      const tournaments = res.tournaments ?? [];
      if (tournaments.length === 0) return interaction.reply({ content: "📋 No hay torneos activos.", ephemeral: true });
      const lines = tournaments.map((t) => `🏆 **${t.name}** (${t.id})\n   ${t.blurb}\n   Inicia: <t:${Math.floor(new Date(t.startsAt).getTime() / 1000)}:R> · Cupos: ${t.capacity}`);
      await interaction.reply({ embeds: [{ title: "🏆 Torneos activos", color: 0xffd700, description: lines.join("\n\n") }] });
      break;
    }
    case "ver": {
      const id = interaction.options.getString("id");
      const res = await api.get(`/api/tournaments/${id}`);
      if (!res.tournament) return interaction.reply({ content: "❌ Torneo no encontrado.", ephemeral: true });
      const t = res.tournament;
      await interaction.reply({
        embeds: [{
          title: `🏆 ${t.name}`,
          color: 0xffd700,
          fields: [
            { name: "Estado", value: t.status, inline: true },
            { name: "Inscripción", value: t.entryLabel ?? "Abierta", inline: true },
            { name: "Tier mínimo", value: t.minTier ?? "basic", inline: true },
            { name: "Cupos", value: `${t.capacity}`, inline: true },
            { name: "Premio", value: t.prize ?? "N/A", inline: true },
            { name: "Inicio", value: `<t:${Math.floor(new Date(t.startsAt).getTime() / 1000)}:R>`, inline: true },
          ],
          description: t.blurb,
        }],
      });
      break;
    }
    case "registrar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/tournaments/register", { tournamentId: id, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Registrado en el torneo.`, ephemeral: true });
      break;
    }
    case "cancelar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/tournaments/cancel", { tournamentId: id, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Registro cancelado.", ephemeral: true });
      break;
    }
    case "participantes": {
      const id = interaction.options.getString("id");
      const res = await api.get(`/api/tournaments/${id}/participants`);
      const participants = res.participants ?? [];
      if (participants.length === 0) return interaction.reply({ content: "📋 Sin participantes aún.", ephemeral: true });
      const lines = participants.slice(0, 20).map((p, i) => `**#${i + 1}** ${p.gamertag ?? p.userId} — ${p.status ?? "registered"}`);
      await interaction.reply({ embeds: [{ title: "👥 Participantes", color: 0x0099ff, description: lines.join("\n") }] });
      break;
    }
    case "bracket": {
      const id = interaction.options.getString("id");
      const res = await api.get(`/api/tournaments/${id}/bracket`);
      if (!res.bracket) return interaction.reply({ content: "📋 Bracket no disponible aún.", ephemeral: true });
      await interaction.reply({ content: `🏆 Bracket: ${res.bracketUrl ?? "En construcción"}`, ephemeral: true });
      break;
    }
    case "partida": {
      const matchId = interaction.options.getString("id");
      const res = await api.get(`/api/tournaments/match/${matchId}`);
      if (!res.match) return interaction.reply({ content: "❌ Partida no encontrada.", ephemeral: true });
      const m = res.match;
      await interaction.reply({
        embeds: [{
          title: `🎮 Partida de Torneo`,
          color: 0xffd700,
          fields: [
            { name: "Jugador 1", value: m.player1Name, inline: true },
            { name: "Jugador 2", value: m.player2Name, inline: true },
            { name: "Ronda", value: `Ronda ${m.round}`, inline: true },
            { name: "Estado", value: m.status, inline: true },
            { name: "Ganador", value: m.winnerId ? (m.winnerId === m.player1Id ? m.player1Name : m.player2Name) : "Pendiente", inline: true },
          ],
        }],
      });
      break;
    }
    case "resultado": {
      const matchId = interaction.options.getString("id");
      const result = interaction.options.getString("resultado");
      const res = await api.post("/api/tournaments/result", { matchId, result, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Resultado registrado.", ephemeral: true });
      break;
    }
  }
}

export async function handleTicket(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "crear": {
      const category = interaction.options.getString("categoria");
      const message = interaction.options.getString("mensaje");
      const res = await api.post("/api/tickets/create", { discordId: userId, category, message });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ Ticket creado. ID: \`${res.ticketId}\``, ephemeral: true });
      break;
    }
    case "cerrar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/tickets/close", { ticketId: id, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Ticket cerrado.", ephemeral: true });
      break;
    }
    case "reclamar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/tickets/claim", { ticketId: id, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Ticket reclamado.", ephemeral: true });
      break;
    }
    case "agregar": {
      const id = interaction.options.getString("id");
      const user = interaction.options.getUser("usuario");
      const res = await api.post("/api/tickets/add", { ticketId: id, targetDiscordId: user.id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ ${user.username} agregado al ticket.`, ephemeral: true });
      break;
    }
    case "remover": {
      const id = interaction.options.getString("id");
      const user = interaction.options.getUser("usuario");
      const res = await api.post("/api/tickets/remove", { ticketId: id, targetDiscordId: user.id });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: `✅ ${user.username} removido del ticket.`, ephemeral: true });
      break;
    }
    case "categoria": {
      const id = interaction.options.getString("id");
      const category = interaction.options.getString("categoria");
      const res = await api.post("/api/tickets/category", { ticketId: id, category });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Categoría actualizada.", ephemeral: true });
      break;
    }
  }
}

export async function handleEvento(interaction, api) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  switch (sub) {
    case "lista": {
      const res = await api.get("/api/events/upcoming");
      const events = res.events ?? [];
      if (events.length === 0) return interaction.reply({ content: "📋 No hay eventos próximos.", ephemeral: true });
      const lines = events.map((e) => `📅 **${e.title}** (${e.id})\n   ${e.description ?? ""}\n   Inicio: <t:${Math.floor(new Date(e.startsAt).getTime() / 1000)}:R>`);
      await interaction.reply({ embeds: [{ title: "📅 Próximos eventos", color: 0x00d4aa, description: lines.join("\n\n") }] });
      break;
    }
    case "ver": {
      const id = interaction.options.getString("id");
      const res = await api.get(`/api/events/${id}`);
      if (!res.event) return interaction.reply({ content: "❌ Evento no encontrado.", ephemeral: true });
      const e = res.event;
      await interaction.reply({
        embeds: [{
          title: `📅 ${e.title}`,
          color: 0x00d4aa,
          fields: [
            { name: "Estado", value: e.status, inline: true },
            { name: "Inicio", value: `<t:${Math.floor(new Date(e.startsAt).getTime() / 1000)}:R>`, inline: true },
            { name: "Capacidad", value: e.capacity ? `${e.capacity}` : "Ilimitada", inline: true },
          ],
          description: e.description ?? "",
        }],
      });
      break;
    }
    case "registrar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/events/rsvp", { eventId: id, discordId: userId, displayName: interaction.user.username });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Registrado en el evento.", ephemeral: true });
      break;
    }
    case "cancelar": {
      const id = interaction.options.getString("id");
      const res = await api.post("/api/events/cancel", { eventId: id, discordId: userId });
      if (res.error) return interaction.reply({ content: `❌ ${res.error}`, ephemeral: true });
      await interaction.reply({ content: "✅ Registro cancelado.", ephemeral: true });
      break;
    }
    case "participantes": {
      const id = interaction.options.getString("id");
      const res = await api.get(`/api/events/${id}/participants`);
      const participants = res.participants ?? [];
      if (participants.length === 0) return interaction.reply({ content: "📋 Sin participantes.", ephemeral: true });
      const lines = participants.slice(0, 20).map((p, i) => `**#${i + 1}** ${p.displayName}`);
      await interaction.reply({ embeds: [{ title: "👥 Participantes", color: 0x00d4aa, description: lines.join("\n") }] });
      break;
    }
    case "recordatorio": {
      const id = interaction.options.getString("id");
      await interaction.reply({ content: `⏰ Recordatorio configurado para el evento \`${id}\`.`, ephemeral: true });
      break;
    }
    case "calendario": {
      const res = await api.get("/api/events/calendar");
      const events = res.events ?? [];
      if (events.length === 0) return interaction.reply({ content: "📋 Calendario vacío.", ephemeral: true });
      const lines = events.map((e) => `📅 **${e.title}** — <t:${Math.floor(new Date(e.startsAt).getTime() / 1000)}:R>`);
      await interaction.reply({ embeds: [{ title: "📆 Calendario de eventos", color: 0x00d4aa, description: lines.join("\n") }] });
      break;
    }
  }
}
