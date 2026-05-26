import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Loader2, TrendingUp, Target, Award, Star, ListTodo } from "lucide-react";
import { assignmentApi } from "@/services/assignment-api";
import { taskApi } from "@/services/task-api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intern/performance")({
  head: () => ({ meta: [{ title: "Performance — InternFlow AI" }] }),
  component: InternPerformance,
});

function InternPerformance() {
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskApi.getMyTasks(),
  });

  if (assignmentsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === "DONE").length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === "IN_PROGRESS").length || 0;
  const inReviewTasks = tasks?.filter(t => t.status === "IN_REVIEW").length || 0;
  const todoTasks = tasks?.filter(t => t.status === "TODO").length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Recharts task distribution data
  const chartData = [
    { name: "To Do", count: todoTasks, fill: "oklch(0.554 0.046 257)" },
    { name: "In Progress", count: inProgressTasks, fill: "oklch(0.51 0.23 277)" },
    { name: "In Review", count: inReviewTasks, fill: "oklch(0.78 0.16 70)" },
    { name: "Completed", count: completedTasks, fill: "oklch(0.74 0.18 145)" },
  ];

  const getPerformanceRating = (rate: number) => {
    if (rate >= 90) return { label: "Excellent", color: "text-success bg-success/10", desc: "Top performer with high velocity and high-quality deliverables." };
    if (rate >= 70) return { label: "Good / Solid", color: "text-primary bg-primary/10", desc: "Consistently completes deliverables on time." };
    if (rate > 0) return { label: "Improving", color: "text-warning bg-warning/10", desc: "Actively working on active tasks." };
    return { label: "Awaiting Tasks", color: "text-muted-foreground bg-muted", desc: "Complete assigned tasks to unlock your performance metrics." };
  };

  const rating = getPerformanceRating(completionRate);

  return (
    <div>
      <PageHeader
        title="Performance Analytics"
        subtitle="Live metrics, completion metrics, and official supervisor evaluation."
      />

      <div className="grid gap-5 md:grid-cols-3 mb-6">
        <Card className="p-6 rounded-2xl glass shadow-soft hover:shadow-glow transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Target className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Assigned Tasks</p>
              <p className="text-3xl font-bold mt-0.5">{totalTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl glass shadow-soft hover:shadow-glow transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10 text-success">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed Milestones</p>
              <p className="text-3xl font-bold mt-0.5">{completedTasks}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl glass shadow-soft hover:shadow-glow transition-all">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <Award className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Overall Score</p>
              <p className="text-3xl font-bold mt-0.5">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Recharts Workload Distribution */}
        <Card className="lg:col-span-2 p-6 rounded-2xl glass shadow-soft">
          <div className="mb-4">
            <h3 className="font-semibold text-base">Workload Velocity</h3>
            <p className="text-xs text-muted-foreground">Distribution of milestones by current execution stage</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.929 0.013 255)" />
                <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", background: "white", border: "1px solid oklch(0.929 0.013 255)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {chartData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.fill} dataKey="count" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Supervisor Remarks and Evaluation */}
        <Card className="p-6 rounded-2xl glass shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="size-5 text-warning fill-warning" />
              <h3 className="font-semibold text-base">Evaluation Remarks</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Official grading and remarks synced from your active projects</p>
            
            <div className="p-4 rounded-xl bg-card border border-border mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Grade Tier</span>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold uppercase", rating.color)}>
                  {rating.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                {rating.desc}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-xs">
            <p className="font-semibold text-primary mb-1">💡 Tip for growth</p>
            <p className="text-muted-foreground">Keep completing tasks on or before the deadline to automatically boost your overall score and grade tier!</p>
          </div>
        </Card>
      </div>

      {/* Assignments Details List */}
      <Card className="p-6 rounded-2xl glass shadow-soft">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <ListTodo className="size-5 text-primary" /> Active Project Milestones
        </h3>
        
        {!assignments || assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active project milestones found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {assignments.map(assignment => {
              const completed = assignment.tasks.filter(t => t.status === "DONE").length;
              const total = assignment.tasks.length;
              const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
              const hasAttachment = assignment.notes?.includes("Attachment: 📄");
              const displayNotes = hasAttachment 
                ? assignment.notes.split("\n\nAttachment: 📄")[0] 
                : assignment.notes;

              return (
                <div key={assignment.id} className="p-4 border border-border rounded-xl bg-card hover:border-primary/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {assignment.department || "Engineering"}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {completed}/{total} Tasks Done
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground leading-snug mb-1">{assignment.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{assignment.company.name}</p>
                    {displayNotes && (
                      <p className="text-xs text-muted-foreground italic mb-4 line-clamp-2 bg-muted/40 p-2 rounded">
                        " {displayNotes} "
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">Sprint Completion</span>
                      <span className="font-bold">{rate}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
