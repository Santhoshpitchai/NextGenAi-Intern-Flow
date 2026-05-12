import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — InternFlow AI" }] }),
  component: ProjectsPage,
});

const projects = [
  { name: "Mobile App Redesign", desc: "Q2 launch of the new intern mobile app", progress: 78, due: "Jun 12", team: ["MC", "SJ", "JO", "EP"], status: "On Track", tone: "success" },
  { name: "Performance Reviews 2026", desc: "End-of-cycle reviews for all interns", progress: 45, due: "Jun 30", team: ["ER", "PP"], status: "At Risk", tone: "warning" },
  { name: "Onboarding Automation", desc: "Internal tooling for new hire flows", progress: 92, due: "May 25", team: ["JO", "SJ"], status: "On Track", tone: "success" },
  { name: "Brand System v3", desc: "Refresh of design tokens and components", progress: 30, due: "Jul 18", team: ["MC", "TW"], status: "In Progress", tone: "primary" },
  { name: "Analytics Pipeline", desc: "Migrate to event-driven warehouse", progress: 60, due: "Jun 22", team: ["PP", "JO", "SJ"], status: "On Track", tone: "success" },
  { name: "Recruiting Portal", desc: "Public site for intern applications", progress: 12, due: "Aug 1", team: ["MC", "ER"], status: "Planning", tone: "muted" },
];
const toneBg: Record<string, string> = {
  success: "bg-success/10 text-success", warning: "bg-warning/10 text-warning",
  primary: "bg-primary/10 text-primary", muted: "bg-muted text-muted-foreground",
};

function ProjectsPage() {
  return (
    <div>
      <PageHeader title="Projects" subtitle="Active initiatives across all departments."
        actions={<Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="size-4" /> New Project</Button>} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div key={p.name} className="p-6 rounded-2xl glass shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </div>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap", toneBg[p.tone])}>{p.status}</span>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-bold">{p.progress}%</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-primary rounded-full" style={{ width: `${p.progress}%` }} /></div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex -space-x-1.5">
                {p.team.map((t) => (<div key={t} className="size-7 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold grid place-items-center ring-2 ring-card">{t}</div>))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-3" /> {p.team.length}</span>
                <span className="flex items-center gap-1"><Calendar className="size-3" /> {p.due}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
