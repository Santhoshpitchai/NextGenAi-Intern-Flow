import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/auth-api";
import { ApiRequestError } from "@/lib/api/errors";

interface SignupEmailPendingProps {
  email: string;
}

export function SignupEmailPending({ email }: SignupEmailPendingProps) {
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsResending(true);
    try {
      await authApi.resendVerification(email);
      toast.success("Verification email resent successfully! Please check your inbox.");
      setCooldown(60); // 60 second cooldown
    } catch (err) {
      if (err instanceof ApiRequestError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to resend verification email. Please try again later.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Decorative pulse mail container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/25 shadow-inner">
          <Mail className="size-10 text-primary animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-foreground">Verify your email address</h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-md">
        We've sent a verification link to <span className="font-semibold text-foreground break-all">{email}</span>. 
        Please click the link in that email to fully activate your account.
      </p>

      {/* Verification Instructions Callout */}
      <div className="mt-6 w-full rounded-2xl bg-muted/30 border border-border/50 p-4 text-left space-y-3">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Check your spam or junk folder if you don't see the email within 2 minutes.
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            The verification link will expire in 24 hours.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col w-full gap-3">
        <Button
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
          className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow font-semibold"
        >
          {isResending ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4 animate-spin" />
              Resending...
            </span>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw className="size-4" />
              Resend Verification Email
            </span>
          )}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 h-11 w-full rounded-xl border border-input bg-background/40 hover:bg-accent/60 text-sm font-semibold transition-all duration-200"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
