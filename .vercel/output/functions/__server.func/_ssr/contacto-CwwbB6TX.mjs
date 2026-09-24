import { t as CONTACT_EMAIL } from "./plans-BL2SEEb7.mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ContactForm } from "./contact-form-WbhgzBt1.mjs";
import { t as SectionKicker } from "./section-kicker-DjHSDR3a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacto-CwwbB6TX.js
var import_jsx_runtime = require_jsx_runtime();
function ContactoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionKicker, {
				code: "09",
				label: "Contacto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-5xl font-semibold tracking-[-0.05em]",
				children: "Escríbenos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-md text-muted",
				children: [
					"Cada envío entra a la cola de VantBot y a ",
					CONTACT_EMAIL,
					". Sin copia en el navegador."
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, { source: "contacto" })]
	});
}
//#endregion
export { ContactoPage as component };
