import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env.server";
import { getSql } from "@/lib/db";
import { randomToken } from "@/lib/platform/crypto";

function syncSecret() {
  return env("VANT_BOT_SYNC_SECRET") ?? env("CROSAIM_BOT_SYNC_SECRET") ?? "";
}

function header(request: Request, name: string) {
  return request.headers.get(name) ?? request.headers.get(name.replace("vant", "crosaim")) ?? "";
}

export async function verifyVantSync(request: Request, rawBody: string) {
  const secret = syncSecret();
  const provided = header(request, "x-vant-sync-secret");
  if (!secret) {
    return { ok: false as const, error: "sync_secret_unconfigured" };
  }
  if (!provided || provided.length !== secret.length) {
    return { ok: false as const, error: "unauthorized" };
  }
  if (!timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) {
    return { ok: false as const, error: "unauthorized" };
  }

  const required = (env("VANT_SIGNED_SYNC_REQUIRED") ?? env("CROSAIM_SIGNED_SYNC_REQUIRED") ?? "true") !== "false";
  if (!required) return { ok: true as const };

  const timestamp = header(request, "x-vant-sync-timestamp");
  const nonce = header(request, "x-vant-sync-nonce");
  const bodyHash = header(request, "x-vant-sync-body-sha256");
  const signature = header(request, "x-vant-sync-signature");
  if (!timestamp || !nonce || !bodyHash || !signature) {
    return { ok: false as const, error: "missing_signature" };
  }
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60 * 1000) {
    return { ok: false as const, error: "stale_timestamp" };
  }
  const expectedHash = createHash("sha256").update(rawBody).digest("hex");
  if (expectedHash !== bodyHash) return { ok: false as const, error: "body_hash_mismatch" };

  const url = new URL(request.url);
  const payload = [request.method.toUpperCase(), url.pathname, timestamp, nonce, bodyHash].join("\n");
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return { ok: false as const, error: "bad_signature" };
  }
  return { ok: true as const };
}

export async function enqueueSyncEvent(input: {
  eventType: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
}) {
  const sql = await getSql();
  const body = JSON.stringify(input.payload);
  await sql`
    insert into vant_sync_events (event_type, idempotency_key, payload, status)
    values (${input.eventType}, ${input.idempotencyKey}, ${body}, 'pending')
    on conflict (idempotency_key) do nothing
  `;
}

export async function leasePendingEvents(limit = 8) {
  const sql = await getSql();
  const token = randomToken(16);
  const rows = await sql<{
    id: number;
    event_type: string;
    payload: string;
    attempts: number;
  }>`
    select id, event_type, payload, attempts
    from vant_sync_events
    where status in ('pending', 'failed')
      and (lease_until is null or lease_until < now())
    order by created_at asc
    limit ${limit}
  `;
  const events = [];
  for (const row of rows) {
    const until = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    await sql`
      update vant_sync_events
      set status = 'processing',
          attempts = attempts + 1,
          lease_token = ${token},
          lease_until = ${until}
      where id = ${row.id}
    `;
    events.push({
      id: Number(row.id),
      eventType: row.event_type,
      payload: JSON.parse(row.payload) as Record<string, unknown>,
      leaseToken: token,
    });
  }
  return events;
}

export async function ackEvent(id: number, leaseToken: string, ok: boolean, error?: string) {
  const sql = await getSql();
  const rows = await sql<{ id: number; lease_token: string | null }>`
    select id, lease_token from vant_sync_events where id = ${id} limit 1
  `;
  const row = rows[0];
  if (!row || row.lease_token !== leaseToken) {
    return { ok: false as const, error: "lease_mismatch" };
  }
  if (ok) {
    await sql`
      update vant_sync_events
      set status = 'delivered', delivered_at = now(), last_error = null, lease_token = null, lease_until = null
      where id = ${id}
    `;
  } else {
    await sql`
      update vant_sync_events
      set status = 'failed', last_error = ${error ?? "delivery_failed"}, lease_token = null, lease_until = null
      where id = ${id}
    `;
  }
  return { ok: true as const };
}
