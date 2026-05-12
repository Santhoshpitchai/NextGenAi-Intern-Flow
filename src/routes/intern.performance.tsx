import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/performance")({
  head: () => ({ meta: [{ title: "Performance — InternFlow AI" }] }),
  component: () => <ComingSoon title="Performance" subtitle="Your performance hub. Connected to your workspace." />,
});
