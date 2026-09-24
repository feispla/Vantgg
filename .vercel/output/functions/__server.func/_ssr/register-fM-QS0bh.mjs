import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-CVqXY6bk.mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { r as avatarDataUrl, t as COUNTRIES } from "./avatar-DYTTtK-m.mjs";
import { l as requestEmailVerification, t as completeRegistration } from "./profiles-D-Lv5pW_.mjs";
import { _ as Eye, v as EyeOff } from "../_libs/lucide-react.mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { t as AuthShell } from "./auth-shell-DTFwdCRU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-fM-QS0bh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Register() {
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("España");
	const [terms, setTerms] = (0, import_react.useState)(false);
	const [policy, setPolicy] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const preview = (0, import_react.useMemo)(() => avatarDataUrl(username || name || "vant-player"), [username, name]);
	async function onSubmit(e) {
		e.preventDefault();
		if (busy) return;
		if (password !== confirm) {
			setError("Las contraseñas no coinciden.");
			return;
		}
		if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
			setError("Username: 3–20 caracteres, letras, números o _.");
			return;
		}
		if (!terms || !policy) {
			setError("Debes aceptar Términos y Política VANT.");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const res = await withTimeout(authClient.signUp.email({
				email,
				password,
				name: name.trim()
			}), 12e3);
			if (res.error) throw new Error(res.error.message);
			await withTimeout(completeRegistration({ data: {
				username,
				country,
				displayName: name.trim()
			} }), 1e4);
			await withTimeout(requestEmailVerification(), 6e3).catch(() => void 0);
			await navigate({ to: "/verify-email" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		kicker: "Registro",
		title: "Crear cuenta",
		subtitle: "Naces con un logo único. Luego lo editas en tu perfil.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
					src: preview,
					name: username || "VANT",
					size: 48,
					className: "rounded-xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: username || "tu_username"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
					children: "Logo provisional"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
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
						required: true,
						placeholder: "Username",
						value: username,
						onChange: (e) => setUsername(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: "email",
						required: true,
						placeholder: "Email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field pr-12",
							type: show ? "text" : "password",
							required: true,
							minLength: 8,
							placeholder: "Password",
							value: password,
							onChange: (e) => setPassword(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute inset-y-0 right-3 text-subtle",
							onClick: () => setShow((v) => !v),
							children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						type: show ? "text" : "password",
						required: true,
						minLength: 8,
						placeholder: "Confirmar password",
						value: confirm,
						onChange: (e) => setConfirm(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "field",
						value: country,
						onChange: (e) => setCountry(e.target.value),
						children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1",
								checked: terms,
								onChange: (e) => setTerms(e.target.checked)
							}),
							"Acepto los",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/legal/$slug",
								params: { slug: "terminos" },
								className: "text-fg underline",
								children: "Términos"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-2 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1",
								checked: policy,
								onChange: (e) => setPolicy(e.target.checked)
							}),
							"Acepto la",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/legal/$slug",
								params: { slug: "politica-vant" },
								className: "text-fg underline",
								children: "Política VANT"
							})
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Creando…" : "Crear cuenta"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-center text-xs text-subtle",
				children: [
					"¿Ya tienes cuenta?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "underline",
						children: "Iniciar sesión"
					})
				]
			})
		]
	});
}
//#endregion
export { Register as component };
