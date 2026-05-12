import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/admin/attendance")({
  head: () => ({ meta: [{ title: "Attendance — InternFlow AI" }] }),
  component: () => <ComingSoon title="Attendance" subtitle="Manage your attendance from a single source of truth." />,
});
