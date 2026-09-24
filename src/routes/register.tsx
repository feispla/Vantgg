import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth-shell";
import { PlayerAvatar } from "@/components/player-avatar";
import { Button } from "@/components/ui/button";
import { avatarDataUrl } from "@/lib/avatar";
import { authClient, authEnabled } from "@/lib/auth/client";
import { COUNTRIES } from "@/lib/catalog";
import { completeRegistration, requestEmailVerification } from "@/lib/platform/profiles";
import { withTimeout } from "@/lib/platform/http";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    if (typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")) return { next: s.next };
    return {};
  },
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [country, setCountry] = useState("España");
  const [terms, setTerms] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => avatarDataUrl(username || name || "vant-player"), [username, name]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled || busy) return;
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError("Username: 3–20 caracteres, letras, números o _.");
      return;
    }
    if (!terms || !policy) {
      setError("Debes aceptar Términos y Política VANT.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await withTimeout(
        authClient.signUp.email({
          email,
          password,
          name: name.trim(),
        }),
        12000,
      );
      if (res.error) throw new Error(res.error.message);
      await withTimeout(
        completeRegistration({
          data: { username, country, displayName: name.trim() },
        }),
        10000,
      );
      await withTimeout(requestEmailVerification(), 6000).catch(() => undefined);
      await navigate({ to: "/verify-email" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="Registro"
      title="Crear cuenta"
      subtitle="Naces con un logo único. Luego lo editas en tu perfil."
    >
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
        <PlayerAvatar src={preview} name={username || "VANT"} size={48} className="rounded-xl" />
        <div>
          <p className="text-sm">{username || "tu_username"}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">Logo provisional</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="field" required placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="field" required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="field" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <span className="relative block">
          <input
            className="field pr-12"
            type={show ? "text" : "password"}
            required
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="absolute inset-y-0 right-3 text-subtle" onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
        <input
          className="field"
          type={show ? "text" : "password"}
          required
          minLength={8}
          placeholder="Confirmar password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <select className="field" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" className="mt-1" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          Acepto los{" "}
          <Link to="/legal/$slug" params={{ slug: "terminos" }} className="text-fg underline">
            Términos
          </Link>
        </label>
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" className="mt-1" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
          Acepto la{" "}
          <Link to="/legal/$slug" params={{ slug: "politica-vant" }} className="text-fg underline">
            Política VANT
          </Link>
        </label>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Creando…" : "Crear cuenta"}
        </Button>
      </form>
      <p className="mt-5 text-center text-xs text-subtle">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  );
}
