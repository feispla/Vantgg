import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/error-DTZ0TztX.js
var import_jsx_runtime = require_jsx_runtime();
function ErrorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-magenta",
				children: "Error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Algo no ha ido bien"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Puedes reintentar o escribir a soporte. El mensaje técnico se muestra si la app lo reporta."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: buttonVariants(),
					children: "Volver a VANT"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/support",
					className: buttonVariants({ variant: "ghost" }),
					children: "Soporte"
				})]
			})
		]
	});
}
//#endregion
export { ErrorPage as component };
