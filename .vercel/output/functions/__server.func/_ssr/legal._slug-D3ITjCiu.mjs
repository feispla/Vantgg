import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$11 } from "./router-Zz1eqit4.mjs";
import { r as docBySlug } from "./catalog-qGeQRWTI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal._slug-D3ITjCiu.js
var import_jsx_runtime = require_jsx_runtime();
function LegalDocPage() {
	const { slug } = Route$11.useParams();
	const doc = docBySlug(slug);
	if (!doc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-semibold",
			children: "Documento no encontrado"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/legal",
			className: "mt-6 inline-block text-sm text-accent underline",
			children: "Volver al índice"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/legal",
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "← Legal OS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
				children: [
					doc.code,
					" · actualizado ",
					doc.updated
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl",
				children: doc.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: doc.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 space-y-10",
				children: doc.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold text-fg",
					children: section.heading
				}), section.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-7 text-muted",
					children: p
				}, p.slice(0, 48)))] }, section.heading))
			})
		]
	});
}
//#endregion
export { LegalDocPage as component };
