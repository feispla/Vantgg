import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type StatsData = {
  tournaments: Record<string, unknown>;
  ranked: Record<string, unknown>;
  revenue: Record<string, unknown>;
  events: Record<string, unknown>;
};

export const getStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const [tournaments, ranked, revenue, events] = await Promise.all([
      sql`select * from get_tournament_stats() as data`,
      sql`select * from get_ranked_stats() as data`,
      sql`select * from get_revenue_stats() as data`,
      sql`select * from get_event_stats() as data`,
    ]);
    return {
      tournaments: tournaments[0]?.data ?? {},
      ranked: ranked[0]?.data ?? {},
      revenue: revenue[0]?.data ?? {},
      events: events[0]?.data ?? {},
    } as StatsData;
  });

export const getPublicStats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const [tournaments, events] = await Promise.all([
    sql`select * from get_tournament_stats() as data`,
    sql`select * from get_event_stats() as data`,
  ]);
  return {
    tournaments: tournaments[0]?.data ?? {},
    events: events[0]?.data ?? {},
  };
});
