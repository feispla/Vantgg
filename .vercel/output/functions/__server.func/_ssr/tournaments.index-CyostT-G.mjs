import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants, g as Button } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { i as registerForTournament, r as listTournaments } from "./compete-Er1YmlUw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tournaments.index-CyostT-G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TournamentsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {}) });
}
function Body() {
	const [data, setData] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	function reload() {
		listTournaments().then(setData).catch(() => setData(null));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	async function join(id) {
		setMsg(null);
		try {
			await registerForTournament({ data: { tournamentId: id } });
			setMsg("Inscripción confirmada.");
			reload();
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "No se pudo inscribir.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "Torneos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold",
				children: "Circuito VANT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted",
				children: "El registro se valida en servidor. Cambiar el HTML no te mete en un invitational."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tournaments/private",
				className: cn(buttonVariants({ variant: "ghost" }), "mt-6"),
				children: "Sala privada"
			}),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-cyan",
				children: msg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-4 md:grid-cols-2",
				children: (data?.tournaments ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass-card rounded-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.14em] text-accent",
							children: [
								t.status,
								" · ",
								t.entry_label
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl font-semibold",
							children: t.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: t.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm",
							children: [
								new Date(t.starts_at).toLocaleString("es"),
								" · ",
								t.participants,
								"/",
								t.capacity,
								" · Premio ",
								t.prize
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: t.eligible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ok",
								children: "Tu ticket permite participar"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-warn",
								children: "Necesitas un ticket compatible"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-5",
							disabled: !t.eligible || t.registered || t.status !== "open",
							onClick: () => void join(t.id),
							children: t.registered ? "Inscrito" : "Inscribirme"
						})
					]
				}, t.id))
			})
		]
	});
}
//#endregion
export { TournamentsPage as component };
