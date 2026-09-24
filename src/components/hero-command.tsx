import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const PULSE = [
  { k: "Temporada", v: "S1" },
  { k: "Modo", v: "CALL" },
  { k: "Circuito", v: "LIVE" },
  { k: "Divisiones", v: "I–III" },
];

export function HeroCommand() {
  return (
    <section className="hero-wash relative overflow-hidden border-b border-line">
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">00 / Temporada 1</p>
          <div className="mt-6 flex items-center gap-5">
            <img src="/vant-logo.png" alt="" className="h-16 w-auto object-contain sm:h-20" />
            <h1 className="font-display text-5xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-7xl">
              VANT
              <span className="block text-muted">REALM</span>
            </h1>
          </div>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Circuito competitivo con insignias reales, divisiones I–III y el call que decide la serie. Bronze a
            Legends. Cuentas reales. Sin bots de relleno.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/ranked" className={buttonVariants()}>
              Jugar Ranked
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/players" className={buttonVariants({ variant: "ghost" })}>
              Leaderboard
            </Link>
            <Link to="/register" className={buttonVariants({ variant: "quiet" })}>
              Crear cuenta
            </Link>
          </div>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Estado del reino</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {PULSE.map((row) => (
              <li key={row.k} className="rounded-2xl border border-line bg-bg/60 px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{row.k}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{row.v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Placement 5 · MMR Elo · Best of call
          </p>
        </div>
      </div>
    </section>
  );
}
