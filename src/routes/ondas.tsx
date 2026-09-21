import { createFileRoute } from "@tanstack/react-router";
import { FluidSim } from "@/components/fluid-sim";

export const Route = createFileRoute("/ondas")({ component: OndasPage });

function OndasPage() {
  return <FluidSim />;
}
