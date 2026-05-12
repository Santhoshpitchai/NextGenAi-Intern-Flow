import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Sparkles, BarChart3, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — InternFlow AI" }, { name: "description", content: "Sign in to your InternFlow AI workspace." }] }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left illustration panel */}
      <div className="relative hidden lg:flex items-center justify-center p-12 bg-gradient-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="absolute top-8 left-8"><Logo /></div>
        <div className="relative max-w-md">
          <h2 className="text-5xl font-bold leading-tight">Manage Interns Smarter</h2>
          <p className="mt-4 text-lg opacity-90">Track productivity, run sprints, and review performance — all in one calm, focused workspace.</p>

          <div className="mt-12 space-y-3">
            {[
              { icon: BarChart3, label: "Real-time productivity analytics" },
              { icon: CheckCircle2, label: "AI-powered task assignment" },
              { icon: Sparkles, label: "Weekly insight briefings" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 p-4 rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20">
                <div className="size-10 rounded-xl bg-primary-foreground/20 grid place-items-center"><f.icon className="size-5" /></div>
                <span className="font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-mesh">
        <div className="w-full max-w-md p-8 md:p-10 rounded-3xl glass shadow-glass">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to continue to your workspace.</p>

          <form className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-10 h-11 bg-background/60" />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11 bg-background/60" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox /> <span>Remember me</span></label>
              <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
            </div>
            <Button asChild className="w-full h-11 bg-gradient-primary text-primary-foreground shadow-glow"><Link to="/admin">Login</Link></Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-2.5">
            <Button variant="outline" className="w-full h-11 bg-background/60">
              <svg className="size-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full h-11 bg-background/60">
              <svg className="size-4" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>
              Continue with Microsoft
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
