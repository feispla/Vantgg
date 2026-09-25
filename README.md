# VANT

VANT es una plataforma competitiva conectada a Discord. La web y VantBot deben utilizar Supabase como fuente de datos canónica. La web se despliega en Vercel y el bot se ejecuta como un servicio independiente en Railway.

## Arquitectura

- **Web VANT:** aplicación web desarrollada con Vite. Incluye la experiencia pública, autenticación, perfiles y funciones competitivas y administrativas.
- **VantBot:** bot de Discord desarrollado en Python. Ejecuta comandos de jugadores, Ranked, temporadas, torneos, eventos y administración.
- **Supabase:** base de datos compartida y canónica para los datos de VANT.
- **Sincronización web-bot:** los componentes deben comunicarse mediante una API autenticada y solicitudes firmadas. La tabla `vant_sync_events` está presente en la base de datos para registrar eventos de sincronización; su existencia no confirma por sí sola que la API o el proceso de entrega estén implementados o desplegados.
- **Ollama:** proveedor opcional para funciones de asistente. No debe controlar MMR, rangos, resultados ni permisos administrativos.
- **Stripe:** gestiona pagos y comprobaciones de acceso cuando corresponda.

## Estado actual de la base de datos

El esquema público de Supabase ya contiene tablas relacionadas con:

- **Jugadores y cuentas:** `players`, `player_discord_accounts`, `profiles`
- **Ranked:** `seasons`, `season_player_stats`, `ranked_matches`, `ranked_queue`, `ranked_rules`, `ranked_history`
- **Torneos:** `tournaments`, `tournament_entries`, `tournament_matches`
- **Eventos:** `events`, `event_rsvps`
- **Tickets y compras:** `support_tickets`, `support_ticket_messages`, `tickets`, `purchases`, `entitlements`
- **Postulaciones y auditoría:** `postulaciones`, `postulaciones_auditoria`, `audit_logs`
- **Sincronización:** `vant_sync_events`

En la revisión actual, la mayoría de estas tablas no tenían filas; `tournaments` tenía cuatro. La existencia de las tablas confirma que el esquema está preparado, pero no que todas las pantallas, comandos, rutas API o automatizaciones estén ya implementadas.

El proyecto también contiene tablas `bots`, `conversations` y `connections_live` con referencias a Botpress. No asumir que esas tablas forman parte de la integración de VantBot sin comprobar el código.

## Funciones previstas del bot

### Ranked

- `/ranked entrar`
- `/ranked placement`
- `/ranked perfil`
- `/ranked estado`
- `/ranked leaderboard`
- `/ranked historial`
- `/ranked partida`
- `/ranked cola`
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

### Torneos, tickets y eventos

- `/torneo lista`, `/torneo ver`, `/torneo registrar`, `/torneo cancelar`
- `/torneo participantes`, `/torneo bracket`, `/torneo partida`, `/torneo resultado`
- `/ticket crear`, `/ticket cerrar`, `/ticket reclamar`
- `/ticket agregar`, `/ticket remover`, `/ticket categoria`
- `/evento lista`, `/evento ver`, `/evento registrar`, `/evento cancelar`
- `/evento participantes`, `/evento recordatorio`, `/evento calendario`

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

Esta lista describe las funciones previstas; confirmar en el código cuáles están implementadas. Los comandos administrativos deben comprobar los roles autorizados antes de realizar cambios.

La regla prevista es que la primera cuenta real que ejecute `/cuenta crear` pueda iniciar la Temporada 1. El leaderboard comenzaría vacío hasta que existan partidas válidas. Confirmar esta lógica en el código antes de presentarla como comportamiento activo.

## Desarrollo local

### Web

Desde la raíz del proyecto:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
