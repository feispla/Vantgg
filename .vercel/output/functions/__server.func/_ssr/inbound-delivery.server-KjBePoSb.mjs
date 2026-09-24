import { n as newId } from "./utils-DG8erAqy.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { t as env } from "./env.server-wS9zOhV6.mjs";
import { i as settleWithin, n as fetchWithTimeout, r as queueEmail } from "./email.server-DO3567x7.mjs";
import { t as randomToken } from "./crypto-CHRFo8dF.mjs";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/inbound-delivery.server-KjBePoSb.js
var SUPABASE_URL = env("SUPABASE_URL") ?? "https://qrpknnhnflavmwkwrufs.supabase.co";
var SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY") ?? env("SUPABASE_ANON_KEY");
function supabaseConfigured() {
	return Boolean(SERVICE_KEY && SERVICE_KEY.startsWith("eyJ"));
}
async function supabaseInsert(table, row) {
	if (!supabaseConfigured() || !SERVICE_KEY) return {
		ok: false,
		skipped: true,
		error: "missing_key"
	};
	try {
		const res = await fetchWithTimeout(`${SUPABASE_URL}/rest/v1/${table}`, {
			method: "POST",
			headers: {
				apikey: SERVICE_KEY,
				Authorization: `Bearer ${SERVICE_KEY}`,
				"Content-Type": "application/json",
				Prefer: "return=minimal"
			},
			body: JSON.stringify(row)
		}, 2500);
		if (!res.ok) {
			const text = await res.text();
			return {
				ok: false,
				skipped: false,
				error: `supabase ${res.status} ${text.slice(0, 180)}`
			};
		}
		return {
			ok: true,
			skipped: false
		};
	} catch (err) {
		return {
			ok: false,
			skipped: false,
			error: err instanceof Error ? err.message : "supabase_failed"
		};
	}
}
function syncSecret() {
	return env("VANT_BOT_SYNC_SECRET") ?? env("CROSAIM_BOT_SYNC_SECRET") ?? "";
}
function header(request, name) {
	return request.headers.get(name) ?? request.headers.get(name.replace("vant", "crosaim")) ?? "";
}
async function verifyVantSync(request, rawBody) {
	const secret = syncSecret();
	const provided = header(request, "x-vant-sync-secret");
	if (!secret) return {
		ok: false,
		error: "sync_secret_unconfigured"
	};
	if (!provided || provided.length !== secret.length) return {
		ok: false,
		error: "unauthorized"
	};
	if (!timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) return {
		ok: false,
		error: "unauthorized"
	};
	if (!((env("VANT_SIGNED_SYNC_REQUIRED") ?? env("CROSAIM_SIGNED_SYNC_REQUIRED") ?? "true") !== "false")) return { ok: true };
	const timestamp = header(request, "x-vant-sync-timestamp");
	const nonce = header(request, "x-vant-sync-nonce");
	const bodyHash = header(request, "x-vant-sync-body-sha256");
	const signature = header(request, "x-vant-sync-signature");
	if (!timestamp || !nonce || !bodyHash || !signature) return {
		ok: false,
		error: "missing_signature"
	};
	const ts = Number(timestamp);
	if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 3e5) return {
		ok: false,
		error: "stale_timestamp"
	};
	if (createHash("sha256").update(rawBody).digest("hex") !== bodyHash) return {
		ok: false,
		error: "body_hash_mismatch"
	};
	const url = new URL(request.url);
	const payload = [
		request.method.toUpperCase(),
		url.pathname,
		timestamp,
		nonce,
		bodyHash
	].join("\n");
	const expected = createHmac("sha256", secret).update(payload).digest("hex");
	if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return {
		ok: false,
		error: "bad_signature"
	};
	return { ok: true };
}
async function enqueueSyncEvent(input) {
	const sql = await getSql();
	const body = JSON.stringify(input.payload);
	await sql`
    insert into vant_sync_events (event_type, idempotency_key, payload, status)
    values (${input.eventType}, ${input.idempotencyKey}, ${body}, 'pending')
    on conflict (idempotency_key) do nothing
  `;
}
async function leasePendingEvents(limit = 8) {
	const sql = await getSql();
	const token = randomToken(16);
	const rows = await sql`
    select id, event_type, payload, attempts
    from vant_sync_events
    where status in ('pending', 'failed')
      and (lease_until is null or lease_until < now())
    order by created_at asc
    limit ${limit}
  `;
	const events = [];
	for (const row of rows) {
		await sql`
      update vant_sync_events
      set status = 'processing',
          attempts = attempts + 1,
          lease_token = ${token},
          lease_until = ${new Date(Date.now() + 12e4).toISOString()}
      where id = ${row.id}
    `;
		events.push({
			id: Number(row.id),
			eventType: row.event_type,
			payload: JSON.parse(row.payload),
			leaseToken: token
		});
	}
	return events;
}
async function ackEvent(id, leaseToken, ok, error) {
	const sql = await getSql();
	const row = (await sql`
    select id, lease_token from vant_sync_events where id = ${id} limit 1
  `)[0];
	if (!row || row.lease_token !== leaseToken) return {
		ok: false,
		error: "lease_mismatch"
	};
	if (ok) await sql`
      update vant_sync_events
      set status = 'delivered', delivered_at = now(), last_error = null, lease_token = null, lease_until = null
      where id = ${id}
    `;
	else await sql`
      update vant_sync_events
      set status = 'failed', last_error = ${error ?? "delivery_failed"}, lease_token = null, lease_until = null
      where id = ${id}
    `;
	return { ok: true };
}
var inbound_delivery_server_exports = /* @__PURE__ */ __exportAll({
	CONTACT_INBOX: () => CONTACT_INBOX,
	deliverInbound: () => deliverInbound
});
var CONTACT_INBOX = "feispla@hotmail.com";
async function deliverInbound(input) {
	const id = newId();
	const sql = await getSql();
	const payload = {
		playerName: input.name,
		contact: input.email,
		discordUsername: input.discord ?? "",
		discordUserId: "",
		role: typeof input.extra?.role === "string" ? input.extra.role : "",
		rank: typeof input.extra?.rank === "string" ? input.extra.rank : "",
		region: typeof input.extra?.region === "string" ? input.extra.region : "",
		bio: input.message,
		source: input.source,
		subject: input.subject ?? "",
		kind: input.kind,
		...input.extra
	};
	await sql`
    insert into contact_leads (id, name, email, subject, message, source, discord_username, payload)
    values (
      ${id},
      ${input.name},
      ${input.email},
      ${input.subject ?? null},
      ${input.message},
      ${input.source},
      ${input.discord ?? null},
      ${JSON.stringify(payload)}
    )
  `;
	const eventType = input.kind === "application" ? "application_submitted" : "profile_updated";
	const text = [
		`Origen: ${input.source}`,
		`Nombre: ${input.name}`,
		`Email: ${input.email}`,
		"",
		input.message
	].join("\n");
	const subject = input.subject ?? `VANT · ${input.source}`;
	try {
		await enqueueSyncEvent({
			eventType,
			idempotencyKey: `${input.kind}:${id}:submitted`,
			payload
		});
	} catch {}
	try {
		await queueEmail({
			to: CONTACT_INBOX,
			template: "inbound",
			body: text
		});
	} catch {}
	const webhook = env("DISCORD_WEBHOOK_URL");
	await settleWithin(Promise.allSettled([
		supabaseInsert("discord_events", {
			event_type: eventType,
			idempotency_key: `${input.kind}:${id}:submitted`,
			payload,
			status: "pending"
		}),
		input.kind === "application" ? supabaseInsert("postulaciones", {
			nombre: input.name,
			discord_username: input.discord ?? null,
			descripcion: input.message,
			estado: "POSTULACIÓN",
			payload_original: payload
		}) : Promise.resolve(null),
		webhook ? fetchWithTimeout(webhook, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content: [
				input.kind === "application" ? "**Nueva postulación VANTCALL**" : "**Nuevo formulario VANT**",
				`**Nombre:** ${input.name}`,
				`**Email:** ${input.email}`,
				input.discord ? `**Discord:** ${input.discord}` : "",
				`**Asunto:** ${subject}`,
				input.message
			].filter(Boolean).join("\n") })
		}, 2500) : Promise.resolve(null),
		fetchWithTimeout("https://formsubmit.co/ajax/" + CONTACT_INBOX, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				_subject: subject,
				name: input.name,
				email: input.email,
				message: text,
				source: input.source
			})
		}, 2500).catch(() => null)
	]), 3500);
	return { id };
}
//#endregion
export { verifyVantSync as a, leasePendingEvents as i, inbound_delivery_server_exports as n, ackEvent as r, deliverInbound as t };
