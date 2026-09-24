//#region node_modules/.nitro/vite/services/ssr/assets/app-url-D20KWGKr.js
function readEnv(key) {
	if (typeof process === "undefined") return void 0;
	return process.env[key]?.trim() || void 0;
}
function getAppUrl(request) {
	const fromEnv = readEnv("APP_URL") ?? readEnv("NEXT_PUBLIC_APP_URL") ?? readEnv("BETTER_AUTH_URL") ?? readEnv("VITE_APP_URL");
	if (fromEnv) return fromEnv.replace(/\/+$/, "");
	if (request) {
		const url = new URL(request.url);
		const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
		const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
		if (host) return `${proto}://${host}`;
	}
	return "http://127.0.0.1:8080";
}
//#endregion
export { getAppUrl as t };
