/** Snapshot from live Stripe (acct VANT) via connector, 2026-09-20. */

export const STRIPE_LIVE = {
  account: "VANT",
  mode: "live" as const,
  currency: "EUR",
  products: 4,
  activePrices: 5,
  customers: 0,
  subscriptions: 0,
  foundingSold: 0,
  syncedAt: "2026-09-20",
  productsLive: [
    { name: "VANT Gratis", id: "prod_VHu8LSB2J0hCpu", status: "LIVE" },
    { name: "VANT Founding Mark", id: "prod_VHsRdwNODMyOWx", status: "LIVE" },
    { name: "VANT Operator", id: "prod_VHryjsGmG3vcZC", status: "LIVE" },
    { name: "VANT Command", id: "prod_VHsMD1SnrnyNCh", status: "LIVE" },
  ],
};
