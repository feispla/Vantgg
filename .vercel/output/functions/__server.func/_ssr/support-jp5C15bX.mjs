import { o as __toESM } from "../_runtime.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
import { g as Button, v as useCurrentUser } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-jp5C15bX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var submitSupport = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(2).max(80),
	email: string().trim().email(),
	category: _enum([
		"Pago",
		"Login",
		"Ticket",
		"Verificación",
		"Torneo",
		"Ranked",
		"Otro"
	]),
	purchaseId: string().trim().max(80).optional(),
	message: string().trim().min(10).max(4e3)
})).handler(createSsrRpc("18fecb8155a1e43f842b2fe11b9762ffd94fcfc477e0d7b4c8a43bb47d54c1d7"));
var CATS = [
	"Pago",
	"Login",
	"Ticket",
	"Verificación",
	"Torneo",
	"Ranked",
	"Otro"
];
function SupportPage() {
	const user = useCurrentUser();
	const [name, setName] = (0, import_react.useState)(user?.displayName ?? "");
	const [email, setEmail] = (0, import_react.useState)(user?.primaryEmail ?? "");
	const [category, setCategory] = (0, import_react.useState)("Pago");
	const [purchaseId, setPurchaseId] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const r = await submitSupport({ data: {
				name,
				email,
				category,
				purchaseId: purchaseId || void 0,
				message
			} });
			setDone(r.id);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo enviar.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-lg px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Soporte"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Contacto"
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-ok",
				children: [
					"Mensaje recibido. ID ",
					done.slice(0, 8),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						required: true,
						placeholder: "Nombre",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "email",
						required: true,
						placeholder: "Email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field",
						value: category,
						onChange: (e) => setCategory(e.target.value),
						children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "ID de compra (opcional)",
						value: purchaseId,
						onChange: (e) => setPurchaseId(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field min-h-32 py-3",
						required: true,
						minLength: 10,
						placeholder: "Mensaje",
						value: message,
						onChange: (e) => setMessage(e.target.value)
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Enviando…" : "Enviar"
					})
				]
			})
		]
	});
}
//#endregion
export { SupportPage as component };
