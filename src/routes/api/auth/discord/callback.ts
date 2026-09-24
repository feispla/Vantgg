import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/lib/env.server";

async function handle(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return Response.json(
      { error: `Discord error: ${error}` },
      { status: 400 }
    );
  }

  if (!code) {
    return Response.json(
      { error: "No authorization code received" },
      { status: 400 }
    );
  }

  const clientId = env("DISCORD_CLIENT_ID");
  const clientSecret = env("DISCORD_CLIENT_SECRET");
  const redirectUri = "https://vantgg.vercel.app/api/auth/discord/callback";

  if (!clientId || !clientSecret) {
    return Response.json(
      { error: "Discord no está configurado" },
      { status: 503 }
    );
  }

  try {
    // Intercambiar código por token
    const tokenResponse = await fetch(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      return Response.json(
        { error: "Failed to exchange code for token" },
        { status: 400 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Obtener datos del usuario
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      return Response.json(
        { error: "Failed to fetch user data" },
        { status: 400 }
      );
    }

    const discordUser = await userResponse.json();

    // Aquí iría la lógica para crear/actualizar el usuario en tu DB
    // y retornar un JWT o sesión

    return Response.json({
      success: true,
      user: {
        id: discordUser.id,
        username: discordUser.username,
        email: discordUser.email,
        avatar: discordUser.avatar,
      },
    });
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const Route = createFileRoute("/api/auth/discord/callback")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
    },
  },
});
