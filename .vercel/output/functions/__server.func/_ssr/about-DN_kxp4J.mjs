import { t as cn } from "./utils-DG8erAqy.mjs";
import { n as KICK_URL } from "./plans-BL2SEEb7.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as buttonVariants } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-DN_kxp4J.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "12 / Origen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Una org. Una capa. Un cobro."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 space-y-6 text-base leading-7 text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CROSAIM es la cara pública de VANTCALL: el sitio donde se entra, se paga y se compete. Detrás hay un bot de Discord (VantBot), un control plane y un marco legal (Legal OS). Lo opera FEISS — streamer en Kick, builder en X @feispla." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No es un clan disfrazado de startup. Scout observa. Operator juega cada semana. Command corre roster. Founding Mark deja el nombre en el muro cuando el cupo todavía es barato." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: "veil",
						children: "CROSAIM: VEIL es el juego futuro del nodo VANTGAME. Hoy está IN DEVELOPMENT. No se vende ni se promete fecha. El dinero que entra ahora opera la capa live: web, Stripe, Discord, tryouts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Riot / VALORANT no nos patrocina. Stripe cobra en EUR a nombre de feispla, Ltd. La sociedad definitiva está por constituir — lo dice el aviso legal, no un footer de teatro." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/pricing",
					className: buttonVariants(),
					children: "Ver planes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: KICK_URL,
					target: "_blank",
					rel: "noreferrer",
					className: cn(buttonVariants({ variant: "ghost" })),
					children: "Ver stream"
				})]
			})
		]
	});
}
//#endregion
export { AboutPage as component };
