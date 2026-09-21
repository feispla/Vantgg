import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/error")({ component: ErrorPage });

function ErrorPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-magenta">Error</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Algo no ha ido bien</h1>
      <p className="mt-3 text-muted">Puedes reintentar o escribir a soporte. El mensaje técnico se muestra si la app lo reporta.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className={buttonVariants()}>
          Volver a VANT
        </Link>
        <Link to="/support" className={buttonVariants({ variant: "ghost" })}>
          Soporte
        </Link>
      </div>
    </main>
  );
}
