export type RosterSeat = {
  code: string;
  role: string;
  handle: string | null;
  status: "active" | "open" | "trial";
  note: string;
};

export const ROSTER: RosterSeat[] = [
  { code: "01", role: "Founder / Ops", handle: "FEISS", status: "active", note: "Dirección, stream y control plane." },
  { code: "02", role: "IGL", handle: null, status: "open", note: "Tryouts T-01. Prioridad Operator." },
  { code: "03", role: "Duelist", handle: null, status: "open", note: "Entry + first blood. VOD requerido." },
  { code: "04", role: "Controller", handle: null, status: "open", note: "Smokes y tempo de round." },
  { code: "05", role: "Initiator", handle: null, status: "open", note: "Info y space. Flex valorado." },
  { code: "06", role: "Sentinel", handle: null, status: "open", note: "Anchor + retake." },
  { code: "07", role: "Coach", handle: null, status: "open", note: "VOD review y anti-strats." },
  { code: "08", role: "Content", handle: "FEISS", status: "active", note: "Kick + X. Clips oficiales." },
];

export const ORG = {
  name: "VANT Sports",
  layer: "CROSAIM",
  game: "VALORANT",
  region: "EU",
  founded: "2026",
};
