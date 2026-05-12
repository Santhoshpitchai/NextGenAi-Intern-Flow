import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { Button } from "@/components/ui/button";
import {
  ListChecks, BarChart3, Calendar, Inbox, MessageSquare, Clock, Sparkles, UserCheck,
  ArrowRight, Play, Check, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternFlow AI — Smart Intern Management & Productivity Platform" },
      { name: "description", content: "Manage interns, assign tasks, track productivity, and run reviews from one premium dashboard. AI-powered insights for modern teams." },
      { property: "og:title", content: "InternFlow AI" },
      { property: "og:description", content: "Smart intern management & productivity tracking for high-growth teams." },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: ListChecks, title: "Task Assignment", desc: "Delegate work with priority, deadlines, and intelligent routing." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Real-time visibility into every milestone and sprint." },
  { icon: Sparkles, title: "Performance Analytics", desc: "AI scorecards that surface top talent automatically." },
  { icon: UserCheck, title: "Attendance", desc: "Automated check-ins with timezone-aware logs." },
  { icon: Inbox, title: "Requests & Approvals", desc: "Leave, extensions and resources — one click to act." },
  { icon: MessageSquare, title: "Team Communication", desc: "Threaded comments and team announcements built-in." },
  { icon: Clock, title: "Deadline Tracking", desc: "Never miss a delivery with smart escalation." },
  { icon: Sparkles, title: "AI Productivity Insights", desc: "Weekly briefings on bottlenecks and burnout signals." },
];

const workflow = [
  { n: "01", t: "Add Intern", d: "Bulk import or invite via email." },
  { n: "02", t: "Assign Tasks", d: "Drag-and-drop with priority." },
  { n: "03", t: "Monitor Progress", d: "Live activity & screenshots." },
  { n: "04", t: "Review Performance", d: "Auto-generated scorecards." },
  { n: "05", t: "Generate Reports", d: "One-click PDF exports." },
];

const stats = [
  { v: "10K+", l: "Interns Managed" },
  { v: "98%", l: "Completion Rate" },
  { v: "500+", l: "Companies" },
  { v: "4.9/5", l: "Avg. Rating" },
];

const testimonials = [
  { q: "InternFlow turned our chaotic intern program into a measurable, scalable engine.", n: "Maya Patel", r: "VP People, Vertex Labs" },
  { q: "We finally have visibility into productivity without micromanaging anyone.", n: "James Okafor", r: "CTO, Northwind" },
  { q: "The AI insights catch burnout before we ever notice. Worth every penny.", n: "Lina Schmidt", r: "Head of Talent, Loop" },
];

const pricing = [
  { name: "Starter", price: "$0", period: "/mo", desc: "For small teams trying it out.", cta: "Start Free",
    features: ["Up to 10 interns", "Task & project boards", "Basic analytics", "Email support"] },
  { name: "Growth", price: "$49", period: "/mo", desc: "For scaling intern programs.", cta: "Start 14-day Trial", featured: true,
    features: ["Up to 100 interns", "AI productivity insights", "Custom workflows", "Priority support", "SSO & integrations"] },
  { name: "Enterprise", price: "Custom", period: "", desc: "For organizations at scale.", cta: "Talk to Sales",
    features: ["Unlimited interns", "Dedicated CSM", "Advanced security", "On-prem option", "Custom SLAs"] },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60 -z-10" />
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="size-3" /> Enterprise Ready · AI-Powered
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-balance leading-[1.05]">
            Smart Intern Management & <span className="text-gradient">Productivity Tracking</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            The all-in-one platform to orchestrate intern workflows, monitor real-time performance, and scale your talent pipeline with AI-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow h-12 px-8 text-base">
              <Link to="/signup">Start Managing <ArrowRight className="ml-1" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/60 backdrop-blur-md">
              <Play className="mr-1" /> Watch Demo
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Check className="size-3.5 text-success" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="size-3.5 text-success" /> 14-day trial</span>
            <span className="flex items-center gap-1"><Check className="size-3.5 text-success" /> Cancel anytime</span>
          </div>
        </div>
        <div className="mt-20 max-w-6xl mx-auto"><HeroMockup /></div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Everything you need, nothing you don't</h2>
            <p className="mt-4 text-muted-foreground text-lg">A focused toolkit built specifically for managing early-career talent at scale.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl glass hover:shadow-glow transition-all hover:-translate-y-1">
                <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground mb-5 shadow-glow group-hover:scale-110 transition-transform">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-32 px-6 bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Workflow</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">From hire to handoff in 5 steps</h2>
          </div>
          <div className="relative grid md:grid-cols-5 gap-6">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {workflow.map((w) => (
              <div key={w.n} className="relative text-center">
                <div className="mx-auto size-16 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-glow mb-4 relative z-10">{w.n}</div>
                <h4 className="font-semibold">{w.t}</h4>
                <p className="text-sm text-muted-foreground mt-1">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="about" className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Loved by teams</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Trusted by modern teams</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.n} className="p-7 rounded-2xl glass">
                <div className="flex gap-0.5 mb-4">{Array.from({length:5}).map((_,i)=>(<Star key={i} className="size-4 fill-warning text-warning" />))}</div>
                <p className="text-base leading-relaxed mb-6">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">{t.n.split(" ").map(s=>s[0]).join("")}</div>
                  <div><div className="text-sm font-semibold">{t.n}</div><div className="text-xs text-muted-foreground">{t.r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 px-6 bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade when you scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((p) => (
              <div key={p.name} className={`p-8 rounded-3xl relative ${p.featured ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105" : "glass"}`}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-warning text-warning-foreground rounded-full">Most Popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className={`text-sm mt-1 ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">{p.price}</span>
                  <span className={`text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.period}</span>
                </div>
                <Button asChild className={`w-full mt-6 ${p.featured ? "bg-background text-foreground hover:bg-background/90" : "bg-gradient-primary text-primary-foreground"}`}>
                  <Link to="/signup">{p.cta}</Link>
                </Button>
                <ul className="mt-8 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`size-4 mt-0.5 shrink-0 ${p.featured ? "text-primary-foreground" : "text-success"}`} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center p-12 md:p-16 rounded-3xl bg-gradient-primary text-primary-foreground shadow-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to scale your intern program?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">Join 500+ teams using InternFlow AI to ship better outcomes with less overhead.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 h-12 px-8"><Link to="/signup">Get Started Free</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/login">Login</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
