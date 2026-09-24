import { createFileRoute, Navigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/account")({ component: AccountRedirect });

function AccountRedirect() {
  return (
    <RequireAuth>
      <Navigate to="/dashboard" />
    </RequireAuth>
  );
}
