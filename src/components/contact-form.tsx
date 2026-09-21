import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/platform/inbound";
import { withTimeout } from "@/lib/platform/http";

export function ContactForm({ source = "contact" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [discord, setDiscord] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await withTimeout(
        submitContact({
          data: { name, email, subject: subject || undefined, message, source, discord: discord || undefined },
        }),
        8000,
      );
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ok">Enviado</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">Lo tenemos.</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Copia a Discord (cola VantBot) y a feispla@hotmail.com. Si el bot está vivo, aparece en revisión.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Nombre</span>
          <input className="field mt-2" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Email</span>
          <input className="field mt-2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Asunto</span>
          <input className="field mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Discord</span>
          <input className="field mt-2" value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="opcional" />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Mensaje</span>
        <textarea className="field mt-2 min-h-32 py-3" required minLength={8} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? "Enviando…" : "Enviar a Discord y correo"}
      </Button>
    </form>
  );
}
