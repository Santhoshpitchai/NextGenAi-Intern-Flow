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
import { Calendar, Briefcase, Loader2, Plus, FileDown } from "lucide-react";
import { assignmentApi } from "@/services/assignment-api";
import { dailyUpdateApi } from "@/services/daily-update-api";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { env } from "@/lib/env";

export const Route = createFileRoute("/intern/updates")({
  head: () => ({ meta: [{ title: "Updates — InternFlow AI" }] }),
  component: InternUpdates,
});

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function InternUpdates() {
  const queryClient = useQueryClient();
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [updateData, setUpdateData] = useState({
    summary: "",
    accomplishments: "",
    challenges: "",
    nextSteps: "",
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ["my-daily-updates"],
    queryFn: () => dailyUpdateApi.getMyUpdates(),
  });

  const createUpdateMutation = useMutation({
    mutationFn: dailyUpdateApi.createUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-daily-updates"] });
      toast.success("Daily update submitted successfully!");
      setUpdateDialog(false);
      setSelectedProjectId("");
      setUpdateData({ summary: "", accomplishments: "", challenges: "", nextSteps: "" });
    },
    onError: () => {
      toast.error("Failed to submit daily update");
    },
  });

  const handleSubmitUpdate = () => {
    if (!updateData.summary) {
      toast.error("Please provide a summary");
      return;
    }

    let finalSummary = updateData.summary;
    if (selectedProjectId && assignments) {
      const selectedProj = assignments.find((a: any) => a.id === selectedProjectId);
      if (selectedProj) {
        finalSummary = `[${selectedProj.title}] ${updateData.summary}`;
      }
    }

    createUpdateMutation.mutate({
      ...updateData,
      summary: finalSummary,
    });
  };

  const isLoading = assignmentsLoading || updatesLoading;

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
        title="Daily Updates"
        subtitle="Track your progress and share updates with your team"
        actions={
          <Button
            className="bg-gradient-primary text-primary-foreground"
            onClick={() => setUpdateDialog(true)}
          >
            <Plus className="size-4" />
            Submit Update
          </Button>
        }
      />

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Assignments</h3>

          {!assignments || assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="size-12 mx-auto mb-2 opacity-50" />
              <p>No assignments yet</p>
              <p className="text-xs mt-1">
                Assignments will appear here when your admin creates them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{assignment.status}</Badge>
                        {assignment.department && (
                          <Badge variant="outline">{assignment.department}</Badge>
                        )}
                      </div>

                      <h4 className="font-semibold mb-1">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {assignment.company.name}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                          {new Date(assignment.endDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{assignment.tasks.length} tasks</span>
                      </div>

                      {(() => {
                        const attachmentMatch = assignment.notes?.match(
                          /\[Attachment: 📄 (.*?)\]\((.*?)\)/,
                        );
                        const hasAttachmentUrl = !!attachmentMatch;
                        const attachmentName = attachmentMatch ? attachmentMatch[1] : null;
                        let attachmentUrl = attachmentMatch ? attachmentMatch[2] : null;
                        if (attachmentUrl && attachmentUrl.startsWith("/")) {
                          attachmentUrl = `${env.apiUrl.replace("/api/v1", "")}${attachmentUrl}`;
                        }

                        const hasOldAttachment =
                          assignment.notes?.includes("Attachment: 📄 ") && !hasAttachmentUrl;
                        const oldAttachmentName = hasOldAttachment
                          ? assignment.notes.split("Attachment: 📄 ")[1]
                          : null;

                        const displayNotes = assignment.notes
                          ? assignment.notes
                              .replace(/\n\n\[Attachment: 📄 .*?\].*?$/, "")
                              .replace(/\n\nAttachment: 📄 .*?$/, "")
                          : assignment.notes;

                        return (
                          <>
                            {displayNotes && (
                              <p className="text-sm mt-2 text-muted-foreground">{displayNotes}</p>
                            )}

                            {(hasAttachmentUrl || hasOldAttachment) && (
                              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between text-sm">
                                <span className="font-semibold text-primary truncate max-w-[80%]">
                                  📄 {attachmentName || oldAttachmentName}
                                </span>
                                <div className="flex gap-2">
                                  {hasAttachmentUrl ? (
                                    <a
                                      href={attachmentUrl!}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 rounded-md transition-all"
                                    >
                                      <FileDown className="size-3.5" />
                                      <span>Read Document</span>
                                    </a>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs font-semibold text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground"
                                      onClick={() =>
                                        toast.success(
                                          `Downloaded project briefing: ${oldAttachmentName}`,
                                        )
                                      }
                                    >
                                      <FileDown className="size-3.5 mr-1.5" />
                                      Read Document
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <Link to="/intern/tasks">
                      <Button variant="outline" size="sm">
                        View Tasks
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Updates</h3>
          {!updates || updates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="size-12 mx-auto mb-2 opacity-50" />
              <p>No updates yet</p>
              <p className="text-xs mt-1">Submit your first daily update to track your progress</p>
              <Button className="mt-4" variant="outline" onClick={() => setUpdateDialog(true)}>
                <Plus className="size-4" />
                Submit Update
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <Card key={update.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(update.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="font-semibold mb-2">{update.summary}</h4>

                  {update.accomplishments && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Accomplishments
                      </p>
                      <p className="text-sm">{update.accomplishments}</p>
                    </div>
                  )}

                  {update.challenges && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Challenges</p>
                      <p className="text-sm">{update.challenges}</p>
                    </div>
                  )}

                  {update.nextSteps && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Next Steps</p>
                      <p className="text-sm">{update.nextSteps}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Daily Update</DialogTitle>
            <DialogDescription>Share your progress and updates with your team</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project">Select Associated Project / Assignment</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Link this update to an active project..." />
                </SelectTrigger>
                <SelectContent>
                  {assignments?.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>
                      📁 {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="summary">Summary *</Label>
              <Input
                id="summary"
                value={updateData.summary}
                onChange={(e) => setUpdateData({ ...updateData, summary: e.target.value })}
                placeholder="Brief summary of today's work"
              />
            </div>
            <div>
              <Label htmlFor="accomplishments">Accomplishments</Label>
              <Textarea
                id="accomplishments"
                value={updateData.accomplishments}
                onChange={(e) => setUpdateData({ ...updateData, accomplishments: e.target.value })}
                placeholder="What did you accomplish today?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="challenges">Challenges</Label>
              <Textarea
                id="challenges"
                value={updateData.challenges}
                onChange={(e) => setUpdateData({ ...updateData, challenges: e.target.value })}
                placeholder="Any challenges or blockers?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="nextSteps">Next Steps</Label>
              <Textarea
                id="nextSteps"
                value={updateData.nextSteps}
                onChange={(e) => setUpdateData({ ...updateData, nextSteps: e.target.value })}
                placeholder="What are you planning for tomorrow?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpdate}
              disabled={!updateData.summary || createUpdateMutation.isPending}
            >
              {createUpdateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
