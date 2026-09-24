import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/section-kicker-DjHSDR3a.js
var import_jsx_runtime = require_jsx_runtime();
function SectionKicker({ code, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-accent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-accent/60" }),
			label
		]
	});
}
//#endregion
export { SectionKicker as t };
