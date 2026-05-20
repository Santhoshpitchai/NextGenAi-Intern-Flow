import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/interns")({
  head: () => ({ meta: [{ title: "Interns — InternFlow AI" }] }),
  component: InternsPage,
});

const interns = [
  { name: "Sarah Jenkins", id: "2026-0012", dept: "Engineering", tasks: "12/15", completion: 80, attendance: 98, score: 96, status: "online", tone: "success" },
  { name: "Marcus Chen", id: "2026-0045", dept: "Design", tasks: "8/10", completion: 80, attendance: 92, score: 92, status: "online", tone: "success" },
  { name: "Elena Rodriguez", id: "2026-0023", dept: "Marketing", tasks: "9/12", completion: 75, attendance: 95, score: 89, status: "away", tone: "warning" },
  { name: "James Okafor", id: "2026-0089", dept: "Engineering", tasks: "7/10", completion: 70, attendance: 88, score: 86, status: "online", tone: "success" },
  { name: "Priya Patel", id: "2026-0067", dept: "Data", tasks: "6/9", completion: 67, attendance: 91, score: 84, status: "offline", tone: "muted" },
  { name: "Tom Wallace", id: "2026-0102", dept: "Design", tasks: "5/12", completion: 42, attendance: 78, score: 68, status: "offline", tone: "muted" },
];
const toneClass = (t: string) =>
  t === "success" ? "bg-success/10 text-success" : t === "warning" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground";
const dot = (s: string) =>
  s === "online" ? "bg-success" : s === "away" ? "bg-warning" : "bg-muted-foreground";

function InternsPage() {
  return (
    <div>
      <PageHeader
        title="Interns"
        subtitle="248 active interns across 5 departments."
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="size-4" /> Add Intern</Button>
          </>
        }
      />
      <div className="rounded-2xl glass shadow-soft overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b border-border">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search interns..." className="pl-10 bg-background/60" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="size-4" /> Department</Button>
            <Button variant="outline" size="sm">Status</Button>
            <Button variant="outline" size="sm">Score</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Tasks</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {interns.map((i) => (
                <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center">{i.name.split(" ").map(s=>s[0]).join("")}</div>
                      <div>
                        <div className="font-semibold text-sm">{i.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {i.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{i.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold w-12">{i.tasks}</span>
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-primary" style={{ width: `${i.completion}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{i.attendance}%</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", toneClass(i.tone))}>{i.score}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", dot(i.status))} />
                      <span className="text-xs capitalize text-muted-foreground">{i.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
