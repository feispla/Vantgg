import { getSql } from "@/lib/db";
import { env } from "@/lib/env.server";
import { fetchWithTimeout } from "@/lib/platform/http";
import { newId } from "@/lib/utils";

export type EmailTemplate =
  | "register"
  | "verify"
  | "reset"
  | "purchase"
  | "ticket"
  | "tournament"
  | "inbound";

const SUBJECTS: Record<EmailTemplate, string> = {
  register: "Bienvenido a VANT",
  verify: "Verifica tu cuenta VANT",
  reset: "Restablece tu contraseña VANT",
  purchase: "Compra confirmada — VANT",
  ticket: "Tu ticket VANT",
  tournament: "Inscripción al torneo confirmada",
  inbound: "VANT · nuevo formulario",
};

export async function queueEmail(input: {
  to: string;
  template: EmailTemplate;
  body: string;
  actionUrl?: string;
}) {
  const sql = await getSql();
  const id = newId();
  const subject = SUBJECTS[input.template];
  const apiKey = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM") ?? "VANT <noreply@vant.ltd>";
  let status: "preview" | "sent" | "queued" = "preview";
  let error: string | null = null;

  if (apiKey) {
    try {
      const res = await fetchWithTimeout(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [input.to],
            subject,
            text: input.body + (input.actionUrl ? `\n\n${input.actionUrl}` : ""),
          }),
        },
        2500,
      );
      if (!res.ok) {
        error = `Resend ${res.status}`;
        status = "queued";
      } else {
        status = "sent";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "send_failed";
      status = "queued";
    }
  }

  await sql`
    insert into email_outbox (id, to_email, template, subject, body, action_url, status, error)
    values (
      ${id},
      ${input.to},
      ${input.template},
      ${subject},
      ${input.body},
      ${input.actionUrl ?? null},
      ${status},
      ${error}
    )
  `;
  return { id, status, actionUrl: input.actionUrl ?? null, delivered: status === "sent" };
}

export async function latestPreviewLink(email: string, template: EmailTemplate) {
  const sql = await getSql();
  const rows = await sql<{ action_url: string | null; created_at: string; status: string }>`
    select action_url, created_at, status
    from email_outbox
    where to_email = ${email} and template = ${template}
    order by created_at desc
    limit 1
  `;
  return rows[0] ?? null;
}
