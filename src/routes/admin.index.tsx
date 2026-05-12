import { createFileRoute } from "@tanstack/react-router";
import { Users, FolderKanban, ListChecks, CheckCircle2, TrendingUp, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — InternFlow AI" }] }),
  component: AdminDashboard,
});

const productivityData = [
  { d: "Mon", a: 65, b: 50 }, { d: "Tue", a: 78, b: 60 }, { d: "Wed", a: 72, b: 65 },
  { d: "Thu", a: 88, b: 70 }, { d: "Fri", a: 92, b: 78 }, { d: "Sat", a: 70, b: 55 }, { d: "Sun", a: 60, b: 48 },
];
const taskData = [
  { name: "Eng", done: 42, pend: 12 }, { name: "Design", done: 28, pend: 8 },
  { name: "Mktg", done: 35, pend: 14 }, { name: "Ops", done: 22, pend: 6 }, { name: "Data", done: 30, pend: 10 },
];
const ranking = [
  { n: "Sarah Jenkins", d: "Engineering", s: 96 },
  { n: "Marcus Chen", d: "Design", s: 92 },
  { n: "Elena Rodriguez", d: "Marketing", s: 89 },
  { n: "James Okafor", d: "Engineering", s: 86 },
  { n: "Priya Patel", d: "Data", s: 84 },
];

function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Welcome back, Jane 👋"
        subtitle="Here's what's happening across your intern program today."
        actions={
          <>
            <Button variant="outline">Export</Button>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow">+ Add Intern</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Users} label="Total Interns" value="248" delta="12%" tone="primary" />
        <StatCard icon={FolderKanban} label="Active Projects" value="34" delta="4%" tone="secondary" />
        <StatCard icon={ListChecks} label="Pending Tasks" value="126" delta="8%" trend="down" tone="warning" />
        <StatCard icon={CheckCircle2} label="Completed" value="1,284" delta="22%" tone="success" />
        <StatCard icon={TrendingUp} label="Productivity" value="94%" delta="3%" tone="primary" />
        <StatCard icon={CalendarCheck} label="Attendance" value="97%" delta="1%" tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Productivity Trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days vs previous week</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> This week</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-secondary" /> Last week</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0.4} /><stop offset="100%" stopColor="oklch(0.51 0.23 277)" stopOpacity={0} /></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0.3} /><stop offset="100%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.929 0.013 255)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="a" stroke="oklch(0.51 0.23 277)" strokeWidth={2.5} fill="url(#g1)" />
              <Area type="monotone" dataKey="b" stroke="oklch(0.74 0.14 210)" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl glass shadow-soft">
          <h3 className="font-semibold">Overall Score</h3>
          <p className="text-xs text-muted-foreground mb-4">Team productivity index</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "score", v: 94, fill: "oklch(0.51 0.23 277)" }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="v" background={{ fill: "oklch(0.929 0.013 255)" }} cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center -mt-32 pointer-events-none">
            <div className="text-4xl font-bold">94%</div>
            <div className="text-xs text-muted-foreground">Team Score</div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-16 text-center text-xs">
            <div><div className="font-bold text-success">+12%</div><div className="text-muted-foreground">vs last</div></div>
            <div><div className="font-bold">A+</div><div className="text-muted-foreground">Grade</div></div>
            <div><div className="font-bold">5/5</div><div className="text-muted-foreground">Goals</div></div>
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
            <BarChart data={taskData} barCategoryGap={20}>
              <CartesianGrid stroke="oklch(0.929 0.013 255)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
              <Bar dataKey="done" stackId="a" fill="oklch(0.51 0.23 277)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pend" stackId="a" fill="oklch(0.74 0.14 210)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 rounded-2xl glass shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top Performers</h3>
            <span className="text-xs text-primary font-medium cursor-pointer">View all</span>
          </div>
          <div className="space-y-3">
            {ranking.map((r, i) => (
              <div key={r.n} className="flex items-center gap-3">
                <div className="size-7 rounded-lg bg-muted grid place-items-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">{r.n.split(" ").map(s=>s[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{r.n}</div>
                  <div className="text-[11px] text-muted-foreground">{r.d}</div>
                </div>
                <div className="text-sm font-bold text-primary">{r.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
