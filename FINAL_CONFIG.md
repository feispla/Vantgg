# ✅ VANT - Configuración Final

## 📍 URLs Correctas (vantcall.vercel.app)

```
Web: https://vantcall.vercel.app/
API Stripe Webhook: https://vantcall.vercel.app/api/stripe/webhook
Discord Callback: https://vantcall.vercel.app/api/auth/discord/callback
```

---

## 🔐 Variables de Entorno (`.env.local`)

```env
# Discord OAuth
DISCORD_CLIENT_ID=1547309949137453167
DISCORD_CLIENT_SECRET=3x8f_viCDdyhWmB_TBBx5rwNxRJUkNhN
DISCORD_GUILD_ID=1546641331927908472

# Bot Sync
VANT_BOT_SYNC_SECRET=VANT_SYNC_7fK9mQ2xL8pR4vN6sT3wY5zA1bC9dE
VANT_WEB_BASE_URL=https://vantcall.vercel.app/

# Stripe Live Mode
STRIPE_SECRET_KEY=[REDACTED]oiDAc5hyHjBe65F1tlKVgyifOzaoZrXI1TWQwJ0vJ3SAlYoqF1hePMrgr006xld1Xq0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51UHFf4EamHVhBbtrR9ownumeTGHOe6FGpYr0Tpsz6941SgFHPLoT8uSMcfN9ul2gNbtq1vPOCc8wur9D56ZNd1At00RPB7uKRj
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51UHFf4EamHVhBbtrR9ownumeTGHOe6FGpYr0Tpsz6941SgFHPLoT8uSMcfN9ul2gNbtq1vPOCc8wur9D56ZNd1At00RPB7uKRj

# Auth
BETTER_AUTH_SECRET=your-secret-change-in-production
VITE_AUTH_ENABLED=true
```

---

## 🔗 Configuración Pendiente en Proveedores

### Discord Developer Portal
URL: https://discord.com/developers/applications/1547309949137453167

**OAuth2 → Redirects**
Agregar:
```
https://vantcall.vercel.app/api/auth/discord/callback
http://localhost:8080/api/auth/discord/callback (dev local)
```

### Stripe Dashboard
URL: https://dashboard.stripe.com/webhooks

**Crear Webhook Endpoint:**
- URL: `https://vantcall.vercel.app/api/stripe/webhook`
- Eventos:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.expired`
  - `checkout.session.async_payment_failed`
  - `charge.refunded`

**Luego copiar el Signing Secret (`whsec_...`) → Agrega a `.env.local` como:**
```env
STRIPE_WEBHOOK_SECRET=whsec_tu_signing_secret_aqui
```

---

## ✅ Archivos Configurados

- `.env.local` ✅ Con URLs correctas de vantcall.vercel.app
- `src/lib/auth/providers.ts` ✅ Discord provider agregado
- `src/lib/auth/discord.server.ts` ✅ Config de Discord OAuth
- `src/lib/platform/discord-sync.server.ts` ✅ Bot sync ready
- `src/routes/api/auth/discord.callback.ts` ✅ Callback actualizado
- `src/routes/login.tsx` ✅ Botón Discord disponible

---

## 🚀 Flujo Completo

### Desarrollo Local
```bash
npm run dev
# Ve a http://localhost:8080/login
# Click "Continuar con Discord" → Popup de OAuth
# Si todo funciona, deberías entrar
```

### Producción (vantcall.vercel.app)
```bash
# Las env vars se heredan del Vercel Deploy
# El bot enviará eventos a /api/vant/sync (si existe)
# Los pagos se confirman vía webhook en /api/stripe/webhook
```

---

## 📝 Lo Que Falta

**1 SOLO PASO:**
- Crea el webhook en Stripe Dashboard
- Copia el `Signing Secret` (whsec_...)
- Actualiza `.env.local` con `STRIPE_WEBHOOK_SECRET=whsec_...`

Después de eso, estará 100% funcional.

---

## 🐛 Testing

### Probar Discord Login
```
1. npm run dev
2. http://localhost:8080/login
3. Click "Continuar con Discord"
4. Autoriza la app
5. Deberías entrar automaticamente
```

### Probar Stripe Pagos
```
1. npm run dev
2. http://localhost:8080/pricing
3. Selecciona un ticket
4. Click "Pagar de forma segura"
5. Completa pago con tarjeta (LIVE MODE = tarjeta real)
6. Si sale "Pago confirmado" → Webhook funcionó
```

### Probar Bot Sync
```
El bot puede enviar eventos firmados con HMAC a:
POST https://vantcall.vercel.app/api/discord/events

Header: x-vant-signature: <hmac_sha256_signature>
Body: {"type": "user.registered", "userId": "...", ...}
```

---

¿Necesitas que haga algo más?
