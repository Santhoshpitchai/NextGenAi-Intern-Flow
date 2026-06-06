import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";
import { tokenStorage } from "@/lib/storage/token-storage";
import { ApiRequestError } from "@/lib/api/errors";
import type { ApiErrorBody, ApiSuccess, AuthTokens } from "@/types/auth";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000, // Increased to 60 seconds for slower servers
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401 errors on protected endpoints
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/register") &&
      !original.url?.includes("/auth/refresh") &&
      !original.url?.includes("/auth/logout")
    ) {
      const refreshToken = tokenStorage.getRefreshToken();

      // No refresh token available - clear and notify
      if (!refreshToken) {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }

      // Mark as retried to prevent infinite loops
      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiSuccess<AuthTokens>>(`${env.apiUrl}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = data.data;

        // Update tokens
        tokenStorage.setTokens(accessToken, newRefresh);

        // Process queued requests
        processQueue(accessToken);

        // Retry original request with new token
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        // Refresh failed - clear tokens and notify
        tokenStorage.clear();
        processQueue(null);
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle API error responses
    if (error.response?.data && error.response.data.success === false) {
      return Promise.reject(
        ApiRequestError.fromResponse(error.response.status, error.response.data),
      );
    }

    // Handle network errors
    return Promise.reject(
      new ApiRequestError(error.response?.status ?? 500, error.message || "Network error"),
    );
  },
);

export function unwrap<T>(response: { data: any }): T {
  // Handle both wrapped { success, data, message } and raw array/object responses
  if (response.data && typeof response.data === "object" && "success" in response.data && "data" in response.data) {
    return response.data.data;
  }
  return response.data;
}
