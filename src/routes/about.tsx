import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { KICK_URL } from "@/lib/plans";
import { SocialLinks } from "@/components/social-links";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">12 / Origen</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Una org. Una capa. Un cobro.</h1>
      <div className="mt-10 space-y-6 text-base leading-7 text-muted">
        <p>
          CROSAIM es la cara pública de VANTCALL: el sitio donde se entra, se paga y se compete. Detrás hay un bot de Discord (VantBot), un control plane y un marco legal (Legal OS). Lo opera FEISS — streamer en Kick, builder en X @feispla.
        </p>
        <p>
          No es un clan disfrazado de startup. Scout observa. Operator juega cada semana. Command corre roster. Founding Mark deja el nombre en el muro cuando el cupo todavía es barato.
        </p>
        <p id="veil">
          CROSAIM: VEIL es el juego futuro del nodo VANTGAME. Hoy está IN DEVELOPMENT. No se vende ni se promete fecha. El dinero que entra ahora opera la capa live: web, Stripe, Discord, tryouts.
        </p>
        <p>
          Riot / VALORANT no nos patrocina. Stripe cobra en EUR a nombre de feispla, Ltd. La sociedad definitiva está por constituir — lo dice el aviso legal, no un footer de teatro.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/pricing" className={buttonVariants()}>
          Ver planes
        </Link>
        <a href={KICK_URL} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost" }))}>
          Ver stream
        </a>
      </div>
      <div className="mt-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">Redes sociales</p>
        <SocialLinks />
      </div>
    </main>
  );
}
