import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/tasks")({
  head: () => ({ meta: [{ title: "Tasks — InternFlow AI" }] }),
  component: () => <ComingSoon title="Tasks" subtitle="Your tasks hub. Connected to your workspace." />,
});
