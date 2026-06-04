const defaultApiUrl =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://nextgenai-intern-flow.onrender.com/api/v1"
    : "http://localhost:4000/api/v1";

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? defaultApiUrl,
} as const;

// Resolve a file URL — if it's a relative /uploads/... path, prepend the backend base URL
export function resolveFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Relative path — prepend backend origin
  const backendOrigin = env.apiUrl.replace(/\/api\/v\d+$/, "");
  return `${backendOrigin}${url}`;
}
