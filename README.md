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
