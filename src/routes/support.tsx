import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { submitSupport } from "@/lib/platform/support";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/support")({ component: SupportPage });

const CATS = ["Pago", "Login", "Ticket", "Verificación", "Torneo", "Ranked", "Otro"] as const;

function SupportPage() {
  const user = useCurrentUser();
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.primaryEmail ?? "");
  const [category, setCategory] = useState<(typeof CATS)[number]>("Pago");
  const [purchaseId, setPurchaseId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await submitSupport({
        data: { name, email, category, purchaseId: purchaseId || undefined, message },
      });
      setDone(r.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Soporte</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Contacto</h1>
      {done ? (
        <p className="mt-8 text-sm text-ok">Mensaje recibido. ID {done.slice(0, 8)}.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <input className="field" required placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="field" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value as (typeof CATS)[number])}>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input className="field" placeholder="ID de compra (opcional)" value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} />
          <textarea
            className="field min-h-32 py-3"
            required
            minLength={10}
            placeholder="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Enviando…" : "Enviar"}
          </Button>
        </form>
      )}
    </main>
  );
}
