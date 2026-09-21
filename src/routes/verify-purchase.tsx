import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { verifyPurchasePublic } from "@/lib/platform/commerce";

export const Route = createFileRoute("/verify-purchase")({ component: VerifyPurchase });

function VerifyPurchase() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof verifyPurchasePublic>> | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      setResult(await verifyPurchasePublic({ data: { query } }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Verificación de compra</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">Comprobar ticket</h1>
      <p className="mt-3 text-sm text-muted">Ticket ID, Purchase ID o código. No se muestran datos privados de otros usuarios.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input className="field" placeholder="VANT-XXXXXX" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Buscando…" : "Verificar"}
        </Button>
      </form>
      {result ? (
        <div className="glass-card mt-8 rounded-2xl p-5">
          {result.found && result.valid ? (
            <p className="text-ok">Compra válida · {result.productName} · {result.ticketCode}</p>
          ) : result.found ? (
            <p className="text-warn">Encontrada pero no válida ({result.status})</p>
          ) : (
            <p className="text-warn">Compra no encontrada</p>
          )}
        </div>
      ) : null}
    </main>
  );
}
