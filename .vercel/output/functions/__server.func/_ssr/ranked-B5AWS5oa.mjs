import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { c as listPublicPlayers } from "./profiles-D-Lv5pW_.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { _ as buttonVariants, g as Button, y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { i as nextRank, n as RANK_TIERS, s as rankFromPoints } from "./ranks-CBPR_Saa.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { n as RankInsignia, r as RankShowcase, t as RankChip } from "./rank-insignia-BIGdsRV9.mjs";
import { a as startRankedQueue, n as getRankedBoard, o as submitRankedMatch } from "./compete-Er1YmlUw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ranked-B5AWS5oa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RankedPlay({ meName, meAvatar, meRankKey, onClose, onFinished }) {
	const [phase, setPhase] = (0, import_react.useState)("search");
	const [error, setError] = (0, import_react.useState)(null);
	const [opponent, setOpponent] = (0, import_react.useState)(null);
	const [matchId, setMatchId] = (0, import_react.useState)(null);
	const [round, setRound] = (0, import_react.useState)(0);
	const [countdown, setCountdown] = (0, import_react.useState)(3);
	const [lastMs, setLastMs] = (0, import_react.useState)(null);
	const [times, setTimes] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(null);
	const startRef = (0, import_react.useRef)(0);
	const timerRef = (0, import_react.useRef)(null);
	const busyRef = (0, import_react.useRef)(false);
	const timesRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		let live = true;
		withTimeout(startRankedQueue(), 1e4).then((data) => {
			if (!live) return;
			setOpponent(data.opponent);
			setMatchId(data.matchId);
			window.setTimeout(() => {
				if (live) setPhase("ready");
			}, 1200);
		}).catch((err) => {
			if (!live) return;
			setError(err instanceof Error ? err.message : "No se pudo encontrar rival.");
		});
		return () => {
			live = false;
			if (timerRef.current) window.clearTimeout(timerRef.current);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (phase !== "ready") return;
		setCountdown(3);
		const t = window.setInterval(() => {
			setCountdown((c) => {
				if (c <= 1) {
					window.clearInterval(t);
					beginRound(0);
					return 0;
				}
				return c - 1;
			});
		}, 700);
		return () => window.clearInterval(t);
	}, [phase]);
	function beginRound(index) {
		setRound(index);
		setLastMs(null);
		setPhase("wait");
		const delay = 900 + Math.floor(Math.random() * 1500);
		startRef.current = 0;
		timerRef.current = window.setTimeout(() => {
			startRef.current = performance.now();
			setPhase("go");
			timerRef.current = window.setTimeout(() => {
				resolveRound(null);
			}, 1100);
		}, delay);
	}
	function resolveRound(ms) {
		if (busyRef.current) return;
		busyRef.current = true;
		if (timerRef.current) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		const clean = ms !== null && ms >= 118 && ms <= 1100 ? Math.round(ms) : null;
		timesRef.current = [...timesRef.current, clean];
		setTimes(timesRef.current);
		setLastMs(clean);
		setPhase("round");
		window.setTimeout(() => {
			busyRef.current = false;
			if (timesRef.current.length >= 5) {
				finish();
				return;
			}
			beginRound(timesRef.current.length);
		}, 850);
	}
	async function finish() {
		if (!matchId) return;
		setPhase("summary");
		try {
			const data = await withTimeout(submitRankedMatch({ data: {
				matchId,
				times: timesRef.current
			} }), 1e4);
			setResult(data);
			onFinished(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo guardar el resultado.");
		}
	}
	function onArenaClick() {
		if (phase === "wait") {
			if (timerRef.current) window.clearTimeout(timerRef.current);
			resolveRound(null);
			return;
		}
		if (phase === "go" && startRef.current) resolveRound(performance.now() - startRef.current);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex flex-col bg-bg/96 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-line px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
				children: "VANT CALL · 5 rondas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "inline-flex size-11 items-center justify-center rounded-xl text-muted hover:bg-elevated hover:text-fg",
				"aria-label": "Cerrar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid flex-1 place-items-center px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-danger",
				children: error
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: onClose,
				children: "Volver"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col items-center justify-center px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							name: meName,
							avatar: meAvatar,
							rankKey: meRankKey,
							align: "right",
							you: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.2em] text-subtle",
							children: "vs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, {
							name: opponent?.name ?? "…",
							avatar: null,
							rankKey: opponent?.rankKey ?? "unranked",
							align: "left"
						})
					]
				}),
				phase === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-[0.22em] text-muted",
					children: "Buscando rival en el circuito…"
				}) : null,
				phase === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-6xl font-semibold tabular-nums",
					children: countdown || "CALL"
				}) : null,
				phase === "wait" || phase === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onArenaClick,
					className: cn("grid size-56 place-items-center rounded-full border transition-[border-color,background-color,transform] duration-150 sm:size-64", phase === "go" ? "call-pulse border-accent bg-accent/15" : "border-line bg-surface"),
					children: phase === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/vant-logo.png",
						alt: "",
						className: "h-24 w-24 object-contain sm:h-28 sm:w-28"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px] uppercase tracking-[0.22em] text-subtle",
						children: "Espera el call"
					})
				}) : null,
				phase === "round" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-display text-4xl font-semibold tabular-nums", lastMs ? "text-fg" : "text-danger"),
						children: lastMs ? `${lastMs} ms` : "False start"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: [
							"Ronda ",
							round + 1,
							" / 5"
						]
					})]
				}) : null,
				phase === "summary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center",
					children: !result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Cerrando serie…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-5xl font-semibold tracking-[-0.05em]",
							children: result.won ? "VICTORIA" : "DERROTA"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-mono text-sm uppercase tracking-[0.16em] text-muted",
							children: [
								result.roundsWon,
								"-",
								result.roundsLost,
								" · ",
								result.mmrDelta >= 0 ? "+" : "",
								result.mmrDelta,
								" MMR"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
								rankKey: result.rankKey,
								size: "xl"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-lg",
							children: result.rankLabel
						}),
						result.promoted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ok",
							children: "Promoción"
						}) : null,
						result.placed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ok",
							children: "Placement cerrado. Bienvenido al circuito."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-8",
							onClick: onClose,
							children: "Continuar"
						})
					] })
				}) : null,
				times.length > 0 && phase !== "summary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-8 flex gap-2",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { className: cn("h-1.5 w-8 rounded-full", times[i] === void 0 ? "bg-elevated" : times[i] ? "bg-fg" : "bg-danger") }, i))
				}) : null,
				phase === "wait" || phase === "go" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: [
						"Ronda ",
						round + 1,
						" de 5 · no pulses antes"
					]
				}) : null
			]
		})]
	});
}
function PlayerCard({ name, avatar, rankKey, align, you }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-w-0 items-center gap-3", align === "right" && "flex-row-reverse"),
		children: [avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
			src: avatar,
			name,
			size: 48,
			className: "rounded-xl"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
			rankKey,
			size: "md"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("min-w-0", align === "right" && "text-right"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate font-medium",
				children: [name, you ? " · tú" : ""]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
				children: rankKey.replaceAll("-", " ")
			})]
		})]
	});
}
function RankedPage() {
	const { user, isPending } = useCurrentUserState();
	const signedIn = !isPending && Boolean(user) && !user?.isDevFallback;
	const [mine, setMine] = (0, import_react.useState)(null);
	const [board, setBoard] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(false);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [tick, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let live = true;
		const load = async () => {
			try {
				if (signedIn) {
					const data = await withTimeout(getRankedBoard(), 1e4);
					if (!live) return;
					setMine(data);
					setBoard(data.board.map((row) => ({
						position: row.position,
						username: row.username,
						avatarUrl: row.avatarUrl,
						rankKey: row.rankKey,
						rank: row.rank,
						points: row.points,
						isYou: row.isYou
					})));
					return;
				}
				const rows = await withTimeout(listPublicPlayers(), 8e3);
				if (!live) return;
				setBoard(rows.map((p) => ({
					position: p.position,
					username: p.username,
					avatarUrl: p.avatar_url,
					rankKey: p.rank.key,
					rank: p.rank.label,
					points: p.points,
					isYou: false
				})));
			} catch {
				if (live) setError(true);
			}
		};
		if (!isPending) load();
		return () => {
			live = false;
		};
	}, [
		isPending,
		signedIn,
		tick
	]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-danger",
			children: "No se pudo cargar Ranked."
		})
	});
	if (isPending || board === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-surface" })
	});
	const me = mine?.me;
	const upcoming = me ? nextRank(me.points) : null;
	const placing = (me?.placementsLeft ?? 0) > 0 && me?.points === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "01 / Circuito"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "VANT Ranked"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Temporada 1. Cinco rondas de call contra el circuito. Placement, MMR y promoción por divisiones."
			}),
			me ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankShowcase, {
					rankKey: placing ? "unranked" : me.rank.key,
					points: placing ? void 0 : me.points
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card rounded-3xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-semibold",
							children: placing ? `Placement ${5 - me.placementsLeft}/5` : me.rank.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
							children: [
								"#",
								me.position,
								" · racha ",
								me.streak,
								" · pico ",
								me.peakRankKey.replaceAll("-", " ")
							]
						}),
						placing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Cierra cinco series para recibir insignia."
						}) : upcoming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted",
							children: [
								upcoming.remaining,
								" MMR para ",
								upcoming.label
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-rank-legends",
							children: "Techo de Temporada 1."
						}),
						upcoming && !placing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full origin-left rounded-full bg-accent transition-transform duration-200",
								style: { transform: `scaleX(${upcoming.progress})` }
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: buttonVariants(),
								onClick: () => setPlaying(true),
								children: "Jugar Ranked"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tournaments",
								className: buttonVariants({ variant: "ghost" }),
								children: "Torneos"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "MMR",
							value: String(me.points)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Win rate",
							value: `${me.winRate}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Wins",
							value: String(me.wins)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Losses",
							value: String(me.losses)
						})
					]
				})] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 glass-card rounded-3xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-6 text-muted",
					children: "Mira el circuito ahora. Tus puntos, placement e historial aparecen cuando creas una cuenta."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: cn(buttonVariants(), "mt-5"),
					children: "Crear cuenta y jugar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-16 font-display text-2xl font-semibold",
				children: "Insignias"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-4",
				children: RANK_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono w-36 text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: tier.label
					}), tier.keys.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex flex-col items-center gap-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
							rankKey: key,
							size: "lg"
						})
					}, key))]
				}, tier.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-16 font-display text-2xl font-semibold",
				children: "Leaderboard"
			}),
			board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 glass-card rounded-2xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nadie se ha registrado todavía. El primero abre Temporada 1."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: cn(buttonVariants({ variant: "ghost" }), "mt-5"),
					children: "Registrarme"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-y border-line",
				children: board.map((row) => {
					const rank = rankFromPoints(row.points);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("flex items-center justify-between gap-3 py-3 text-sm", row.isYou && "text-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono w-8 shrink-0 text-xs text-subtle",
									children: ["#", row.position]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
									rankKey: row.rankKey || rank.key,
									size: "md"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
									src: row.avatarUrl,
									name: row.username,
									size: 36,
									className: "rounded-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/players/$username",
									params: { username: row.username },
									className: "truncate hover:underline",
									children: [row.username, row.isYou ? " · tú" : ""]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankChip, {
							rankKey: row.rankKey || rank.key,
							points: row.points,
							className: "shrink-0"
						})]
					}, `${row.position}-${row.username}`);
				})
			}),
			mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-16 font-display text-2xl font-semibold",
				children: "Historial"
			}), mine.history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Todavía no hay series registradas."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm",
				children: mine.history.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between gap-3 border-b border-line py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						h.title,
						" · ",
						h.result
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums text-muted",
						children: [h.points_delta >= 0 ? "+" : "", h.points_delta]
					})]
				}, h.id))
			})] }) : null,
			playing && me ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankedPlay, {
				meName: me.username ?? user?.displayName ?? "Tú",
				meAvatar: me.avatar_url,
				meRankKey: placing ? "unranked" : me.rank.key,
				onClose: () => {
					setPlaying(false);
					setTick((n) => n + 1);
				},
				onFinished: () => {
					setTick((n) => n + 1);
				}
			}) : null
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card rounded-2xl p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 font-display text-2xl font-semibold tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { RankedPage as component };
