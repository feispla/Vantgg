import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants, o as Route$15 } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.cancel-5UmobBgD.js
var import_jsx_runtime = require_jsx_runtime();
function CancelPage() {
	const { product } = Route$15.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-warn",
				children: "Pago"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "El pago no fue completado."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Nada se ha cobrado. Puedes intentarlo de nuevo cuando quieras."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout/$productId",
						params: { productId: product },
						className: buttonVariants(),
						children: "Intentar nuevamente"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tickets",
						className: cn(buttonVariants({ variant: "ghost" })),
						children: "Volver a tickets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						className: cn(buttonVariants({ variant: "quiet" })),
						children: "Contactar soporte"
					})
				]
			})
		]
	});
}
//#endregion
export { CancelPage as component };
