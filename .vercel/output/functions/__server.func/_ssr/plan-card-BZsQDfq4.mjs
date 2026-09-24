import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ArrowUpRight, w as Check } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plan-card-BZsQDfq4.js
var import_jsx_runtime = require_jsx_runtime();
function PlanCard({ plan }) {
	const ctaClass = cn(buttonVariants({ variant: plan.featured ? "primary" : "ghost" }), "mt-8 w-full");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("flex flex-col border border-line bg-surface p-6 sm:p-7", plan.featured && "border-accent/70 bg-accent/5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
					children: [
						plan.code,
						" / ",
						plan.name
					]
				}), plan.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.14em] text-accent",
					children: "Recomendado"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-5 font-display text-3xl font-semibold tracking-[-0.04em]",
				children: plan.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted",
				children: plan.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-4xl font-semibold tracking-[-0.05em] tabular-nums",
					children: plan.priceLabel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
					children: plan.priceHint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex flex-1 flex-col gap-3",
				children: plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-2 text-sm text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), feature]
				}, feature))
			}),
			plan.id === "scout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/apply",
				className: ctaClass,
				children: [plan.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/join/$planId",
				params: { planId: plan.id },
				className: ctaClass,
				children: [plan.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
			})
		]
	});
}
//#endregion
export { PlanCard as t };
