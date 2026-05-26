import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks, Calendar, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { assignmentApi } from "@/services/assignment-api";
import { taskApi } from "@/services/task-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/intern/tasks")({
  head: () => ({ meta: [{ title: "Tasks — InternFlow AI" }] }),
  component: InternTasks,
});

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-purple-100 text-purple-800",
  BLOCKED: "bg-red-100 text-red-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

function InternTasks() {
  const queryClient = useQueryClient();
  const [progressDialog, setProgressDialog] = useState<{ open: boolean; taskId: string | null }>({ open: false, taskId: null });
  const [progressData, setProgressData] = useState({ percentComplete: 0, summary: "", details: "", blockers: "" });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) => taskApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const addProgressMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) => taskApi.addProgress(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
      setProgressDialog({ open: false, taskId: null });
      setProgressData({ percentComplete: 0, summary: "", details: "", blockers: "" });
      toast.success("Progress added successfully");
    },
    onError: () => {
      toast.error("Failed to add progress");
    },
  });

  const handleMarkDone = (taskId: string) => {
    updateTaskMutation.mutate({ taskId, data: { status: "DONE" } });
  };

  const handleUpdateProgress = () => {
    if (!progressDialog.taskId) return;
    addProgressMutation.mutate({
      taskId: progressDialog.taskId,
      data: progressData,
    });
  };

  const allTasks = assignments?.flatMap((assignment) =>
    assignment.tasks.map((task) => ({
      ...task,
      assignmentTitle: assignment.title,
      companyName: assignment.company.name,
    }))
  ) || [];

  const activeTasks = allTasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED");
  const completedTasks = allTasks.filter((t) => t.status === "DONE");

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
        title="My Tasks"
        subtitle={`${activeTasks.length} active tasks, ${completedTasks.length} completed`}
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <ListChecks className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <p className="text-2xl font-bold">{activeTasks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <AlertCircle className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assignments</p>
              <p className="text-2xl font-bold">{assignments?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {allTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <ListChecks className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">
            Tasks will appear here when your admin assigns them to you.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {allTasks.map((task) => (
            <Card key={task.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn("text-xs", statusColors[task.status as keyof typeof statusColors])}>
                      {task.status.replace("_", " ")}
                    </Badge>
                    <Badge className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}>
                      {task.priority}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <ListChecks className="size-4" />
                      {task.assignmentTitle}
                    </span>
                    <span>•</span>
                    <span>{task.companyName}</span>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {new Date(task.dueDate) < new Date() && task.status !== "DONE" && (
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                      )}
                    </div>
                  )}

                  {task.completedAt && (
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <CheckCircle2 className="size-4 text-green-600" />
                      <span className="text-muted-foreground">
                        Completed: {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {task.status !== "DONE" && task.status !== "CANCELLED" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setProgressDialog({ open: true, taskId: task.id })}
                      >
                        Update Progress
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleMarkDone(task.id)}
                        disabled={updateTaskMutation.isPending}
                      >
                        Mark Done
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={progressDialog.open} onOpenChange={(open) => setProgressDialog({ open, taskId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Progress</DialogTitle>
            <DialogDescription>Add progress details for this task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="percentComplete">Percent Complete (%)</Label>
              <Input
                id="percentComplete"
                type="number"
                min="0"
                max="100"
                value={progressData.percentComplete}
                onChange={(e) => setProgressData({ ...progressData, percentComplete: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="summary">Summary *</Label>
              <Input
                id="summary"
                value={progressData.summary}
                onChange={(e) => setProgressData({ ...progressData, summary: e.target.value })}
                placeholder="Brief summary of progress"
              />
            </div>
            <div>
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={progressData.details}
                onChange={(e) => setProgressData({ ...progressData, details: e.target.value })}
                placeholder="Detailed description of work done"
              />
            </div>
            <div>
              <Label htmlFor="blockers">Blockers</Label>
              <Textarea
                id="blockers"
                value={progressData.blockers}
                onChange={(e) => setProgressData({ ...progressData, blockers: e.target.value })}
                placeholder="Any blockers or issues"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressDialog({ open: false, taskId: null })}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProgress}
              disabled={!progressData.summary || addProgressMutation.isPending}
            >
              {addProgressMutation.isPending ? "Saving..." : "Save Progress"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

