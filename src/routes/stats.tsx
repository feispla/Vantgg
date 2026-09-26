import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Activity, DollarSign, Calendar, Users, Target, TrendingUp, Award } from "lucide-react";
import { RequireAuth } from "@/components/require-auth";
import { getStats } from "@/lib/platform/stats.server";

export const Route = createFileRoute("/stats")({
  component: () => (
    <RequireAuth>
      <StatsPage />
    </RequireAuth>
  ),
});

function StatsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">05 / Estadísticas</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-[-0.06em]">Dashboard</h1>
      <p className="mt-4 max-w-2xl text-muted">Métricas en vivo de torneos, ranked, ingresos y eventos del ecosistema VANT.</p>

      <StatsGrid />
    </main>
  );
}

function StatsGrid() {
  const stats = getStats();

  const tournamentStats = stats.tournaments as Record<string, number>;
  const rankedStats = stats.ranked as Record<string, unknown>;
  const revenueStats = stats.revenue as Record<string, number>;
  const eventStats = stats.events as Record<string, number>;

  const cards = [
    { label: "Torneos activos", value: tournamentStats.active_tournaments ?? 0, icon: Trophy, tone: "text-accent" },
    { label: "Inscripciones totales", value: tournamentStats.total_entries ?? 0, icon: Users, tone: "text-cyan" },
    { label: "Partidas ranked", value: rankedStats.total_matches ?? 0, icon: Activity, tone: "text-ok" },
    { label: "Eventos próximos", value: eventStats.upcoming_events ?? 0, icon: Calendar, tone: "text-warn" },
    { label: "Compras pagadas", value: revenueStats.paid_purchases ?? 0, icon: DollarSign, tone: "text-accent" },
    { label: "Tickets emitidos", value: revenueStats.total_tickets ?? 0, icon: Award, tone: "text-cyan" },
    { label: "Postulaciones", value: eventStats.total_postulaciones ?? 0, icon: Target, tone: "text-ok" },
    { label: "RSVPs", value: eventStats.total_rsvps ?? 0, icon: TrendingUp, tone: "text-accent" },
  ];

  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.tone}`} />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
