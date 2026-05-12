import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  ListChecks, BarChart3, Inbox, MessageSquare, Clock, UserCheck, ArrowRight,
} from "lucide-react";

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
  { icon: ListChecks, title: "Task Assignment", desc: "Assign tasks with priorities and deadlines." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Monitor intern progress in real-time." },
  { icon: UserCheck, title: "Attendance", desc: "Track attendance and working hours." },
  { icon: Inbox, title: "Requests & Approvals", desc: "Manage leave requests and approvals." },
  { icon: MessageSquare, title: "Communication", desc: "Built-in messaging and announcements." },
  { icon: Clock, title: "Deadline Tracking", desc: "Keep track of all deadlines and deliverables." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 -z-10" />
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Intern Management <span className="text-gradient">Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Streamline your intern program with task management, progress tracking, and performance monitoring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow h-12 px-8">
              <Link to="/login">Access Dashboard <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to manage your interns effectively.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl glass">
                <div className="size-12 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground mb-4">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 bg-card/40 border-y border-border">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
          </div>
          <div className="space-y-8">
            <div className="glass p-8 rounded-xl">
              <p className="text-lg text-muted-foreground leading-relaxed">
                NextGen AI Automation was founded with a single mission: to bridge the gap between cutting-edge artificial intelligence and practical business operations.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-gradient">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To help 1,000+ businesses in India automate their repetitive tasks and focus on what truly matters: innovation and growth.
                </p>
              </div>
              <div className="glass p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-gradient">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading AI automation partner for the manufacturing and service sectors by 2030.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
