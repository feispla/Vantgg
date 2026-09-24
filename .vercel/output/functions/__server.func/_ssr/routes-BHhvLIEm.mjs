import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { a as PLANS } from "./plans-BL2SEEb7.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { c as listPublicPlayers } from "./profiles-D-Lv5pW_.mjs";
import { E as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
import { n as RANK_TIERS, o as rankByKey } from "./ranks-CBPR_Saa.mjs";
import { t as ContactForm } from "./contact-form-WbhgzBt1.mjs";
import { t as SectionKicker } from "./section-kicker-DjHSDR3a.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { n as RankInsignia, t as RankChip } from "./rank-insignia-BIGdsRV9.mjs";
import { t as PlanCard } from "./plan-card-BZsQDfq4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BHhvLIEm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PULSE = [
	{
		k: "Temporada",
		v: "S1"
	},
	{
		k: "Modo",
		v: "CALL"
	},
	{
		k: "Circuito",
		v: "LIVE"
	},
	{
		k: "Divisiones",
		v: "I–III"
	}
];
function HeroCommand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "hero-wash relative overflow-hidden border-b border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.22em] text-accent",
					children: "00 / Temporada 1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/vant-logo.png",
						alt: "",
						className: "h-16 w-auto object-contain sm:h-20"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl",
						children: ["VANT", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-muted",
							children: "REALM"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg",
					children: "Circuito competitivo con insignias reales, divisiones I–III y el call que decide la serie. Bronze a Legends. Cuentas reales. Sin bots de relleno."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ranked",
							className: buttonVariants(),
							children: ["Jugar Ranked", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/players",
							className: buttonVariants({ variant: "ghost" }),
							children: "Leaderboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: buttonVariants({ variant: "quiet" }),
							children: "Crear cuenta"
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card rounded-3xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
						children: "Estado del reino"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 grid grid-cols-2 gap-3",
						children: PULSE.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-line bg-bg/60 px-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
								children: row.k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl font-semibold",
								children: row.v
							})]
						}, row.k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted",
						children: "Placement 5 · MMR Elo · Best of call"
					})
				]
			})]
		})
	});
}
var TIER_TEXT = {
	legends: "text-rank-legends",
	"grand-champion": "text-rank-gc",
	diamond: "text-rank-diamond",
	platinum: "text-rank-platinum",
	gold: "text-rank-gold",
	silver: "text-rank-silver",
	bronze: "text-rank-bronze",
	unranked: "text-rank-unranked"
};
function RankLadder() {
	const [players, setPlayers] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		withTimeout(listPublicPlayers(), 8e3).then((rows) => {
			if (live) setPlayers(rows);
		}).catch(() => {
			if (live) setPlayers([]);
		});
		return () => {
			live = false;
		};
	}, []);
	const top = players?.slice(0, 5) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1.35fr_0.65fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-2",
			children: RANK_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[10rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("tier-chip font-mono text-[9px] uppercase tracking-[0.16em] sm:text-[10px]", TIER_TEXT[tier.id]),
					children: tier.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex items-center justify-start gap-2 sm:gap-4",
					children: tier.keys.map((key) => {
						const rank = rankByKey(key);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
								rankKey: key,
								size: "lg"
							}), tier.keys.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[9px] uppercase tracking-[0.18em] text-subtle",
								children: [
									"I",
									"II",
									"III"
								][rank.division - 1]
							}) : null]
						}, key);
					})
				})]
			}, tier.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card rounded-3xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
				children: "Top circuito"
			}), !players ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-3",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 animate-pulse rounded-2xl bg-elevated" }, i))
			}) : top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6 text-muted",
					children: "El ranking está vacío a propósito. El primero en registrarse abre Temporada 1."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: cn(buttonVariants(), "mt-6"),
					children: "Crear cuenta"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-2",
				children: top.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/players/$username",
					params: { username: p.username },
					className: "flex items-center gap-3 rounded-2xl border border-line bg-bg/60 p-3 transition-colors hover:bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono w-6 text-xs text-subtle",
							children: ["#", p.position]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
							src: p.avatar_url,
							name: p.username,
							size: 40,
							className: "rounded-xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: p.username
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankChip, {
								rankKey: p.rank.key,
								points: p.points
							})]
						})
					]
				}) }, p.username))
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCommand, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "rangos",
			className: "border-b border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
						code: "01",
						label: "Circuito"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl",
						children: "Siete rangos. Tres divisiones. Un techo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-muted",
						children: "Bronze a Legends, cada uno con I, II y III. Unranked hasta cerrar placement. El tablero solo lista cuentas reales."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankLadder, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ranked",
							className: buttonVariants(),
							children: ["Entrar al Ranked", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: buttonVariants({ variant: "ghost" }),
							children: "Crear cuenta"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
					code: "02",
					label: "El call"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 max-w-3xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl",
					children: "Cinco rondas. El mark decide."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-4 md:grid-cols-3",
					children: [
						{
							n: "01",
							t: "Placement",
							d: "Cinco partidas y el circuito te asigna Bronze a Platinum."
						},
						{
							n: "02",
							t: "VANT CALL",
							d: "Espera el isotipo. El primer frame limpio gana la ronda."
						},
						{
							n: "03",
							t: "MMR vivo",
							d: "Elo contra el rival del circuito. Promoción I → II → III."
						}
					].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "glass-card rounded-3xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.18em] text-accent",
								children: step.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-2xl font-semibold",
								children: step.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-6 text-muted",
								children: step.d
							})
						]
					}, step.n))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
						code: "03",
						label: "Entrada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl",
						children: "Ranked es gratis. El invitational no."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-muted",
						children: "Juega el circuito con una cuenta. Los tickets abren Pro Series, salas privadas y Elite."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: PLANS.map((plan) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanCard, { plan }, plan.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "contacto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
						code: "04",
						label: "Contacto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl",
						children: "Un formulario, dos destinos."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted",
						children: "Discord vía VantBot y correo a feispla@hotmail.com. Tryouts autenticados siguen el mismo outbox."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contacto",
						className: cn(buttonVariants({ variant: "ghost" }), "mt-8"),
						children: ["Página de contacto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4" })]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, { source: "home" })]
			})
		})
	] });
}
//#endregion
export { Home as component };
