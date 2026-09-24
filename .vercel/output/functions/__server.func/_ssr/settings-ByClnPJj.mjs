import { t as cn } from "./utils-DG8erAqy.mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { _ as buttonVariants, g as Button } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { t as AppShell } from "./app-shell-oKvsAQA6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-ByClnPJj.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Configuración",
		kicker: "Cuenta",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card space-y-4 rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Email y proveedores OAuth no se cambian sin reautenticación. Password se recupera por enlace seguro."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto"),
					children: "Cambiar contraseña"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/verify-email",
					className: cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto"),
					children: "Verificar email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/support",
					className: cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto"),
					children: "Soporte"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => void signOut().catch(() => void 0),
					children: "Cerrar sesión"
				})
			]
		})
	}) });
}
//#endregion
export { SettingsPage as component };
