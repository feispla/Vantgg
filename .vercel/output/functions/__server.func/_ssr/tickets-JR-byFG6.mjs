import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TICKET_PRODUCTS } from "./avatar-DYTTtK-m.mjs";
import { w as Check } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants, y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { t as getCommerceStatus } from "./commerce-BkEjZ3VT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tickets-JR-byFG6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TicketsPage() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [stripeMsg, setStripeMsg] = (0, import_react.useState)(null);
	const signedIn = !isPending && user && !user.isDevFallback;
	(0, import_react.useEffect)(() => {
		getCommerceStatus().then((s) => setStripeMsg(s.configured ? s.message : s.message)).catch(() => setStripeMsg(null));
	}, []);
	function buy(id) {
		if (isPending) return;
		if (!signedIn) {
			navigate({
				to: "/login",
				search: { next: `/checkout/${id}` }
			});
			return;
		}
		navigate({
			to: "/checkout/$productId",
			params: { productId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Tickets"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "VANT BASIC · PRO · ELITE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "El pago se confirma por webhook de Stripe, no por el redirect del navegador. PayPal aparece en Checkout si está activo en tu cuenta Stripe."
			}),
			stripeMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-cyan",
				children: stripeMsg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 lg:grid-cols-3",
				children: TICKET_PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("glass-card flex flex-col rounded-3xl p-6", p.featured && "glow-violet border-accent/40"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
							children: [
								p.code,
								" · ",
								p.available ? "Disponible" : "Agotado"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-3xl font-semibold",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: p.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 font-display text-4xl font-semibold tabular-nums",
							children: [p.priceLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-mono text-xs uppercase text-subtle",
								children: p.priceHint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 flex-1 space-y-2",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 text-cyan" }), f]
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !p.available,
							onClick: () => buy(p.id),
							className: cn(buttonVariants({ variant: p.featured ? "primary" : "ghost" }), "mt-8 w-full"),
							children: "Comprar"
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-subtle",
				children: [
					"Membresías Operator / Command siguen en",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pricing",
						className: "text-fg underline",
						children: "/pricing"
					}),
					"."
				]
			})
		]
	});
}
//#endregion
export { TicketsPage as component };
