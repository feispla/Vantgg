export type EventKind = "tryout" | "scrim" | "community" | "ops";

export type CalendarEvent = {
  id: string;
  code: string;
  kind: EventKind;
  title: string;
  when: string;
  whenIso: string;
  game: string;
  slots: number;
  open: boolean;
  blurb: string;
};

export const EVENTS: CalendarEvent[] = [
  {
    id: "tryout-veil-01",
    code: "T-01",
    kind: "tryout",
    title: "Tryouts VALORANT — roster abierto",
    when: "27 sep 2026 · 19:00 CEST",
    whenIso: "2026-09-27T19:00:00+02:00",
    game: "VALORANT",
    slots: 12,
    open: true,
    blurb: "VOD + 3 maps. Prioridad Operator y Founding Mark. Scout entra a la cola.",
  },
  {
    id: "ops-brief-02",
    code: "O-02",
    kind: "ops",
    title: "Briefing Command — pipeline de septiembre",
    when: "24 sep 2026 · 21:00 CEST",
    whenIso: "2026-09-24T21:00:00+02:00",
    game: "Ops",
    slots: 8,
    open: true,
    blurb: "Revisión de postulaciones, cupos de evento y reglas de integridad.",
  },
  {
    id: "scrim-03",
    code: "S-03",
    kind: "scrim",
    title: "Scrims internos Operator",
    when: "29 sep 2026 · 20:30 CEST",
    whenIso: "2026-09-29T20:30:00+02:00",
    game: "VALORANT",
    slots: 10,
    open: true,
    blurb: "Solo Operator+. Formato BO3. Stats van al Control Plane.",
  },
  {
    id: "community-04",
    code: "C-04",
    kind: "community",
    title: "Noche Scout — watch party Kick",
    when: "02 oct 2026 · 22:00 CEST",
    whenIso: "2026-10-02T22:00:00+02:00",
    game: "Community",
    slots: 80,
    open: true,
    blurb: "Stream en Kick con FEISS. Scout gratis. Preguntas al roster.",
  },
];

export function eventById(id: string) {
  return EVENTS.find((e) => e.id === id) ?? null;
}
