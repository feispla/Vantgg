import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "NovaTech Systems — Connected clarity";
const APP_DESCRIPTION =
  "NovaTech Systems builds the operating layer for teams navigating more variables, more velocity, and less room for noise.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: APP_DESCRIPTION },
      { name: "theme-color", content: "#0a1220" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootShell,
  notFoundComponent: NotFound,
});

function RootShell() {
  return (
    <html lang="es" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <AppFrame />
          <CookieBanner />
          <Toaster theme="dark" position="top-center" />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function AppFrame() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isNovaTech = pathname === "/";
  return (
    <div className="flex min-h-dvh flex-col">
      {!isNovaTech && <SiteHeader />}
      <div className="flex-1">
        <Outlet />
      </div>
      {!isNovaTech && <SiteFooter />}
    </div>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Página no encontrada</h1>
      <p className="mt-3 text-muted">Esa ruta no existe en VANT REALM.</p>
      <a href="/" className="mt-8 inline-block text-sm text-accent underline">
        Volver a REALM
      </a>
    </main>
  );
}
