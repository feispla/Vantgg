export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "ops",
    title: "Operación",
    items: ["Pipeline de postulaciones", "Roster y tryouts", "Discord como superficie", "Auditoría idempotente"],
  },
  {
    id: "product",
    title: "Producto",
    items: ["Plataformas editoriales", "Simulación 3D / canvas", "Checkout y tickets", "Sistemas de diseño"],
  },
  {
    id: "stack",
    title: "Stack",
    items: ["TypeScript · React", "Supabase", "Python workers", "Stripe · Railway"],
  },
];
