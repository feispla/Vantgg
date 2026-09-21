import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { HeroCommand } from "@/components/hero-command";
import { PlanCard } from "@/components/plan-card";
import { RankLadder } from "@/components/rank-ladder";
import { SectionKicker } from "@/components/section-kicker";
import { buttonVariants } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <HeroCommand />

      <section id="rangos" className="border-b border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionKicker code="01" label="Circuito" />
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Siete rangos. Tres divisiones. Un techo.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Bronze a Legends, cada uno con I, II y III. Unranked hasta cerrar placement. El tablero solo lista cuentas
            reales.
          </p>
          <div className="mt-12">
            <RankLadder />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/ranked" className={buttonVariants()}>
              Entrar al Ranked
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className={buttonVariants({ variant: "ghost" })}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionKicker code="02" label="El call" />
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">
          Cinco rondas. El mark decide.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Placement", d: "Cinco partidas y el circuito te asigna Bronze a Platinum." },
            { n: "02", t: "VANT CALL", d: "Espera el isotipo. El primer frame limpio gana la ronda." },
            { n: "03", t: "MMR vivo", d: "Elo contra el rival del circuito. Promoción I → II → III." },
          ].map((step) => (
            <article key={step.n} className="glass-card rounded-3xl p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold">{step.t}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionKicker code="03" label="Entrada" />
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Ranked es gratis. El invitational no.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Juega el circuito con una cuenta. Los tickets abren Pro Series, salas privadas y Elite.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section id="contacto">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
          <div>
            <SectionKicker code="04" label="Contacto" />
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Un formulario, dos destinos.
            </h2>
            <p className="mt-4 text-muted">
              Discord vía VantBot y correo a feispla@hotmail.com. Tryouts autenticados siguen el mismo outbox.
            </p>
            <Link to="/contacto" className={cn(buttonVariants({ variant: "ghost" }), "mt-8")}>
              Página de contacto
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ContactForm source="home" />
        </div>
      </section>
    </main>
  );
}
