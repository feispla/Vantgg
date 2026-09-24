import { env } from "@/lib/env.server";
import { fetchWithTimeout } from "@/lib/platform/http";

const SUPABASE_URL = env("SUPABASE_URL") ?? "https://qrpknnhnflavmwkwrufs.supabase.co";
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY") ?? env("SUPABASE_ANON_KEY");

export const SUPABASE_PROJECT = {
  url: SUPABASE_URL,
  ref: "qrpknnhnflavmwkwrufs",
  name: "VantcallXgrok | VANT Platform",
};

export function supabaseConfigured() {
  return Boolean(SERVICE_KEY && SERVICE_KEY.startsWith("eyJ"));
}

export async function supabaseInsert(table: string, row: Record<string, unknown>) {
  if (!supabaseConfigured() || !SERVICE_KEY) {
    return { ok: false as const, skipped: true as const, error: "missing_key" };
  }
  try {
    const res = await fetchWithTimeout(
      `${SUPABASE_URL}/rest/v1/${table}`,
      {
        method: "POST",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      },
      2500,
    );
    if (!res.ok) {
      const text = await res.text();
      return { ok: false as const, skipped: false as const, error: `supabase ${res.status} ${text.slice(0, 180)}` };
    }
    return { ok: true as const, skipped: false as const };
  } catch (err) {
    return {
      ok: false as const, skipped: false as const,
      error: err instanceof Error ? err.message : "supabase_failed",
    };
  }
}
