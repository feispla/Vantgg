import { createFileRoute, Link } from "@tanstack/react-router";
import { signOut } from "@/lib/auth/client";
import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/require-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <RequireAuth>
      <AppShell title="Configuración" kicker="Cuenta">
        <div className="glass-card space-y-4 rounded-2xl p-6">
          <p className="text-sm text-muted">
            Email y proveedores OAuth no se cambian sin reautenticación. Password se recupera por enlace seguro.
          </p>
          <Link to="/forgot-password" className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}>
            Cambiar contraseña
          </Link>
          <Link to="/verify-email" className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}>
            Verificar email
          </Link>
          <Link to="/support" className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}>
            Soporte
          </Link>
          <Button
            variant="ghost"
            onClick={() => void signOut().catch(() => undefined)}
          >
            Cerrar sesión
          </Button>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
