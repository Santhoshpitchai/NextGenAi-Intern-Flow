import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  ListChecks, BarChart3, Inbox, MessageSquare, Clock, UserCheck, ArrowRight,
  Sparkles, Cpu, Zap, Activity, ShieldAlert, CheckCircle2, TrendingUp, Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternFlow AI — Intern Management Platform" },
      { name: "description", content: "Internal platform to manage interns, assign tasks, track progress, and monitor performance." },
      { property: "og:title", content: "InternFlow AI" },
      { property: "og:description", content: "Internal intern management platform" },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: ListChecks,
    title: "AI Task Orchestration",
    desc: "Assign milestones and break deliverables into interactive tasks with granular priorities and countdown deadlines.",
    badge: "Advanced"
  },
  {
    icon: BarChart3,
    title: "Dynamic Metrics Tracking",
    desc: "Monitor real-time progress, daily standup summaries, and compute direct performance velocity charts.",
    badge: "Real-Time"
  },
  {
    icon: UserCheck,
    title: "Active Session Attendance",
    desc: "Network-loss protected session logins. Ensures check-ins and check-outs are safely registered without session drops.",
    badge: "Core"
  },
  {
    icon: Inbox,
    title: "Direct Request Pipelines",
    desc: "Seamlessly submit, audit, and approve leave requests with detailed history logs and instant push updates.",
    badge: "Unified"
  },
  {
    icon: MessageSquare,
    title: "Context-Aware Loops",
    desc: "Tag teammates in Team Chat briefing announcements and bind discussions directly to active tasks and projects.",
    badge: "Premium"
  },
  {
    icon: Clock,
    title: "Deadline Radar",
    desc: "Interactive calendars map assignments and milestones dynamically, providing warnings before critical drop-offs.",
    badge: "Security"
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-gradient-mesh selection:bg-primary/20">
      
      {/* Top Banner (Product by NextGen AI Automation) */}
      <div className="bg-gradient-primary text-primary-foreground py-2.5 px-4 text-center text-xs font-bold tracking-wider uppercase z-50 relative shadow-glow">
        <a 
          href="https://www.nextgenaiautomation.net/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="size-3.5 animate-pulse" />
          <span>NextGen AI Automation Product — Streamlining 1,000+ businesses nationwide →</span>
        </a>
      </div>

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary animate-pulse">
                <Cpu className="size-3.5" />
                <span>NextGen Autonomous Standups Ready</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Intern Operations <br />
                <span className="text-gradient">Unified & Autonomous</span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Empower your organization with InternFlow AI—built by <a href="https://www.nextgenaiautomation.net/" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">NextGen AI Automation</a> to streamline task pipelines, track bulletproof attendance, and organize context-aware briefings.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow h-12 px-8 font-bold rounded-xl hover:opacity-95 cursor-pointer">
                  <Link to="/login">
                    Access Dashboard <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <a 
                  href="#features" 
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-muted/40"
                >
                  Explore Platform
                </a>
              </div>

              {/* Trust Badge Grid */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/60 max-w-md">
                <div>
                  <div className="text-2xl font-black text-foreground">10x</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Faster Standups</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">0%</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Session Log Loss</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">100%</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Audit Visibility</div>
                </div>
              </div>
            </div>

            {/* Right Dashboard Mockup Visual */}
            <div className="lg:col-span-6 relative">
              {/* Outer Glowing Accents */}
              <div className="absolute -inset-2 bg-gradient-primary rounded-3xl opacity-20 blur-2xl -z-10" />
              
              {/* Main Styled Glass Window Wrapper */}
              <div className="border border-border/80 bg-background/80 rounded-2xl shadow-medium overflow-hidden glass p-4 md:p-6 space-y-6">
                
                {/* Visual Window Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-destructive/80" />
                    <span className="size-3 rounded-full bg-warning/80" />
                    <span className="size-3 rounded-full bg-success/80" />
                    <span className="text-[10px] font-mono text-muted-foreground ml-2">internflow_dashboard_v2.tsx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-muted text-[9px] font-bold text-muted-foreground uppercase">Active Sprint</span>
                  </div>
                </div>

                {/* Dashboard Stats Cards Mockup */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-primary uppercase">Active Tasks</div>
                    <div className="text-xl font-black text-foreground mt-2">12</div>
                  </div>
                  <div className="p-3 rounded-xl bg-success/5 border border-success/10 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-success uppercase">Completed</div>
                    <div className="text-xl font-black text-foreground mt-2">84</div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-secondary uppercase">Glow Rate</div>
                    <div className="text-xl font-black text-foreground mt-2">98%</div>
                  </div>
                </div>

                {/* Active Standup Progress Bar */}
                <div className="space-y-2 p-3.5 rounded-xl bg-muted/30 border border-border/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold flex items-center gap-1"><Zap className="size-3 text-secondary animate-pulse" /> Platform Velocity</span>
                    <span className="font-extrabold text-secondary">82% Speedup</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary w-[82%] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Team Chat Briefing Card Mockup */}
                <div className="rounded-xl border border-primary/20 bg-card shadow-soft overflow-hidden text-left">
                  <div className="bg-gradient-primary px-3 py-1.5 flex items-center gap-1.5 text-primary-foreground text-[10px] font-extrabold uppercase">
                    <Sparkles className="size-3" />
                    <span>AI Standup Briefing</span>
                  </div>
                  <div className="p-3 space-y-2 text-xs">
                    <div className="font-extrabold leading-tight text-foreground">Sprint 3 Milestone Reached</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      NextGen automation triggers completed. Intern logs verified and compiled into high-fidelity dashboards.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-muted/10 -z-10" />
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Standardized Core Ecosystem</h2>
            <p className="text-muted-foreground">Autonomous tools designed by automation specialists to scale management seamlessly.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl glass hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
                <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground mb-5 group-hover:scale-110 transition-transform shadow-glow">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-extrabold text-lg mb-2 flex items-center justify-between">
                  <span>{f.title}</span>
                  <Badge variant="secondary" className="text-[8px] bg-primary/10 text-primary uppercase font-black tracking-widest">{f.badge}</Badge>
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US / NEXTGEN AI SHOWCASE */}
      <section id="about" className="py-24 px-6 bg-card/30 border-y border-border/80 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 -z-10" />
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The Team Behind the Automation</h2>
            <p className="text-muted-foreground">Building high-fidelity applications designed to replace overheads with algorithms.</p>
          </div>
          
          <div className="space-y-8">
            <div className="glass p-8 rounded-2xl border border-border/60">
              <h3 className="text-2xl font-extrabold mb-4 text-gradient">NextGen AI Automation</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                NextGen AI Automation was founded with a single mission: to bridge the gap between cutting-edge artificial intelligence and practical business operations. We build internal tools like InternFlow AI to demonstrate how robust task automation, attendance check-ins, and conversation loop-mail channels can optimize standard operating procedures.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-2xl border border-border/60 flex flex-col justify-between">
                <div>
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Laptop className="size-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Our Mission</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To help 1,000+ businesses in India automate their repetitive operations, scale administrative pipelines, and unlock breakthrough growth.
                  </p>
                </div>
                <a 
                  href="https://www.nextgenaiautomation.net/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-6 text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Visit Website <ArrowRight className="size-3" />
                </a>
              </div>

              <div className="glass p-8 rounded-2xl border border-border/60 flex flex-col justify-between">
                <div>
                  <div className="size-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <Activity className="size-5" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Our Vision</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To become the leading AI automation and internal systems engineering partner for the manufacturing and services sectors by 2030.
                  </p>
                </div>
                <a 
                  href="https://www.nextgenaiautomation.net/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-6 text-xs font-bold uppercase tracking-wider text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Explore Automation <ArrowRight className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// Simple Helper Badge Component
function Badge({ children, variant = "primary", className }: { children: React.ReactNode; variant?: "primary" | "secondary"; className?: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 tracking-wider",
      variant === "primary" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/10 text-secondary border border-secondary/20",
      className
    )}>
      {children}
    </span>
  );
}
