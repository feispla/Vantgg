import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({
  compact = false,
  className,
  to = "/",
}: {
  compact?: boolean;
  className?: string;
  to?: "/";
}) {
  return (
    <Link to={to} aria-label="VANT REALM home" className={cn("flex items-center gap-3 text-fg", className)}>
      <img src="/vant-logo.png" alt="" width={40} height={24} className="h-8 w-auto object-contain" />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-bold tracking-[0.28em]">VANT</span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-accent">Realm</span>
        </span>
      )}
    </Link>
  );
}
