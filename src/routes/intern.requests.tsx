import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, HelpCircle, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";
import { requestApi } from "@/services/request-api";
import { toast } from "sonner";

export const Route = createFileRoute("/intern/requests")({
  head: () => ({ meta: [{ title: "Requests — InternFlow AI" }] }),
  component: InternRequests,
});

function InternRequests() {
  const queryClient = useQueryClient();
  const [requestDialog, setRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    type: "LEAVE" as "LEAVE" | "TIME_OFF" | "RESOURCE" | "HELP" | "OTHER",
    title: "",
    description: "",
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["my-requests"],
    queryFn: () => requestApi.getMyRequests(),
  });

  const createRequestMutation = useMutation({
    mutationFn: requestApi.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast.success("Request submitted successfully!");
      setRequestDialog(false);
      setRequestData({ type: "LEAVE", title: "", description: "" });
    },
    onError: () => {
      toast.error("Failed to submit request");
    },
  });

  const handleCreateRequest = () => {
    if (!requestData.title || !requestData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    createRequestMutation.mutate(requestData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="size-4" />;
      case "APPROVED":
        return <CheckCircle className="size-4" />;
      case "REJECTED":
        return <XCircle className="size-4" />;
      default:
        return <HelpCircle className="size-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Requests"
        subtitle="Submit requests and track their status"
        actions={
          <Button
            className="bg-gradient-primary text-primary-foreground"
            onClick={() => setRequestDialog(true)}
          >
            <Plus className="size-4" />
            New Request
          </Button>
        }
      />

      {!requests || requests.length === 0 ? (
        <Card className="p-12 text-center">
          <HelpCircle className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
          <p className="text-muted-foreground mb-4">
            Submit a request for time off, resources, or help
          </p>
          <Button onClick={() => setRequestDialog(true)}>
            <Plus className="size-4" />
            Create Request
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(request.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </Badge>
                    <Badge variant="outline">{request.type.replace("_", " ")}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{request.description}</p>

                  {request.response && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs font-semibold mb-1">
                        Response from {request.reviewedBy?.companyAdmin?.fullName || "Admin"}
                      </p>
                      <p className="text-sm">{request.response}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
                {request.reviewedAt && (
                  <span>Reviewed {new Date(request.reviewedAt).toLocaleDateString()}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={requestDialog} onOpenChange={setRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Request</DialogTitle>
            <DialogDescription>Submit a request for time off, resources, or help</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Request Type</Label>
              <Select
                value={requestData.type}
                onValueChange={(value) => setRequestData({ ...requestData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEAVE">Leave Request</SelectItem>
                  <SelectItem value="TIME_OFF">Time Off</SelectItem>
                  <SelectItem value="RESOURCE">Resource Request</SelectItem>
                  <SelectItem value="HELP">Help/Support</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={requestData.title}
                onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                placeholder="Brief title for your request"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={requestData.description}
                onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                placeholder="Provide details about your request"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={
                !requestData.title || !requestData.description || createRequestMutation.isPending
              }
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
