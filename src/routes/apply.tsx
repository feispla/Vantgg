import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { submitTryoutApplication } from "@/lib/leads";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/apply")({ component: ApplyPage });

const ROLES = ["Duelist", "Controller", "Initiator", "Sentinel", "IGL", "Coach", "Content", "Other"];
const GAMES = ["Valorant", "CS2", "League", "Fortnite", "Apex", "CROSAIM: VEIL", "Other"];

type FormState = {
  tag: string;
  discord: string;
  role: string;
  game: string;
  note: string;
};

const EMPTY: FormState = { tag: "", discord: "", role: "Duelist", game: "Valorant", note: "" };

function ApplyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">05 / Tryouts</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Postúlate.</h1>
      <p className="mt-4 text-muted">
        Scout entra gratis. El bot y Control Plane procesan la cola. Entra con Google, X o email para dejar tu postulación en el pipeline real.
      </p>
      <SignedOut>
        <div className="mt-10 border border-line bg-surface p-6">
          <p className="text-sm text-muted">Necesitas cuenta para que ops vea la postulación. No se guarda en tu navegador.</p>
          <Link to="/login" className={cn(buttonVariants(), "mt-6")}>
            Entrar y postularme
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <ApplyForm />
      </SignedIn>
    </main>
  );
}

function ApplyForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.tag.trim() || !form.discord.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitTryoutApplication({ data: form });
      setSent(true);
    } catch {
      setError("No se pudo enviar. Entra de nuevo o escríbenos a feispla@hotmail.com.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-10 border border-line bg-surface p-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ok">Tryout queued</p>
        <h2 className="mt-4 font-display text-3xl font-semibold">Postulación recibida.</h2>
        <p className="mt-3 text-sm text-muted">Ops revisa el pipeline. Prioridad: Operator o Founding Mark.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/join/$planId" params={{ planId: "operator" }} className={buttonVariants()}>
            Activar Operator
          </Link>
          <Link to="/account" className={buttonVariants({ variant: "ghost" })}>
            Mi cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 space-y-5">
      <Field label="Gamertag">
        <input
          required
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className={fieldClass}
          placeholder="VANT#001"
        />
      </Field>
      <Field label="Discord">
        <input
          required
          value={form.discord}
          onChange={(e) => setForm({ ...form, discord: e.target.value })}
          className={fieldClass}
          placeholder="usuario"
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Rol">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={fieldClass}>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Juego">
          <select value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className={fieldClass}>
            {GAMES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Por qué CROSAIM">
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className={cn(fieldClass, "min-h-28 py-3")}
          placeholder="Rank, disponibilidad, VOD…"
        />
      </Field>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Enviando…" : "Enviar postulación"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const fieldClass =
  "min-h-11 w-full border border-line bg-bg px-3 text-sm text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent";
