import { PLANS, type Plan, type PlanId } from "@/lib/plans";

export type TicketTier = "basic" | "pro" | "elite";
export type ProductKind = "ticket" | "membership";
export type Billing = "free" | "once" | "month";

export type CatalogProduct = {
  id: string;
  kind: ProductKind;
  code: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  priceHint: string;
  amountCents: number;
  currency: "eur";
  billing: Billing;
  featured?: boolean;
  available: boolean;
  stripePriceId: string | null;
  stripeProductId: string | null;
  tier: TicketTier | null;
  features: string[];
  cta: string;
};

export const TICKET_PRODUCTS: CatalogProduct[] = [
  {
    id: "vant-basic",
    kind: "ticket",
    code: "T1",
    name: "VANT BASIC",
    tagline: "Entra al circuito.",
    description: "Acceso comunitario, 1 entrada a torneos abiertos y perfil Ranked.",
    priceLabel: "€9",
    priceHint: "pago único",
    amountCents: 900,
    currency: "eur",
    billing: "once",
    available: true,
    stripePriceId: null,
    stripeProductId: null,
    tier: "basic",
    features: [
      "Ticket BASIC de por vida en esta temporada",
      "Inscripción a VANT Open",
      "Perfil Ranked (Bronze–Gold)",
      "Soporte estándar",
    ],
    cta: "Comprar BASIC",
  },
  {
    id: "vant-pro",
    kind: "ticket",
    code: "T2",
    name: "VANT PRO",
    tagline: "Compite cada semana.",
    description: "Ranked completo, Pro Series y prioridad de tryouts.",
    priceLabel: "€19",
    priceHint: "pago único",
    amountCents: 1900,
    currency: "eur",
    billing: "once",
    featured: true,
    available: true,
    stripePriceId: null,
    stripeProductId: null,
    tier: "pro",
    features: [
      "Todo BASIC",
      "VANT Pro Series",
      "Sala privada / scrims",
      "Prioridad en tryouts",
      "Rol Operator equivalente",
    ],
    cta: "Comprar PRO",
  },
  {
    id: "vant-elite",
    kind: "ticket",
    code: "T3",
    name: "VANT ELITE",
    tagline: "El asiento de invitational.",
    description: "Elite Invitational, cupo Command y marca visible en Ranked.",
    priceLabel: "€39",
    priceHint: "pago único",
    amountCents: 3900,
    currency: "eur",
    billing: "once",
    available: true,
    stripePriceId: null,
    stripeProductId: null,
    tier: "elite",
    features: [
      "Todo PRO",
      "VANT Elite Invitational",
      "Badge Elite en perfil",
      "Canal Command",
      "Revisión de verificación prioritaria",
    ],
    cta: "Comprar ELITE",
  },
];

function planToProduct(plan: Plan): CatalogProduct {
  const amount =
    plan.id === "founding" ? 1900 : plan.id === "operator" ? 1000 : plan.id === "command" ? 2900 : 0;
  const tier: TicketTier | null =
    plan.id === "command" || plan.id === "founding" ? "elite" : plan.id === "operator" ? "pro" : null;
  return {
    id: plan.id,
    kind: "membership",
    code: plan.code,
    name: plan.name,
    tagline: plan.tagline,
    description: plan.tagline,
    priceLabel: plan.priceLabel,
    priceHint: plan.priceHint,
    amountCents: amount,
    currency: "eur",
    billing: plan.cadence,
    featured: plan.featured,
    available: plan.id !== "scout",
    stripePriceId: plan.priceId,
    stripeProductId: plan.productId,
    tier,
    features: plan.features,
    cta: plan.cta,
  };
}

export const MEMBERSHIP_PRODUCTS: CatalogProduct[] = PLANS.map(planToProduct);

export const ALL_PRODUCTS: CatalogProduct[] = [...TICKET_PRODUCTS, ...MEMBERSHIP_PRODUCTS];

export function productById(id: string | undefined): CatalogProduct | null {
  if (!id) return null;
  return ALL_PRODUCTS.find((p) => p.id === id) ?? null;
}

export function isPlanId(id: string): id is PlanId {
  return PLANS.some((p) => p.id === id);
}

export const TIER_RANK: Record<TicketTier, number> = { basic: 1, pro: 2, elite: 3 };

export function tierMeets(have: TicketTier | null | undefined, need: TicketTier | "none"): boolean {
  if (need === "none") return true;
  if (!have) return false;
  return TIER_RANK[have] >= TIER_RANK[need];
}

export const COUNTRIES = [
  "España",
  "México",
  "Argentina",
  "Colombia",
  "Chile",
  "Perú",
  "Estados Unidos",
  "Reino Unido",
  "Francia",
  "Alemania",
  "Italia",
  "Portugal",
  "Brasil",
  "Canadá",
  "Países Bajos",
  "Bélgica",
  "Suecia",
  "Polonia",
  "Turquía",
  "Japón",
  "Corea del Sur",
  "Australia",
  "Otro",
] as const;

export {
  RANKS,
  RANK_TIERS,
  PLACEMENT_MATCHES,
  rankFromPoints,
  rankByKey,
  nextRank,
  rankAsset,
  rankIndex,
  type RankKey,
  type Rank,
} from "@/lib/ranks";

