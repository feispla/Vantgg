/**
 * Sincronización entre la web VANT y el VantBot de Discord
 * Maneja autenticación de webhooks y comunicación bidireccional
 */
import { env } from "@/lib/env.server";
import { createHmac } from "node:crypto";

const BOT_SYNC_SECRET = env("VANT_BOT_SYNC_SECRET");
const WEB_BASE_URL = env("VANT_WEB_BASE_URL") || "http://localhost:8080";

/**
 * Verifica la firma de una solicitud del bot
 */
export function verifyBotSignature(
  request: Request,
  body: string
): { ok: boolean; error?: string } {
  if (!BOT_SYNC_SECRET) {
    return { ok: false, error: "VANT_BOT_SYNC_SECRET no configurado" };
  }

  const signature = request.headers.get("x-vant-signature");
  if (!signature) {
    return { ok: false, error: "Falta firma en el header x-vant-signature" };
  }

  const expectedSignature = createHmac("sha256", BOT_SYNC_SECRET)
    .update(body)
    .digest("hex");

  const isValid = signature === expectedSignature;
  return isValid ? { ok: true } : { ok: false, error: "Firma inválida" };
}

/**
 * Firma una solicitud de la web hacia el bot
 */
export function signBotRequest(body: string): string {
  if (!BOT_SYNC_SECRET) {
    throw new Error("VANT_BOT_SYNC_SECRET no configurado");
  }
  return createHmac("sha256", BOT_SYNC_SECRET).update(body).digest("hex");
}

/**
 * Tipos de eventos que pueden sincronizarse entre web y bot
 */
export type VantSyncEvent =
  | { type: "user.registered"; userId: string; discordId?: string; email: string }
  | { type: "user.linked_discord"; userId: string; discordId: string }
  | { type: "ticket.purchased"; userId: string; ticketCode: string; tier: string }
  | { type: "rank.updated"; userId: string; newRank: string; mmr: number }
  | { type: "tournament.created"; tournamentId: string; name: string }
  | { type: "tournament.joined"; userId: string; tournamentId: string }
  | { type: "application.submitted"; userId: string; tournamentId: string };

/**
 * Envía un evento de sincronización al bot
 */
export async function sendBotSyncEvent(event: VantSyncEvent): Promise<Response> {
  const bodyStr = JSON.stringify(event);
  const signature = signBotRequest(bodyStr);

  const response = await fetch(
    new URL("/api/vant/sync", WEB_BASE_URL),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-vant-signature": signature,
      },
      body: bodyStr,
    }
  );

  return response;
}
