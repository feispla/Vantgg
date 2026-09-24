import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as LEGAL_DOCS, t as LEGAL_CATEGORIES } from "./catalog-qGeQRWTI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal.index-DxuwpcYr.js
var import_jsx_runtime = require_jsx_runtime();
function LegalIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "07 / Legal OS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Marco legal VANTCALL."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: "Documentos públicos de CROSAIM. Versión 1.0 · 20 sep 2026. La entidad societaria definitiva sigue pendiente — los cobros van por Stripe a nombre de feispla, Ltd."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: LEGAL_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-line bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.16em] text-accent",
							children: [
								cat.code,
								" / ",
								cat.title
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: cat.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: LEGAL_DOCS.filter((d) => d.category === cat.id).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/legal/$slug",
								params: { slug: d.slug },
								className: "text-sm text-fg hover:text-accent",
								children: [
									d.code,
									" ",
									d.title
								]
							}) }, d.slug))
						})
					]
				}, cat.id))
			})
		]
	});
}
//#endregion
export { LegalIndex as component };
