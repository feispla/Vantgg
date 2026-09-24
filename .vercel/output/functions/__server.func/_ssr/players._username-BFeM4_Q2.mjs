import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { o as getPublicPlayer } from "./profiles-D-Lv5pW_.mjs";
import { _ as buttonVariants, n as Route$9 } from "./router-Zz1eqit4.mjs";
import { i as nextRank } from "./ranks-CBPR_Saa.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { n as RankInsignia, t as RankChip } from "./rank-insignia-BIGdsRV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/players._username-BFeM4_Q2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProfile() {
	const { username } = Route$9.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		withTimeout(getPublicPlayer({ data: { username } }), 8e3).then((d) => {
			if (live) setData(d);
		}).catch((err) => {
			if (live) setError(err instanceof Error ? err.message : "No se pudo cargar.");
		});
		return () => {
			live = false;
		};
	}, [username]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: error
		})
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-xl px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-surface" })
	});
	if (!data.player) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Jugador no encontrado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Solo se publican cuentas registradas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/players",
				className: cn(buttonVariants({ variant: "ghost" }), "mt-8"),
				children: "Volver al roster"
			})
		]
	});
	const p = data.player;
	const rank = data.rank ?? p.rank;
	const upcoming = nextRank(p.points);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Perfil público"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 glass-card flex flex-wrap items-center gap-6 rounded-3xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
						src: p.avatar_url,
						name: p.username,
						size: 96,
						className: "rounded-3xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -bottom-2 -right-2 rounded-full bg-bg p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
							rankKey: rank.key,
							size: "md"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-semibold tracking-[-0.04em]",
						children: p.username
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted",
						children: p.display_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankChip, {
						rankKey: rank.key,
						points: p.points,
						size: "sm",
						className: "mt-3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
						children: [
							"#",
							data.position,
							" · ",
							p.country ?? "—",
							" · ",
							p.wins,
							"W / ",
							p.losses,
							"L"
						]
					}),
					upcoming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							upcoming.remaining,
							" pts para insignia ",
							upcoming.label
						]
					}) : null
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/players",
					className: buttonVariants({ variant: "ghost" }),
					children: "Todos los jugadores"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/ranked",
					className: buttonVariants({ variant: "ghost" }),
					children: "Ranked"
				})]
			})
		]
	});
}
//#endregion
export { PublicProfile as component };
