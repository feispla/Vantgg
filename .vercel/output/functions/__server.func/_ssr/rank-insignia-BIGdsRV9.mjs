import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rankAsset, o as rankByKey } from "./ranks-CBPR_Saa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rank-insignia-BIGdsRV9.js
var import_jsx_runtime = require_jsx_runtime();
var SIZE_CLASS = {
	sm: "size-6",
	md: "size-10",
	lg: "size-16",
	xl: "size-24",
	hero: "size-40 sm:size-48"
};
var TONE_CLASS = {
	unranked: "text-rank-unranked",
	"bronze-1": "text-rank-bronze",
	"bronze-2": "text-rank-bronze",
	"bronze-3": "text-rank-bronze",
	"silver-1": "text-rank-silver",
	"silver-2": "text-rank-silver",
	"silver-3": "text-rank-silver",
	"gold-1": "text-rank-gold",
	"gold-2": "text-rank-gold",
	"gold-3": "text-rank-gold",
	"platinum-1": "text-rank-platinum",
	"platinum-2": "text-rank-platinum",
	"platinum-3": "text-rank-platinum",
	"diamond-1": "text-rank-diamond",
	"diamond-2": "text-rank-diamond",
	"diamond-3": "text-rank-diamond",
	"grand-champion-1": "text-rank-gc",
	"grand-champion-2": "text-rank-gc",
	"grand-champion-3": "text-rank-gc",
	"legends-1": "text-rank-legends",
	"legends-2": "text-rank-legends",
	"legends-3": "text-rank-legends"
};
function RankInsignia({ rankKey, size = "md", className, title }) {
	const rank = rankByKey(rankKey);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: rankAsset(rank.key),
		alt: title ?? `Insignia ${rank.label}`,
		title: title ?? rank.label,
		width: size === "hero" ? 192 : size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 40 : 24,
		height: size === "hero" ? 192 : size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 40 : 24,
		className: cn("shrink-0 object-contain", SIZE_CLASS[size], className),
		draggable: false
	});
}
function RankChip({ rankKey, points, size = "sm", className }) {
	const rank = rankByKey(rankKey);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex min-w-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]", TONE_CLASS[rank.key], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
			rankKey: rank.key,
			size
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "truncate",
			children: [rank.label, typeof points === "number" ? ` · ${points} MMR` : null]
		})]
	});
}
function RankShowcase({ rankKey, points, className }) {
	const rank = rankByKey(rankKey);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center text-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
				rankKey: rank.key,
				size: "hero",
				className: "rank-float"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-3 font-display text-2xl font-semibold tracking-[-0.04em]", TONE_CLASS[rank.key]),
				children: rank.label
			}),
			typeof points === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
				children: [points, " MMR"]
			}) : null
		]
	});
}
//#endregion
export { RankInsignia as n, RankShowcase as r, RankChip as t };
