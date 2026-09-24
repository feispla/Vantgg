import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { QrMark } from "@/components/qr-mark";
import { RequireAuth } from "@/components/require-auth";
import { buttonVariants } from "@/components/ui/button";
import { productById } from "@/lib/catalog";
import { getMyTickets } from "@/lib/platform/commerce";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-tickets")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => {
    if (typeof s.code === "string") return { code: s.code };
    return {};
  },
  component: MyTicketsPage,
});

function MyTicketsPage() {
  return (
    <RequireAuth>
      <Body />
    </RequireAuth>
  );
}

function Body() {
  const { code } = Route.useSearch();
  const [tickets, setTickets] = useState<Awaited<ReturnType<typeof getMyTickets>>>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getMyTickets()
      .then(setTickets)
      .finally(() => setLoaded(true));
  }, []);

  const selected = code ? tickets.find((t) => t.code === code) : null;

  return (
    <AppShell title="Mis tickets" kicker="Acceso">
      {!loaded ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      ) : tickets.length === 0 ? (
        <p className="text-sm text-muted">
          No hay tickets pagados.{" "}
          <Link to="/tickets" className="underline">
            Comprar
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tickets.map((t) => {
            const product = productById(t.product_id);
            return (
              <article key={t.id} className="glass-card rounded-2xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  Ticket {product?.name ?? t.product_id}
                </p>
                <p className="mt-2 text-sm">
                  Estado: <span className="text-ok">{t.status}</span>
                </p>
                <p className="mt-1 font-mono text-sm">Código: {t.code}</p>
                {selected?.id === t.id || tickets.length === 1 ? (
                  <QrMark value={t.code} className="mt-4 h-40 w-40 rounded-xl border border-line" />
                ) : null}
                <Link
                  to="/my-tickets"
                  search={{ code: t.code }}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-4")}
                >
                  Ver ticket
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
