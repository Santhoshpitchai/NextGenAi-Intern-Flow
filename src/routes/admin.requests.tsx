import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquare, Calendar, Clock, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestApi } from "@/services/request-api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/requests")({
  head: () => ({ meta: [{ title: "Requests — InternFlow AI" }] }),
  component: RequestsPage,
});

function RequestsPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["all-requests"],
    queryFn: () => requestApi.getAllRequests(),
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      requestApi.updateRequest(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["all-requests"] });
      toast.success(`Request ${variables.status.toLowerCase()} successfully!`);
    },
    onError: () => {
      toast.error("Failed to update request status");
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "LEAVE":
      case "TIME_OFF":
        return Calendar;
      case "RESOURCE":
        return Package;
      case "HELP":
        return MessageSquare;
      default:
        return Clock;
    }
  };

  const getTone = (type: string) => {
    switch (type) {
      case "LEAVE":
      case "TIME_OFF":
        return "primary";
      case "RESOURCE":
        return "warning";
      case "HELP":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const toneBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const list = requests || [];

  return (
    <div>
      <PageHeader
        title="Requests"
        subtitle="Approve, reject, or comment on open intern requests."
      />
      <div className="grid lg:grid-cols-2 gap-5">
        {list.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground glass rounded-2xl">
            No requests submitted yet.
          </div>
        ) : (
          list.map((r) => {
            const IconComponent = getIcon(r.type);
            const tone = getTone(r.type);
            const createdDate = new Date(r.createdAt).toLocaleDateString();

            return (
              <div key={r.id} className="p-6 rounded-2xl glass shadow-soft">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "size-11 rounded-xl grid place-items-center shrink-0",
                      toneBg[tone],
                    )}
                  >
                    <IconComponent className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold leading-snug">{r.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.createdBy?.intern?.fullName || r.createdBy?.email} ·{" "}
                          {r.type.replace("_", " ")} · {createdDate}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold capitalize",
                            r.status === "APPROVED"
                              ? "bg-success/10 text-success"
                              : r.status === "REJECTED"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning",
                          )}
                        >
                          {r.status.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {r.description}
                    </p>

                    {r.status === "PENDING" && (
                      <div className="mt-5 flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-success text-success-foreground hover:opacity-90"
                          onClick={() =>
                            updateRequestMutation.mutate({ id: r.id, status: "APPROVED" })
                          }
                          disabled={updateRequestMutation.isPending}
                        >
                          <Check className="size-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateRequestMutation.mutate({ id: r.id, status: "REJECTED" })
                          }
                          disabled={updateRequestMutation.isPending}
                        >
                          <X className="size-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
