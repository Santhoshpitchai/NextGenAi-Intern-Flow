import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/intern/chat")({
  head: () => ({ meta: [{ title: "Chat — InternFlow AI" }] }),
  component: () => <ComingSoon title="Chat" subtitle="Your chat hub. Connected to your workspace." />,
});
