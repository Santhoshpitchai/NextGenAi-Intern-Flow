import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/task-api";
import { useState } from "react";

export const Route = createFileRoute("/admin/calendar")({
  head: () => ({ meta: [{ title: "Calendar — InternFlow AI" }] }),
  component: CalendarPage,
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const tone: Record<string, string> = {
  meeting: "bg-primary/10 text-primary border-primary/20",
  deadline: "bg-destructive/10 text-destructive border-destructive/20 font-semibold",
  event: "bg-secondary/10 text-secondary border-secondary/20",
};

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Fetch all tasks from backend
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => taskApi.getAllTasks(),
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const tasksList = tasks || [];

  // Calculate calendar grid days
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  // Map Sunday (0) to index 6, Monday (1) to 0, Tuesday (2) to 1...
  const emptyDaysBefore = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create grid cells array
  const cells: { day: number | null; isToday: boolean; inMonth: boolean }[] = [];

  // Add empty leading cells
  for (let i = 0; i < emptyDaysBefore; i++) {
    cells.push({ day: null, isToday: false, inMonth: false });
  }

  // Add actual days
  const todayDate = new Date();
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const isToday = 
      todayDate.getDate() === d && 
      todayDate.getMonth() === currentMonth && 
      todayDate.getFullYear() === currentYear;
    cells.push({ day: d, isToday, inMonth: true });
  }

  // Fill up trailing empty cells to make standard grid (multiple of 7)
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      cells.push({ day: null, isToday: false, inMonth: false });
    }
  }

  const getDayEvents = (day: number) => {
    const eventsList: { type: "meeting" | "deadline" | "event"; label: string }[] = [];

    // Map database task deadlines
    tasksList.forEach((t) => {
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        if (d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          eventsList.push({ type: "deadline", label: `🏁 [Task] ${t.title}` });
        }
      }
    });

    return eventsList;
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Meetings, deadlines, attendance, and team events."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <div className="px-4 py-1.5 rounded-lg bg-muted text-sm font-semibold select-none">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />
      
      <div className="rounded-2xl glass shadow-soft p-5">
        <div className="grid grid-cols-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, i) => {
            const hasEvents = cell.day ? getDayEvents(cell.day).length > 0 : false;
            const dayEvents = cell.day ? getDayEvents(cell.day) : [];

            return (
              <div 
                key={i} 
                className={cn(
                  "min-h-[110px] rounded-xl border p-2 text-xs flex flex-col gap-1 transition-all",
                  cell.inMonth ? "bg-background border-border" : "bg-muted/10 border-transparent text-muted-foreground/30",
                  cell.isToday && "ring-2 ring-primary border-primary/30 bg-primary/5",
                )}
              >
                {cell.day && (
                  <div className="flex items-center justify-between">
                    <span className={cn("font-semibold text-xs", cell.isToday ? "text-primary font-bold" : "text-muted-foreground")}>
                      {cell.day}
                    </span>
                    {cell.isToday && (
                      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                )}
                
                {cell.day && (
                  <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5 max-h-[80px] scrollbar-thin">
                    {dayEvents.map((e, idx) => (
                      <div 
                        key={idx} 
                        className={cn("text-[9px] px-1.5 py-0.5 rounded-md border truncate leading-relaxed", tone[e.type])}
                        title={e.label}
                      >
                        {e.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
