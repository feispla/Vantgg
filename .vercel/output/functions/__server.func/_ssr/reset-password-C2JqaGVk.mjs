import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as resetPasswordWithToken } from "./profiles-D-Lv5pW_.mjs";
import { g as Button, l as Route$26 } from "./router-Zz1eqit4.mjs";
import { t as AuthShell } from "./auth-shell-DTFwdCRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-C2JqaGVk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reset() {
	const { token } = Route$26.useSearch();
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [ok, setOk] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (password !== confirm) {
			setError("Las contraseñas no coinciden.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			await resetPasswordWithToken({ data: {
				token,
				password
			} });
			setOk(true);
			setTimeout(() => navigate({ to: "/login" }), 1200);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo restablecer.");
		} finally {
			setBusy(false);
		}
	}
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		kicker: "Reset",
		title: "Enlace incompleto",
		subtitle: "Pide un nuevo enlace desde recuperar contraseña.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Falta el token."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		kicker: "Reset",
		title: "Nueva contraseña",
		subtitle: "Elige una contraseña de al menos 8 caracteres.",
		children: ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ok",
			children: "Contraseña actualizada. Te llevamos al login…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					type: "password",
					required: true,
					minLength: 8,
					placeholder: "Nueva contraseña",
					value: password,
					onChange: (e) => setPassword(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					type: "password",
					required: true,
					minLength: 8,
					placeholder: "Confirmar",
					value: confirm,
					onChange: (e) => setConfirm(e.target.value)
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "Guardando…" : "Guardar y entrar"
				})
			]
		})
	});
}
//#endregion
export { Reset as component };
