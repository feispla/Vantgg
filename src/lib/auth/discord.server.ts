/**
 * Discord OAuth config — now managed directly in `server.ts`.
 *
 * This file is kept for backwards compatibility. The Discord OAuth provider is
 * configured as a direct `genericOAuth` entry in `server.ts` (bypassing the
 * Grok auth broker), using `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` env vars
 * and Discord's own OAuth endpoints.
 *
 * @deprecated Use the config in `server.ts` instead.
 */
import { env } from "@/lib/env.server";

export const discordOAuthConfig = {
  clientId: env("DISCORD_CLIENT_ID"),
  clientSecret: env("DISCORD_CLIENT_SECRET"),
  authorizationUrl: "https://discord.com/api/oauth2/authorize",
  tokenUrl: "https://discord.com/api/oauth2/token",
  userInfoUrl: "https://discord.com/api/users/@me",
  scopes: ["identify", "email"],
};

export function getDiscordUserData(accessToken: string) {
  return fetch(discordOAuthConfig.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json());
}
