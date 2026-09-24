import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as requestEmailVerification, n as confirmEmailToken, s as getVerificationPreview } from "./profiles-D-Lv5pW_.mjs";
import { _ as buttonVariants, c as Route$18, f as RedirectToSignIn, g as Button, y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { t as AuthShell } from "./auth-shell-DTFwdCRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-email-BUlN-q3V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyEmail() {
	const { token } = Route$18.useSearch();
	const { user, isPending } = useCurrentUserState();
	const [state, setState] = (0, import_react.useState)("idle");
	const [message, setMessage] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!token) return;
		confirmEmailToken({ data: { token } }).then(() => {
			setState("ok");
			setMessage("Cuenta verificada.");
		}).catch((err) => {
			setState("err");
			setMessage(err instanceof Error ? err.message : "Enlace no válido.");
		});
	}, [token]);
	(0, import_react.useEffect)(() => {
		if (!user || user.isDevFallback) return;
		getVerificationPreview().then((r) => setPreview(r.preview)).catch(() => setPreview(null));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-md px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-surface" })
	});
	if (!token && (!user || user.isDevFallback)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, { to: "/login" });
	async function resend() {
		setBusy(true);
		try {
			const r = await requestEmailVerification();
			setPreview(r.previewUrl);
			setMessage("Correo reenviado.");
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "No se pudo reenviar.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		kicker: "Verificación",
		title: "Revisa tu correo para verificar tu cuenta.",
		subtitle: "Si no llega, reenvía. Sin proveedor de email configurado, el enlace de desarrollo aparece abajo.",
		children: [state === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ok",
			children: message
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mb-4 text-sm", state === "err" ? "text-danger" : "text-muted"),
				children: message
			}) : null,
			user && !user.isDevFallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: () => void resend(),
				children: busy ? "Enviando…" : "Reenviar correo"
			}) : null,
			preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 break-all text-xs text-cyan",
				children: [
					"Enlace de desarrollo:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "underline",
						href: preview,
						children: preview
					})
				]
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/dashboard",
			className: cn(buttonVariants({ variant: "ghost" }), "mt-6 w-full"),
			children: "Ir al dashboard"
		})]
	});
}
//#endregion
export { VerifyEmail as component };
