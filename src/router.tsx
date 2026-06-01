import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { toast } from "sonner";
import { ApiRequestError } from "@/lib/api/errors";

function handleError(error: unknown) {
  // Ignore any 401 unauthorized errors globally in the query/mutation caches
  // because these are handled by the session-expired/logout redirect logic,
  // or represent harmless in-flight requests interrupted by a logout.
  if (error && typeof error === "object") {
    const errObj = error as Record<string, unknown>;
    const status = errObj.status;
    const response = errObj.response as Record<string, unknown> | undefined;
    const responseStatus = response?.status;
    if (status === 401 || responseStatus === 401) {
      return;
    }
  }

  if (error instanceof ApiRequestError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function getRouter() {
  return router;
}
