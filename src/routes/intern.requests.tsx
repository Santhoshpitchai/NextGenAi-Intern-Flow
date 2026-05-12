import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/requests")({
  head: () => ({ meta: [{ title: "Requests — InternFlow AI" }] }),
  component: () => <ComingSoon title="Requests" subtitle="Your requests hub. Connected to your workspace." />,
});
