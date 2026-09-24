export function SectionKicker({ code, label }: { code: string; label: string }) {
  return (
    <p className="font-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-accent">
      <span className="text-subtle">{code}</span>
      <span className="h-px w-8 bg-accent/60" />
      {label}
    </p>
  );
}
