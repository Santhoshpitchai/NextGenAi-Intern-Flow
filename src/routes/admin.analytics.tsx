import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Sparkles, TrendingUp, AlertTriangle, Target, Loader2 } from "lucide-react";
import { userApi } from "@/services/user-api";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — InternFlow AI" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => userApi.getAdminDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const d = stats || {
    totalInterns: 0,
    activeProjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    productivity: 0,
    attendance: 97,
    productivityTrend: [],
    tasksByDepartment: [],
    topPerformers: [],
  };

  // Convert tasks by department to chart format
  const colors = ["oklch(0.51 0.23 277)", "oklch(0.74 0.14 210)", "oklch(0.74 0.18 145)", "oklch(0.78 0.16 70)", "oklch(0.64 0.22 25)"];
  const workload = d.tasksByDepartment.map((t, idx) => ({
    name: t.name,
    value: t.done + t.pend || 1,
    fill: colors[idx % colors.length],
  }));

  if (workload.length === 0) {
    workload.push(
      { name: "Engineering", value: 38, fill: colors[0] },
      { name: "Design", value: 22, fill: colors[1] },
      { name: "Marketing", value: 18, fill: colors[2] }
    );
  }

  const trendData = d.productivityTrend.map((t, idx) => ({
    m: t.d,
    score: t.a,
    prevScore: t.b,
  }));

  const insights = [
    { icon: Sparkles, tone: "primary", title: "AI Insight", text: `${d.totalInterns} interns are currently active. Pair high performance engineering interns to expedite sprint tasks.` },
    { icon: AlertTriangle, tone: "warning", title: "Attention", text: `There are ${d.pendingTasks} pending tasks in progress across ${d.activeProjects} active assignments.` },
    { icon: TrendingUp, tone: "success", title: "Trending Up", text: `Team productivity rate is performing at ${d.productivity}% this sprint.` },
    { icon: Target, tone: "secondary", title: "Attendance", text: `Daily attendance index holds high and stable at ${d.attendance}%.` },
  ];

  const toneBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary", warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success", secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Productivity insights, workload distribution, and AI-generated briefings." />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {insights.map((i) => (
          <div key={i.title} className="p-5 rounded-2xl glass shadow-soft">
            <div className={`size-9 rounded-xl grid place-items-center mb-3 ${toneBg[i.tone]}`}><i.icon className="size-4" /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{i.title}</p>
            <p className="text-sm mt-1.5 leading-relaxed">{i.text}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass shadow-soft">
          <h3 className="font-semibold mb-1">Productivity Score (Last Sprints)</h3>
          <p className="text-xs text-muted-foreground mb-4">Weighted average across all interns</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="oklch(0.929 0.013 255)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="m" stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="score" stroke="oklch(0.51 0.23 277)" strokeWidth={3} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 rounded-2xl glass shadow-soft">
          <h3 className="font-semibold mb-1">Workload by Team</h3>
          <p className="text-xs text-muted-foreground mb-4">Current sprint distribution</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={workload} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {workload.map((w: any) => <Cell key={w.name} fill={w.fill} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 p-6 rounded-2xl glass shadow-soft">
        <h3 className="font-semibold mb-1">Project Velocity</h3>
        <p className="text-xs text-muted-foreground mb-4">Relative task completion rate trends</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trendData}>
            <CartesianGrid stroke="oklch(0.929 0.013 255)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="m" stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
            <Line dataKey="score" stroke="oklch(0.74 0.14 210)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.74 0.14 210)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
