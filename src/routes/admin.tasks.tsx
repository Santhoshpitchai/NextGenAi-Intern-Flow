import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
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
import {
  Calendar,
  MessageSquare,
  Plus,
  MoreHorizontal,
  Loader2,
  ArrowRight,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { taskApi } from "@/services/task-api";
import { assignmentApi } from "@/services/assignment-api";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — InternFlow AI" }] }),
  component: TasksPage,
});

const statusColumns = [
  {
    id: "TODO",
    title: "To Do",
    tone: "bg-muted-foreground/30",
    textClass: "text-muted-foreground",
  },
  { id: "IN_PROGRESS", title: "In Progress", tone: "bg-primary", textClass: "text-primary" },
  { id: "IN_REVIEW", title: "In Review", tone: "bg-warning", textClass: "text-warning" },
  { id: "DONE", title: "Done", tone: "bg-success", textClass: "text-success" },
];

const priorityStyle: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive",
  URGENT: "bg-destructive/15 text-destructive font-bold border border-destructive/20",
  MEDIUM: "bg-warning/10 text-warning",
  LOW: "bg-muted text-muted-foreground",
};

function TasksPage() {
  const queryClient = useQueryClient();
  const [addTaskDialog, setAddTaskDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assignmentId: "",
  });

  // Query database for all tasks
  const { data: tasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => taskApi.getAllTasks(),
  });

  // Query database for active assignments (sprints) to populate dialog dropdown
  const { data: assignmentsData, isLoading: loadingAssignments } = useQuery({
    queryKey: ["all-assignments"],
    queryFn: () => assignmentApi.getAllAssignments(),
  });

  // Task creation mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: any) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      toast.success("Task created and assigned successfully!");
      setAddTaskDialog(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create task");
    },
  });

  // Task status update mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      taskApi.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      toast.success("Task status updated!");
    },
    onError: () => {
      toast.error("Failed to update task status");
    },
  });

  // Task deletion mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      assignmentId: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.assignmentId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Resolve assignee (intern's user ID) from selected project assignment
    const selectedAssignment = assignments.find((a: any) => a.id === formData.assignmentId);
    if (!selectedAssignment || !selectedAssignment.intern) {
      toast.error("Invalid assignment selected");
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate || undefined,
      assignmentId: formData.assignmentId,
      assigneeId: selectedAssignment.intern.userId,
    };

    createTaskMutation.mutate(payload);
  };

  const handleNextStatus = (id: string, currentStatus: string) => {
    const sequence = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const nextIndex = sequence.indexOf(currentStatus) + 1;
    if (nextIndex < sequence.length) {
      updateTaskMutation.mutate({ id, status: sequence[nextIndex] });
    }
  };

  if (loadingTasks || loadingAssignments) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const tasksList = tasks || [];
  const assignments = assignmentsData?.assignments || [];

  return (
    <div>
      <PageHeader
        title="Task Board"
        subtitle="Manage sprint assignments and track task statuses dynamically."
        actions={
          <Button
            className="bg-gradient-primary text-primary-foreground shadow-glow"
            onClick={() => setAddTaskDialog(true)}
          >
            <Plus className="size-4" /> New Task
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statusColumns.map((col) => {
          const colTasks = tasksList.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-2xl bg-card/50 border border-border p-4 min-h-[60vh]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", col.tone)} />
                  <h3 className="font-semibold text-sm">{col.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {colTasks.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground"
                  onClick={() => setAddTaskDialog(true)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground/60 border border-dashed rounded-xl">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const initials = t.assignment?.company?.name?.slice(0, 2).toUpperCase() || "IF";
                    const formattedDue = t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "No limit";

                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-xl bg-background border border-border shadow-soft hover:shadow-glow hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                              priorityStyle[t.priority] || priorityStyle.MEDIUM,
                            )}
                          >
                            {t.priority}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {t.status !== "DONE" && (
                              <button
                                className="text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => handleNextStatus(t.id, t.status)}
                                title="Move to next stage"
                              >
                                <ArrowRight className="size-3.5" />
                              </button>
                            )}
                            {t.status !== "DONE" && (
                              <button
                                className="text-muted-foreground hover:text-success transition-colors"
                                onClick={() =>
                                  updateTaskMutation.mutate({ id: t.id, status: "DONE" })
                                }
                                title="Mark Completed"
                              >
                                <CheckCircle className="size-3.5" />
                              </button>
                            )}
                            <button
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => {
                                if (confirm("Delete this task?")) {
                                  deleteTaskMutation.mutate(t.id);
                                }
                              }}
                              title="Delete Task"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-semibold text-sm leading-snug mb-1 text-foreground">
                          {t.title}
                        </h4>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {t.description}
                          </p>
                        )}

                        <div className="text-[11px] text-muted-foreground font-medium mb-3">
                          📁 {t.assignment?.title || "Corporate Sprint"}
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
                          <div className="size-6 rounded-full bg-gradient-primary text-primary-foreground text-[9px] font-bold grid place-items-center ring-2 ring-background">
                            {initials}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {formattedDue}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={addTaskDialog} onOpenChange={setAddTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Assign a targeted milestone to an intern project sprint.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project">Link to Active Project *</Label>
              <Select
                value={formData.assignmentId}
                onValueChange={(val) => setFormData({ ...formData, assignmentId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select active project sprint..." />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>
                      📁 {a.title} ({a.intern?.fullName || "No Intern"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Synthesize User Feedback"
              />
            </div>
            <div>
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details and expected deliverables..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(val) => setFormData({ ...formData, priority: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTaskDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createTaskMutation.isPending}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {createTaskMutation.isPending ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
