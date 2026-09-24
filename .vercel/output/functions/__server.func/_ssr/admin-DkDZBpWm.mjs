import { o as __toESM } from "../_runtime.mjs";
import { i as OPS_EMAIL_ALT, r as OPS_EMAIL, t as CONTACT_EMAIL } from "./plans-BL2SEEb7.mjs";
import { D as _enum, F as object, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { C as require_jsx_runtime, W as require_react, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
import { y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { s as rankFromPoints } from "./ranks-CBPR_Saa.mjs";
import { t as STRIPE_LIVE } from "./stripe-status-D-H8hWY7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DkDZBpWm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2549f9a9205f79114d7d5308f3c10fc43c16e71528bf9a7cfedd24a564424c87"));
var checkAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7a4e9b683da1fdae3847482bc673c8aa12f5a6c4e41ad0452137b1e6b46a8733"));
OPS_EMAIL.toLowerCase(), OPS_EMAIL_ALT.toLowerCase(), CONTACT_EMAIL.toLowerCase();
var getAdminConsole = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0b7f29839d11cdb102f7ddfa02530c545cb81b4e33aaf1a1d10d6ad13ed7f7a9"));
var setVerificationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	status: _enum([
		"PENDING",
		"REVIEW",
		"VERIFIED",
		"REJECTED"
	])
})).handler(createSsrRpc("05e68b20309bb17b98ab9a94fde95d7a6dc96d521e51f7751172bfa51f4c5960"));
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [allowed, setAllowed] = (0, import_react.useState)(null);
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		if (!user || user.isDevFallback) {
			setAllowed(false);
			return;
		}
		checkAdmin().then((r) => {
			setAllowed(r.isAdmin);
			if (r.isAdmin) return getAdminConsole().then(setData);
		}).catch(() => setAllowed(false));
	}, [user, isPending]);
	if (isPending || allowed === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-4xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
			children: "Admin"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-muted",
			children: "Verificando permisos…"
		})]
	});
	if (!user || user.isDevFallback) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-4xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Acceso denegado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-muted",
				children: [
					"/admin requiere rol admin (email ops ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: "feispla@zohomail.com"
					}),
					")."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				className: "mt-8 inline-block text-sm text-accent underline",
				children: "Ir al dashboard"
			})
		]
	});
	const entryMap = new Map((data?.entries ?? []).map((r) => [r.tournament_id, r.n]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Admin / Control Plane"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Panel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Usuarios, compras, tickets, pagos Stripe, torneos, verificaciones y rankings. Los pagos solo aparecen cuando Stripe confirma el evento."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Usuarios",
						value: String(data?.users.length ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Compras",
						value: String(data?.purchases.length ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tickets",
						value: String(data?.tickets.length ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Eventos Stripe",
						value: String(data?.events.length ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Usuarios",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Nombre",
						"Email",
						"Username",
						"Verif",
						"Pts"
					],
					rows: (data?.users ?? []).map((u) => [
						u.name,
						u.email,
						u.username ?? "—",
						u.verification_status ?? "—",
						String(u.points ?? 0)
					]),
					empty: "Sin usuarios."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Compras",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Producto",
						"Email",
						"Importe",
						"Estado",
						"Método"
					],
					rows: (data?.purchases ?? []).map((p) => [
						p.product_id ?? p.plan_id,
						p.email ?? "—",
						p.amount_total != null ? `${(p.amount_total / 100).toFixed(2)} ${p.currency ?? ""}` : "—",
						p.status,
						p.payment_method ?? "—"
					]),
					empty: "Sin compras. El webhook vive en /api/stripe/webhook."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Tickets",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Código",
						"Producto",
						"Tier",
						"Estado"
					],
					rows: (data?.tickets ?? []).map((t) => [
						t.code,
						t.product_id,
						t.tier,
						t.status
					]),
					empty: "Sin tickets emitidos."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Pagos / eventos",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Evento",
						"Tipo",
						"Estado",
						"Importe"
					],
					rows: (data?.events ?? []).map((e) => [
						e.event_id.slice(0, 18),
						e.type,
						e.status ?? "—",
						String(e.amount ?? "—")
					]),
					empty: "Sin eventos de Stripe todavía."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Torneos",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-line border-y border-line",
					children: (data?.tournaments ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-accent",
							children: [
								entryMap.get(t.id) ?? 0,
								"/",
								t.capacity
							]
						})]
					}, t.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Verificaciones",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: (data?.verifications ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-subtle",
						children: "Sin solicitudes."
					}) : (data?.verifications ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							v.username ?? v.user_id.slice(0, 8),
							" · ",
							v.verification_status
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex gap-2",
							children: [
								"VERIFIED",
								"REJECTED",
								"REVIEW"
							].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-lg border border-line px-2 py-1 text-[10px] uppercase",
								onClick: () => void setVerificationStatus({ data: {
									userId: v.user_id,
									status: st
								} }).then(() => getAdminConsole().then(setData)),
								children: st
							}, st))
						})]
					}, v.user_id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Rankings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Player",
						"Rank",
						"Pts"
					],
					rows: (data?.rankings ?? []).map((r) => [
						r.username ?? r.display_name ?? "—",
						rankFromPoints(r.points).label,
						String(r.points)
					]),
					empty: "Sin ranked."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Soporte",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Nombre",
						"Email",
						"Tipo",
						"Estado"
					],
					rows: (data?.support ?? []).map((s) => [
						s.name,
						s.email,
						s.category,
						s.status
					]),
					empty: "Sin tickets de soporte."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Tryouts",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxTable, {
					headers: [
						"Tag",
						"Discord",
						"Rol",
						"Juego",
						"Estado"
					],
					rows: (data?.applications ?? []).map((a) => [
						a.gamertag,
						a.discord_username,
						a.role,
						a.game,
						a.status
					]),
					empty: "Sin postulaciones."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold",
					children: "Stripe catálogo conocido"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: STRIPE_LIVE.productsLive.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-line bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-ok",
							children: p.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: p.name
						})]
					}, p.id))
				})]
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-semibold",
			children: title
		}), children]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-line bg-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 font-display text-3xl font-semibold",
			children: value
		})]
	});
}
function InboxTable({ headers, rows, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 overflow-x-auto border border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface font-mono text-[10px] uppercase tracking-[0.12em] text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: headers.length,
				className: "px-3 py-6 text-center text-subtle",
				children: empty
			}) }) : rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t border-line",
				children: row.map((cell, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-3 py-2",
					children: cell
				}, j))
			}, i)) })]
		})
	});
}
//#endregion
export { AdminPage as component };
