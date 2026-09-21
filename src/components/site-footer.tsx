import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo";
import { CONTACT_EMAIL, KICK_URL } from "@/lib/plans";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <LogoMark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            VANT REALM · circuito competitivo. Ranked, tickets, tryouts y el bot que no duerme.
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Escenas</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link to="/players" className="hover:text-fg">Jugadores</Link></li>
            <li><Link to="/ranked" className="hover:text-fg">Ranked</Link></li>
            <li><Link to="/about" className="hover:text-fg">Acerca</Link></li>
            <li><Link to="/contacto" className="hover:text-fg">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Plataforma</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link to="/tickets" className="hover:text-fg">Tickets</Link></li>
            <li><Link to="/ranked" className="hover:text-fg">Ranked</Link></li>
            <li><Link to="/tournaments" className="hover:text-fg">Torneos</Link></li>
            <li><Link to="/apply" className="hover:text-fg">Tryouts</Link></li>
            <li><Link to="/ops" className="hover:text-fg">Ops / Bot</Link></li>
            <li><Link to="/legal" className="hover:text-fg">Legal OS</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Señal</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-fg">{CONTACT_EMAIL}</a></li>
            <li><a href="https://x.com/feispla" target="_blank" rel="noreferrer" className="hover:text-fg">X @feispla</a></li>
            <li><a href={KICK_URL} target="_blank" rel="noreferrer" className="hover:text-fg">Kick / feispla</a></li>
            <li><Link to="/support" className="hover:text-fg">Soporte</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto flex w-full max-w-6xl flex-wrap justify-between gap-3 px-4 py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:px-6">
          <span>© 2026 VANT REALM. Todos los derechos reservados.</span>
          <span>Temporada 1 · VantBot</span>
        </p>
      </div>
    </footer>
  );
}
