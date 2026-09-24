import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { a as Trophy, c as ShieldCheck, g as Flag, i as UserRound, l as Settings, m as LayoutGrid, p as LogOut, r as Users, s as Ticket, x as CreditCard } from "../_libs/lucide-react.mjs";
import { v as useCurrentUser } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-oKvsAQA6.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/dashboard",
		label: "Overview",
		icon: LayoutGrid
	},
	{
		to: "/profile",
		label: "Perfil",
		icon: UserRound
	},
	{
		to: "/players",
		label: "Jugadores",
		icon: Users
	},
	{
		to: "/dashboard",
		label: "Compras",
		icon: CreditCard,
		search: { tab: "compras" }
	},
	{
		to: "/my-tickets",
		label: "Tickets",
		icon: Ticket
	},
	{
		to: "/ranked",
		label: "Ranked",
		icon: Trophy
	},
	{
		to: "/tournaments",
		label: "Torneos",
		icon: Flag
	},
	{
		to: "/verification",
		label: "Verificación",
		icon: ShieldCheck
	},
	{
		to: "/settings",
		label: "Configuración",
		icon: Settings
	}
];
function AppShell({ title, kicker, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = useCurrentUser();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid w-full min-w-0 max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "min-w-0 lg:sticky lg:top-24 lg:self-start",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
					children: "Cuenta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 truncate text-sm text-muted",
					children: user?.displayName ?? user?.primaryEmail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-5 flex max-w-full gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible",
					children: [NAV.map((item) => {
						const active = pathname === item.to && item.label !== "Compras";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm text-muted transition-colors hover:bg-elevated hover:text-fg", active && "bg-elevated text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 text-accent" }), item.label]
						}, item.label);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut().catch(() => void 0),
						className: "flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm text-muted hover:bg-elevated hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-danger" }), "Cerrar sesión"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-semibold tracking-[-0.04em]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children
			})
		] })]
	});
}
//#endregion
export { AppShell as t };
