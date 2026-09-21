import { cn } from "@/lib/utils";

export function Steps({ step }: { step: 1 | 2 | 3 | 4 }) {
  const items = ["Cuenta", "Ticket", "Pago", "Confirmación"];
  return (
    <ol className="grid grid-cols-4 gap-2">
      {items.map((label, i) => {
        const n = i + 1;
        const active = n <= step;
        return (
          <li key={label} className="text-center">
            <div
              className={cn(
                "mx-auto h-1.5 rounded-full",
                active ? "bg-accent shadow-[0_0_12px_rgba(168,85,247,0.7)]" : "bg-line",
              )}
            />
            <p className={cn("mt-2 font-mono text-[9px] uppercase tracking-[0.14em]", active ? "text-fg" : "text-subtle")}>
              0{n} {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
