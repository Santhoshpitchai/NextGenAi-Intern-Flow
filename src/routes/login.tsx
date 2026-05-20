import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/auth/login-form";
import { Sparkles, BarChart3, CheckCircle2 } from "lucide-react";
import { ensureGuest } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — InternFlow AI" },
      { name: "description", content: "Sign in to your InternFlow AI workspace." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await ensureGuest(context.queryClient);
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="absolute left-8 top-8">
          <Logo />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-5xl font-bold leading-tight">Manage Interns Smarter</h2>
          <p className="mt-4 text-lg opacity-90">
            Track productivity, run sprints, and review performance — all in one calm, focused
            workspace.
          </p>
          <ul className="mt-12 space-y-3">
            {[
              { icon: BarChart3, label: "Real-time productivity analytics" },
              { icon: CheckCircle2, label: "AI-powered task assignment" },
              { icon: Sparkles, label: "Weekly insight briefings" },
            ].map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur-md"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/20">
                  <f.icon className="size-5" />
                </span>
                <span className="font-medium">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <span className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <span className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center bg-gradient-mesh p-6 md:p-12">
        <div className="w-full max-w-md rounded-3xl glass p-8 shadow-glass md:p-10">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your workspace.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
