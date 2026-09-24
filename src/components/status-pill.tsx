import type { NodeStatus } from "@/lib/ecosystem";
import { cn } from "@/lib/utils";

const COPY: Record<NodeStatus, string> = {
  LIVE: "LIVE",
  BUILD: "IN DEVELOPMENT",
  NEXT: "FUTURE",
};

export function StatusPill({ status }: { status: NodeStatus }) {
  return (
    <span
      className={cn(
        "font-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.13em]",
        status === "LIVE" && "text-ok",
        status === "BUILD" && "text-warn",
        status === "NEXT" && "text-subtle",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "LIVE" && "bg-ok",
          status === "BUILD" && "bg-warn",
          status === "NEXT" && "bg-subtle",
        )}
      />
      {COPY[status]}
    </span>
  );
}
