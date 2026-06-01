import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { ensureGuest } from "@/lib/auth/route-guards";
import { authApi } from "@/services/auth-api";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — InternFlow AI" },
      { name: "description", content: "Reset your InternFlow AI account password." },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await ensureGuest(context.queryClient);
  },
  validateSearch: (search: Record<string, unknown>): { token?: string } => {
    return {
      token: typeof search.token === "string" ? search.token : undefined,
    };
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-mesh px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-md rounded-3xl glass p-8 shadow-glass sm:p-10 text-center">
          <Logo className="justify-center mb-6" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Invalid Token</h1>
          <p className="text-muted-foreground mb-6">
            The password reset link is invalid or missing. Please request a new one.
          </p>
          <Button
            asChild
            className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
          >
            <Link to="/forgot-password">Request New Link</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await authApi.resetPassword({
        token,
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully. You can now log in.");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
        </div>

        <div className="rounded-3xl glass p-8 shadow-glass sm:p-10">
          <h1 className="text-3xl font-bold">Create new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your new password must be unique and contain at least 8 characters.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div>
              <Label
                htmlFor="newPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                New Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-background/60 pl-10"
                  disabled={isSubmitting}
                  {...register("newPassword")}
                />
              </div>
              {errors.newPassword && (
                <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-background/60 pl-10"
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {isSubmitting ? "Resetting…" : "Reset password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
