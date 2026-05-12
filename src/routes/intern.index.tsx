import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { ListChecks, CheckCircle2, TrendingUp, Award, Calendar, Upload, MessageSquare, Megaphone, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intern/")({
  head: () => ({ meta: [{ title: "My Dashboard — InternFlow AI" }] }),
  component: InternDashboard,
});

const myTasks = [
  { title: "Implement auth refresh token rotation", by: "Sarah J.", priority: "high", due: "May 16", progress: 65 },
  { title: "Code review for onboarding flow", by: "James O.", priority: "med", due: "May 18", progress: 30 },
  { title: "Write integration tests for billing", by: "Sarah J.", priority: "low", due: "May 22", progress: 10 },
];
const trend = [{m:"M",v:60},{m:"T",v:78},{m:"W",v:72},{m:"T",v:88},{m:"F",v:92},{m:"S",v:70},{m:"S",v:60}];
const announcements = [
  { who: "Sarah J.", time: "1h ago", text: "Sprint planning Friday at 10am — be ready with your top 3 priorities." },
  { who: "Jane (Admin)", time: "1d ago", text: "Welcome new interns! Onboarding kit is in the shared drive." },
];
const badges = ["First Ship", "Bug Crusher", "Sprint Streak ×3", "Team Player"];
const priorityStyle: Record<string, string> = {
  high: "bg-destructive/10 text-destructive", med: "bg-warning/10 text-warning", low: "bg-muted text-muted-foreground",
};

function InternDashboard() {
  return (
    <div>
      <PageHeader title="Welcome, Alex 👋" subtitle="You have 3 tasks due this week and a 92% productivity score."
        actions={<Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Upload className="size-4" /> Submit Daily Update</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ListChecks} label="Active Tasks" value="7" tone="primary" />
        <StatCard icon={CheckCircle2} label="Completed" value="42" delta="6" tone="success" />
        <StatCard icon={TrendingUp} label="Productivity" value="92%" delta="8%" tone="secondary" />
        <StatCard icon={Award} label="Badges Earned" value="11" tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Tasks</h3>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-3">
              {myTasks.map((t) => (
                <div key={t.title} className="p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", priorityStyle[t.priority])}>{t.priority}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="size-3" /> {t.due}</span>
                      </div>
                      <h4 className="font-semibold text-sm">{t.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Assigned by {t.by}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm">Upload</Button>
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">Done</Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-muted-foreground">Progress</span><span className="font-bold">{t.progress}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-primary" style={{ width: `${t.progress}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl glass shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Personal Productivity</h3>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">↑ 8%</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend}>
                <defs><linearGradient id="iv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.74 0.14 210)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="oklch(0.929 0.013 255)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.554 0.046 257)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.929 0.013 255)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.74 0.14 210)" strokeWidth={2.5} fill="url(#iv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-5 mb-3" />
            <h3 className="font-semibold">AI Coach</h3>
            <p className="text-sm opacity-90 mt-1 leading-relaxed">You're shipping consistently. Try blocking 2-hour deep work sessions to push productivity past 95%.</p>
          </div>

          <div className="p-6 rounded-2xl glass shadow-soft">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Award className="size-4 text-warning" /> Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="text-xs px-3 py-1.5 rounded-full bg-warning/10 text-warning font-semibold border border-warning/20">{b}</span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl glass shadow-soft">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Megaphone className="size-4 text-primary" /> Team Announcements</h3>
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.text} className="text-sm">
                  <p className="leading-relaxed">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">— {a.who} · {a.time}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full"><MessageSquare className="size-4" /> Open Team Chat</Button>
        </div>
      </div>
    </div>
  );
}
