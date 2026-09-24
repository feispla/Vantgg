import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { queueEmail } from "@/lib/platform/email.server";
import { fetchWithTimeout, settleWithin } from "@/lib/platform/http";
import { supabaseInsert } from "@/lib/platform/supabase.server";
import { enqueueSyncEvent } from "@/lib/platform/vant-sync.server";
import { newId } from "@/lib/utils";

export const CONTACT_INBOX = "feispla@hotmail.com";

export type InboundKind = "contact" | "application" | "support";

export async function deliverInbound(input: {
  kind: InboundKind;
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: string;
  discord?: string;
  extra?: Record<string, unknown>;
}) {
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
    ...input.extra,
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
    input.message,
  ].join("\n");
  const subject = input.subject ?? `VANT · ${input.source}`;

  try {
    await enqueueSyncEvent({
      eventType,
      idempotencyKey: `${input.kind}:${id}:submitted`,
      payload,
    });
  } catch {
    // outbox is optional
  }

  try {
    await queueEmail({
      to: CONTACT_INBOX,
      template: "inbound",
      body: text,
    });
  } catch {
    // recorded later if resend is down
  }

  const webhook = env("DISCORD_WEBHOOK_URL");
  await settleWithin(
    Promise.allSettled([
      supabaseInsert("discord_events", {
        event_type: eventType,
        idempotency_key: `${input.kind}:${id}:submitted`,
        payload,
        status: "pending",
      }),
      input.kind === "application"
        ? supabaseInsert("postulaciones", {
            nombre: input.name,
            discord_username: input.discord ?? null,
            descripcion: input.message,
            estado: "POSTULACIÓN",
            payload_original: payload,
          })
        : Promise.resolve(null),
      webhook
        ? fetchWithTimeout(
            webhook,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: [
                  input.kind === "application" ? "**Nueva postulación VANTCALL**" : "**Nuevo formulario VANT**",
                  `**Nombre:** ${input.name}`,
                  `**Email:** ${input.email}`,
                  input.discord ? `**Discord:** ${input.discord}` : "",
                  `**Asunto:** ${subject}`,
                  input.message,
                ]
                  .filter(Boolean)
                  .join("\n"),
              }),
            },
            2500,
          )
        : Promise.resolve(null),
      fetchWithTimeout(
        "https://formsubmit.co/ajax/" + CONTACT_INBOX,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: subject,
            name: input.name,
            email: input.email,
            message: text,
            source: input.source,
          }),
        },
        2500,
      ).catch(() => null),
    ]),
    3500,
  );

  return { id };
}
