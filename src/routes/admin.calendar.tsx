import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/calendar")({
  head: () => ({ meta: [{ title: "Calendar — InternFlow AI" }] }),
  component: CalendarPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const events: Record<number, { type: string; label: string }[]> = {
  3: [{ type: "meeting", label: "All-hands" }],
  7: [{ type: "deadline", label: "Sprint review" }, { type: "meeting", label: "1:1 SJ" }],
  10: [{ type: "deadline", label: "Brand v2 due" }],
  14: [{ type: "meeting", label: "Mentor sync" }],
  18: [{ type: "deadline", label: "Auth refresh" }],
  22: [{ type: "event", label: "Workshop" }],
  25: [{ type: "deadline", label: "Reviews due" }, { type: "meeting", label: "Demo day" }],
  28: [{ type: "event", label: "Team offsite" }],
};
const tone: Record<string, string> = {
  meeting: "bg-primary/10 text-primary border-primary/20",
  deadline: "bg-destructive/10 text-destructive border-destructive/20",
  event: "bg-secondary/10 text-secondary border-secondary/20",
};

function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Meetings, deadlines, attendance and team events."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="size-4" /></Button>
            <div className="px-4 py-1.5 rounded-lg bg-muted text-sm font-semibold">May 2026</div>
            <Button variant="outline" size="icon"><ChevronRight className="size-4" /></Button>
          </div>
        }
      />
      <div className="rounded-2xl glass shadow-soft p-5">
        <div className="grid grid-cols-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {days.map((d) => <div key={d} className="px-2 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 2;
            const inMonth = day >= 1 && day <= 31;
            const today = day === 12;
            const dayEvents = events[day] || [];
            return (
              <div key={i} className={cn(
                "min-h-[100px] rounded-xl border p-2 text-xs flex flex-col gap-1",
                inMonth ? "bg-background border-border" : "bg-muted/20 border-transparent text-muted-foreground/40",
                today && "ring-2 ring-primary border-primary/30",
              )}>
                <div className={cn("font-semibold text-xs", today && "text-primary")}>{inMonth ? day : ""}</div>
                {dayEvents.map((e, idx) => (
                  <div key={idx} className={cn("text-[10px] px-1.5 py-1 rounded-md border truncate", tone[e.type])}>{e.label}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
