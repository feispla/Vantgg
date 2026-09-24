import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, W as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as productById } from "./avatar-DYTTtK-m.mjs";
import { _ as buttonVariants, u as Route$35 } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { r as getMyTickets } from "./commerce-BkEjZ3VT.mjs";
import { t as AppShell } from "./app-shell-oKvsAQA6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-tickets-Ce3o--jn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cellsFromCode(code) {
	const size = 21;
	const cells = [];
	let h = 2166136261;
	for (let i = 0; i < code.length; i++) h = Math.imul(h ^ code.charCodeAt(i), 16777619);
	for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (x < 7 && y < 7 || x >= 14 && y < 7 || x < 7 && y >= 14) {
		const dx = x < 7 ? x : x >= 14 ? x - 14 : x;
		const dy = y < 7 ? y : y >= 14 ? y - 14 : y;
		const ring = dx === 0 || dy === 0 || dx === 6 || dy === 6 || dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
		cells.push(ring);
	} else {
		const bit = (h ^ Math.imul(x + 3, y + 11) ^ code.charCodeAt((x + y) % code.length)) & 1;
		cells.push(bit === 1);
	}
	return {
		size,
		cells
	};
}
function QrMark({ value, className }) {
	const { size, cells } = cellsFromCode(value);
	const s = 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${size * s} ${size * s}`,
		className,
		role: "img",
		"aria-label": `Código visual ${value}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: size * s,
			height: size * s,
			fill: "#0b0912"
		}), cells.map((on, i) => on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: i % size * s,
			y: Math.floor(i / size) * s,
			width: s,
			height: s,
			fill: i % 17 === 0 ? "#22d3ee" : "#e8e4ff"
		}, i) : null)]
	});
}
function MyTicketsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {}) });
}
function Body() {
	const { code } = Route$35.useSearch();
	const [tickets, setTickets] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getMyTickets().then(setTickets).finally(() => setLoaded(true));
	}, []);
	const selected = code ? tickets.find((t) => t.code === code) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Mis tickets",
		kicker: "Acceso",
		children: !loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-surface" }) : tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: [
				"No hay tickets pagados.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tickets",
					className: "underline",
					children: "Comprar"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: tickets.map((t) => {
				const product = productById(t.product_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass-card rounded-2xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
							children: ["Ticket ", product?.name ?? t.product_id]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm",
							children: ["Estado: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ok",
								children: t.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-sm",
							children: ["Código: ", t.code]
						}),
						selected?.id === t.id || tickets.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrMark, {
							value: t.code,
							className: "mt-4 h-40 w-40 rounded-xl border border-line"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/my-tickets",
							search: { code: t.code },
							className: cn(buttonVariants({
								variant: "ghost",
								size: "sm"
							}), "mt-4"),
							children: "Ver ticket"
						})
					]
				}, t.id);
			})
		})
	});
}
//#endregion
export { MyTicketsPage as component };
