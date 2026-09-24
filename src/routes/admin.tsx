import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { checkAdmin } from "@/lib/admin";
import { rankFromPoints } from "@/lib/catalog";
import { getAdminConsole, setVerificationStatus } from "@/lib/platform/admin-console";
import { STRIPE_LIVE } from "@/lib/stripe-status";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminConsole>> | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!user || user.isDevFallback) {
      setAllowed(false);
      return;
    }
    checkAdmin()
      .then((r) => {
        setAllowed(r.isAdmin);
        if (r.isAdmin) return getAdminConsole().then(setData);
      })
      .catch(() => setAllowed(false));
  }, [user, isPending]);

  if (isPending || allowed === null) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Admin</p>
        <p className="mt-4 text-muted">Verificando permisos…</p>
      </main>
    );
  }

  if (!user || user.isDevFallback) return <Navigate to="/login" />;

  if (!allowed) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Admin</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Acceso denegado</h1>
        <p className="mt-4 text-muted">
          /admin requiere rol admin (email ops <span className="text-fg">feispla@zohomail.com</span>).
        </p>
        <Link to="/dashboard" className="mt-8 inline-block text-sm text-accent underline">
          Ir al dashboard
        </Link>
      </main>
    );
  }

  const entryMap = new Map((data?.entries ?? []).map((r) => [r.tournament_id, r.n]));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Admin / Control Plane</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.05em]">Panel</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Usuarios, compras, tickets, pagos Stripe, torneos, verificaciones y rankings. Los pagos solo aparecen cuando Stripe confirma el evento.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Usuarios" value={String(data?.users.length ?? 0)} />
        <Stat label="Compras" value={String(data?.purchases.length ?? 0)} />
        <Stat label="Tickets" value={String(data?.tickets.length ?? 0)} />
        <Stat label="Eventos Stripe" value={String(data?.events.length ?? 0)} />
      </div>

      <Section title="Usuarios">
        <InboxTable
          headers={["Nombre", "Email", "Username", "Verif", "Pts"]}
          rows={(data?.users ?? []).map((u) => [
            u.name,
            u.email,
            u.username ?? "—",
            u.verification_status ?? "—",
            String(u.points ?? 0),
          ])}
          empty="Sin usuarios."
        />
      </Section>

      <Section title="Compras">
        <InboxTable
          headers={["Producto", "Email", "Importe", "Estado", "Método"]}
          rows={(data?.purchases ?? []).map((p) => [
            p.product_id ?? p.plan_id,
            p.email ?? "—",
            p.amount_total != null ? `${(p.amount_total / 100).toFixed(2)} ${p.currency ?? ""}` : "—",
            p.status,
            p.payment_method ?? "—",
          ])}
          empty="Sin compras. El webhook vive en /api/stripe/webhook."
        />
      </Section>

      <Section title="Tickets">
        <InboxTable
          headers={["Código", "Producto", "Tier", "Estado"]}
          rows={(data?.tickets ?? []).map((t) => [t.code, t.product_id, t.tier, t.status])}
          empty="Sin tickets emitidos."
        />
      </Section>

      <Section title="Pagos / eventos">
        <InboxTable
          headers={["Evento", "Tipo", "Estado", "Importe"]}
          rows={(data?.events ?? []).map((e) => [e.event_id.slice(0, 18), e.type, e.status ?? "—", String(e.amount ?? "—")])}
          empty="Sin eventos de Stripe todavía."
        />
      </Section>

      <Section title="Torneos">
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {(data?.tournaments ?? []).map((t) => (
            <li key={t.id} className="flex justify-between py-3 text-sm">
              <span>{t.name}</span>
              <span className="font-mono text-accent">
                {entryMap.get(t.id) ?? 0}/{t.capacity}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Verificaciones">
        <ul className="mt-4 space-y-3">
          {(data?.verifications ?? []).length === 0 ? (
            <p className="text-sm text-subtle">Sin solicitudes.</p>
          ) : (
            (data?.verifications ?? []).map((v) => (
              <li key={v.user_id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 text-sm">
                <span>
                  {v.username ?? v.user_id.slice(0, 8)} · {v.verification_status}
                </span>
                <span className="flex gap-2">
                  {(["VERIFIED", "REJECTED", "REVIEW"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      className="rounded-lg border border-line px-2 py-1 text-[10px] uppercase"
                      onClick={() =>
                        void setVerificationStatus({ data: { userId: v.user_id, status: st } }).then(() =>
                          getAdminConsole().then(setData),
                        )
                      }
                    >
                      {st}
                    </button>
                  ))}
                </span>
              </li>
            ))
          )}
        </ul>
      </Section>

      <Section title="Rankings">
        <InboxTable
          headers={["Player", "Rank", "Pts"]}
          rows={(data?.rankings ?? []).map((r) => [
            r.username ?? r.display_name ?? "—",
            rankFromPoints(r.points).label,
            String(r.points),
          ])}
          empty="Sin ranked."
        />
      </Section>

      <Section title="Soporte">
        <InboxTable
          headers={["Nombre", "Email", "Tipo", "Estado"]}
          rows={(data?.support ?? []).map((s) => [s.name, s.email, s.category, s.status])}
          empty="Sin tickets de soporte."
        />
      </Section>

      <Section title="Tryouts">
        <InboxTable
          headers={["Tag", "Discord", "Rol", "Juego", "Estado"]}
          rows={(data?.applications ?? []).map((a) => [a.gamertag, a.discord_username, a.role, a.game, a.status])}
          empty="Sin postulaciones."
        />
      </Section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Stripe catálogo conocido</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STRIPE_LIVE.productsLive.map((p) => (
            <div key={p.id} className="border border-line bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ok">{p.status}</p>
              <p className="mt-2 text-sm">{p.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function InboxTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: string[][];
  empty: string;
}) {
  return (
    <div className="mt-4 overflow-x-auto border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-3 py-6 text-center text-subtle">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-t border-line">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
