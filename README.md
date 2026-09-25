# VanteIAp

VANT es una plataforma competitiva conectada a Discord. La web y el bot comparten la misma fuente de datos para que cuentas, perfiles, rangos, MMR, partidas, torneos, eventos, tickets y operaciones estén sincronizados.

## Componentes

- **Web VANT:** aplicación pública con autenticación, perfiles, Ranked, jugadores, torneos, eventos, tickets, postulaciones y consola de operaciones.

- **VantBot:** bot oficial de Discord para ejecutar comandos de jugadores, temporada, torneos, eventos, tickets y administración.

- **API de sincronización:** comunicación autenticada entre la web y el bot mediante solicitudes firmadas.

- **Base de datos canónica:** almacena la información de usuarios, perfiles, partidas, temporadas, rangos, torneos, eventos, tickets y auditoría.

- **Ollama:** proveedor opcional para funciones de asistente; no controla rangos, MMR, partidas ni permisos administrativos.

## Funciones previstas del bot

### Ranked

```
/ranked entrar
/ranked placement
/ranked perfil
/ranked estado
/ranked leaderboard
/ranked historial
/ranked partida
/ranked cola
/ranked cancelar
/ranked resultado
/ranked reglas
```

### Jugadores y cuentas

```
/jugador perfil
/jugador buscar
/jugador estadisticas
/jugador comparar
/jugador verificar
/jugador desconectar
/jugadores activos
/cuenta crear
/cuenta perfil
/cuenta conectar
/cuenta desconectar
/cuenta privacidad
```

### Torneos, tickets y eventos

```
/torneo lista
/torneo ver
/torneo registrar
/torneo cancelar
/torneo participantes
/torneo bracket
/torneo partida
/torneo resultado
/ticket crear
/ticket cerrar
/ticket reclamar
/ticket agregar
/ticket remover
/ticket categoria
/evento lista
/evento ver
/evento registrar
/evento cancelar
/evento participantes
/evento recordatorio
/evento calendario
```

### Temporada y administración

```
/temporada actual
/temporada ranking
/temporada estadisticas
/temporada records
/admin temporada iniciar
/admin temporada cerrar
/admin rango asignar
/admin mmr ajustar
/admin partida validar
/admin partida anular
/admin torneo crear
/admin evento crear
/admin leaderboard actualizar
/menu
```

Los comandos administrativos están restringidos a los roles autorizados. La primera cuenta real que ejecute `/cuenta crear` puede activar automáticamente la Temporada 1, cuyo leaderboard comienza vacío hasta que existan partidas válidas.

## Desarrollo local de la web

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

La aplicación utiliza las migraciones de `migrations/`. Las credenciales de base de datos, Stripe, autenticación y sincronización deben configurarse mediante variables de entorno. Nunca se deben subir archivos `.env` ni claves secretas al repositorio.

## Desarrollo local del VantBot

```bash
cd integrations/vantbot
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m pytest -q
python -m compileall -q bot.py image_generator.py supabase_db.py crosaim_setup.py
python bot.py
```

En Windows PowerShell:

```
cd .\integrations\vantbot
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python bot.py
```

El bot necesita el token de Discord, la URL de la web, el secreto de sincronización, las credenciales de Supabase y los identificadores de servidor/canales correspondientes. Esos valores deben guardarse únicamente en variables de entorno.

## Despliegue

- **Vercel:** aloja la aplicación web de VANT.

- **Railway:** ejecuta el VantBot como worker persistente para que Discord funcione aunque el ordenador personal esté apagado.

- **Supabase:** aloja la base de datos y las migraciones canónicas.

- **Stripe:** gestiona tickets, planes y comprobaciones de acceso cuando corresponda.

El bot debe desplegarse como un servicio separado de la web, pero ambos deben utilizar la misma API de sincronización y la misma fuente de datos. No se deben crear bases de datos paralelas para el bot.

## Seguridad

- No conceder al bot el permiso `Administrator`.

- Usar únicamente los permisos de Discord necesarios para canales, roles, mensajes, miembros y comandos.

- Mantener los secretos en Vercel/Railway/Supabase, nunca en el código.

- Firmar las solicitudes entre la web y el bot.

- Registrar auditoría de cambios administrativos y transiciones de partidas/postulaciones.

- Validar permisos antes de modificar rangos, MMR, temporadas, torneos o eventos.

## Estructura relevante

```
src/                         Aplicación web VANT
migrations/                  Esquema canónico de datos
integrations/vantbot/        Bot oficial de Discord
integrations/vantbot/bot.py  Proceso principal del bot
src/routes/api/vant/         API de sincronización web-bot
src/routes/api/discord/      Rutas relacionadas con Discord
```
