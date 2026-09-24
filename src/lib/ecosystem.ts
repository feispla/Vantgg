export type NodeStatus = "LIVE" | "BUILD" | "NEXT";

export type EcoNode = {
  code: string;
  name: string;
  role: string;
  status: NodeStatus;
  repo: string;
  href: string;
};

export const ECOSYSTEM: EcoNode[] = [
  {
    code: "01",
    name: "Canonical Web",
    role: "Portal público, cultura competitiva y checkout Stripe.",
    status: "LIVE",
    repo: "feispla/Vantcall",
    href: "/",
  },
  {
    code: "02",
    name: "Control Plane",
    role: "Identidad, perfiles, scores, leaderboard y ops.",
    status: "LIVE",
    repo: "feispla/Vant-ControlPlane",
    href: "/admin",
  },
  {
    code: "03",
    name: "Discord Bot",
    role: "Postulaciones, roles, tryouts y auditoría.",
    status: "LIVE",
    repo: "feispla/VantBot",
    href: "/ops",
  },
  {
    code: "04",
    name: "VANTGAME",
    role: "Plataforma de juego y futuro CROSAIM: VEIL.",
    status: "BUILD",
    repo: "feispla/Vantgame",
    href: "/about",
  },
  {
    code: "05",
    name: "Legal OS",
    role: "Términos, privacidad, competición y contratos versionados.",
    status: "LIVE",
    repo: "feispla/Vantcall-Legal-OS",
    href: "/legal",
  },
  {
    code: "06",
    name: "PRISM",
    role: "Capa Hono / Prisma para servicios de integración.",
    status: "BUILD",
    repo: "feispla/honoPRISMAI.IO",
    href: "/ops",
  },
];
