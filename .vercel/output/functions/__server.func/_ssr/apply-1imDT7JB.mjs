import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants, g as Button, m as SignedOut, p as SignedIn } from "./router-Zz1eqit4.mjs";
import { r as submitTryoutApplication } from "./leads-CrD0TF4E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apply-1imDT7JB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"Duelist",
	"Controller",
	"Initiator",
	"Sentinel",
	"IGL",
	"Coach",
	"Content",
	"Other"
];
var GAMES = [
	"Valorant",
	"CS2",
	"League",
	"Fortnite",
	"Apex",
	"CROSAIM: VEIL",
	"Other"
];
var EMPTY = {
	tag: "",
	discord: "",
	role: "Duelist",
	game: "Valorant",
	note: ""
};
function ApplyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "05 / Tryouts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Postúlate."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: "Scout entra gratis. El bot y Control Plane procesan la cola. Entra con Google, X o email para dejar tu postulación en el pipeline real."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border border-line bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Necesitas cuenta para que ops vea la postulación. No se guarda en tu navegador."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: cn(buttonVariants(), "mt-6"),
					children: "Entrar y postularme"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplyForm, {}) })
		]
	});
}
function ApplyForm() {
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		if (!form.tag.trim() || !form.discord.trim() || submitting) return;
		setSubmitting(true);
		setError(null);
		try {
			await submitTryoutApplication({ data: form });
			setSent(true);
		} catch {
			setError("No se pudo enviar. Entra de nuevo o escríbenos a feispla@hotmail.com.");
		} finally {
			setSubmitting(false);
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 border border-line bg-surface p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-ok",
				children: "Tryout queued"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-3xl font-semibold",
				children: "Postulación recibida."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Ops revisa el pipeline. Prioridad: Operator o Founding Mark."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/join/$planId",
					params: { planId: "operator" },
					className: buttonVariants(),
					children: "Activar Operator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					className: buttonVariants({ variant: "ghost" }),
					children: "Mi cuenta"
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "mt-10 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Gamertag",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					value: form.tag,
					onChange: (e) => setForm({
						...form,
						tag: e.target.value
					}),
					className: fieldClass,
					placeholder: "VANT#001"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Discord",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					value: form.discord,
					onChange: (e) => setForm({
						...form,
						discord: e.target.value
					}),
					className: fieldClass,
					placeholder: "usuario"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Rol",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: form.role,
						onChange: (e) => setForm({
							...form,
							role: e.target.value
						}),
						className: fieldClass,
						children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Juego",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: form.game,
						onChange: (e) => setForm({
							...form,
							game: e.target.value
						}),
						className: fieldClass,
						children: GAMES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: g }, g))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Por qué CROSAIM",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.note,
					onChange: (e) => setForm({
						...form,
						note: e.target.value
					}),
					className: cn(fieldClass, "min-h-28 py-3"),
					placeholder: "Rank, disponibilidad, VOD…"
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-accent",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "w-full sm:w-auto",
				disabled: submitting,
				children: submitting ? "Enviando…" : "Enviar postulación"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children
		})]
	});
}
var fieldClass = "min-h-11 w-full border border-line bg-bg px-3 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent";
//#endregion
export { ApplyPage as component };
