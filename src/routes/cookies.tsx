import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cookies")({ component: CookiesPage });

function CookiesPage() {
  function setConsent(value: "all" | "essential") {
    try {
      localStorage.setItem("crosaim-cookie-consent", value);
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">A.04 / Cookies</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Cookies</h1>
      <p className="mt-4 text-muted">
        Esenciales para la sesión de cuenta. Analítica de Vercel opcional. Detalle completo también en{" "}
        <Link to="/legal/$slug" params={{ slug: "cookies" }} className="text-fg underline">
          el documento legal
        </Link>
        .
      </p>
      <div className="mt-10 space-y-4 border border-line bg-surface p-6 text-sm leading-6 text-muted">
        <p>
          <span className="text-fg">Sesión</span> — cookies HttpOnly de Better Auth. Sin ellas no hay login ni postulaciones.
        </p>
        <p>
          <span className="text-fg">Analítica</span> — Vercel Web Analytics, solo si aceptas.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={() => setConsent("essential")}>
          Solo esenciales
        </Button>
        <Button onClick={() => setConsent("all")}>Aceptar analítica</Button>
      </div>
    </main>
  );
}
