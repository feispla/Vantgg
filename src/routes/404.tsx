import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/404")({ component: NotFoundPage });

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Página no encontrada</h1>
      <p className="mt-3 text-muted">Esa ruta no existe en VANT.</p>
      <Link to="/" className={cn(buttonVariants(), "mt-8")}>
        Volver a VANT
      </Link>
    </main>
  );
}
