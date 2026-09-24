import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/success-Cjb8RNL2.js
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-cyan",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-[-0.04em]",
				children: "Vuelve a la confirmación"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: "El estado real del pago está en /checkout/success con el session_id de Stripe. Esta pantalla no marca un pago como cobrado."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/my-tickets",
					className: buttonVariants(),
					children: "Ver mis tickets"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: cn(buttonVariants({ variant: "ghost" })),
					children: "Dashboard"
				})]
			})
		]
	});
}
//#endregion
export { SuccessPage as component };
