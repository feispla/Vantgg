import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { o as GROK_PROVIDERS } from "./server-DmcI2TpJ.mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { _ as Eye, v as EyeOff } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants, d as Route$36, g as Button } from "./router-Zz1eqit4.mjs";
import { t as AuthShell } from "./auth-shell-DTFwdCRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-4ppypS9x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function safeNext(next) {
	if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
	return next;
}
function Login() {
	const { next } = Route$36.useSearch();
	const navigate = useNavigate();
	const callbackURL = safeNext(next);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [method, setMethod] = (0, import_react.useState)("idle");
	const google = (0, import_react.useMemo)(() => GROK_PROVIDERS.find((p) => p.idp === "google"), []);
	const x = (0, import_react.useMemo)(() => GROK_PROVIDERS.find((p) => p.idp === "twitter"), []);
	async function onEmail(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		setMethod("email");
		setError(null);
		try {
			const res = await withTimeout(authClient.signIn.email({
				email,
				password
			}), 1e4);
			if (res.error) throw new Error(res.error.message);
			await navigate({ to: callbackURL });
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo entrar.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, {
		kicker: "Acceso",
		title: "Entra a VANT",
		subtitle: "Google, X o email. Las postulaciones llegan a Discord por el bot.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [google ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMethod("google");
						signIn(google.providerId, { callbackURL });
					},
					className: cn(buttonVariants({ variant: "ghost" }), "w-full"),
					children: "Continuar con Google"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl border border-line px-4 py-3 text-sm text-muted",
					children: "Google no está configurado todavía"
				}), x ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMethod("x");
						signIn(x.providerId, { callbackURL });
					},
					className: cn(buttonVariants({ variant: "quiet" }), "w-full"),
					children: "Continuar con X"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
				children: "o email / password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan",
				children: ["Método: ", method === "idle" ? "elige uno" : method]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onEmail,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							required: true,
							autoComplete: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "field mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative mt-1 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: show ? "text" : "password",
								required: true,
								minLength: 8,
								autoComplete: "current-password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "field pr-12"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "absolute inset-y-0 right-3 text-subtle",
								"aria-label": show ? "Ocultar password" : "Mostrar password",
								onClick: () => setShow((v) => !v),
								children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Entrando…" : "Iniciar sesión"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2 text-center text-xs text-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					search: { next },
					className: "underline",
					children: "Crear cuenta"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: "underline",
					children: "Recuperar contraseña"
				})]
			})
		] })
	});
}
//#endregion
export { Login as component };
