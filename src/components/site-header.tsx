import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/ranked", label: "Ranked", code: "01" },
  { to: "/players", label: "Jugadores", code: "02" },
  { to: "/tournaments", label: "Torneos", code: "03" },
  { to: "/tickets", label: "Tickets", code: "04" },
  { to: "/events", label: "Eventos", code: "05" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && user && !user.isDevFallback;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <LogoMark />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg",
                pathname === item.to && "text-fg",
              )}
            >
              <span className="mr-2 text-accent">{item.code}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-elevated" />
          ) : signedIn ? (
            <>
              <Link to="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : authEnabled ? (
            <Link to="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Entrar
            </Link>
          ) : null}
          <Link to="/ranked" className={buttonVariants({ size: "sm" })}>
            Jugar
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      {open && (
        <div className="border-t border-line bg-surface px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="font-mono flex min-h-11 items-center justify-between border-b border-line py-3 text-[11px] uppercase tracking-[0.15em] text-muted"
            >
              <span>
                <span className="mr-3 text-accent">{item.code}</span>
                {item.label}
              </span>
            </Link>
          ))}
          {authEnabled && !signedIn && (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "ghost" }), "mt-3 w-full")}
            >
              Entrar
            </Link>
          )}
          {signedIn && (
            <div className="mt-3 flex flex-col gap-3 py-2">
              <Link to="/dashboard" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
                Dashboard
              </Link>
              <UserButton />
            </div>
          )}
          <Link to="/ranked" onClick={() => setOpen(false)} className={cn(buttonVariants(), "mt-4 w-full")}>
            Jugar Ranked
          </Link>
        </div>
      )}
    </header>
  );
}
