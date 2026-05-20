import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";
import { tokenStorage } from "@/lib/storage/token-storage";
import { ApiRequestError } from "@/lib/api/errors";
import type { ApiErrorBody, ApiSuccess, AuthTokens } from "@/types/auth";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
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

  if (config.data instanceof FormData) {
    if (config.headers) {
      delete (config.headers as Record<string, unknown>)['Content-Type'];
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/register")
    ) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(error);
      }

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

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiSuccess<AuthTokens>>(
          `${env.apiUrl}/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefresh } = data.data;
        tokenStorage.setTokens(accessToken, newRefresh);
        processQueue(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        tokenStorage.clear();
        processQueue(null);
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data && error.response.data.success === false) {
      return Promise.reject(
        ApiRequestError.fromResponse(error.response.status, error.response.data),
      );
    }

    return Promise.reject(
      new ApiRequestError(error.response?.status ?? 500, error.message || "Network error"),
    );
  },
);

export function unwrap<T>(response: { data: ApiSuccess<T> }): T {
  return response.data.data;
}
