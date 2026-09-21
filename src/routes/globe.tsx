import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/globe")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: function GlobeGone() {
    return null;
  },
});
