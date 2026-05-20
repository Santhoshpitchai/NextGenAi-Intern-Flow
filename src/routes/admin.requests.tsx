import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Calendar, Clock, Package, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/requests")({
  head: () => ({ meta: [{ title: "Requests — InternFlow AI" }] }),
  component: RequestsPage,
});

const requests = [
  { type: "leave", icon: Calendar, who: "Sarah Jenkins", dept: "Engineering", title: "Leave Request — May 25 to May 28", body: "Family event out of town. All sprint work will be pre-shipped.", time: "2h ago", tone: "primary" },
  { type: "deadline", icon: Clock, who: "Marcus Chen", dept: "Design", title: "Deadline Extension — Brand Guidelines", body: "Needs +3 days due to additional review rounds.", time: "5h ago", tone: "warning" },
  { type: "meeting", icon: Video, who: "Elena Rodriguez", dept: "Marketing", title: "1:1 with mentor next Tuesday", body: "Quarterly check-in & growth conversation.", time: "1d ago", tone: "secondary" },
  { type: "resource", icon: Package, who: "James Okafor", dept: "Engineering", title: "Resource — Figma Pro license", body: "Need design handoff access for the new project.", time: "2d ago", tone: "primary" },
];
const toneBg: Record<string, string> = {
  primary: "bg-primary/10 text-primary", warning: "bg-warning/10 text-warning", secondary: "bg-secondary/10 text-secondary",
};

function RequestsPage() {
  return (
    <div>
      <PageHeader title="Requests" subtitle="Approve, reject, or comment on open intern requests." />
      <div className="grid lg:grid-cols-2 gap-5">
        {requests.map((r) => (
          <div key={r.title} className="p-6 rounded-2xl glass shadow-soft">
            <div className="flex items-start gap-4">
              <div className={cn("size-11 rounded-xl grid place-items-center shrink-0", toneBg[r.tone])}><r.icon className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold leading-snug">{r.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.who} · {r.dept} · {r.time}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.body}</p>
                <div className="mt-5 flex items-center gap-2">
                  <Button size="sm" className="bg-success text-success-foreground hover:opacity-90"><Check className="size-4" /> Approve</Button>
                  <Button size="sm" variant="outline"><X className="size-4" /> Reject</Button>
                  <Button size="sm" variant="ghost" className="ml-auto"><MessageSquare className="size-4" /> Comment</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
