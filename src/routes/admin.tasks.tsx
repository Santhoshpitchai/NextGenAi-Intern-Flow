import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Paperclip, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — InternFlow AI" }] }),
  component: TasksPage,
});

type Task = { id: string; title: string; project: string; priority: "high" | "med" | "low"; due: string; assignees: string[]; comments: number; files: number };
const columns: { id: string; title: string; tone: string; tasks: Task[] }[] = [
  {
    id: "todo", title: "To Do", tone: "bg-muted-foreground/20",
    tasks: [
      { id: "1", title: "Design onboarding email sequence", project: "Growth Q2", priority: "high", due: "May 18", assignees: ["MC", "EP"], comments: 3, files: 2 },
      { id: "2", title: "Research competitor pricing pages", project: "Marketing", priority: "med", due: "May 22", assignees: ["ER"], comments: 1, files: 0 },
    ],
  },
  {
    id: "progress", title: "In Progress", tone: "bg-primary",
    tasks: [
      { id: "3", title: "Implement auth refresh token rotation", project: "Platform", priority: "high", due: "May 16", assignees: ["SJ", "JO"], comments: 8, files: 4 },
      { id: "4", title: "Refactor performance review components", project: "Reviews", priority: "med", due: "May 20", assignees: ["MC"], comments: 5, files: 1 },
      { id: "5", title: "User interview synthesis", project: "Research", priority: "low", due: "May 24", assignees: ["PP"], comments: 2, files: 7 },
    ],
  },
  {
    id: "review", title: "In Review", tone: "bg-warning",
    tasks: [
      { id: "6", title: "Setup Docker dev environment", project: "Platform", priority: "med", due: "May 15", assignees: ["JO"], comments: 4, files: 1 },
    ],
  },
  {
    id: "done", title: "Done", tone: "bg-success",
    tasks: [
      { id: "7", title: "Q1 Performance reports compiled", project: "Reviews", priority: "high", due: "May 10", assignees: ["SJ", "ER"], comments: 6, files: 3 },
      { id: "8", title: "Brand guidelines v2 published", project: "Design", priority: "low", due: "May 8", assignees: ["MC"], comments: 2, files: 12 },
    ],
  },
];

const priorityStyle: Record<Task["priority"], string> = {
  high: "bg-destructive/10 text-destructive",
  med: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
};

function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Task Board"
        subtitle="Drag and drop to update status. Hover for quick actions."
        actions={
          <>
            <Button variant="outline">Filter</Button>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="size-4" /> New Task</Button>
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {columns.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card/50 border border-border p-4 min-h-[60vh]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", c.tone)} />
                <h3 className="font-semibold text-sm">{c.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{c.tasks.length}</span>
              </div>
              <Button variant="ghost" size="icon" className="size-7"><Plus className="size-4" /></Button>
            </div>
            <div className="space-y-3">
              {c.tasks.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-background border border-border shadow-soft hover:shadow-glow hover:border-primary/30 transition-all cursor-grab">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", priorityStyle[t.priority])}>{t.priority}</span>
                    <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
                  </div>
                  <h4 className="font-semibold text-sm leading-snug mb-2">{t.title}</h4>
                  <div className="text-[11px] text-muted-foreground mb-3">{t.project}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {t.assignees.map((a) => (
                        <div key={a} className="size-6 rounded-full bg-gradient-primary text-primary-foreground text-[9px] font-bold grid place-items-center ring-2 ring-background">{a}</div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{t.due}</span>
                      {t.comments > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="size-3" />{t.comments}</span>}
                      {t.files > 0 && <span className="flex items-center gap-0.5"><Paperclip className="size-3" />{t.files}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
