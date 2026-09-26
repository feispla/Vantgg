import { createFileRoute } from "@tanstack/react-router";
import { verifyVantSync } from "@/lib/platform/vant-sync.server";
import { getSql } from "@/lib/db";

async function handle(request: Request) {
  const rawBody = await request.text();
  const auth = await verifyVantSync(request, rawBody);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });

  let body: { eventId?: number; status?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.eventId) {
    return Response.json({ error: "Missing eventId" }, { status: 400 });
  }

  const sql = await getSql();
  await sql`
    update vant_sync_events
    set status = 'delivered', delivered_at = now()
    where id = ${body.eventId} and status in ('pending', 'failed', 'leased')
  `;

  return Response.json({ ok: true, eventId: body.eventId });
}

export const Route = createFileRoute("/api/discord/ack")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
    },
  },
});
