import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/require-auth";
import { Steps } from "@/components/steps";
import { buttonVariants } from "@/components/ui/button";
import { getMyPurchaseBySession } from "@/lib/platform/commerce";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <RequireAuth>
      <Body />
    </RequireAuth>
  );
}

function Body() {
  const { session_id } = Route.useSearch();
  const user = useCurrentUser();
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyPurchaseBySession>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) return;
    let stop = false;
    async function poll() {
      try {
        const res = await getMyPurchaseBySession({ data: { sessionId: session_id! } });
        if (stop) return;
        setData(res);
        if (res.purchase?.status === "pending") {
          setTimeout(poll, 2000);
        }
      } catch (err) {
        if (!stop) setError(err instanceof Error ? err.message : "No se pudo cargar la compra.");
      }
    }
    void poll();
    return () => {
      stop = true;
    };
  }, [session_id]);

  const status = data?.purchase?.status ?? "pending";
  const confirmed = status === "paid";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <Steps step={4} />
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-ok">
        {confirmed ? "Pago confirmado" : "Esperando confirmación"}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold">
        {confirmed ? "¡Compra confirmada!" : "Confirmando con Stripe…"}
      </h1>
      <p className="mt-3 text-sm text-muted">
        La fuente de verdad es el webhook (o la API de Stripe en el servidor). El redirect solo abre esta pantalla.
      </p>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <dl className="mt-8 space-y-3 text-left text-sm">
        <Row k="Nombre" v={user?.displayName ?? "—"} />
        <Row k="Producto" v={data?.product?.name ?? "—"} />
        <Row k="Ticket" v={data?.ticket?.code ?? data?.purchase?.ticket_code ?? "—"} />
        <Row k="ID de compra" v={data?.purchase?.id ?? "—"} />
        <Row k="Estado" v={status} />
        <Row
          k="Fecha"
          v={data?.purchase?.created_at ? new Date(data.purchase.created_at).toLocaleString("es") : "—"}
        />
        <Row k="Método" v={data?.purchase?.payment_method ?? "Stripe"} />
        <Row k="Código" v={data?.ticket?.code ?? "—"} />
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/my-tickets" className={buttonVariants()}>
          Ver mis tickets
        </Link>
        <Link to="/profile" className={cn(buttonVariants({ variant: "ghost" }))}>
          Ver mi perfil
        </Link>
        <Link to="/" className={cn(buttonVariants({ variant: "quiet" }))}>
          Volver a VANT
        </Link>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2">
      <dt className="text-subtle">{k}</dt>
      <dd className="font-mono text-xs">{v}</dd>
    </div>
  );
}
