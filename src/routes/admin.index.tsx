import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import {
  Users,
  FolderKanban,
  ListChecks,
  CheckCircle2,
  TrendingUp,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — InternFlow AI" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const userName = user?.companyAdminProfile?.adminName?.split(" ")[0] || "there";

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

  const dashboardStats = stats || {
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

  const getGrade = (s: number) => {
    if (s >= 95) return "A+";
    if (s >= 90) return "A";
    if (s >= 80) return "B+";
    if (s >= 70) return "B";
    return "C";
  };

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${userName} 👋`}
        subtitle="Here's what's happening across your intern program today."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                if (!stats) return;
                const rows = [
                  ["Admin Dashboard Export", ""],
                  ["Generated At", new Date().toLocaleString()],
                  ["", ""],
                  ["Metrics", "Value"],
                  ["Total Interns", dashboardStats.totalInterns.toString()],
                  ["Active Projects", dashboardStats.activeProjects.toString()],
                  ["Pending Tasks", dashboardStats.pendingTasks.toString()],
                  ["Completed Tasks", dashboardStats.completedTasks.toString()],
                  ["Productivity Index", `${dashboardStats.productivity}%`],
                  ["Attendance", `${dashboardStats.attendance}%`],
                  ["", ""],
                  ["Top Performers", "Score", "Department"],
                ];
                dashboardStats.topPerformers.forEach((p: any) => {
                  rows.push([p.n, p.s.toString(), p.d]);
                });
                const csvContent = rows
                  .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
                  .join("\r\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `Dashboard_Summary_${new Date().toISOString().split("T")[0]}.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export
            </Button>
            <Button
              className="bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => navigate({ to: "/admin/interns", search: { add: true } })}
            >
              + Add Intern
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Interns"
          value={dashboardStats.totalInterns.toString()}
          delta="12%"
          tone="primary"
        />
        <StatCard
          icon={FolderKanban}
          label="Active Projects"
          value={dashboardStats.activeProjects.toString()}
          delta="4%"
          tone="secondary"
        />
        <StatCard
          icon={ListChecks}
          label="Pending Tasks"
          value={dashboardStats.pendingTasks.toString()}
          delta="8%"
          trend="down"
          tone="warning"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={dashboardStats.completedTasks.toLocaleString()}
          delta="22%"
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Productivity"
          value={`${dashboardStats.productivity}%`}
          delta="3%"
          tone="primary"
        />
        <StatCard
          icon={CalendarCheck}
          label="Attendance"
          value={`${dashboardStats.attendance}%`}
          delta="1%"
          tone="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Productivity Trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days vs previous week</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" /> This week
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-secondary" /> Last week
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dashboardStats.productivityTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="oklch(0.929 0.013 255)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="d"
                stroke="oklch(0.554 0.046 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.554 0.046 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.929 0.013 255)",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="a"
                stroke="oklch(0.51 0.23 277)"
                strokeWidth={2.5}
                fill="url(#g1)"
              />
              <Area
                type="monotone"
                dataKey="b"
                stroke="oklch(0.74 0.14 210)"
                strokeWidth={2}
                fill="url(#g2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl glass shadow-soft">
          <h3 className="font-semibold">Overall Score</h3>
          <p className="text-xs text-muted-foreground mb-4">Team productivity index</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={[
                { name: "score", v: dashboardStats.productivity, fill: "oklch(0.51 0.23 277)" },
              ]}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="v"
                background={{ fill: "oklch(0.929 0.013 255)" }}
                cornerRadius={20}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-32 pointer-events-none">
            <div className="text-4xl font-bold">{dashboardStats.productivity}%</div>
            <div className="text-xs text-muted-foreground">Team Score</div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-16 text-center text-xs">
            <div>
              <div className="font-bold text-success">+12%</div>
              <div className="text-muted-foreground">vs last</div>
            </div>
            <div>
              <div className="font-bold">{getGrade(dashboardStats.productivity)}</div>
              <div className="text-muted-foreground">Grade</div>
            </div>
            <div>
              <div className="font-bold">5/5</div>
              <div className="text-muted-foreground">Goals</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Tasks by Department</h3>
            <span className="text-xs text-muted-foreground">This sprint</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dashboardStats.tasksByDepartment} barCategoryGap={20}>
              <CartesianGrid
                stroke="oklch(0.929 0.013 255)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="oklch(0.554 0.046 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.554 0.046 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.929 0.013 255)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="done" stackId="a" fill="oklch(0.51 0.23 277)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pend" stackId="a" fill="oklch(0.74 0.14 210)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 rounded-2xl glass shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top Performers</h3>
            <span
              className="text-xs text-primary font-medium cursor-pointer"
              onClick={() => navigate({ to: "/admin/interns", search: { add: undefined } })}
            >
              View all
            </span>
          </div>
          <div className="space-y-3">
            {dashboardStats.topPerformers.map(
              (r: { n: string; d: string; s: number }, i: number) => (
                <div key={r.n} className="flex items-center gap-3">
                  <div className="size-7 rounded-lg bg-muted grid place-items-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                    {r.n
                      .split(" ")
                      .map((s: string) => s[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{r.n}</div>
                    <div className="text-[11px] text-muted-foreground">{r.d}</div>
                  </div>
                  <div className="text-sm font-bold text-primary">{r.s}</div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
