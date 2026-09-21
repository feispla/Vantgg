import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { deliverInbound } from "@/lib/platform/inbound-delivery.server";
import { verifyVantSync } from "@/lib/platform/vant-sync.server";
import { newId } from "@/lib/utils";

async function handle(request: Request) {
  const raw = await request.text();
  const auth = await verifyVantSync(request, raw);
  if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
  let body: Record<string, unknown> = {};
  try {
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const name = String(body.playerName ?? body.nombre ?? "Jugador");
  const discord = String(body.discordUsername ?? body.discord ?? "");
  const message = String(body.message ?? body.mensaje ?? "Postulación Discord");
  const sql = await getSql();
  const id = newId();
  await sql`
    insert into tryout_applications (id, gamertag, discord_username, role, game, note, status)
    values (
      ${id},
      ${name},
      ${discord || "discord"},
      ${String(body.role ?? "Por confirmar")},
      ${String(body.rank ?? "Valorant")},
      ${message},
      'new'
    )
  `;
  await deliverInbound({
    kind: "application",
    name,
    email: String(body.contact || "discord@vant.ltd"),
    subject: "Postulación Discord",
    message,
    source: "discord-bot",
    discord,
    extra: {
      discordMessageId: body.discordMessageId,
      applicationId: body.applicationId ?? id,
      role: body.role,
      rank: body.rank,
    },
  });
  return Response.json({ id, publicLookupNumber: id.slice(0, 8) });
}

export const Route = createFileRoute("/api/vant/applications")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
    },
  },
});
