import { createFileRoute } from "@tanstack/react-router";
import { leasePendingEvents, verifyVantSync } from "@/lib/platform/vant-sync.server";

async function handle(request: Request) {
  const raw = "";
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const events = await leasePendingEvents();
  return Response.json({ events });
}

export const Route = createFileRoute("/api/vant/events")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
    },
  },
});
