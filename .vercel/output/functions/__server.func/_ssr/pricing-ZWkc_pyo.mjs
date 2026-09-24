import { a as PLANS, o as STRIPE_ACCOUNT } from "./plans-BL2SEEb7.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as STRIPE_LIVE } from "./stripe-status-D-H8hWY7.mjs";
import { t as PlanCard } from "./plan-card-BZsQDfq4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-ZWkc_pyo.js
var import_jsx_runtime = require_jsx_runtime();
function PricingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "04 / Planes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl",
				children: "Entra. Opera. Cobra."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 max-w-2xl text-base leading-7 text-muted",
				children: [
					"Precios en EUR. Cobro live con Stripe (",
					STRIPE_ACCOUNT,
					" · cuenta ",
					STRIPE_LIVE.account,
					"). Cancela Operator o Command cuando quieras. Founding Mark no se duplica."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ok",
				children: [
					STRIPE_LIVE.products,
					" productos live · ",
					STRIPE_LIVE.customers,
					" clientes · sync ",
					STRIPE_LIVE.syncedAt
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: PLANS.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, { plan }, plan.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 text-sm text-muted",
				children: [
					"Reembolsos y cancelación en",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/legal/$slug",
						params: { slug: "reembolsos" },
						className: "text-fg underline",
						children: "/legal/reembolsos"
					}),
					"."
				]
			})
		]
	});
}
//#endregion
export { PricingPage as component };
