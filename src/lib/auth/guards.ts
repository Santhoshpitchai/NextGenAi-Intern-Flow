import { redirect } from "@tanstack/react-router";
import type { AuthContextValue } from "@/contexts/auth-context";
import type { UserRole } from "@/types/auth";
import { getDashboardPath } from "@/lib/auth/redirects";

export function requireAuth(auth: AuthContextValue, redirectTo = "/login") {
  if (auth.isLoading) return;
  if (!auth.isAuthenticated) {
    throw redirect({ to: redirectTo });
  }
}

export function requireGuest(auth: AuthContextValue) {
  if (auth.isLoading) return;
  if (auth.isAuthenticated && auth.user) {
    throw redirect({ to: getDashboardPath(auth.user.role) });
  }
}

export function requireRole(auth: AuthContextValue, ...roles: UserRole[]) {
  requireAuth(auth);
  if (auth.user && !roles.includes(auth.user.role)) {
    throw redirect({ to: getDashboardPath(auth.user.role) });
  }
}
