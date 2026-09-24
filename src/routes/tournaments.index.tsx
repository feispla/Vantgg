import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { listTournaments, registerForTournament } from "@/lib/platform/compete";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tournaments/")({ component: TournamentsPage });

function TournamentsPage() {
  return (
    <RequireAuth>
      <Body />
    </RequireAuth>
  );
}

function Body() {
  const [data, setData] = useState<Awaited<ReturnType<typeof listTournaments>> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function reload() {
    listTournaments().then(setData).catch(() => setData(null));
  }

  useEffect(() => {
    reload();
  }, []);

  async function join(id: string) {
    setMsg(null);
    try {
      await registerForTournament({ data: { tournamentId: id } });
      setMsg("Inscripción confirmada.");
      reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "No se pudo inscribir.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Torneos</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">Circuito VANT</h1>
      <p className="mt-3 max-w-2xl text-muted">
        El registro se valida en servidor. Cambiar el HTML no te mete en un invitational.
      </p>
      <Link to="/tournaments/private" className={cn(buttonVariants({ variant: "ghost" }), "mt-6")}>
        Sala privada
      </Link>
      {msg ? <p className="mt-4 text-sm text-cyan">{msg}</p> : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {(data?.tournaments ?? []).map((t) => (
          <article key={t.id} className="glass-card rounded-2xl p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              {t.status} · {t.entry_label}
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold">{t.name}</h2>
            <p className="mt-2 text-sm text-muted">{t.blurb}</p>
            <p className="mt-4 text-sm">
              {new Date(t.starts_at).toLocaleString("es")} · {t.participants}/{t.capacity} · Premio {t.prize}
            </p>
            <p className="mt-2 text-sm">
              {t.eligible ? (
                <span className="text-ok">Tu ticket permite participar</span>
              ) : (
                <span className="text-warn">Necesitas un ticket compatible</span>
              )}
            </p>
            <Button
              className="mt-5"
              disabled={!t.eligible || t.registered || t.status !== "open"}
              onClick={() => void join(t.id)}
            >
              {t.registered ? "Inscrito" : "Inscribirme"}
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}
