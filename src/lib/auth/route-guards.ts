import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/auth-api";
import { authKeys } from "@/hooks/api/query-keys";
import { tokenStorage } from "@/lib/storage/token-storage";
import { getDashboardPath } from "@/lib/auth/redirects";
import type { User, UserRole } from "@/types/auth";

export async function ensureAuthenticated(queryClient: QueryClient): Promise<User> {
  const token = tokenStorage.getAccessToken();
  if (!token) {
    throw redirect({ to: "/login" });
  }

  try {
    return await queryClient.fetchQuery({
      queryKey: authKeys.me,
      queryFn: () => authApi.getMe(),
      staleTime: 60_000,
    });
  } catch {
    tokenStorage.clear();
    throw redirect({ to: "/login" });
  }
}

export async function ensureGuest(queryClient: QueryClient) {
  const token = tokenStorage.getAccessToken();
  if (!token) return;

  try {
    const user = await queryClient.fetchQuery({
      queryKey: authKeys.me,
      queryFn: () => authApi.getMe(),
      staleTime: 60_000,
    });
    throw redirect({ to: getDashboardPath(user.role) });
  } catch (err) {
    if (err && typeof err === "object" && "to" in err) throw err;
    tokenStorage.clear();
  }
}

export async function ensureRole(queryClient: QueryClient, ...roles: UserRole[]): Promise<User> {
  const user = await ensureAuthenticated(queryClient);
  if (!roles.includes(user.role)) {
    throw redirect({ to: getDashboardPath(user.role) });
  }
  return user;
}
