import { createFileRoute, Link } from "@tanstack/react-router";
import { LEGAL_CATEGORIES, LEGAL_DOCS } from "@/lib/legal/catalog";

export const Route = createFileRoute("/legal/")({ component: LegalIndex });

function LegalIndex() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">07 / Legal OS</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Marco legal VANTCALL.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Documentos públicos de CROSAIM. Versión 1.0 · 20 sep 2026. La entidad societaria definitiva sigue pendiente — los cobros van por Stripe a nombre de feispla, Ltd.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEGAL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="border border-line bg-surface p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              {cat.code} / {cat.title}
            </p>
            <p className="mt-3 text-sm text-muted">{cat.blurb}</p>
            <ul className="mt-4 space-y-2">
              {LEGAL_DOCS.filter((d) => d.category === cat.id).map((d) => (
                <li key={d.slug}>
                  <Link to="/legal/$slug" params={{ slug: d.slug }} className="text-sm text-fg hover:text-accent">
                    {d.code} {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
