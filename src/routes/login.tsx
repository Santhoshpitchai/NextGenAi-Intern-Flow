import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/auth/login-form";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-mesh p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-md rounded-3xl glass p-8 shadow-glass md:p-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="text-center text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Select your role and sign in to continue to your workspace.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
