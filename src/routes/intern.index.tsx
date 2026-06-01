import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  ListChecks,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Upload,
  MessageSquare,
  Loader2,
  FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { assignmentApi } from "@/services/assignment-api";
import { taskApi } from "@/services/task-api";
import { authApi } from "@/services/auth-api";
import { dailyUpdateApi } from "@/services/daily-update-api";
import { toast } from "sonner";

export const Route = createFileRoute("/intern/")({
  head: () => ({ meta: [{ title: "My Dashboard — InternFlow AI" }] }),
  component: InternDashboard,
});

const priorityStyle: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive",
  URGENT: "bg-destructive/10 text-destructive",
  MEDIUM: "bg-warning/10 text-warning",
  LOW: "bg-muted text-muted-foreground",
};

function InternDashboard() {
  const navigate = useNavigate();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => authApi.getMe(),
  });

  // Fetch assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  // Fetch tasks
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskApi.getMyTasks(),
  });

  // Fetch recent daily updates
  const { data: recentUpdates } = useQuery({
    queryKey: ["my-daily-updates"],
    queryFn: () => dailyUpdateApi.getMyUpdates(7), // Last 7 updates
  });

  // Calculate stats from real data
  const activeTasks = tasks?.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED") || [];
  const completedTasks = tasks?.filter((t) => t.status === "DONE") || [];
  const userName = user?.internProfile?.fullName?.split(" ")[0] || "there";

  // Calculate completion rate
  const totalTasks = tasks?.length || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Get upcoming tasks (next 3 with due dates)
  const upcomingTasks = activeTasks
    .filter((t) => t.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const isLoading = assignmentsLoading || tasksLoading;

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
        title={`Welcome, ${userName} 👋`}
        subtitle={`You have ${activeTasks.length} active tasks and ${assignments?.length || 0} assignments.`}
        actions={
          <Button
            className="bg-gradient-primary text-primary-foreground shadow-glow"
            onClick={() => navigate({ to: "/intern/updates" })}
          >
            <Upload className="size-4" /> Submit Daily Update
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ListChecks}
          label="Active Tasks"
          value={activeTasks.length.toString()}
          tone="primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks.length.toString()}
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Assignments"
          value={assignments?.length.toString() || "0"}
          tone="secondary"
        />
        <StatCard
          icon={Award}
          label="Completion Rate"
          value={`${completionRate}%`}
          tone="warning"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* My Tasks Section */}
          <div className="p-6 rounded-2xl glass shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Tasks</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/intern/tasks" })}>
                View all
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ListChecks className="size-12 mx-auto mb-2 opacity-50" />
                  <p>No active tasks yet</p>
                  <p className="text-xs mt-1">Tasks will appear here when assigned by your admin</p>
                </div>
              ) : (
                upcomingTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => navigate({ to: "/intern/tasks" })}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                              priorityStyle[t.priority] || priorityStyle.MEDIUM,
                            )}
                          >
                            {t.priority.toLowerCase()}
                          </span>
                          {t.dueDate && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="size-3" />
                              Due {new Date(t.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{t.title}</h4>
                        {t.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {t.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: <span className="font-medium">{t.status.replace("_", " ")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="p-6 rounded-2xl glass shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/intern/updates" })}>
                View all
              </Button>
            </div>
            <div className="space-y-3">
              {!recentUpdates || recentUpdates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="size-12 mx-auto mb-2 opacity-50" />
                  <p>No updates yet</p>
                  <p className="text-xs mt-1">Submit your first daily update to track progress</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => navigate({ to: "/intern/updates" })}
                  >
                    Submit Update
                  </Button>
                </div>
              ) : (
                recentUpdates.slice(0, 3).map((update) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl border border-border bg-background"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{update.summary}</h4>
                    {update.accomplishments && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {update.accomplishments}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-6 rounded-2xl glass shadow-soft">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: "/intern/tasks" })}
              >
                <ListChecks className="size-4" /> View All Tasks
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: "/intern/updates" })}
              >
                <Upload className="size-4" /> Submit Update
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: "/intern/requests" })}
              >
                <MessageSquare className="size-4" /> Create Request
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate({ to: "/intern/calendar" })}
              >
                <Calendar className="size-4" /> View Calendar
              </Button>
            </div>
          </div>

          {/* Assignments Overview */}
          <div className="p-6 rounded-2xl glass shadow-soft">
            <h3 className="font-semibold mb-4">My Assignments</h3>
            {!assignments || assignments.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No assignments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => {
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
                    <div
                      key={assignment.id}
                      className="p-3 rounded-lg border border-border bg-background space-y-2"
                    >
                      <h4 className="font-semibold text-sm mb-1">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {assignment.company.name}
                      </p>
                      {displayNotes && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {displayNotes}
                        </p>
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
                                  toast.success(`Downloaded project briefing: ${oldAttachmentName}`)
                                }
                              >
                                <FileDown className="size-3.5 mr-1.5" />
                                Read Document
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full font-medium",
                            assignment.status === "ACTIVE"
                              ? "bg-success/10 text-success"
                              : assignment.status === "PENDING"
                                ? "bg-warning/10 text-warning"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {assignment.status}
                        </span>
                        <span className="text-muted-foreground">
                          {assignment.tasks.length} tasks
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Team Chat Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: "/intern/chat" })}
          >
            <MessageSquare className="size-4" /> Open Team Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
