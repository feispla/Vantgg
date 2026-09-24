import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { resetPasswordWithToken } from "@/lib/platform/profiles";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
  component: Reset,
});

function Reset() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPasswordWithToken({ data: { token, password } });
      setOk(true);
      setTimeout(() => navigate({ to: "/login" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo restablecer.");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <AuthShell kicker="Reset" title="Enlace incompleto" subtitle="Pide un nuevo enlace desde recuperar contraseña.">
        <p className="text-sm text-muted">Falta el token.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell kicker="Reset" title="Nueva contraseña" subtitle="Elige una contraseña de al menos 8 caracteres.">
      {ok ? (
        <p className="text-sm text-ok">Contraseña actualizada. Te llevamos al login…</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="field"
            type="password"
            required
            minLength={8}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="field"
            type="password"
            required
            minLength={8}
            placeholder="Confirmar"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Guardando…" : "Guardar y entrar"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
