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
  const [initializing, setInitializing] = useState(true);
  const [hasValidToken, setHasValidToken] = useState(false);

  const { data: user, isLoading: isQueryLoading } = useQuery({
    queryKey: authKeys.me,
    queryFn: () => authApi.getMe(),
    enabled: hasValidToken && bootstrapped,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Bootstrap on mount - validate tokens ONCE
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      // No tokens at all - just finish bootstrap
      if (!accessToken && !refreshToken) {
        if (isMounted) {
          setBootstrapped(true);
          setInitializing(false);
          setHasValidToken(false);
        }
        return;
      }

      // Try to get user with current access token
      if (accessToken) {
        try {
          const userData = await authApi.getMe();
          if (isMounted) {
            queryClient.setQueryData(authKeys.me, userData);
            setHasValidToken(true);
            setBootstrapped(true);
            setInitializing(false);
          }
          return;
        } catch (error) {
          // Access token invalid, will try refresh below
        }
      }

      // Access token failed or missing, try refresh token
      if (refreshToken) {
        try {
          const response = await authApi.refresh(refreshToken);
          tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
          
          // Get user data with new token
          const userData = await authApi.getMe();
          if (isMounted) {
            queryClient.setQueryData(authKeys.me, userData);
            setHasValidToken(true);
            setBootstrapped(true);
            setInitializing(false);
          }
          return;
        } catch (refreshError) {
          // Refresh failed - clear everything silently
          tokenStorage.clear();
          if (isMounted) {
            queryClient.setQueryData(authKeys.me, null);
            setHasValidToken(false);
            setBootstrapped(true);
            setInitializing(false);
          }
          return;
        }
      }

      // No valid tokens
      if (isMounted) {
        tokenStorage.clear();
        queryClient.setQueryData(authKeys.me, null);
        setHasValidToken(false);
        setBootstrapped(true);
        setInitializing(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []); // Only run once on mount

  const login = useCallback(
    (response: AuthResponse) => {
      tokenStorage.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      queryClient.setQueryData(authKeys.me, response.user);
      setHasValidToken(true);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    tokenStorage.clear();
    queryClient.setQueryData(authKeys.me, null);
    queryClient.removeQueries({ queryKey: authKeys.all });
    setHasValidToken(false);
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
      setHasValidToken(false);
      toast.error("Your session has expired. Please sign in again.");
      navigate({ to: "/login" });
    };
    window.addEventListener("auth:session-expired", onExpired);
    return () => window.removeEventListener("auth:session-expired", onExpired);
  }, [queryClient, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: !!user && hasValidToken,
      isLoading: initializing || (hasValidToken && isQueryLoading),
      login,
      logout,
      refetchUser,
    }),
    [user, hasValidToken, initializing, isQueryLoading, login, logout, refetchUser],
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
