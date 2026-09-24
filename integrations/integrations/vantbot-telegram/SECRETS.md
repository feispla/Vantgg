# GitHub Secrets Configuration

Para activar el bot con tokens seguros en GitHub y Railway, sigue estos pasos:

## 1. GitHub Secrets (para CI/CD y referencia)

Ve a tu repo en GitHub:
1. **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**

Agrega estos secrets:
- **Name:** `TELEGRAM_BOT_TOKEN`
  **Value:** Tu token de @BotFather

- **Name:** `SUPABASE_URL`
  **Value:** `https://quroqevalwwvgflqdclh.supabase.co` (completa con tu URL)

- **Name:** `SUPABASE_KEY`
  **Value:** Tu clave anon de Supabase

Los secrets aparecen como `[REDACTED]` en los logs y nunca se exponen.

## 2. Railway Deployment

Ve a https://railway.app y conecta tu repo de GitHub.

### Variables de entorno en Railway:

En el dashboard de Railway, ve a **Environment** y agrega:

```
TELEGRAM_BOT_TOKEN=<tu_token>
SUPABASE_URL=https://quroqevalwwvgflqdclh.supabase.co
SUPABASE_KEY=<tu_clave_anon>
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=https://tu-servidor-ollama-seguro  (si es remoto)
```

### Procfile para Railway:

Crea `integrations/vantbot-telegram/Procfile`:

```
worker: python bot.py
```

Railway automáticamente:
- Detecta `requirements.txt`
- Instala dependencias
- Ejecuta el comando del Procfile

## 3. Verificación de seguridad

Nunca commits:
- `.env` con valores reales
- Tokens en código
- Claves en README o documentación

El `.gitignore` ya excluye `.env`.

Verifica:
```bash
git log --all -p | grep -i "token\|secret\|key" || echo "✅ Sin secretos expuestos"
```

## 4. Workflow local vs Railway

**Local (.env):**
```
TELEGRAM_BOT_TOKEN=tu_token_aqui
SUPABASE_URL=https://...
SUPABASE_KEY=tu_clave_aqui
```

**Railway (Environment tab):**
- Mismas variables
- Sin archivo `.env`
- Railway inyecta automáticamente

## Referencias

- [GitHub Secrets](https://docs.github.com/es/actions/security-guides/using-secrets-in-github-actions)
- [Railway Environment](https://docs.railway.app/guides/variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api#api-url-and-keys)
