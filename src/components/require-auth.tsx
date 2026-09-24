import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16">
        <div className="h-8 w-40 animate-pulse rounded-md bg-elevated" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }
  if (!user || user.isDevFallback) return <RedirectToSignIn to="/login" />;
  return <>{children}</>;
}
