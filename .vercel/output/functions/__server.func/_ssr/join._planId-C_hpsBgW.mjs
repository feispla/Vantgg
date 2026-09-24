import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { o as STRIPE_ACCOUNT, r as OPS_EMAIL, s as planById } from "./plans-BL2SEEb7.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as ShieldCheck } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants, i as Route$13, y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { i as startCheckout, t as getCommerceStatus } from "./commerce-BkEjZ3VT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join._planId-C_hpsBgW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JoinPlan() {
	const { planId } = Route$13.useParams();
	const plan = planById(planId);
	const { user, isPending } = useCurrentUserState();
	const signedIn = !isPending && user && !user.isDevFallback;
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [stripe, setStripe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCommerceStatus().then(setStripe).catch(() => setStripe(null));
	}, []);
	if (!plan || plan.id === "scout") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Plan no encontrado"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/pricing",
			className: cn(buttonVariants({ variant: "ghost" }), "mt-8"),
			children: "Ver planes"
		})]
	});
	const selected = plan;
	async function pay() {
		if (!signedIn) {
			navigate({
				to: "/login",
				search: { next: `/join/${selected.id}` }
			});
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const res = await startCheckout({ data: { productId: selected.id } });
			window.location.assign(res.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo abrir Stripe.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: ["Checkout / ", plan.code]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: plan.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-muted",
				children: plan.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 font-display text-5xl font-semibold tabular-nums",
				children: [plan.priceLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-3 font-mono text-sm uppercase tracking-[0.14em] text-subtle",
					children: plan.priceHint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-3 text-sm text-fg",
				children: plan.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "border-b border-line py-3",
					children: feature
				}, feature))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "glass-card rounded-3xl p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-ok" }),
						"Pago seguro · ",
						STRIPE_ACCOUNT,
						" · EUR"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm leading-6 text-muted",
					children: "Stripe Checkout oficial. El cobro se confirma por webhook. PayPal solo si está activo en Stripe."
				}),
				stripe && !stripe.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-warn",
					children: stripe.message
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy || stripe?.configured === false,
					onClick: () => void pay(),
					className: cn(buttonVariants({ size: "lg" }), "mt-8 w-full"),
					children: busy ? "Abriendo Stripe…" : `Pagar ${plan.priceLabel} con Stripe`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `mailto:${OPS_EMAIL}?subject=${encodeURIComponent("VANT " + plan.name)}`,
					className: "mt-6 block text-center text-xs text-subtle underline",
					children: "¿Empresa? Pedir invoice"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/legal/$slug",
					params: { slug: "reembolsos" },
					className: "mt-3 block text-center text-xs text-subtle underline",
					children: "Términos y reembolsos"
				})
			]
		})]
	});
}
//#endregion
export { JoinPlan as component };
