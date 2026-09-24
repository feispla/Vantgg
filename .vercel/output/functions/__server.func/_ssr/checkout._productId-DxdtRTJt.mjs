import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as productById } from "./avatar-DYTTtK-m.mjs";
import { _ as buttonVariants, g as Button, s as Route$16, v as useCurrentUser } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { t as Steps } from "./steps-DdqwEdzS.mjs";
import { i as startCheckout, t as getCommerceStatus } from "./commerce-BkEjZ3VT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout._productId-DxdtRTJt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutBody, {}) });
}
function CheckoutBody() {
	const { productId } = Route$16.useParams();
	const product = productById(productId);
	const user = useCurrentUser();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [stripe, setStripe] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getCommerceStatus().then(setStripe).catch(() => setStripe(null));
	}, []);
	if (!product || !product.available) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Producto no disponible"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/tickets",
			className: cn(buttonVariants({ variant: "ghost" }), "mt-6"),
			children: "Volver a tickets"
		})]
	});
	const item = product;
	async function pay() {
		setBusy(true);
		setError(null);
		try {
			const res = await startCheckout({ data: { productId: item.id } });
			window.location.assign(res.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo abrir Stripe.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { step: 3 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-semibold",
				children: product.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: product.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "glass-card mt-8 space-y-4 rounded-2xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "01 Cuenta · "
						}), user?.primaryEmail ?? user?.displayName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: "02 Ticket · "
							}),
							product.name,
							" · ",
							product.priceLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: "03 Pago · "
							}),
							"Stripe Checkout (tarjeta",
							stripe?.paypal ? " + PayPal" : "",
							")"
						]
					})
				]
			}),
			stripe && !stripe.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 rounded-2xl border border-warn/40 bg-warn/10 p-4 text-sm text-warn",
				children: stripe.message
			}) : null,
			stripe?.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-cyan",
				children: stripe.paypal ? "Pagar con PayPal está disponible dentro de Stripe Checkout, junto a tarjeta." : stripe.paypalMessage
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || stripe?.configured === false,
						onClick: () => void pay(),
						children: busy ? "Abriendo Stripe…" : "Pagar de forma segura"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/tickets",
						className: buttonVariants({ variant: "ghost" }),
						children: "Volver"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/support",
						className: buttonVariants({ variant: "quiet" }),
						children: "Contactar soporte"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-6 text-xs text-subtle underline",
				onClick: () => navigate({ to: "/login" }),
				children: "Cambiar de cuenta"
			})
		]
	});
}
//#endregion
export { CheckoutPage as component };
