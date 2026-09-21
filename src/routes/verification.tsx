import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import { getMyAccount, requestKycReview } from "@/lib/platform/profiles";

export const Route = createFileRoute("/verification")({ component: VerificationPage });

const LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  REVIEW: "En revisión",
  VERIFIED: "Verificada",
  REJECTED: "Rechazada",
};

function VerificationPage() {
  return (
    <RequireAuth>
      <Body />
    </RequireAuth>
  );
}

function Body() {
  const [status, setStatus] = useState<string>("PENDING");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getMyAccount().then((d) => setStatus(d.profile.verification_status));
  }, []);

  async function submit() {
    setBusy(true);
    try {
      const r = await requestKycReview({ data: { note } });
      setStatus(r.status);
      setMsg("Solicitud enviada. No subas documentos aquí.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Verificación" kicker="KYC listo">
      <div className="glass-card rounded-2xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          Estado · {LABELS[status] ?? status}
        </p>
        {status === "VERIFIED" ? (
          <p className="mt-6 flex items-center gap-2 text-ok">
            <Check className="h-5 w-5" /> Cuenta verificada
          </p>
        ) : (
          <>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
              Sistema preparado para un proveedor KYC real. No almacenamos documentos sensibles en el navegador.
              Ops revisa la cola; un admin marca VERIFIED / REJECTED.
            </p>
            <textarea
              className="field mt-6 min-h-28 py-3"
              placeholder="Nota opcional para ops (sin documentos)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button className="mt-4" disabled={busy || status === "REVIEW"} onClick={() => void submit()}>
              {status === "REVIEW" ? "En revisión" : busy ? "Enviando…" : "Pedir revisión"}
            </Button>
          </>
        )}
        {msg ? <p className="mt-4 text-sm text-cyan">{msg}</p> : null}
      </div>
    </AppShell>
  );
}
