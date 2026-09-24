import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
import { t as STRIPE_LIVE } from "./stripe-status-D-H8hWY7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/founders-Gh5PkqHE.js
var import_jsx_runtime = require_jsx_runtime();
function FoundersPage() {
	const remaining = Math.max(0, 50 - STRIPE_LIVE.foundingSold);
	const slots = Array.from({ length: 24 }, (_, i) => i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "11 / Founding wall"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "El muro está vacío a propósito."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: [
					"Stripe live reporta ",
					STRIPE_LIVE.foundingSold,
					" Founding Marks cobradas. Quedan ",
					remaining,
					" de ",
					50,
					". El primer nombre no se inventa: se paga."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid grid-cols-3 gap-px bg-line sm:grid-cols-4 md:grid-cols-6",
				children: slots.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex aspect-square flex-col items-center justify-center bg-bg p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] text-subtle",
						children: String(i + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-line",
						children: "vacant"
					})]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
				children: [
					"Mostrando 24 de ",
					50,
					" · el resto se revela al cobro"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/join/$planId",
				params: { planId: "founding" },
				className: cn(buttonVariants({ size: "lg" }), "mt-10"),
				children: "Tomar la marca 01"
			})
		]
	});
}
//#endregion
export { FoundersPage as component };
