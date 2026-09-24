import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/steps-DdqwEdzS.js
var import_jsx_runtime = require_jsx_runtime();
function Steps({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid grid-cols-4 gap-2",
		children: [
			"Cuenta",
			"Ticket",
			"Pago",
			"Confirmación"
		].map((label, i) => {
			const n = i + 1;
			const active = n <= step;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-auto h-1.5 rounded-full", active ? "bg-accent shadow-[0_0_12px_rgba(168,85,247,0.7)]" : "bg-line") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-2 font-mono text-[9px] uppercase tracking-[0.14em]", active ? "text-fg" : "text-subtle"),
					children: [
						"0",
						n,
						" ",
						label
					]
				})]
			}, label);
		})
	});
}
//#endregion
export { Steps as t };
