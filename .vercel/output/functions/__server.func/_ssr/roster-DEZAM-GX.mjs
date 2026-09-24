import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roster-DEZAM-GX.js
var import_jsx_runtime = require_jsx_runtime();
var ROSTER = [
	{
		code: "01",
		role: "Founder / Ops",
		handle: "FEISS",
		status: "active",
		note: "Dirección, stream y control plane."
	},
	{
		code: "02",
		role: "IGL",
		handle: null,
		status: "open",
		note: "Tryouts T-01. Prioridad Operator."
	},
	{
		code: "03",
		role: "Duelist",
		handle: null,
		status: "open",
		note: "Entry + first blood. VOD requerido."
	},
	{
		code: "04",
		role: "Controller",
		handle: null,
		status: "open",
		note: "Smokes y tempo de round."
	},
	{
		code: "05",
		role: "Initiator",
		handle: null,
		status: "open",
		note: "Info y space. Flex valorado."
	},
	{
		code: "06",
		role: "Sentinel",
		handle: null,
		status: "open",
		note: "Anchor + retake."
	},
	{
		code: "07",
		role: "Coach",
		handle: null,
		status: "open",
		note: "VOD review y anti-strats."
	},
	{
		code: "08",
		role: "Content",
		handle: "FEISS",
		status: "active",
		note: "Kick + X. Clips oficiales."
	}
];
var ORG = {
	name: "VANT Sports",
	layer: "CROSAIM",
	game: "VALORANT",
	region: "EU",
	founded: "2026"
};
function RosterPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: ["10 / ", ORG.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "El roster todavía se escribe."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: [
					ORG.game,
					" · ",
					ORG.region,
					" · fundada ",
					ORG.founded,
					". Capa CROSAIM. Los asientos OPEN se cubren por tryouts, no por pago."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 overflow-hidden border border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[48px_1fr_auto] gap-x-4 border-b border-line bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:grid-cols-[64px_1fr_1.2fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ID" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rol" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:block",
							children: "Nota"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estado" })
					]
				}), ROSTER.map((seat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[48px_1fr_auto] items-center gap-x-4 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[64px_1fr_1.2fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-accent",
							children: seat.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: seat.role
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: seat.handle ?? "Sin asignar"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-sm text-muted sm:block",
							children: seat.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("font-mono text-[10px] uppercase tracking-[0.14em]", seat.status === "open" ? "text-warn" : "text-ok"),
							children: seat.status
						})
					]
				}, seat.code))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/apply",
				className: cn(buttonVariants(), "mt-10"),
				children: "Postularme a un asiento"
			})
		]
	});
}
//#endregion
export { RosterPage as component };
