import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { c as listPublicPlayers } from "./profiles-D-Lv5pW_.mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
import { n as RANK_TIERS } from "./ranks-CBPR_Saa.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { n as RankInsignia, t as RankChip } from "./rank-insignia-BIGdsRV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/players.index-T7vMwQzr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlayersPage() {
	const [players, setPlayers] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		withTimeout(listPublicPlayers(), 8e3).then((rows) => {
			if (live) setPlayers(rows);
		}).catch((err) => {
			if (live) setError(err instanceof Error ? err.message : "No se pudo cargar.");
		});
		return () => {
			live = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "01 / Roster vivo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Jugadores"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Solo cuentas registradas. Cada rango tiene insignia. Al crear tu perfil naces Unranked y subes con puntos reales."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 flex flex-wrap gap-2",
				children: RANK_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
						rankKey: tier.keys[tier.keys.length - 1],
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.12em] text-muted",
						children: tier.label
					})]
				}, tier.id))
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-danger",
				children: error
			}) : null,
			!players ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-surface" }, i))
			}) : players.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 glass-card rounded-2xl p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Aún no hay perfiles públicos. No sembramos jugadores falsos: crea una cuenta y serás el primero."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: cn(buttonVariants(), "mt-6"),
					children: "Crear cuenta"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/players/$username",
					params: { username: p.username },
					className: "glass-card flex min-h-24 items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-elevated",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
							src: p.avatar_url,
							name: p.username,
							size: 56
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-1 -right-1 rounded-full bg-bg p-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
								rankKey: p.rank.key,
								size: "sm"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate font-display text-lg font-semibold",
								children: [
									"#",
									p.position,
									" ",
									p.username
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankChip, {
								rankKey: p.rank.key,
								points: p.points,
								className: "mt-1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block truncate text-xs text-subtle",
								children: [
									p.country ?? "—",
									" · ",
									p.wins,
									"W ",
									p.losses,
									"L"
								]
							})
						]
					})]
				}) }, p.username))
			})
		]
	});
}
//#endregion
export { PlayersPage as component };
