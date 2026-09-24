import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { hitRateLimit } from "@/lib/platform/rate-limit";
import { newId } from "@/lib/utils";

const CATEGORIES = ["Pago", "Login", "Ticket", "Verificación", "Torneo", "Ranked", "Otro"] as const;

export const submitSupport = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().email(),
      category: z.enum(CATEGORIES),
      purchaseId: z.string().trim().max(80).optional(),
      message: z.string().trim().min(10).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const limited = await hitRateLimit(`support:${data.email.toLowerCase()}`, 8, 60 * 60 * 1000);
    if (!limited.ok) throw new Error("Demasiados mensajes. Espera un poco.");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const session = await getSessionUser();
    const sql = await getSql();
    const id = newId();
    await sql`
      insert into support_tickets (id, user_id, name, email, category, purchase_id, message)
      values (
        ${id},
        ${session?.id ?? null},
        ${data.name},
        ${data.email},
        ${data.category},
        ${data.purchaseId || null},
        ${data.message}
      )
    `;
    const { deliverInbound } = await import("@/lib/platform/inbound-delivery.server");
    await deliverInbound({
      kind: "support",
      name: data.name,
      email: data.email,
      subject: `Soporte · ${data.category}`,
      message: data.purchaseId ? `${data.message}\n\nCompra: ${data.purchaseId}` : data.message,
      source: "support",
      extra: { category: data.category, userId: session?.id ?? null },
    });
    return { id };
  });

export { CATEGORIES as SUPPORT_CATEGORIES };
