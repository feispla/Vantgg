# VantBot Telegram — Híbrido VANT + Ollama

Bot de Telegram que combina comandos VANT Ranked (perfiles, stats, torneos, tickets) + asistente Ollama local.

## Setup rápido

### 1. Crear el bot en Telegram

Busca `@BotFather` en Telegram, envía `/newbot`, elige un nombre y username que termine en `bot`. Copia el token.

### 2. Configurar variables de entorno

```powershell
cd integrations/vantbot-telegram
Copy-Item .env.example .env
notepad .env
```

Completa:
- `TELEGRAM_BOT_TOKEN` — token de @BotFather
- `SUPABASE_URL` — URL de tu proyecto Supabase (ej: `https://xxxxx.supabase.co`)
- `SUPABASE_KEY` — Clave anon de Supabase (encontrada en Settings → API)
- `OLLAMA_BASE_URL` — default `http://127.0.0.1:11434` (déjalo si Ollama es local)

### 3. Instalar dependencias

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 4. Prerequisitos

- **Ollama corriendo:**
  ```powershell
  ollama list
  ollama serve  # si no está en background
  ```
- **Supabase con VANT schema** (acceso a `profiles`, `ranked_queue`, `tournaments`, `tickets`)

### 5. Iniciar el bot

```powershell
python bot.py
```

Busca tu bot en Telegram y prueba `/start`.

## Comandos VANT

Todos requieren `/link <username>` primero:

- **`/link <username>`** — Vincula tu cuenta VANT (ej: `/link feispla`)
- **`/perfil`** — Tu perfil, rango, stats (W/L, win rate)
- **`/ranked`** — Estado Ranked (rango actual, placements left, si estás en cola)
- **`/torneos`** — Torneos abiertos y sus requisitos
- **`/tickets`** — Tus tickets de VANT (tier, estado, código)
- **`/leaderboard`** — Top 10 del circuito
- **`/historial`** — Últimas partidas Ranked

## Asistente Ollama

- **`/ayuda`** — Info sobre el asistente
- **Escribe cualquier pregunta** — Ollama responde (redacción, preguntas, tareas)

## Variables de entorno

```
TELEGRAM_BOT_TOKEN=...           # Token de @BotFather (requerido)
SUPABASE_URL=...                 # URL de Supabase (requerido)
SUPABASE_KEY=...                 # Clave anon (requerido)
OLLAMA_MODEL=qwen2.5:7b          # Modelo local (default)
OLLAMA_BASE_URL=http://127.0.0.1:11434  # URL de Ollama (default)
```

## Despliegue en Railway

Si alojas en Railway, cambia a URLs remotas:

```text
TELEGRAM_BOT_TOKEN=... (secreto)
SUPABASE_URL=...
SUPABASE_KEY=...
OLLAMA_BASE_URL=https://tu-servidor-ollama-seguro
```

No publiques Ollama en internet sin autenticación.

## Troubleshooting

**"Falta TELEGRAM_BOT_TOKEN"**
→ Verifica que copiaste el token de @BotFather a `.env`

**"Faltan SUPABASE_URL o SUPABASE_KEY"**
→ Obtén la URL en Supabase Settings → API. Usa la clave "anon" (la que comienza con `eyJ...`).

**"Error al vincular"**
→ Asegúrate que el username existe en VANT y que Supabase tiene las tablas. Verifica permisos RLS si está habilitado.

**"No pude conectarme con Ollama"**
→ Comprueba que Ollama corre en el puerto correcto: `ollama list`. Si Remote, verifica que la URL es correcta.

## Licencia

VANT REALM. Parte de la plataforma competitiva integrada.
