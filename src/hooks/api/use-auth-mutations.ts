import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginPayload } from "@/services/auth-api";
import type { AdminSignupFormValues, InternSignupFormValues } from "@/lib/validations/signup";
import { authKeys } from "@/hooks/api/query-keys";

export function useRegisterAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminSignupFormValues) => authApi.registerAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useRegisterInternMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InternSignupFormValues) => authApi.registerIntern(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}
