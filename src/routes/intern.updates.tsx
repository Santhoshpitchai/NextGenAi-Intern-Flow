import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/updates")({
  head: () => ({ meta: [{ title: "Updates — InternFlow AI" }] }),
  component: () => <ComingSoon title="Updates" subtitle="Your updates hub. Connected to your workspace." />,
});
