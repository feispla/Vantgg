import { r as getSql } from "./db-B12kHszo.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as newAvatarSeed, i as isAvatarUrl, r as avatarDataUrl } from "./avatar-DYTTtK-m.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profiles-D-Lv5pW_.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function persistAvatar(userId, avatar) {
	const sql = await getSql();
	await sql`
    update profiles set avatar_url = ${avatar}, updated_at = now() where user_id = ${userId}
  `;
	await sql`
    update "user" set image = ${avatar} where id = ${userId}
  `;
}
async function ensureProfile(userId, seed) {
	const sql = await getSql();
	const existing = await sql`select * from profiles where user_id = ${userId} limit 1`;
	if (existing[0]) {
		if (!existing[0].avatar_url) {
			const generated = seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(userId);
			await persistAvatar(userId, generated);
			existing[0].avatar_url = generated;
		}
		return existing[0];
	}
	const display = seed?.name ?? null;
	const username = display ? display.toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 16) || null : null;
	const avatar = seed?.image && isAvatarUrl(seed.image) ? seed.image : avatarDataUrl(`${userId}:${newAvatarSeed()}`);
	await sql`
    insert into profiles (user_id, username, display_name, avatar_url)
    values (${userId}, ${username}, ${display}, ${avatar})
    on conflict (user_id) do nothing
  `;
	await sql`
    update "user" set image = coalesce(image, ${avatar}) where id = ${userId}
  `;
	return (await sql`select * from profiles where user_id = ${userId} limit 1`)[0];
}
var getMyAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("deb3a2d4496fca2e82878f5aff1c93434ca03e1d92443fc0072d8658352010b3"));
var profileSchema = object({
	displayName: string().trim().min(2).max(60),
	username: string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
	country: string().trim().min(2).max(40)
});
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(profileSchema).handler(createSsrRpc("af0f64d23fee3b242de735a28a4fd49e4fd36c8174f2edd304331bd0af64f763"));
var updateMyAvatar = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ avatarUrl: string().min(24).max(18e4) })).handler(createSsrRpc("1901095251ff239f8285ffb4744e9bab5fdeb5922965b0aba15ce23ca448d7cf"));
var rerollMyAvatar = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("86363557105de8797960e854ddac0b263e9ef9e01106f93a1293aea51fa8e45d"));
var listPublicPlayers = createServerFn({ method: "GET" }).handler(createSsrRpc("1fa8a9906c72f4a50b48fdcdb290a726a0d0aa9f6eb4095960360e3c5da6dc69"));
var getPublicPlayer = createServerFn({ method: "GET" }).validator(object({ username: string().trim().min(2).max(20) })).handler(createSsrRpc("a6f167651d03b3e38721a8594ae6e224afcba8693ec08bd2571bf8fec4f5d160"));
var requestEmailVerification = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("11c6d0549c71671718ee536cfaa7ed30163331642c3e320556579744f1694777"));
var confirmEmailToken = createServerFn({ method: "POST" }).validator(object({ token: string().min(16) })).handler(createSsrRpc("fa1d5328f8b8eec12ffe895e2d4f65b8e570d25ad58af71bd29b296a15cbceeb"));
var requestPasswordReset = createServerFn({ method: "POST" }).validator(object({ email: string().trim().email() })).handler(createSsrRpc("acfbb6a9867654bc78f8e1b5a0a83b7200b77b7f078c7f25dc2d0ea44e16d720"));
var resetPasswordWithToken = createServerFn({ method: "POST" }).validator(object({
	token: string().min(16),
	password: string().min(8).max(128)
})).handler(createSsrRpc("55b1b1f36c46fae1275017a6b6f845de2e8439e5a940cd26ecfcde655d3990f4"));
var completeRegistration = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	username: string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
	country: string().trim().min(2).max(40),
	displayName: string().trim().min(2).max(60)
})).handler(createSsrRpc("516284c55788431ae8c2fbd52335493fc98812a0eeb83cc739f8dc48ee786302"));
var getVerificationPreview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a19fb881fa295077d8f467a3c326b5c8f7ad59fc6d974e9909ae77a50f3a0823"));
var requestKycReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ note: string().trim().max(500).optional() })).handler(createSsrRpc("431bc9d5fc46497de97f6406b9b73cb4b7ef0a876f0ad389befdd1cb5f1f6527"));
//#endregion
export { getMyAccount as a, listPublicPlayers as c, requestPasswordReset as d, rerollMyAvatar as f, updateMyProfile as h, ensureProfile as i, requestEmailVerification as l, updateMyAvatar as m, confirmEmailToken as n, getPublicPlayer as o, resetPasswordWithToken as p, createSsrRpc as r, getVerificationPreview as s, completeRegistration as t, requestKycReview as u };
