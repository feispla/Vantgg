import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
import { a as verifyPurchasePublic } from "./commerce-BkEjZ3VT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-purchase-jaFDbQjJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPurchase() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			setResult(await verifyPurchasePublic({ data: { query } }));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-lg px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Verificación de compra"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Comprobar ticket"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Ticket ID, Purchase ID o código. No se muestran datos privados de otros usuarios."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "VANT-XXXXXX",
					value: query,
					onChange: (e) => setQuery(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Buscando…" : "Verificar"
				})]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card mt-8 rounded-2xl p-5",
				children: result.found && result.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-ok",
					children: [
						"Compra válida · ",
						result.productName,
						" · ",
						result.ticketCode
					]
				}) : result.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-warn",
					children: [
						"Encontrada pero no válida (",
						result.status,
						")"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-warn",
					children: "Compra no encontrada"
				})
			}) : null
		]
	});
}
//#endregion
export { VerifyPurchase as component };
