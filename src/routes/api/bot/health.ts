import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/bot/health")({
  server: {
    handlers: {
      GET: () => {
        const discordConfigured = Boolean(process.env.DISCORD_BOT_TOKEN);
        const syncConfigured = Boolean(
          process.env.VANT_BOT_SYNC_SECRET || process.env.CROSAIM_BOT_SYNC_SECRET,
        );
        const supabaseConfigured = Boolean(
          process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
        );
        const ready = discordConfigured && syncConfigured && supabaseConfigured;
        return Response.json(
          {
            ok: ready,
            service: "vantbot-web",
            bot: { runtime: "persistent-worker", discordConfigured },
            sync: { signedRequestsConfigured: syncConfigured },
            storage: { supabaseConfigured },
            timestamp: new Date().toISOString(),
          },
          { status: ready ? 200 : 503 },
        );
      },
    },
  },
});
