import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "vant-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(KEY));
    } catch {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setVisible(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function choose(value: "all" | "essential" | "dismiss") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible || hide) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-4 backdrop-blur-xl sm:p-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl pr-8 text-sm leading-6 text-muted">
          Cookies esenciales para la sesión. Analítica solo si aceptas.{" "}
          <Link to="/cookies" className="text-fg underline underline-offset-2">
            Detalle
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => choose("essential")}>
            Solo esenciales
          </Button>
          <Button size="sm" onClick={() => choose("all")}>
            Aceptar
          </Button>
          <Button variant="quiet" size="sm" className="px-2" aria-label="Cerrar" onClick={() => choose("dismiss")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
