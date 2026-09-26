import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { withTimeout } from "@/lib/platform/http";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    if (typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")) return { next: s.next };
    return {};
  },
  component: Login,
});

function safeNext(next: string | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

function Login() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const callbackURL = safeNext(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"idle" | "email" | "google" | "x" | "discord">("idle");

  const google = useMemo(() => GROK_PROVIDERS.find((p) => p.idp === "google"), []);
  const x = useMemo(() => GROK_PROVIDERS.find((p) => p.idp === "twitter"), []);
  const discord = useMemo(() => GROK_PROVIDERS.find((p) => p.idp === "discord"), []);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled || busy) return;
    setBusy(true);
    setMethod("email");
    setError(null);
    try {
      const res = await withTimeout(authClient.signIn.email({ email, password }), 10000);
      if (res.error) throw new Error(res.error.message);
      await navigate({ to: callbackURL });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="Acceso"
      title="Entra a VANT"
      subtitle="Google, X, Discord o email. Las postulaciones llegan a Discord por el bot."
    >
      {authEnabled ? (
        <>
          <div className="space-y-3">
            {google ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("google");
                  void signIn(google.providerId, { callbackURL });
                }}
                className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
              >
                Continuar con Google
              </button>
            ) : (
              <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">
                Google no está configurado todavía
              </p>
            )}
            {x ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("x");
                  void signIn(x.providerId, { callbackURL });
                }}
                className={cn(buttonVariants({ variant: "quiet" }), "w-full")}
              >
                Continuar con X
              </button>
            ) : null}
            {discord ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("discord");
                  void signIn(discord.providerId, { callbackURL });
                }}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Continuar con Discord
              </button>
            ) : (
              <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">
                Discord no está configurado todavía
              </p>
            )}
          </div>
          <p className="my-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            o email / password
          </p>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan">
            Método: {method === "idle" ? "elige uno" : method}
          </p>
          <form onSubmit={onEmail} className="space-y-3">
            <label className="block text-xs text-muted">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field mt-1"
              />
            </label>
            <label className="block text-xs text-muted">
              Password
              <span className="relative mt-1 block">
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 text-subtle"
                  aria-label={show ? "Ocultar password" : "Mostrar password"}
                  onClick={() => setShow((v) => !v)}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Entrando…" : "Iniciar sesión"}
            </Button>
          </form>
          <div className="mt-5 flex flex-col gap-2 text-center text-xs text-subtle">
            <Link to="/register" search={{ next: next }} className="underline">
              Crear cuenta
            </Link>
            <Link to="/forgot-password" className="underline">
              Recuperar contraseña
            </Link>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted">Sign-in desactivado.</p>
      )}
    </AuthShell>
  );
}
