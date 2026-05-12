import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/calendar")({
  head: () => ({ meta: [{ title: "Calendar — InternFlow AI" }] }),
  component: () => <ComingSoon title="Calendar" subtitle="Your calendar hub. Connected to your workspace." />,
});
