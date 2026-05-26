import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Loader2, Mail, Lock, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginMutation } from "@/hooks/api/use-auth-mutations";
import { useAuthLoginRedirect } from "@/contexts/auth-context";
import { ApiRequestError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { TermsModal, PrivacyModal } from "@/components/auth/terms-modal";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RoleType = "INTERN" | "ADMIN";

export function LoginForm() {
  const loginMutation = useLoginMutation();
  const onAuthSuccess = useAuthLoginRedirect();
  const [selectedRole, setSelectedRole] = useState<RoleType>("INTERN");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const {
    register,
    control,
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
        role: selectedRole,
      });

      // Extra client-side role validation guard
      const userRole = result.user.role;
      const isSelectedAdmin = selectedRole === "ADMIN";
      const isUserAdmin = userRole === "COMPANY_ADMIN" || userRole === "SUPER_ADMIN";
      const isUserIntern = userRole === "INTERN";

      if (isSelectedAdmin && !isUserAdmin) {
        toast.error("Access restricted. This account does not have Admin privileges.");
        return;
      }
      if (!isSelectedAdmin && !isUserIntern) {
        toast.error("Access restricted. This account does not have Intern privileges.");
        return;
      }

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

      {/* Role Toggle Selector */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          I am logging in as
        </Label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border">
          <button
            type="button"
            onClick={() => setSelectedRole("INTERN")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-bold transition-all duration-200 cursor-pointer",
              selectedRole === "INTERN"
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <User className="size-4 shrink-0" />
            <span>Intern</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-bold transition-all duration-200 cursor-pointer",
              selectedRole === "ADMIN"
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Shield className="size-4 shrink-0" />
            <span>Admin</span>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground text-center">
          {selectedRole === "INTERN"
            ? "Logging in as an intern — you'll be directed to your personal dashboard."
            : "Logging in as an administrator — you'll be directed to the admin control panel."}
        </p>
      </div>

      <div>
        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {selectedRole === "ADMIN" ? "Admin Email" : "Intern Email"}
        </Label>
        <div className="relative mt-1.5">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={selectedRole === "ADMIN" ? "admin@company.com" : "intern@company.com"}
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
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <span>Remember me</span>
        </label>
        <Link to="/forgot-password" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={loginMutation.isPending}
        className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow font-bold"
      >
        {loginMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {selectedRole === "ADMIN" ? <Shield className="size-4" /> : <User className="size-4" />}
            Login as {selectedRole === "ADMIN" ? "Admin" : "Intern"}
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>

      <p className="text-center text-[11px] text-muted-foreground mt-4 border-t border-border/40 pt-4">
        By signing in, you agree to our{" "}
        <button
          type="button"
          onClick={() => setShowTerms(true)}
          className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline align-baseline"
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          type="button"
          onClick={() => setShowPrivacy(true)}
          className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline align-baseline"
        >
          Privacy Policy
        </button>
        .
      </p>

      {/* Terms and Privacy Policy Modals */}
      <TermsModal open={showTerms} onOpenChange={setShowTerms} />
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
    </form>
  );
}
