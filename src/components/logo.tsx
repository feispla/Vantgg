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
    <Link to={to} aria-label="VANTS home" className={cn("flex items-center gap-3 text-fg", className)}>
      <img src="/vant-logo.png" alt="" width={40} height={24} className="h-8 w-auto object-contain" />
      {!compact && (
        <span className="font-display text-[15px] font-bold tracking-[0.28em]">VANTS</span>
      )}
    </Link>
  );
}
