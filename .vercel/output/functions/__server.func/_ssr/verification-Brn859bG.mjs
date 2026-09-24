import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getMyAccount, u as requestKycReview } from "./profiles-D-Lv5pW_.mjs";
import { w as Check } from "../_libs/lucide-react.mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { t as AppShell } from "./app-shell-oKvsAQA6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verification-Brn859bG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	PENDING: "Pendiente",
	REVIEW: "En revisión",
	VERIFIED: "Verificada",
	REJECTED: "Rechazada"
};
function VerificationPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {}) });
}
function Body() {
	const [status, setStatus] = (0, import_react.useState)("PENDING");
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getMyAccount().then((d) => setStatus(d.profile.verification_status));
	}, []);
	async function submit() {
		setBusy(true);
		try {
			const r = await requestKycReview({ data: { note } });
			setStatus(r.status);
			setMsg("Solicitud enviada. No subas documentos aquí.");
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "Error");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Verificación",
		kicker: "KYC listo",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
					children: ["Estado · ", LABELS[status] ?? status]
				}),
				status === "VERIFIED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center gap-2 text-ok",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5" }), " Cuenta verificada"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-sm leading-6 text-muted",
						children: "Sistema preparado para un proveedor KYC real. No almacenamos documentos sensibles en el navegador. Ops revisa la cola; un admin marca VERIFIED / REJECTED."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field mt-6 min-h-28 py-3",
						placeholder: "Nota opcional para ops (sin documentos)",
						value: note,
						onChange: (e) => setNote(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						disabled: busy || status === "REVIEW",
						onClick: () => void submit(),
						children: status === "REVIEW" ? "En revisión" : busy ? "Enviando…" : "Pedir revisión"
					})
				] }),
				msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-cyan",
					children: msg
				}) : null
			]
		})
	});
}
//#endregion
export { VerificationPage as component };
