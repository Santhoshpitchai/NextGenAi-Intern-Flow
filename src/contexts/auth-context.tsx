import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authApi } from "@/services/auth-api";
import { authKeys } from "@/hooks/api/query-keys";
import { tokenStorage } from "@/lib/storage/token-storage";
import { getDashboardPath } from "@/lib/auth/redirects";
import type { AuthResponse, User } from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [bootstrapped, setBootstrapped] = useState(false);

  const hasToken = !!tokenStorage.getAccessToken();

  const { data: user, isLoading: isQueryLoading } = useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!hasToken || !isQueryLoading) {
      setBootstrapped(true);
    }
  }, [hasToken, isQueryLoading]);

  const login = useCallback(
    (response: AuthResponse) => {
      tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      queryClient.setQueryData(authKeys.me, response.user);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    tokenStorage.clear();
    queryClient.setQueryData(authKeys.me, null);
    queryClient.removeQueries({ queryKey: authKeys.all });
    navigate({ to: "/login" });
    toast.success("Logged out successfully");
  }, [queryClient, navigate]);

  const refetchUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me });
  }, [queryClient]);

  useEffect(() => {
    const onExpired = () => {
      tokenStorage.clear();
      queryClient.setQueryData(authKeys.me, null);
      toast.error("Your session has expired. Please sign in again.");
      navigate({ to: "/login" });
    };
    window.addEventListener("auth:session-expired", onExpired);
    return () => window.removeEventListener("auth:session-expired", onExpired);
  }, [queryClient, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user && hasToken,
      isLoading: hasToken && (!bootstrapped || isQueryLoading),
      login,
      logout,
      refetchUser,
    }),
    [user, hasToken, bootstrapped, isQueryLoading, login, logout, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function useAuthLoginRedirect() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (response: AuthResponse, message = "Welcome back!") => {
    login(response);
    toast.success(message);
    navigate({ to: getDashboardPath(response.user.role) });
  };
}
