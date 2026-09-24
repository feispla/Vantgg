import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/crypto-CHRFo8dF.js
function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}
function randomToken(bytes = 32) {
	return randomBytes(bytes).toString("hex");
}
function ticketCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = randomBytes(6);
	let out = "";
	for (let i = 0; i < 6; i++) out += alphabet[bytes[i] % 32];
	return `VANT-${out}`;
}
//#endregion
export { sha256 as n, ticketCode as r, randomToken as t };
