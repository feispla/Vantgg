import { createFileRoute, Link } from "@tanstack/react-router";
import { docBySlug } from "@/lib/legal/catalog";

export const Route = createFileRoute("/legal/$slug")({
  component: LegalDocPage,
});

function LegalDocPage() {
  const { slug } = Route.useParams();
  const doc = docBySlug(slug);
  if (!doc) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Documento no encontrado</h1>
        <Link to="/legal" className="mt-6 inline-block text-sm text-accent underline">
          Volver al índice
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link to="/legal" className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        ← Legal OS
      </Link>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
        {doc.code} · actualizado {doc.updated}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{doc.title}</h1>
      <p className="mt-4 text-muted">{doc.summary}</p>
      <div className="mt-12 space-y-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl font-semibold text-fg">{section.heading}</h2>
            {section.body.map((p) => (
              <p key={p.slice(0, 48)} className="mt-3 text-sm leading-7 text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
