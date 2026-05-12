import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — InternFlow AI" }] }),
  component: () => <ComingSoon title="Settings" subtitle="Manage your settings from a single source of truth." />,
});
