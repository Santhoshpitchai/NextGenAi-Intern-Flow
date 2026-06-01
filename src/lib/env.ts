const defaultApiUrl =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://nextgenai-intern-flow.onrender.com/api/v1"
    : "http://localhost:4000/api/v1";

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? defaultApiUrl,
} as const;
