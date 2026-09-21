# vantpremium

VANT Premium is the merged VANT REALM web application with a verified-player Ranked circuit.

## Included

- The complete public site, auth, profiles, tournaments, tickets, and Stripe webhook flow from the two uploaded workspaces.
- One canonical rank system with the supplied rank artwork in `public/ranks/`.
- Automatic placement matches, MMR progression, streaks, peak rank, history, leaderboard, and match-rate limiting.
- Leaderboards and public profiles restricted to registered users with verified email addresses; seeded or synthetic records are excluded.
- Stripe-backed ticket/entitlement checks for ranked and tournament access.

## Local development

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

The app uses the migration files in `migrations/`. Configure the production database and Stripe values as environment variables; never commit `.env` files or secret keys.

## Deployment

The intended production path is a new private GitHub repository named `vantpremium`, connected to Vercel, with the Postgres database hosted on Supabase and Stripe webhook verification configured in Vercel environment variables.

## Integrated repositories

This repository is the canonical merge target for `vantpremium`, `vantgoogle`, and `CROSAIM.GG-railwaybot`. The Google and X/Twitter sign-in providers remain defined in `src/lib/auth/providers.ts` as `grok-google` and `grok-x` (`twitter` upstream), with the existing callback and popup flow unchanged. The Discord bot and its operational contracts are preserved under `integrations/vantbot/`; they use the signed VANT sync API and must run as a separate persistent worker. The web application remains the single canonical source for database migrations, including `migrations/0008_discord_integration.sql`; duplicate standalone bot schema files are intentionally not copied into the deployment root.
