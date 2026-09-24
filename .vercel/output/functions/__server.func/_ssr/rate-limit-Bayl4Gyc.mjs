import { r as getSql } from "./db-B12kHszo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rate-limit-Bayl4Gyc.js
async function hitRateLimit(key, limit, windowMs) {
	const sql = await getSql();
	const now = Date.now();
	const row = (await sql`
    select hits, window_start from rate_limits where key = ${key} limit 1
  `)[0];
	if (!row) {
		await sql`insert into rate_limits (key, hits, window_start) values (${key}, 1, now())`;
		return {
			ok: true,
			remaining: limit - 1
		};
	}
	if (now - new Date(row.window_start).getTime() > windowMs) {
		await sql`update rate_limits set hits = 1, window_start = now() where key = ${key}`;
		return {
			ok: true,
			remaining: limit - 1
		};
	}
	if (row.hits >= limit) return {
		ok: false,
		remaining: 0
	};
	await sql`update rate_limits set hits = hits + 1 where key = ${key}`;
	return {
		ok: true,
		remaining: limit - row.hits - 1
	};
}
//#endregion
export { hitRateLimit as t };
