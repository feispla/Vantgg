import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PROJECT_FILTERS, PROJECTS, type ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectGrid() {
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const items = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PROJECT_FILTERS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={cn(
              "min-h-10 rounded-full border px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
              filter === chip.id ? "border-cyan bg-cyan/15 text-fg" : "border-line text-muted hover:text-fg",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((project) => (
          <Link
            key={project.id}
            to={project.href as never}
            className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-[border-color,background-color] duration-200 hover:border-cyan/40 hover:bg-elevated"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                {project.kicker} · {project.year}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.14em]",
                  project.status === "LIVE" ? "text-ok" : "text-warn",
                )}
              >
                {project.status}
              </span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em]">{project.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{project.summary}</p>
            <p className="mt-3 max-h-0 overflow-hidden text-sm leading-6 text-fg/90 opacity-0 transition-all duration-200 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:opacity-100">
              {project.detail}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
