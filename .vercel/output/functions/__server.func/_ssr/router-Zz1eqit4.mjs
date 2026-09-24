import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as newId, t as cn } from "./utils-DG8erAqy.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { n as KICK_URL, t as CONTACT_EMAIL } from "./plans-BL2SEEb7.mjs";
import { F as object, M as literal, P as number, R as string, z as union } from "../_libs/@better-auth/core+[...].mjs";
import { B as redirect, C as require_jsx_runtime, S as useRouter, W as require_react, _ as createFileRoute, b as Navigate, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut, t as authClient } from "./client-CVqXY6bk.mjs";
import { i as hasGateSessionMarker, t as auth } from "./server-DmcI2TpJ.mjs";
import { a as verifyVantSync, i as leasePendingEvents, r as ackEvent, t as deliverInbound } from "./inbound-delivery.server-KjBePoSb.mjs";
import { t as handleStripeWebhook } from "./stripe.server-ficCO77n.mjs";
import { f as Menu, o as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-ClOiUQ-z.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Zz1eqit4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-xl font-medium uppercase tracking-[0.14em] transition-[opacity,transform,background-color,border-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "border border-line bg-transparent text-fg hover:border-accent/50 hover:bg-elevated",
			quiet: "text-muted hover:text-fg",
			cyan: "bg-cyan text-bg hover:opacity-90"
		},
		size: {
			md: "min-h-11 px-5 py-3 text-[11px]",
			sm: "min-h-10 px-4 py-2 text-[10px]",
			lg: "min-h-12 px-6 py-3.5 text-[11px]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(function Button({ className, variant, size, type = "button", ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
var KEY = "vant-cookie-consent";
function CookieBanner() {
	const [visible, setVisible] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const hide = pathname.startsWith("/checkout") || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password");
	(0, import_react.useEffect)(() => {
		try {
			setVisible(!localStorage.getItem(KEY));
		} catch {
			setVisible(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!visible) return;
		function onKey(e) {
			if (e.key === "Escape") setVisible(false);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [visible]);
	function choose(value) {
		try {
			localStorage.setItem(KEY, value);
		} catch {}
		setVisible(false);
	}
	if (!visible || hide) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-4 backdrop-blur-xl sm:p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-2xl pr-8 text-sm leading-6 text-muted",
				children: [
					"Cookies esenciales para la sesión. Analítica solo si aceptas.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cookies",
						className: "text-fg underline underline-offset-2",
						children: "Detalle"
					}),
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => choose("essential"),
						children: "Solo esenciales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => choose("all"),
						children: "Aceptar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "sm",
						className: "px-2",
						"aria-label": "Cerrar",
						onClick: () => choose("dismiss"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			})]
		})
	});
}
function LogoMark({ compact = false, className, to = "/" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		"aria-label": "VANTS home",
		className: cn("flex items-center gap-3 text-fg", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/vant-logo.png",
			alt: "",
			width: 40,
			height: 24,
			className: "h-8 w-auto object-contain"
		}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[15px] font-bold tracking-[0.28em]",
			children: "VANTS"
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-line bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-sm leading-6 text-muted",
						children: "VANTS · circuito competitivo. Ranked, tickets, tryouts y el bot que no duerme."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
					children: "Escenas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/players",
							className: "hover:text-fg",
							children: "Jugadores"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ranked",
							className: "hover:text-fg",
							children: "Ranked"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "hover:text-fg",
							children: "Acerca"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contacto",
							className: "hover:text-fg",
							children: "Contacto"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
					children: "Plataforma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tickets",
							className: "hover:text-fg",
							children: "Tickets"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ranked",
							className: "hover:text-fg",
							children: "Ranked"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tournaments",
							className: "hover:text-fg",
							children: "Torneos"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/apply",
							className: "hover:text-fg",
							children: "Tryouts"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ops",
							className: "hover:text-fg",
							children: "Ops / Bot"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/legal",
							className: "hover:text-fg",
							children: "Legal OS"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-subtle",
					children: "Señal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${CONTACT_EMAIL}`,
							className: "hover:text-fg",
							children: CONTACT_EMAIL
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://x.com/feispla",
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-fg",
							children: "X @feispla"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: KICK_URL,
							target: "_blank",
							rel: "noreferrer",
							className: "hover:text-fg",
							children: "Kick / feispla"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/support",
							className: "hover:text-fg",
							children: "Soporte"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-3 px-4 py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 VANTS. Todos los derechos reservados." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Temporada 1 · VantBot" })]
			})
		})]
	});
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		to: "/ranked",
		label: "Ranked",
		code: "01"
	},
	{
		to: "/players",
		label: "Jugadores",
		code: "02"
	},
	{
		to: "/tournaments",
		label: "Torneos",
		code: "03"
	},
	{
		to: "/tickets",
		label: "Tickets",
		code: "04"
	},
	{
		to: "/events",
		label: "Eventos",
		code: "05"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { user, isPending } = useCurrentUserState();
	const signedIn = !isPending && user && !user.isDevFallback;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-6 lg:flex",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg", pathname === item.to && "text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 text-accent",
							children: item.code
						}), item.label]
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-3 lg:flex",
					children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-pulse rounded-full bg-elevated" }) : signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: cn(buttonVariants({
							variant: "ghost",
							size: "sm"
						})),
						children: "Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: cn(buttonVariants({
							variant: "ghost",
							size: "sm"
						})),
						children: "Entrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ranked",
						className: buttonVariants({ size: "sm" }),
						children: "Jugar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "px-2 lg:hidden",
					"aria-label": open ? "Cerrar menú" : "Abrir menú",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-line bg-surface px-4 py-3 lg:hidden",
			children: [
				NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "font-mono flex min-h-11 items-center justify-between border-b border-line py-3 text-[11px] uppercase tracking-[0.15em] text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-3 text-accent",
						children: item.code
					}), item.label] })
				}, item.to)),
				!signedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					onClick: () => setOpen(false),
					className: cn(buttonVariants({ variant: "ghost" }), "mt-3 w-full"),
					children: "Entrar"
				}),
				signedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						onClick: () => setOpen(false),
						className: cn(buttonVariants({ variant: "ghost" }), "w-full"),
						children: "Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/ranked",
					onClick: () => setOpen(false),
					className: cn(buttonVariants(), "mt-4 w-full"),
					children: "Jugar Ranked"
				})
			]
		})]
	});
}
var styles_default = "/assets/styles-D1Kmw29A.css";
var APP_NAME = "VANTS";
var APP_DESCRIPTION = "VANTS — circuito competitivo. Ranked, insignias Bronze a Legends, torneos y perfiles de jugador.";
var Route$54 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: APP_DESCRIPTION
			},
			{
				name: "theme-color",
				content: "#050507"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@500;600;700;800&display=swap"
			}
		]
	}),
	component: RootShell,
	notFoundComponent: NotFound
});
function RootShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppFrame, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieBanner, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						theme: "dark",
						position: "top-center"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
function AppFrame() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold",
				children: "Página no encontrada"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Esa ruta no existe en VANTS."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-8 inline-block text-sm text-accent underline",
				children: "Volver a VANTS"
			})
		]
	});
}
var $$splitComponentImporter$46 = () => import("./routes-BHhvLIEm.mjs");
var Route$53 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$46, "component") });
var $$splitComponentImporter$45 = () => import("./404-BmKn-r1j.mjs");
var Route$52 = createFileRoute("/404")({ component: lazyRouteComponent($$splitComponentImporter$45, "component") });
var $$splitComponentImporter$44 = () => import("./about-DN_kxp4J.mjs");
var Route$51 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$44, "component") });
var $$splitComponentImporter$43 = () => import("./account-CyKrrM06.mjs");
var Route$50 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$43, "component") });
var $$splitComponentImporter$42 = () => import("./admin-DkDZBpWm.mjs");
var Route$49 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
var $$splitComponentImporter$41 = () => import("./apply-1imDT7JB.mjs");
var Route$48 = createFileRoute("/apply")({ component: lazyRouteComponent($$splitComponentImporter$41, "component") });
var $$splitComponentImporter$40 = () => import("./bot-DtaNfb3T.mjs");
var Route$47 = createFileRoute("/bot")({ component: lazyRouteComponent($$splitComponentImporter$40, "component") });
var $$splitComponentImporter$39 = () => import("./checkout-BzVZZdJi.mjs");
var Route$46 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$39, "component") });
var $$splitComponentImporter$38 = () => import("./contacto-CwwbB6TX.mjs");
var Route$45 = createFileRoute("/contacto")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("./cookies-CT71R-z4.mjs");
var Route$44 = createFileRoute("/cookies")({ component: lazyRouteComponent($$splitComponentImporter$37, "component") });
var $$splitComponentImporter$36 = () => import("./dashboard-BkN1hCZO.mjs");
var Route$43 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./error-DTZ0TztX.mjs");
var Route$42 = createFileRoute("/error")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./events-CQjKjDwl.mjs");
var Route$41 = createFileRoute("/events")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./forgot-password-CCrvvyJd.mjs");
var Route$40 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./founders-Gh5PkqHE.mjs");
var Route$39 = createFileRoute("/founders")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./globe-CqXvkON9.mjs");
var Route$38 = createFileRoute("/globe")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./legal-CoeWCTtk.mjs");
var Route$37 = createFileRoute("/legal")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./login-4ppypS9x.mjs");
var Route$36 = createFileRoute("/login")({
	validateSearch: (s) => {
		if (typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")) return { next: s.next };
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./my-tickets-Ce3o--jn.mjs");
var Route$35 = createFileRoute("/my-tickets")({
	validateSearch: (s) => {
		if (typeof s.code === "string") return { code: s.code };
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./ondas-BpTV1ueq.mjs");
var Route$34 = createFileRoute("/ondas")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./ops-BvbG7rwL.mjs");
var Route$33 = createFileRoute("/ops")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./players-ac7t6ahf.mjs");
var Route$32 = createFileRoute("/players")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./pricing-ZWkc_pyo.mjs");
var Route$31 = createFileRoute("/pricing")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./profile-Bn6aNjZH.mjs");
var Route$30 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./proyectos-BoKhfvof.mjs");
var Route$29 = createFileRoute("/proyectos")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./ranked-B5AWS5oa.mjs");
var Route$28 = createFileRoute("/ranked")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./register-fM-QS0bh.mjs");
var Route$27 = createFileRoute("/register")({
	validateSearch: (s) => {
		if (typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")) return { next: s.next };
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./reset-password-C2JqaGVk.mjs");
var Route$26 = createFileRoute("/reset-password")({
	validateSearch: (s) => ({ token: typeof s.token === "string" ? s.token : "" }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./roster-DEZAM-GX.mjs");
var Route$25 = createFileRoute("/roster")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./settings-ByClnPJj.mjs");
var Route$24 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./success-Cjb8RNL2.mjs");
var Route$23 = createFileRoute("/success")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./support-jp5C15bX.mjs");
var Route$22 = createFileRoute("/support")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./tickets-JR-byFG6.mjs");
var Route$21 = createFileRoute("/tickets")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./tournaments-nQ7OymDz.mjs");
var Route$20 = createFileRoute("/tournaments")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./verification-Brn859bG.mjs");
var Route$19 = createFileRoute("/verification")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./verify-email-BUlN-q3V.mjs");
var Route$18 = createFileRoute("/verify-email")({
	validateSearch: (s) => {
		if (typeof s.token === "string") return { token: s.token };
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./verify-purchase-jaFDbQjJ.mjs");
var Route$17 = createFileRoute("/verify-purchase")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./checkout._productId-DxdtRTJt.mjs");
var Route$16 = createFileRoute("/checkout/$productId")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./checkout.cancel-5UmobBgD.mjs");
var Route$15 = createFileRoute("/checkout/cancel")({
	validateSearch: (s) => ({ product: typeof s.product === "string" ? s.product : "vant-pro" }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./checkout.success-UPywK1sV.mjs");
var Route$14 = createFileRoute("/checkout/success")({
	validateSearch: (s) => ({ session_id: typeof s.session_id === "string" ? s.session_id : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./join._planId-C_hpsBgW.mjs");
var Route$13 = createFileRoute("/join/$planId")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./legal.index-DxuwpcYr.mjs");
var Route$12 = createFileRoute("/legal/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./legal._slug-D3ITjCiu.mjs");
var Route$11 = createFileRoute("/legal/$slug")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./players.index-T7vMwQzr.mjs");
var Route$10 = createFileRoute("/players/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./players._username-BFeM4_Q2.mjs");
var Route$9 = createFileRoute("/players/$username")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./tournaments.index-CyostT-G.mjs");
var Route$8 = createFileRoute("/tournaments/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./tournaments.private-DZT6mkF9.mjs");
var Route$7 = createFileRoute("/tournaments/private")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$6 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route$5 = createFileRoute("/api/bot/health")({ server: { handlers: { GET: () => {
	const discordConfigured = Boolean(process.env.DISCORD_BOT_TOKEN);
	const syncConfigured = Boolean(process.env.VANT_BOT_SYNC_SECRET || process.env.CROSAIM_BOT_SYNC_SECRET);
	const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
	const ready = discordConfigured && syncConfigured && supabaseConfigured;
	return Response.json({
		ok: ready,
		service: "vantbot-web",
		bot: {
			runtime: "persistent-worker",
			discordConfigured
		},
		sync: { signedRequestsConfigured: syncConfigured },
		storage: { supabaseConfigured },
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	}, { status: ready ? 200 : 503 });
} } } });
async function handle$3(request) {
	const auth = await verifyVantSync(request, "");
	if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
	const events = await leasePendingEvents();
	return Response.json({ events });
}
var Route$4 = createFileRoute("/api/discord/events")({ server: { handlers: { GET: ({ request }) => handle$3(request) } } });
var Route$3 = createFileRoute("/api/stripe/webhook")({ server: { handlers: { POST: ({ request }) => handleStripeWebhook(request) } } });
async function handle$2(request) {
	const raw = await request.text();
	const auth = await verifyVantSync(request, raw);
	if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
	let body = {};
	try {
		body = raw ? JSON.parse(raw) : {};
	} catch {
		return Response.json({ error: "bad_json" }, { status: 400 });
	}
	const name = String(body.playerName ?? body.nombre ?? "Jugador");
	const discord = String(body.discordUsername ?? body.discord ?? "");
	const message = String(body.message ?? body.mensaje ?? "Postulación Discord");
	const sql = await getSql();
	const id = newId();
	await sql`
    insert into tryout_applications (id, gamertag, discord_username, role, game, note, status)
    values (
      ${id},
      ${name},
      ${discord || "discord"},
      ${String(body.role ?? "Por confirmar")},
      ${String(body.rank ?? "Valorant")},
      ${message},
      'new'
    )
  `;
	await deliverInbound({
		kind: "application",
		name,
		email: String(body.contact || "discord@vant.ltd"),
		subject: "Postulación Discord",
		message,
		source: "discord-bot",
		discord,
		extra: {
			discordMessageId: body.discordMessageId,
			applicationId: body.applicationId ?? id,
			role: body.role,
			rank: body.rank
		}
	});
	return Response.json({
		id,
		publicLookupNumber: id.slice(0, 8)
	});
}
var Route$2 = createFileRoute("/api/vant/applications")({ server: { handlers: { POST: ({ request }) => handle$2(request) } } });
async function handle$1(request) {
	const auth = await verifyVantSync(request, "");
	if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
	const events = await leasePendingEvents();
	return Response.json({ events });
}
var Route$1 = createFileRoute("/api/vant/events")({ server: { handlers: { GET: ({ request }) => handle$1(request) } } });
async function handle(request, idParam) {
	const raw = await request.text();
	const auth = await verifyVantSync(request, raw);
	if (!auth.ok) return Response.json({ error: auth.error }, { status: 401 });
	const id = Number(idParam);
	if (!Number.isFinite(id)) return Response.json({ error: "bad_id" }, { status: 400 });
	let body = {};
	try {
		body = raw ? JSON.parse(raw) : {};
	} catch {
		return Response.json({ error: "bad_json" }, { status: 400 });
	}
	if (!body.leaseToken) return Response.json({ error: "missing_lease" }, { status: 400 });
	const result = await ackEvent(id, body.leaseToken, Boolean(body.ok), body.error);
	if (!result.ok) return Response.json({ error: result.error }, { status: 409 });
	return Response.json({ ok: true });
}
var Route = createFileRoute("/api/vant/events/$id/ack")({ server: { handlers: { POST: ({ request, params }) => handle(request, params.id) } } });
var IndexRoute = Route$53.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$54
});
var R404Route = Route$52.update({
	id: "/404",
	path: "/404",
	getParentRoute: () => Route$54
});
var AboutRoute = Route$51.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$54
});
var AccountRoute = Route$50.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$54
});
var AdminRoute = Route$49.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$54
});
var ApplyRoute = Route$48.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => Route$54
});
var BotRoute = Route$47.update({
	id: "/bot",
	path: "/bot",
	getParentRoute: () => Route$54
});
var CheckoutRoute = Route$46.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$54
});
var ContactoRoute = Route$45.update({
	id: "/contacto",
	path: "/contacto",
	getParentRoute: () => Route$54
});
var CookiesRoute = Route$44.update({
	id: "/cookies",
	path: "/cookies",
	getParentRoute: () => Route$54
});
var DashboardRoute = Route$43.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$54
});
var ErrorRoute = Route$42.update({
	id: "/error",
	path: "/error",
	getParentRoute: () => Route$54
});
var EventsRoute = Route$41.update({
	id: "/events",
	path: "/events",
	getParentRoute: () => Route$54
});
var ForgotPasswordRoute = Route$40.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$54
});
var FoundersRoute = Route$39.update({
	id: "/founders",
	path: "/founders",
	getParentRoute: () => Route$54
});
var GlobeRoute = Route$38.update({
	id: "/globe",
	path: "/globe",
	getParentRoute: () => Route$54
});
var LegalRoute = Route$37.update({
	id: "/legal",
	path: "/legal",
	getParentRoute: () => Route$54
});
var LoginRoute = Route$36.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$54
});
var MyTicketsRoute = Route$35.update({
	id: "/my-tickets",
	path: "/my-tickets",
	getParentRoute: () => Route$54
});
var OndasRoute = Route$34.update({
	id: "/ondas",
	path: "/ondas",
	getParentRoute: () => Route$54
});
var OpsRoute = Route$33.update({
	id: "/ops",
	path: "/ops",
	getParentRoute: () => Route$54
});
var PlayersRoute = Route$32.update({
	id: "/players",
	path: "/players",
	getParentRoute: () => Route$54
});
var PricingRoute = Route$31.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$54
});
var ProfileRoute = Route$30.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$54
});
var ProyectosRoute = Route$29.update({
	id: "/proyectos",
	path: "/proyectos",
	getParentRoute: () => Route$54
});
var RankedRoute = Route$28.update({
	id: "/ranked",
	path: "/ranked",
	getParentRoute: () => Route$54
});
var RegisterRoute = Route$27.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$54
});
var ResetPasswordRoute = Route$26.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$54
});
var RosterRoute = Route$25.update({
	id: "/roster",
	path: "/roster",
	getParentRoute: () => Route$54
});
var SettingsRoute = Route$24.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$54
});
var SuccessRoute = Route$23.update({
	id: "/success",
	path: "/success",
	getParentRoute: () => Route$54
});
var SupportRoute = Route$22.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => Route$54
});
var TicketsRoute = Route$21.update({
	id: "/tickets",
	path: "/tickets",
	getParentRoute: () => Route$54
});
var TournamentsRoute = Route$20.update({
	id: "/tournaments",
	path: "/tournaments",
	getParentRoute: () => Route$54
});
var VerificationRoute = Route$19.update({
	id: "/verification",
	path: "/verification",
	getParentRoute: () => Route$54
});
var VerifyEmailRoute = Route$18.update({
	id: "/verify-email",
	path: "/verify-email",
	getParentRoute: () => Route$54
});
var VerifyPurchaseRoute = Route$17.update({
	id: "/verify-purchase",
	path: "/verify-purchase",
	getParentRoute: () => Route$54
});
var CheckoutProductIdRoute = Route$16.update({
	id: "/$productId",
	path: "/$productId",
	getParentRoute: () => CheckoutRoute
});
var CheckoutCancelRoute = Route$15.update({
	id: "/cancel",
	path: "/cancel",
	getParentRoute: () => CheckoutRoute
});
var CheckoutSuccessRoute = Route$14.update({
	id: "/success",
	path: "/success",
	getParentRoute: () => CheckoutRoute
});
var JoinPlanIdRoute = Route$13.update({
	id: "/join/$planId",
	path: "/join/$planId",
	getParentRoute: () => Route$54
});
var LegalIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => LegalRoute
});
var LegalSlugRoute = Route$11.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => LegalRoute
});
var PlayersIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => PlayersRoute
});
var PlayersUsernameRoute = Route$9.update({
	id: "/$username",
	path: "/$username",
	getParentRoute: () => PlayersRoute
});
var TournamentsIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => TournamentsRoute
});
var TournamentsPrivateRoute = Route$7.update({
	id: "/private",
	path: "/private",
	getParentRoute: () => TournamentsRoute
});
var ApiAuthSplatRoute = Route$6.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$54
});
var ApiBotHealthRoute = Route$5.update({
	id: "/api/bot/health",
	path: "/api/bot/health",
	getParentRoute: () => Route$54
});
var ApiDiscordEventsRoute = Route$4.update({
	id: "/api/discord/events",
	path: "/api/discord/events",
	getParentRoute: () => Route$54
});
var ApiStripeWebhookRoute = Route$3.update({
	id: "/api/stripe/webhook",
	path: "/api/stripe/webhook",
	getParentRoute: () => Route$54
});
var ApiVantApplicationsRoute = Route$2.update({
	id: "/api/vant/applications",
	path: "/api/vant/applications",
	getParentRoute: () => Route$54
});
var ApiVantEventsRoute = Route$1.update({
	id: "/api/vant/events",
	path: "/api/vant/events",
	getParentRoute: () => Route$54
});
var ApiVantEventsIdAckRoute = Route.update({
	id: "/$id/ack",
	path: "/$id/ack",
	getParentRoute: () => ApiVantEventsRoute
});
var CheckoutRouteChildren = {
	CheckoutProductIdRoute,
	CheckoutCancelRoute,
	CheckoutSuccessRoute
};
var CheckoutRouteWithChildren = CheckoutRoute._addFileChildren(CheckoutRouteChildren);
var LegalRouteChildren = {
	LegalSlugRoute,
	LegalIndexRoute
};
var LegalRouteWithChildren = LegalRoute._addFileChildren(LegalRouteChildren);
var PlayersRouteChildren = {
	PlayersUsernameRoute,
	PlayersIndexRoute
};
var PlayersRouteWithChildren = PlayersRoute._addFileChildren(PlayersRouteChildren);
var TournamentsRouteChildren = {
	TournamentsPrivateRoute,
	TournamentsIndexRoute
};
var TournamentsRouteWithChildren = TournamentsRoute._addFileChildren(TournamentsRouteChildren);
var ApiVantEventsRouteChildren = { ApiVantEventsIdAckRoute };
var rootRouteChildren = {
	IndexRoute,
	R404Route,
	AboutRoute,
	AccountRoute,
	AdminRoute,
	ApplyRoute,
	BotRoute,
	CheckoutRoute: CheckoutRouteWithChildren,
	ContactoRoute,
	CookiesRoute,
	DashboardRoute,
	ErrorRoute,
	EventsRoute,
	ForgotPasswordRoute,
	FoundersRoute,
	GlobeRoute,
	LegalRoute: LegalRouteWithChildren,
	LoginRoute,
	MyTicketsRoute,
	OndasRoute,
	OpsRoute,
	PlayersRoute: PlayersRouteWithChildren,
	PricingRoute,
	ProfileRoute,
	ProyectosRoute,
	RankedRoute,
	RegisterRoute,
	ResetPasswordRoute,
	RosterRoute,
	SettingsRoute,
	SuccessRoute,
	SupportRoute,
	TicketsRoute,
	TournamentsRoute: TournamentsRouteWithChildren,
	VerificationRoute,
	VerifyEmailRoute,
	VerifyPurchaseRoute,
	JoinPlanIdRoute,
	ApiAuthSplatRoute,
	ApiBotHealthRoute,
	ApiDiscordEventsRoute,
	ApiStripeWebhookRoute,
	ApiVantApplicationsRoute,
	ApiVantEventsRoute: ApiVantEventsRoute._addFileChildren(ApiVantEventsRouteChildren)
};
var routeTree = Route$54._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { buttonVariants as _, Route$14 as a, Route$18 as c, Route$36 as d, RedirectToSignIn as f, Button as g, LogoMark as h, Route$13 as i, Route$26 as l, SignedOut as m, Route$9 as n, Route$15 as o, SignedIn as p, Route$11 as r, Route$16 as s, router_exports as t, Route$35 as u, useCurrentUser as v, useCurrentUserState as y };
