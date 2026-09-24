import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hitRateLimit } from "@/lib/platform/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(8).max(4000),
  source: z.string().trim().max(40).optional(),
  discord: z.string().trim().max(80).optional(),
});

export const submitContact = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    const limited = await hitRateLimit(`contact:${data.email.toLowerCase()}`, 6, 60 * 60 * 1000);
    if (!limited.ok) throw new Error("Demasiados envíos. Espera un poco.");
    const [{ getSessionUser }, { deliverInbound }] = await Promise.all([
      import("@/lib/auth/verify.server"),
      import("@/lib/platform/inbound-delivery.server"),
    ]);
    const session = await getSessionUser();
    return deliverInbound({
      kind: "contact",
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      source: data.source ?? "contact",
      discord: data.discord,
      extra: { userId: session?.id ?? null },
    });
  });
