import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/logo";

export function AuthShell({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="hero-wash relative grid min-h-[80dvh] place-items-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 grid-veil opacity-60" />
      <div className="glass-card relative w-full max-w-md rounded-3xl p-8">
        <LogoMark />
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{kicker}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <Link to="/" className="mt-8 block text-center text-xs text-subtle underline">
          Volver a VANT
        </Link>
      </div>
    </main>
  );
}
