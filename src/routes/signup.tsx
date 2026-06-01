import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User } from "lucide-react";
import { Logo } from "@/components/Logo";
import { AdminSignupForm } from "@/components/signup/admin-signup-form";
import { InternSignupForm } from "@/components/signup/intern-signup-form";
import type { SignupRole } from "@/lib/validations/signup";
import { cn } from "@/lib/utils";
import { ensureGuest } from "@/lib/auth/route-guards";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — InternFlow AI" },
      { name: "description", content: "Create your InternFlow AI account in under a minute." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await ensureGuest(context.queryClient);
  },
  component: SignupPage,
});

const ROLES: { id: SignupRole; label: string; icon: typeof Building2 }[] = [
  { id: "admin", label: "Company Admin", icon: Building2 },
  { id: "intern", label: "Intern", icon: User },
];

function SignupPage() {
  const [role, setRole] = useState<SignupRole>("admin");

  return (
    <div className="min-h-screen bg-gradient-mesh px-4 py-8 sm:px-6 sm:py-12">
      <div
        className={cn(
          "mx-auto w-full transition-[max-width] duration-500 ease-out",
          role === "intern" ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        <div className="mb-6 text-center">
          <Logo className="justify-center" />
        </div>

        <div className="rounded-3xl glass p-6 shadow-glass sm:p-8 md:p-10">
          <h1 className="text-center text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {role === "admin"
              ? "Set up your company workspace and start managing interns."
              : "Build your intern profile and join your internship program."}
          </p>

          {/* Role toggle */}
          <div className="relative mt-8 grid grid-cols-2 rounded-xl bg-muted p-1">
            <div
              className={cn(
                "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-background shadow-soft transition-transform duration-300 ease-out",
                role === "intern" && "translate-x-full",
              )}
              aria-hidden
            />
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "relative z-10 flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-200",
                  role === r.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80",
                )}
              >
                <r.icon className="size-4" />
                {r.label}
              </button>
            ))}
          </div>

          {/* Animated form panel */}
          <div className="mt-8 overflow-hidden">
            <div
              key={role}
              className="animate-in fade-in-0 slide-in-from-bottom-3 duration-400 fill-mode-both"
            >
              {role === "admin" ? <AdminSignupForm /> : <InternSignupForm />}
            </div>
          </div>

          {/* <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
            
          </p> */}
        </div>
      </div>
    </div>
  );
}
