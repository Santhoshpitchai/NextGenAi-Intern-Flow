import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/services/auth-api";
import { ensureGuest } from "@/lib/auth/route-guards";
import { ApiRequestError } from "@/lib/api/errors";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify Email — InternFlow AI" },
      { name: "description", content: "Verify your email address to activate your account." },
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
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "Verification token is missing. Please request a new verification link."
  );
  
  // Resend state for unverified/expired links
  const [resendEmail, setResendEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Trigger verification on mount if token is present
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        if (isMounted) {
          setStatus("success");
          toast.success("Email verified successfully! You can now log in.");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "The verification link is invalid or has expired.");
          toast.error(err.message || "Verification failed.");
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail);
      toast.success("Verification email resent successfully! Please check your inbox.");
      setCooldown(60);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to resend verification link. Please check the email and try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center animate-in fade-in-0 duration-500">
          <Logo className="justify-center" />
        </div>

        <div className="rounded-3xl glass p-8 shadow-glass sm:p-10 border border-border/40 relative overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          
          {/* 1. VERIFYING STATE */}
          {status === "verifying" && (
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-background border border-border shadow-soft">
                  <Loader2 className="size-8 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Activating account</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please hold on while we verify your credentials and secure your workspace...
                </p>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center text-center py-4 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-soft">
                  <CheckCircle2 className="size-10 text-emerald-500 animate-in zoom-in-50 duration-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Verified!</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your email address has been verified. Your InternFlow AI workspace is now ready.
                </p>
              </div>
              <Button
                asChild
                className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow font-bold mt-2"
              >
                <Link to="/login">
                  <span>Proceed to Log In</span>
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* 3. ERROR / EXPIRED STATE */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20 shadow-soft">
                  <AlertTriangle className="size-8 text-destructive animate-bounce" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification Failed</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {errorMessage}
                </p>
              </div>

              {/* In-view recovery form to resend link */}
              <div className="w-full border-t border-border/40 pt-6 mt-2">
                <form onSubmit={handleResend} className="space-y-4 text-left">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Email Address
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        className="h-11 bg-background/60 pl-10"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        disabled={isResending}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isResending || cooldown > 0}
                    className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow font-semibold"
                  >
                    {isResending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="size-4 animate-spin" />
                        Requesting...
                      </span>
                    ) : cooldown > 0 ? (
                      `Request new link in ${cooldown}s`
                    ) : (
                      "Request New Verification Link"
                    )}
                  </Button>
                </form>
              </div>

              <Link
                to="/login"
                className="text-sm font-semibold text-primary hover:underline mt-4 block"
              >
                Back to Sign In
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
