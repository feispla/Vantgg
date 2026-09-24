import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as STRIPE_LIVE } from "./stripe-status-D-H8hWY7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-BvbG7rwL.js
var import_jsx_runtime = require_jsx_runtime();
var COPY = {
	LIVE: "LIVE",
	BUILD: "IN DEVELOPMENT",
	NEXT: "FUTURE"
};
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("font-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.13em]", status === "LIVE" && "text-ok", status === "BUILD" && "text-warn", status === "NEXT" && "text-subtle"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", status === "LIVE" && "bg-ok", status === "BUILD" && "bg-warn", status === "NEXT" && "bg-subtle") }), COPY[status]]
	});
}
var ECOSYSTEM = [
	{
		code: "01",
		name: "Canonical Web",
		role: "Portal público, cultura competitiva y checkout Stripe.",
		status: "LIVE",
		repo: "feispla/Vantcall",
		href: "/"
	},
	{
		code: "02",
		name: "Control Plane",
		role: "Identidad, perfiles, scores, leaderboard y ops.",
		status: "LIVE",
		repo: "feispla/Vant-ControlPlane",
		href: "/admin"
	},
	{
		code: "03",
		name: "Discord Bot",
		role: "Postulaciones, roles, tryouts y auditoría.",
		status: "LIVE",
		repo: "feispla/VantBot",
		href: "/ops"
	},
	{
		code: "04",
		name: "VANTGAME",
		role: "Plataforma de juego y futuro CROSAIM: VEIL.",
		status: "BUILD",
		repo: "feispla/Vantgame",
		href: "/about"
	},
	{
		code: "05",
		name: "Legal OS",
		role: "Términos, privacidad, competición y contratos versionados.",
		status: "LIVE",
		repo: "feispla/Vantcall-Legal-OS",
		href: "/legal"
	},
	{
		code: "06",
		name: "PRISM",
		role: "Capa Hono / Prisma para servicios de integración.",
		status: "BUILD",
		repo: "feispla/honoPRISMAI.IO",
		href: "/ops"
	}
];
function OpsPage() {
	const live = ECOSYSTEM.filter((n) => n.status === "LIVE").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "06 / Ecosistema"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Nodos conectados."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: [
					live,
					" nodos LIVE. Stripe ",
					STRIPE_LIVE.account,
					" en modo ",
					STRIPE_LIVE.mode,
					": ",
					STRIPE_LIVE.products,
					" productos, ",
					STRIPE_LIVE.customers,
					" clientes, ",
					STRIPE_LIVE.subscriptions,
					" suscripciones. Sync ",
					STRIPE_LIVE.syncedAt,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-3 sm:grid-cols-4",
				children: STRIPE_LIVE.productsLive.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-ok",
							children: p.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-[10px] text-subtle",
							children: p.id
						})
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 overflow-hidden border border-line",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-line bg-surface px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:grid-cols-[64px_1fr_1.4fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ID" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nodo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:block",
							children: "Función"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estado" })
					]
				}), ECOSYSTEM.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: node.href,
					className: "grid grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line px-4 py-4 last:border-b-0 hover:bg-elevated sm:grid-cols-[64px_1fr_1.4fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-accent",
							children: node.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: node.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-subtle",
							children: node.repo
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-sm text-muted sm:block",
							children: node.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: node.status })
					]
				}, node.repo))]
			})
		]
	});
}
//#endregion
export { OpsPage as component };
