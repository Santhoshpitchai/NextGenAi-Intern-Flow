import { TrendingUp, CheckCircle2, Sparkles } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-gradient-mesh blur-3xl opacity-70 -z-10" />
      <div className="p-3 glass rounded-3xl shadow-glow">
        <div className="bg-background/80 border border-border rounded-2xl overflow-hidden flex h-[520px]">
          {/* Sidebar */}
          <div className="w-56 border-r border-border bg-card/60 p-4 hidden md:block">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-7 rounded-lg bg-gradient-primary" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
            <div className="space-y-1.5">
              <div className="h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center px-3 gap-2">
                <div className="size-3 rounded bg-primary/40" /><div className="h-2 w-16 bg-primary/40 rounded" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 rounded-lg flex items-center px-3 gap-2">
                  <div className="size-3 rounded bg-muted-foreground/20" />
                  <div className={`h-2 bg-muted rounded`} style={{ width: `${50 + i * 8}%` }} />
                </div>
              ))}
            </div>
          </div>
          {/* Main */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-5 w-40 bg-muted-foreground/20 rounded mb-2" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="flex gap-2">
                <div className="size-8 rounded-full bg-muted" />
                <div className="size-8 rounded-full bg-gradient-primary" />
              </div>
            </div>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { v: "248", l: "Interns", c: "from-primary/20 to-primary/5" },
                { v: "1.2K", l: "Tasks Done", c: "from-secondary/20 to-secondary/5" },
                { v: "94%", l: "Productivity", c: "from-success/20 to-success/5" },
              ].map((s) => (
                <div key={s.l} className={`p-3 rounded-xl border border-border bg-gradient-to-br ${s.c}`}>
                  <div className="text-xl font-bold">{s.v}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-4 h-40">
              <div className="flex justify-between mb-3">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-12 bg-success/40 rounded" />
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[40, 65, 50, 75, 60, 85, 70, 90, 78, 95, 82, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary to-secondary" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="hidden md:block absolute -left-10 top-32 glass rounded-2xl p-4 w-56 shadow-glass animate-float">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <TrendingUp className="size-4 text-success" /> Weekly Growth
        </div>
        <div className="text-2xl font-bold">+12.4%</div>
        <div className="mt-3 flex items-end gap-1 h-8">
          {[40, 60, 50, 70, 65, 90, 100].map((h, i) => (
            <div key={i} className="flex-1 rounded bg-success/30" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="hidden md:block absolute -right-6 top-16 glass rounded-2xl p-4 w-60 shadow-glass animate-float" style={{ animationDelay: "1.5s" }}>
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold text-sm">AR</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Alex Rivera</div>
            <div className="text-[10px] text-muted-foreground">Engineering Intern</div>
          </div>
          <CheckCircle2 className="size-4 text-success" />
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Sprint Progress</span><span className="font-semibold">92%</span></div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full w-[92%] bg-gradient-primary" /></div>
        </div>
      </div>
      <div className="hidden md:block absolute -right-10 bottom-12 glass rounded-2xl p-3 w-44 shadow-glass animate-float" style={{ animationDelay: "0.7s" }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-4 text-primary" />
          <div className="text-xs font-semibold">AI Insight</div>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">3 interns are ahead of schedule this week.</p>
      </div>
    </div>
  );
}
