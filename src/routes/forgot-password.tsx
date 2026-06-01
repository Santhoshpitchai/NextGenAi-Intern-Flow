import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, CheckCircle2, Shield, User } from "lucide-react";
import { ensureGuest } from "@/lib/auth/route-guards";
import { authApi } from "@/services/auth-api";
import { useState } from "react";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — InternFlow AI" },
      {
        name: "description",
        content: "Request a password reset link for your InternFlow AI account.",
      },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await ensureGuest(context.queryClient);
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"INTERN" | "ADMIN">("INTERN");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword(values.email, selectedRole);
      setIsSuccess(true);
      toast.success("Password reset link sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
        </div>

        <div className="rounded-3xl glass p-8 shadow-glass sm:p-10">
          <h1 className="text-3xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSuccess
              ? "We've sent a password reset link to your email."
              : "Enter your email and we'll send instructions to reset your password."}
          </p>

          {isSuccess ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center text-success flex flex-col items-center gap-3">
                <CheckCircle2 className="size-8" />
                <p className="text-sm font-medium">
                  Please check your email inbox and spam folder.
                </p>
              </div>
              <Button
                asChild
                className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
              >
                <Link to="/login">Return to login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
              {/* Role Toggle Selector */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  I am resetting password for
                </Label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border">
                  <button
                    key="role-intern"
                    type="button"
                    onClick={() => setSelectedRole("INTERN")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-2 px-4 text-sm font-bold transition-all duration-200 cursor-pointer h-10",
                      selectedRole === "INTERN"
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    <User className="size-4 shrink-0" />
                    <span>Intern</span>
                  </button>
                  <button
                    key="role-admin"
                    type="button"
                    onClick={() => setSelectedRole("ADMIN")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-2 px-4 text-sm font-bold transition-all duration-200 cursor-pointer h-10",
                      selectedRole === "ADMIN"
                        ? "bg-gradient-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    <Shield className="size-4 shrink-0" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 bg-background/60 pl-10"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}

          {!isSuccess && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
