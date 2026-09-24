import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants, g as Button, m as SignedOut, p as SignedIn, y as useCurrentUserState } from "./router-Zz1eqit4.mjs";
import { n as rsvpEvent, t as listMyRsvps } from "./leads-CrD0TF4E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events-CQjKjDwl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EVENTS = [
	{
		id: "tryout-veil-01",
		code: "T-01",
		kind: "tryout",
		title: "Tryouts VALORANT — roster abierto",
		when: "27 sep 2026 · 19:00 CEST",
		whenIso: "2026-09-27T19:00:00+02:00",
		game: "VALORANT",
		slots: 12,
		open: true,
		blurb: "VOD + 3 maps. Prioridad Operator y Founding Mark. Scout entra a la cola."
	},
	{
		id: "ops-brief-02",
		code: "O-02",
		kind: "ops",
		title: "Briefing Command — pipeline de septiembre",
		when: "24 sep 2026 · 21:00 CEST",
		whenIso: "2026-09-24T21:00:00+02:00",
		game: "Ops",
		slots: 8,
		open: true,
		blurb: "Revisión de postulaciones, cupos de evento y reglas de integridad."
	},
	{
		id: "scrim-03",
		code: "S-03",
		kind: "scrim",
		title: "Scrims internos Operator",
		when: "29 sep 2026 · 20:30 CEST",
		whenIso: "2026-09-29T20:30:00+02:00",
		game: "VALORANT",
		slots: 10,
		open: true,
		blurb: "Solo Operator+. Formato BO3. Stats van al Control Plane."
	},
	{
		id: "community-04",
		code: "C-04",
		kind: "community",
		title: "Noche Scout — watch party Kick",
		when: "02 oct 2026 · 22:00 CEST",
		whenIso: "2026-10-02T22:00:00+02:00",
		game: "Community",
		slots: 80,
		open: true,
		blurb: "Stream en Kick con FEISS. Scout gratis. Preguntas al roster."
	}
];
function EventsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "09 / Calendario"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Próximos ciclos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Tryouts, scrims y briefings. RSVP con cuenta. Operator tiene prioridad de plaza."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 lg:grid-cols-2",
				children: EVENTS.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col border border-line bg-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
								children: [
									ev.code,
									" / ",
									ev.kind
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
								children: [ev.slots, " plazas"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-2xl font-semibold tracking-[-0.03em]",
							children: ev.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ok",
							children: ev.when
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 flex-1 text-sm leading-6 text-muted",
							children: ev.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RsvpBlock, { eventId: ev.id })
					]
				}, ev.id))
			})
		]
	});
}
function RsvpBlock({ eventId }) {
	const [mine, setMine] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [discord, setDiscord] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const { user, isPending } = useCurrentUserState();
	const signedIn = !isPending && user && !user.isDevFallback;
	(0, import_react.useEffect)(() => {
		if (!signedIn) return;
		listMyRsvps().then((rows) => setMine(rows.some((r) => r.event_id === eventId))).catch(() => setMine(false));
	}, [eventId, signedIn]);
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await rsvpEvent({ data: {
				eventId,
				displayName: name,
				discord
			} });
			setMine(true);
			setOpen(false);
		} catch {
			setError("Entra con una cuenta e inténtalo de nuevo.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			className: cn(buttonVariants({ variant: "ghost" }), "w-full"),
			children: "Entrar para RSVP"
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-[10px] uppercase tracking-[0.16em] text-ok",
			children: "Estás en la lista"
		}) : open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Nombre / tag",
					className: fieldClass
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					required: true,
					value: discord,
					onChange: (e) => setDiscord(e.target.value),
					placeholder: "Discord",
					className: fieldClass
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-accent",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: busy,
					children: busy ? "…" : "Confirmar RSVP"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			className: "w-full",
			onClick: () => setOpen(true),
			children: "Reservar plaza"
		}) })]
	});
}
var fieldClass = "min-h-11 w-full border border-line bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent";
//#endregion
export { EventsPage as component };
