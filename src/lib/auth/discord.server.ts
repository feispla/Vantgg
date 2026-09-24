/**
 * Discord OAuth provider para Better Auth
 * Configura Discord como proveedor de autenticación
 */
import { env } from "@/lib/env.server";

export const discordOAuthConfig = {
  clientId: env("DISCORD_CLIENT_ID"),
  clientSecret: env("DISCORD_CLIENT_SECRET"),
  authorizationUrl: "https://discord.com/api/oauth2/authorize",
  tokenUrl: "https://discord.com/api/oauth2/token",
  userInfoUrl: "https://discord.com/api/users/@me",
  scopes: ["identify", "email", "guilds"],
};

export function getDiscordUserData(accessToken: string) {
  return fetch(discordOAuthConfig.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json());
}
