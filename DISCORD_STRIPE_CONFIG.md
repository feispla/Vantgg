# VANT - Configuración de Discord y Stripe

## 📋 Estado Actual

✅ **Configurado:**
- OAuth providers: Google, X, Discord (nuevamente agregado)
- Better Auth: autenticación con sesiones
- Stripe: webhook y checkout básico
- Discord sync: autenticación y comunicación con el bot

⚠️ **Pendiente:**
- Claves de Stripe en el `.env`
- Webhooks de Stripe apuntando a `/api/stripe/webhook`
- Verificar que Discord esté correctamente integrado con Better Auth

---

## 🔐 Variables de Entorno Necesarias

Crea o actualiza tu `.env.local`:

```env
# Discord OAuth
DISCORD_CLIENT_ID=1547309949137453167
DISCORD_CLIENT_SECRET=3x8f_viCDdyhWmB_TBBx5rwNxRJUkNhN
DISCORD_GUILD_ID=1546641331927908472

# Bot Sync
VANT_BOT_SYNC_SECRET=VANT_SYNC_7fK9mQ2xL8pR4vN6sT3wY5zA1bC9dE
VANT_WEB_BASE_URL=https://vantgg.vercel.app/

# Stripe (REEMPLAZA CON TUS CLAVES REALES)
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Auth General
BETTER_AUTH_SECRET=cambiar-en-producción
VITE_AUTH_ENABLED=true

# Database (opcional para desarrollo)
DATABASE_URL=postgresql://user:[REDACTED]@localhost:5432/vant
```

---

## 🔗 Discord OAuth - Configuración en Discord Developer Portal

1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación (o crea una nueva)
3. En **OAuth2** → **General**:
   - Copia el **Client ID** → `DISCORD_CLIENT_ID`
   - Copia el **Client Secret** → `DISCORD_CLIENT_SECRET`

4. En **OAuth2** → **Redirects**, agrega:
   - `http://localhost:8080/api/auth/discord/callback` (desarrollo local)
   - `https://vantgg.vercel.app/api/auth/discord/callback` (producción)

5. En **Bot** → **OAuth2 URL Generator**, selecciona:
   - Scopes: `identify`, `email`, `guilds`
   - Permissions: `Read Messages/View Channels`, `Send Messages`

---

## 💳 Stripe - Configuración del Webhook

1. Ve a https://dashboard.stripe.com/webhooks
2. Crea un nuevo endpoint apuntando a:
   - **URL**: `https://vantgg.vercel.app/api/stripe/webhook`
   - **Eventos**: 
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `checkout.session.expired`
     - `checkout.session.async_payment_failed`
     - `charge.refunded`

3. Copia el **Signing Secret** → `STRIPE_WEBHOOK_SECRET`
4. En **API Keys**, copia:
   - **Secret Key** → `STRIPE_SECRET_KEY`
   - **Publishable Key** → `VITE_STRIPE_PUBLISHABLE_KEY`

---

## 🤖 Bot Sync - Conectar VantBot

El VantBot debe tener las mismas variables de entorno:

```env
# En Railway o donde corra el bot:
VANT_BOT_SYNC_SECRET=VANT_SYNC_7fK9mQ2xL8pR4vN6sT3wY5zA1bC9dE
VANT_WEB_BASE_URL=https://vantgg.vercel.app/
DISCORD_TOKEN=tu_token_aqui
DISCORD_CLIENT_ID=1547309949137453167
DISCORD_CLIENT_SECRET=3x8f_viCDdyhWmB_TBBx5rwNxRJUkNhN
```

La web enviará eventos sincronizados al bot vía `/api/vant/sync` con firma HMAC.

---

## 🚀 Próximos Pasos

1. **Agrega las claves de Stripe** en `.env.local`
2. **Verifica que el webhook de Stripe** esté correctamente apuntado
3. **Prueba Discord OAuth**:
   - Inicia el servidor: `npm run dev`
   - Ve a `/login`
   - Haz clic en "Continuar con Discord"
   - Deberías ver el popup de Discord OAuth
4. **Prueba Stripe**:
   - Ve a `/pricing` o `/checkout`
   - Completa un pago de prueba
   - Verifica que el webhook confirme la transacción

---

## 📁 Archivos Modificados

- ✅ `.env.local` - Variables de entorno
- ✅ `src/lib/auth/providers.ts` - Agregado Discord provider
- ✅ `src/lib/auth/discord.server.ts` - Configuración de Discord OAuth
- ✅ `src/lib/platform/discord-sync.server.ts` - Sincronización con el bot
- ✅ `src/routes/api/auth/discord.callback.ts` - Callback de Discord OAuth
- ✅ `src/routes/login.tsx` - Botón de Discord agregado

---

## 🐛 Troubleshooting

### "Discord no está configurado todavía"
- Verifica que `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET` estén en `.env.local`
- Reinicia el servidor: `npm run dev`

### Stripe rechaza el pago
- Verifica que `STRIPE_SECRET_KEY` y `VITE_STRIPE_PUBLISHABLE_KEY` sean válidas
- En modo test, usa tarjeta: [REDACTED]

### El webhook de Discord no funciona
- Verifica que `VANT_BOT_SYNC_SECRET` sea igual en web y bot
- Comprueba que el bot esté corriendo en Railway o donde lo tengas deployed

---

¿Necesitas ayuda con algo específico?
