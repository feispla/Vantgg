import { o as __toESM } from "../_runtime.mjs";
import { F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-form-WbhgzBt1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var contactSchema = object({
	name: string().trim().min(2).max(80),
	email: string().trim().email().max(120),
	subject: string().trim().max(120).optional(),
	message: string().trim().min(8).max(4e3),
	source: string().trim().max(40).optional(),
	discord: string().trim().max(80).optional()
});
var submitContact = createServerFn({ method: "POST" }).validator(contactSchema).handler(createSsrRpc("8be87644d5916e3944545662c263dcd5b73d29e93f45411b91fff684be65c048"));
function ContactForm({ source = "contact" }) {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [discord, setDiscord] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await withTimeout(submitContact({ data: {
				name,
				email,
				subject: subject || void 0,
				message,
				source,
				discord: discord || void 0
			} }), 8e3);
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo enviar.");
		} finally {
			setBusy(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-ok",
				children: "Enviado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-3xl font-semibold",
				children: "Lo tenemos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-6 text-muted",
				children: "Copia a Discord (cola VantBot) y a feispla@hotmail.com. Si el bot está vivo, aparece en revisión."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Nombre"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-2",
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-2",
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Asunto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-2",
						value: subject,
						onChange: (e) => setSubject(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: "Discord"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-2",
						value: discord,
						onChange: (e) => setDiscord(e.target.value),
						placeholder: "opcional"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: "Mensaje"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "field mt-2 min-h-32 py-3",
					required: true,
					minLength: 8,
					value: message,
					onChange: (e) => setMessage(e.target.value)
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: busy,
				children: busy ? "Enviando…" : "Enviar a Discord y correo"
			})
		]
	});
}
//#endregion
export { ContactForm as t };
