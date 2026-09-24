import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CircleAlert, D as ArrowRight, O as Activity, S as Clock3, T as Bot, b as Database, c as ShieldCheck, d as RefreshCw, h as Gauge, n as Wifi, u as Send, y as ExternalLink } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bot-DtaNfb3T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var events = [
	{
		type: "application_submitted",
		target: "#tryouts",
		time: "2 min ago",
		state: "Delivered"
	},
	{
		type: "profile_updated",
		target: "#roster",
		time: "18 min ago",
		state: "Delivered"
	},
	{
		type: "tournament_created",
		target: "#announcements",
		time: "42 min ago",
		state: "Delivered"
	},
	{
		type: "system_error",
		target: "#bot-logs",
		time: "1 hr ago",
		state: "Retrying"
	}
];
function BotConsole() {
	const [notice, setNotice] = (0, import_react.useState)("");
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const showNotice = (message) => {
		setNotice(message);
		window.setTimeout(() => setNotice(""), 2800);
	};
	const refresh = () => {
		setRefreshing(true);
		window.setTimeout(() => {
			setRefreshing(false);
			showNotice("Bot status refreshed.");
		}, 700);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
						children: "VANT / BOT CONTROL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 font-display text-5xl font-semibold tracking-[-0.06em]",
						children: [
							"VANTBOT ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: "/"
							}),
							" Console"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-muted",
						children: "A Node web control plane for the Discord worker. Monitor delivery, verify sync, and keep the operational layer visible."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-[11px] uppercase tracking-[0.12em]",
						onClick: refresh,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4" }), " Refresh"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-[11px] uppercase tracking-[0.12em] text-white",
						onClick: () => showNotice("Worker restart queued. Connect the worker host to execute it."),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" }), " Restart worker"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Bot gateway",
						value: "Online",
						detail: "Connected 14m",
						icon: Wifi,
						tone: "text-ok"
					},
					{
						label: "Web sync",
						value: "Healthy",
						detail: "Signed requests",
						icon: ShieldCheck,
						tone: "text-ok"
					},
					{
						label: "Event queue",
						value: "04",
						detail: "01 retrying",
						icon: Send,
						tone: "text-warn"
					},
					{
						label: "Last heartbeat",
						value: "12 sec",
						detail: "Worker interval",
						icon: Clock3,
						tone: "text-accent"
					}
				].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
								children: stat.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(stat.icon, { className: `h-4 w-4 ${stat.tone}` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-display text-2xl font-semibold",
							children: stat.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: stat.detail
						})
					]
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card rounded-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "Event delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Signed web ↔ Discord events from the VANT outbox."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-xs text-accent underline",
							onClick: () => showNotice("Event log export queued."),
							children: "Export log"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[560px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "font-mono text-[10px] uppercase tracking-[0.12em] text-subtle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Event"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "Channel"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "When"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3",
										children: "State"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 font-mono text-xs",
										children: event.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 text-muted",
										children: event.target
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 text-muted",
										children: event.time
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: event.state === "Retrying" ? "py-4 text-warn" : "py-4 text-ok",
										children: event.state
									})
								]
							}, `${event.type}-${event.time}`)) })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card rounded-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-accent-dim text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Worker runtime"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Python Discord process"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Host"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Persistent worker" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Region"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "us-east-1" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Version"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: "v0.8.4"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Last deploy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: "52a87ce"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "mt-7 flex w-full items-center justify-between border-t border-line pt-4 text-xs text-accent",
							onClick: () => showNotice("Worker logs are available on the persistent host."),
							children: ["View worker logs ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: "Supabase sync"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-6 text-muted",
								children: "The worker reads pending events and ACKs them only after Discord delivery succeeds."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "mt-5 inline-flex items-center gap-2 text-xs text-accent",
								onClick: () => showNotice("Sync contract opened."),
								children: ["Open sync contract ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: "Health endpoint"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-6 text-muted",
								children: "Use the Node endpoint to monitor configuration without exposing any secret values."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "mt-5 block rounded-lg bg-bg p-3 font-mono text-xs text-muted",
								children: "GET /api/bot/health"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card rounded-2xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-warn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: "Deployment note"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-6 text-muted",
								children: "Vercel currently blocks deployments because the project billing address is incomplete. Update it in Vercel before redeploying this web console."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "mt-5 inline-flex items-center gap-2 text-xs text-accent",
								onClick: () => showNotice("Open Vercel billing settings to unblock deployments."),
								children: ["Open checklist ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})
						]
					})
				]
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-6 right-6 z-20 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg shadow-2xl",
				children: notice
			})
		]
	});
}
//#endregion
export { BotConsole as component };
