import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/platform/profiles";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset({ data: { email } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="Recuperación"
      title="¿Olvidaste tu contraseña?"
      subtitle="Si el email existe, enviaremos un enlace seguro. La contraseña nunca se guarda en texto plano."
    >
      {done ? (
        <p className="text-sm leading-6 text-ok">
          Si hay una cuenta con ese correo, recibirás el enlace. Revisa bandeja y spam.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="field"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
