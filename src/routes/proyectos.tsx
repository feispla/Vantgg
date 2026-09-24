import { createFileRoute } from "@tanstack/react-router";
import { ProjectGrid } from "@/components/project-grid";
import { SectionKicker } from "@/components/section-kicker";

export const Route = createFileRoute("/proyectos")({ component: ProyectosPage });

function ProyectosPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionKicker code="06" label="Portafolio" />
      <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
        Piezas que operan.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Hover para el detalle. Filtra por capa. Cada tarjeta abre la escena o la consola correspondiente.
      </p>
      <div className="mt-12">
        <ProjectGrid />
      </div>
    </main>
  );
}
