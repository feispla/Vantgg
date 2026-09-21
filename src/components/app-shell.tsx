import { Link, useRouterState } from "@tanstack/react-router";
import {
  CreditCard,
  Flag,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldCheck,
  Ticket,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/profile", label: "Perfil", icon: UserRound },
  { to: "/players", label: "Jugadores", icon: Users },
  { to: "/dashboard", label: "Compras", icon: CreditCard, search: { tab: "compras" } },
  { to: "/my-tickets", label: "Tickets", icon: Ticket },
  { to: "/ranked", label: "Ranked", icon: Trophy },
  { to: "/tournaments", label: "Torneos", icon: Flag },
  { to: "/verification", label: "Verificación", icon: ShieldCheck },
  { to: "/settings", label: "Configuración", icon: Settings },
] as const;

export function AppShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();

  return (
    <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr]">
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Cuenta</p>
        <p className="mt-2 truncate text-sm text-muted">{user?.displayName ?? user?.primaryEmail}</p>
        <nav className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => {
            const active = pathname === item.to && item.label !== "Compras";
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm text-muted transition-colors hover:bg-elevated hover:text-fg",
                  active && "bg-elevated text-fg",
                )}
              >
                <item.icon className="h-4 w-4 text-accent" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => void signOut().catch(() => undefined)}
            className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm text-muted hover:bg-elevated hover:text-fg"
          >
            <LogOut className="h-4 w-4 text-danger" />
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{kicker}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em]">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
