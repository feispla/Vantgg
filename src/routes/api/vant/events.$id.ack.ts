import { createFileRoute } from "@tanstack/react-router";
import { ackEvent, verifyVantSync } from "@/lib/platform/vant-sync.server";

async function handle(request: Request, idParam: string) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  const id = Number(idParam);
  if (!Number.isFinite(id)) return Response.json({ error: "bad_id" }, { status: 400 });
  let body: { ok?: boolean; leaseToken?: string; error?: string } = {};
  try {
    body = raw ? (JSON.parse(raw) as typeof body) : {};
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  if (!body.leaseToken) return Response.json({ error: "missing_lease" }, { status: 400 });
  const result = await ackEvent(id, body.leaseToken, Boolean(body.ok), body.error);
  if (!result.ok) return Response.json({ error: result.error }, { status: 409 });
  return Response.json({ ok: true });
}

export const Route = createFileRoute("/api/vant/events/$id/ack")({
  server: {
    handlers: {
      POST: ({ request, params }) => handle(request, params.id),
    },
  },
});
