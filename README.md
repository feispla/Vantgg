# VANT

VANT es una plataforma competitiva conectada a Discord. La web y VantBot comparten Supabase como fuente de datos canónica para mantener sincronizados jugadores, perfiles, rangos, MMR, partidas, temporadas, torneos, eventos, tickets y operaciones.

## Arquitectura

- **Web VANT:** aplicación web desarrollada con Vite. Incluye la experiencia pública, autenticación, perfiles y funciones competitivas y administrativas.
- **VantBot:** bot oficial de Discord desarrollado en Python. Ejecuta comandos de jugadores, Ranked, temporadas, torneos, eventos y administración.
- **Supabase:** base de datos canónica compartida por la web y el bot.
- **API de sincronización:** comunicación autenticada entre la web y el bot mediante solicitudes firmadas.
- **Ollama:** proveedor opcional para funciones de asistente. No controla MMR, rangos, resultados ni permisos administrativos.
- **Stripe:** gestiona pagos y comprobaciones de acceso cuando corresponda.

El bot debe ejecutarse como un servicio separado de la web. Ambos deben utilizar la misma fuente de datos; no se deben crear bases de datos paralelas para VantBot.

## Estado del esquema de Supabase

El esquema público revisado contiene tablas para:

- **Jugadores y cuentas:** `players`, `player_discord_accounts`, `profiles`
- **Ranked:** `seasons`, `season_player_stats`, `ranked_matches`, `ranked_queue`, `ranked_rules`, `ranked_history`
- **Torneos:** `tournaments`, `tournament_entries`, `tournament_matches`
- **Eventos:** `events`, `event_rsvps`
- **Tickets y compras:** `support_tickets`, `support_ticket_messages`, `tickets`, `purchases`, `entitlements`
- **Postulaciones y auditoría:** `postulaciones`, `postulaciones_auditoria`, `audit_logs`
- **Sincronización:** `vant_sync_events`

En la revisión de la base de datos, la mayoría de estas tablas no tenían filas y `tournaments` tenía cuatro. La presencia de las tablas confirma que existe estructura en la base de datos, pero no confirma que todas las pantallas, rutas, comandos o procesos estén implementados y desplegados.

El esquema también contiene tablas `bots`, `conversations` y `connections_live` con referencias a Botpress. No asumir que esas tablas forman parte de VantBot sin comprobar el código correspondiente.

## Funciones previstas de VantBot

La siguiente lista describe los comandos previstos. Confirma su implementación en el código antes de considerarlos disponibles en producción.

### Ranked

- `/ranked entrar`
- `/ranked placement`
- `/ranked perfil`
- `/ranked estado`
- `/ranked leaderboard`
- `/ranked historial`
- `/ranked partida`
- `/ranked cancelar`
- `/ranked resultado`
- `/ranked reglas`

### Jugadores y cuentas

- `/jugador perfil`
- `/jugador buscar`
- `/jugador estadisticas`
- `/jugador comparar`
- `/jugador verificar`
- `/jugador desconectar`
- `/jugadores activos`
- `/cuenta crear`
- `/cuenta perfil`
- `/cuenta conectar`
- `/cuenta desconectar`
- `/cuenta privacidad`

### Torneos

- `/torneo lista`
- `/torneo ver`
- `/torneo registrar`
- `/torneo cancelar`
- `/torneo participantes`
- `/torneo bracket`
- `/torneo partida`
- `/torneo resultado`

### Tickets

- `/ticket crear`
- `/ticket cerrar`
- `/ticket reclamar`
- `/ticket agregar`
- `/ticket remover`
- `/ticket categoria`

### Eventos

- `/evento lista`
- `/evento ver`
- `/evento registrar`
- `/evento cancelar`
- `/evento participantes`
- `/evento recordatorio`
- `/evento calendario`

### Temporada y administración

- `/temporada actual`
- `/temporada ranking`
- `/temporada estadisticas`
- `/temporada records`
- `/admin temporada iniciar`
- `/admin temporada cerrar`
- `/admin rango asignar`
- `/admin mmr ajustar`
- `/admin partida validar`
- `/admin partida anular`
- `/admin torneo crear`
- `/admin evento crear`
- `/admin leaderboard actualizar`
- `/menu`

Los comandos administrativos deben comprobar que la persona tenga los roles autorizados antes de realizar cambios.

La regla prevista es que la primera cuenta real que ejecute `/cuenta crear` pueda iniciar automáticamente la Temporada 1. El leaderboard comienza vacío hasta que existan partidas válidas. Confirma esta lógica en el código antes de presentarla como comportamiento activo.

## Desarrollo local

### Web

Desde la raíz del proyecto:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
