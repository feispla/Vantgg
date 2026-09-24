export type ProjectCategory = "plataforma" | "ops" | "legal";

export type Project = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  detail: string;
  category: ProjectCategory;
  href: string;
  year: string;
  status: "LIVE" | "BUILD";
};

export const PROJECT_FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "plataforma", label: "Plataforma" },
  { id: "ops", label: "Ops" },
  { id: "legal", label: "Legal" },
];

export const PROJECTS: Project[] = [
  {
    id: "vantcall",
    title: "VANTCALL",
    kicker: "Canonical web",
    summary: "Capa pública: tickets, Ranked, torneos y cultura competitiva.",
    detail: "Portal de VANT.Ltd. Checkout Stripe, perfiles y el camino Scout → Operator → Command.",
    category: "plataforma",
    href: "/",
    year: "2026",
    status: "LIVE",
  },
  {
    id: "vantbot",
    title: "VantBot",
    kicker: "Discord worker",
    summary: "Ingestión, roles, entrevistas, tryouts y autoridad en Discord.",
    detail: "Worker Python en Railway. Idempotencia, ACK y reconciliación. El outbox de esta web alimenta el canal de revisión.",
    category: "ops",
    href: "/ops",
    year: "2026",
    status: "LIVE",
  },
  {
    id: "control",
    title: "Control Plane",
    kicker: "Ops console",
    summary: "Identidad, postulaciones, scores y auditoría para la org.",
    detail: "Consola admin sobre el mismo pipeline que Discord y el bot.",
    category: "ops",
    href: "/admin",
    year: "2026",
    status: "LIVE",
  },
  {
    id: "veil",
    title: "CROSAIM: VEIL",
    kicker: "Game plane",
    summary: "El plano de juego. Todavía en forja.",
    detail: "Futuro título del ecosistema. La web ya reserva el nodo.",
    category: "plataforma",
    href: "/about",
    year: "2026",
    status: "BUILD",
  },
  {
    id: "legalos",
    title: "Legal OS",
    kicker: "Contratos",
    summary: "Términos, privacidad y política de competición versionada.",
    detail: "Documentos vivos, no un PDF olvidado. Lectura clara, pie alineado.",
    category: "legal",
    href: "/legal",
    year: "2026",
    status: "LIVE",
  },
];
