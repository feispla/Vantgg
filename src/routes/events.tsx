import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { EVENTS } from "@/lib/events";
import { listMyRsvps, rsvpEvent } from "@/lib/leads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({ component: EventsPage });

function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">09 / Calendario</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Próximos ciclos.</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Tryouts, scrims y briefings. RSVP con cuenta. Operator tiene prioridad de plaza.
      </p>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {EVENTS.map((ev) => (
          <article key={ev.id} className="flex flex-col border border-line bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                {ev.code} / {ev.kind}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                {ev.slots} plazas
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em]">{ev.title}</h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ok">{ev.when}</p>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted">{ev.blurb}</p>
            <RsvpBlock eventId={ev.id} />
          </article>
        ))}
      </div>
    </main>
  );
}

function RsvpBlock({ eventId }: { eventId: string }) {
  const [mine, setMine] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [discord, setDiscord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isPending } = useCurrentUserState();
  const signedIn = authEnabled && !isPending && user && !user.isDevFallback;

  useEffect(() => {
    if (!signedIn) return;
    listMyRsvps()
      .then((rows) => setMine(rows.some((r) => r.event_id === eventId)))
      .catch(() => setMine(false));
  }, [eventId, signedIn]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await rsvpEvent({ data: { eventId, displayName: name, discord } });
      setMine(true);
      setOpen(false);
    } catch {
      setError("Entra con una cuenta e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <SignedOut>
        <Link to="/login" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
          Entrar para RSVP
        </Link>
      </SignedOut>
      <SignedIn>
        {mine ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ok">Estás en la lista</p>
        ) : open ? (
          <form onSubmit={submit} className="space-y-3">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre / tag"
              className={fieldClass}
            />
            <input
              required
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="Discord"
              className={fieldClass}
            />
            {error ? <p className="text-xs text-accent">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "…" : "Confirmar RSVP"}
            </Button>
          </form>
        ) : (
          <Button variant="ghost" className="w-full" onClick={() => setOpen(true)}>
            Reservar plaza
          </Button>
        )}
      </SignedIn>
    </div>
  );
}

const fieldClass =
  "min-h-11 w-full border border-line bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent";
