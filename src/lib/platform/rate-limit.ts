import { getSql } from "@/lib/db";

export async function hitRateLimit(key: string, limit: number, windowMs: number) {
  const sql = await getSql();
  const now = Date.now();
  const rows = await sql<{ hits: number; window_start: string }>`
    select hits, window_start from rate_limits where key = ${key} limit 1
  `;
  const row = rows[0];
  if (!row) {
    await sql`insert into rate_limits (key, hits, window_start) values (${key}, 1, now())`;
    return { ok: true, remaining: limit - 1 };
  }
  const start = new Date(row.window_start).getTime();
  if (now - start > windowMs) {
    await sql`update rate_limits set hits = 1, window_start = now() where key = ${key}`;
    return { ok: true, remaining: limit - 1 };
  }
  if (row.hits >= limit) return { ok: false, remaining: 0 };
  await sql`update rate_limits set hits = hits + 1 where key = ${key}`;
  return { ok: true, remaining: limit - row.hits - 1 };
}
