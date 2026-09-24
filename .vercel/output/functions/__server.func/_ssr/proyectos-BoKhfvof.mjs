import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SectionKicker } from "./section-kicker-DjHSDR3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/proyectos-BoKhfvof.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROJECT_FILTERS = [
	{
		id: "all",
		label: "Todos"
	},
	{
		id: "plataforma",
		label: "Plataforma"
	},
	{
		id: "ops",
		label: "Ops"
	},
	{
		id: "legal",
		label: "Legal"
	}
];
var PROJECTS = [
	{
		id: "vantcall",
		title: "VANTCALL",
		kicker: "Canonical web",
		summary: "Capa pública: tickets, Ranked, torneos y cultura competitiva.",
		detail: "Portal de VANT.Ltd. Checkout Stripe, perfiles y el camino Scout → Operator → Command.",
		category: "plataforma",
		href: "/",
		year: "2026",
		status: "LIVE"
	},
	{
		id: "vantbot",
		title: "VantBot",
		kicker: "Discord worker",
		summary: "Ingestión, roles, entrevistas, tryouts y autoridad en Discord.",
		detail: "Worker Python en Railway. Idempotencia, ACK y reconciliación. El outbox de esta web alimenta el canal de revisión.",
		category: "ops",
		href: "/ops",
		year: "2026",
		status: "LIVE"
	},
	{
		id: "control",
		title: "Control Plane",
		kicker: "Ops console",
		summary: "Identidad, postulaciones, scores y auditoría para la org.",
		detail: "Consola admin sobre el mismo pipeline que Discord y el bot.",
		category: "ops",
		href: "/admin",
		year: "2026",
		status: "LIVE"
	},
	{
		id: "veil",
		title: "CROSAIM: VEIL",
		kicker: "Game plane",
		summary: "El plano de juego. Todavía en forja.",
		detail: "Futuro título del ecosistema. La web ya reserva el nodo.",
		category: "plataforma",
		href: "/about",
		year: "2026",
		status: "BUILD"
	},
	{
		id: "legalos",
		title: "Legal OS",
		kicker: "Contratos",
		summary: "Términos, privacidad y política de competición versionada.",
		detail: "Documentos vivos, no un PDF olvidado. Lectura clara, pie alineado.",
		category: "legal",
		href: "/legal",
		year: "2026",
		status: "LIVE"
	}
];
function ProjectGrid() {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const items = (0, import_react.useMemo)(() => filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter), [filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: PROJECT_FILTERS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setFilter(chip.id),
			className: cn("min-h-10 rounded-full border px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors", filter === chip.id ? "border-cyan bg-cyan/15 text-fg" : "border-line text-muted hover:text-fg"),
			children: chip.label
		}, chip.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 grid gap-4 sm:grid-cols-2",
		children: items.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: project.href,
			className: "group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-[border-color,background-color] duration-200 hover:border-cyan/40 hover:bg-elevated",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: [
							project.kicker,
							" · ",
							project.year
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono text-[10px] uppercase tracking-[0.14em]", project.status === "LIVE" ? "text-ok" : "text-warn"),
						children: project.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-5 font-display text-2xl font-semibold tracking-[-0.03em]",
					children: project.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted",
					children: project.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-h-0 overflow-hidden text-sm leading-6 text-fg/90 opacity-0 transition-all duration-200 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:opacity-100",
					children: project.detail
				})
			]
		}, project.id))
	})] });
}
function ProyectosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
				code: "06",
				label: "Portafolio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 max-w-3xl font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl",
				children: "Piezas que operan."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Hover para el detalle. Filtra por capa. Cada tarjeta abre la escena o la consola correspondiente."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectGrid, {})
			})
		]
	});
}
//#endregion
export { ProyectosPage as component };
