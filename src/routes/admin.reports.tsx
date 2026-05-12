import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — InternFlow AI" }] }),
  component: () => <ComingSoon title="Reports" subtitle="Manage your reports from a single source of truth." />,
});
