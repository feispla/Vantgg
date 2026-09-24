import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as requestPasswordReset } from "./profiles-D-Lv5pW_.mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
import { t as AuthShell } from "./auth-shell-DTFwdCRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-CCrvvyJd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Forgot() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await requestPasswordReset({ data: { email } });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo enviar.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		kicker: "Recuperación",
		title: "¿Olvidaste tu contraseña?",
		subtitle: "Si el email existe, enviaremos un enlace seguro. La contraseña nunca se guarda en texto plano.",
		children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-6 text-ok",
			children: "Si hay una cuenta con ese correo, recibirás el enlace. Revisa bandeja y spam."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					type: "email",
					required: true,
					placeholder: "Email",
					value: email,
					onChange: (e) => setEmail(e.target.value)
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Enviando…" : "Enviar enlace"
				})
			]
		})
	});
}
//#endregion
export { Forgot as component };
