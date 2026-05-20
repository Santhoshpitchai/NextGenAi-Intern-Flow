import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation } from "@/hooks/api/use-auth-mutations";
import { useAuthLoginRedirect } from "@/contexts/auth-context";
import { ApiRequestError } from "@/lib/api/errors";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const onAuthSuccess = useAuthLoginRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      onAuthSuccess(result);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        toast.error(err.message);
      } else {
        toast.error("Unable to sign in. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
      <div>
        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Email
        </Label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            className="h-11 bg-background/60 pl-10"
            disabled={loginMutation.isPending}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Password
        </Label>
        <div className="relative mt-1.5">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 bg-background/60 pl-10"
            disabled={loginMutation.isPending}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="mt-1.5 text-[0.8rem] font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox {...register("remember")} />
          <span>Remember me</span>
        </label>
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </span>
        ) : (
          "Login"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
