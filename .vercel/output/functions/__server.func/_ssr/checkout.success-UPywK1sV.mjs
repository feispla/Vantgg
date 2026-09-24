import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants, a as Route$14, v as useCurrentUser } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { t as Steps } from "./steps-DdqwEdzS.mjs";
import { n as getMyPurchaseBySession } from "./commerce-BkEjZ3VT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.success-UPywK1sV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SuccessPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {}) });
}
function Body() {
	const { session_id } = Route$14.useSearch();
	const user = useCurrentUser();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!session_id) return;
		let stop = false;
		async function poll() {
			try {
				const res = await getMyPurchaseBySession({ data: { sessionId: session_id } });
				if (stop) return;
				setData(res);
				if (res.purchase?.status === "pending") setTimeout(poll, 2e3);
			} catch (err) {
				if (!stop) setError(err instanceof Error ? err.message : "No se pudo cargar la compra.");
			}
		}
		poll();
		return () => {
			stop = true;
		};
	}, [session_id]);
	const status = data?.purchase?.status ?? "pending";
	const confirmed = status === "paid";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-xl px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, { step: 4 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-ok",
				children: confirmed ? "Pago confirmado" : "Esperando confirmación"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: confirmed ? "¡Compra confirmada!" : "Confirmando con Stripe…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "La fuente de verdad es el webhook (o la API de Stripe en el servidor). El redirect solo abre esta pantalla."
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 space-y-3 text-left text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Nombre",
						v: user?.displayName ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Producto",
						v: data?.product?.name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Ticket",
						v: data?.ticket?.code ?? data?.purchase?.ticket_code ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "ID de compra",
						v: data?.purchase?.id ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Estado",
						v: status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Fecha",
						v: data?.purchase?.created_at ? new Date(data.purchase.created_at).toLocaleString("es") : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Método",
						v: data?.purchase?.payment_method ?? "Stripe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Código",
						v: data?.ticket?.code ?? "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/my-tickets",
						className: buttonVariants(),
						children: "Ver mis tickets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profile",
						className: cn(buttonVariants({ variant: "ghost" })),
						children: "Ver mi perfil"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: cn(buttonVariants({ variant: "quiet" })),
						children: "Volver a VANT"
					})
				]
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4 border-b border-line py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-mono text-xs",
			children: v
		})]
	});
}
//#endregion
export { SuccessPage as component };
