import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as avatarDataUrl } from "./avatar-DYTTtK-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/player-avatar-CasQNDH6.js
var import_jsx_runtime = require_jsx_runtime();
function PlayerAvatar({ src, name, seed, size = 64, className }) {
	const url = src && src.length > 8 ? src : avatarDataUrl(seed || name || "vant");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: name,
		width: size,
		height: size,
		className: cn("rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-white/10", className),
		style: {
			width: size,
			height: size
		}
	});
}
//#endregion
export { PlayerAvatar as t };
