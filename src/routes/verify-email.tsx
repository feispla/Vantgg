import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import {
  confirmEmailToken,
  getVerificationPreview,
  requestEmailVerification,
} from "@/lib/platform/profiles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>): { token?: string } => {
    if (typeof s.token === "string") return { token: s.token };
    return {};
  },
  component: VerifyEmail,
});

function VerifyEmail() {
  const { token } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    confirmEmailToken({ data: { token } })
      .then(() => {
        setState("ok");
        setMessage("Cuenta verificada.");
      })
      .catch((err) => {
        setState("err");
        setMessage(err instanceof Error ? err.message : "Enlace no válido.");
      });
  }, [token]);

  useEffect(() => {
    if (!user || user.isDevFallback) return;
    getVerificationPreview()
      .then((r) => setPreview(r.preview))
      .catch(() => setPreview(null));
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }

  if (!token && (!user || user.isDevFallback)) return <RedirectToSignIn to="/login" />;

  async function resend() {
    setBusy(true);
    try {
      const r = await requestEmailVerification();
      setPreview(r.previewUrl);
      setMessage("Correo reenviado.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo reenviar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="Verificación"
      title="Revisa tu correo para verificar tu cuenta."
      subtitle="Si no llega, reenvía. Sin proveedor de email configurado, el enlace de desarrollo aparece abajo."
    >
      {state === "ok" ? (
        <p className="text-sm text-ok">{message}</p>
      ) : (
        <>
          {message ? (
            <p className={cn("mb-4 text-sm", state === "err" ? "text-danger" : "text-muted")}>{message}</p>
          ) : null}
          {user && !user.isDevFallback ? (
            <Button className="w-full" disabled={busy} onClick={() => void resend()}>
              {busy ? "Enviando…" : "Reenviar correo"}
            </Button>
          ) : null}
          {preview ? (
            <p className="mt-4 break-all text-xs text-cyan">
              Enlace de desarrollo:{" "}
              <a className="underline" href={preview}>
                {preview}
              </a>
            </p>
          ) : null}
        </>
      )}
      <Link to="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "mt-6 w-full")}>
        Ir al dashboard
      </Link>
    </AuthShell>
  );
}
