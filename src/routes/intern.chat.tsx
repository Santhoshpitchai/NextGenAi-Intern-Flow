import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  CheckCircle2,
  MessageSquare,
  Send,
  Loader2,
  Megaphone,
  Users,
  User,
  Shield,
  Check,
} from "lucide-react";
import { messageApi } from "@/services/message-api";
import { userApi } from "@/services/user-api";
import { useAuth } from "@/contexts/auth-context";
import { assignmentApi } from "@/services/assignment-api";
import { taskApi } from "@/services/task-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/intern/chat")({
  head: () => ({ meta: [{ title: "Chat — InternFlow AI" }] }),
  component: InternChat,
});

function InternChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftData, setDraftData] = useState({ subject: "", body: "" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const { data: assignments } = useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => assignmentApi.getMyAssignments(),
  });

  const { data: myTasks } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskApi.getMyTasks(),
  });

  const filteredTasks = myTasks
    ? myTasks.filter((t) => t.assignment?.id === selectedAssignmentId)
    : [];

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: () => messageApi.getMessages(100),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["chat-directory"],
    queryFn: () => userApi.getChatDirectory(),
  });

  const sendMessageMutation = useMutation({
    mutationFn: messageApi.createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setMessageText("");
      setDraftData({ subject: "", body: "" });
      setSelectedUserIds([]);
      setSelectedAssignmentId("");
      setSelectedTaskId("");
      setDraftModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({
      content: messageText,
      type: "TEXT",
    });
  };

  const handleSendDraft = () => {
    if (!draftData.subject.trim() || !draftData.body.trim()) {
      toast.error("Subject and Body are required!");
      return;
    }

    const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id));
    const selectedNames = selectedUsers.map(
      (u) => u.intern?.fullName || u.companyAdmin?.fullName || u.email,
    );

    const actualAssignmentId =
      selectedAssignmentId && selectedAssignmentId !== "none" ? selectedAssignmentId : undefined;
    const actualTaskId = selectedTaskId && selectedTaskId !== "none" ? selectedTaskId : undefined;

    const selectedAssignment = assignments?.find((a) => a.id === actualAssignmentId);
    const selectedTask = myTasks?.find((t) => t.id === actualTaskId);

    sendMessageMutation.mutate({
      content: draftData.body,
      type: "TEXT",
      metadata: {
        subject: draftData.subject,
        taggedUserIds: selectedUserIds,
        taggedUserNames: selectedNames,
        ...(selectedAssignment && {
          assignmentId: selectedAssignment.id,
          assignmentTitle: selectedAssignment.title,
        }),
        ...(selectedTask && {
          taskId: selectedTask.id,
          taskTitle: selectedTask.title,
        }),
      },
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const users = usersData || [];
  const admins = users.filter((u) => u.role === "COMPANY_ADMIN" || u.role === "SUPER_ADMIN");
  const interns = users.filter((u) => u.role === "INTERN");

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const getDisplayName = (message: any) => {
    if (message.sender.intern) {
      return message.sender.intern.fullName;
    }
    if (message.sender.companyAdmin) {
      return message.sender.companyAdmin.fullName;
    }
    return message.sender.email;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getSelectedNames = () => {
    return users
      .filter((u) => selectedUserIds.includes(u.id))
      .map((u) => u.intern?.fullName || u.companyAdmin?.fullName || u.email);
  };

  if (loadingMessages || loadingUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="Team Chat & Briefings"
        subtitle="Communicate in real-time or draft directed team announcements."
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Messages Stream Container */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden glass shadow-soft">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-background/30">
            {!messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageSquare className="size-16 mb-4 opacity-50 text-primary animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm">Start the conversation by sending a message below</p>
              </div>
            ) : (
              <>
                {messages
                  .slice()
                  .reverse()
                  .map((message) => {
                    const isOwnMessage = message.sender.id === user?.id;
                    const displayName = getDisplayName(message);
                    const isBriefing = message.metadata?.subject;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3.5 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                      >
                        <Avatar className="size-9 border border-border shadow-soft shrink-0">
                          <AvatarImage
                            src={message.sender.intern?.profilePhoto?.publicUrl}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-bold">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex flex-col max-w-[70%] ${isOwnMessage ? "items-end" : ""}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-foreground/90">
                              {displayName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {isBriefing ? (
                            /* Briefing Card Announcement Rendering */
                            <div className="rounded-2xl border border-primary/20 bg-background/80 shadow-medium overflow-hidden w-full max-w-lg text-left">
                              <div className="bg-gradient-primary px-4 py-2.5 flex items-center gap-2 text-primary-foreground">
                                <Megaphone className="size-4 shrink-0" />
                                <span className="text-xs font-extrabold uppercase tracking-widest">
                                  Team Announcement
                                </span>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <h4 className="font-extrabold text-base text-foreground leading-tight">
                                    {message.metadata.subject}
                                  </h4>
                                  <div className="flex flex-wrap gap-1 mt-2 items-center">
                                    <span className="text-[10px] text-muted-foreground font-semibold uppercase mr-1">
                                      To:
                                    </span>
                                    {message.metadata.taggedUserNames?.map(
                                      (name: string, i: number) => (
                                        <Badge
                                          key={i}
                                          variant="secondary"
                                          className="text-[9px] font-bold px-2 py-0.5"
                                        >
                                          @{name}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>

                                {(message.metadata.assignmentTitle ||
                                  message.metadata.taskTitle) && (
                                  <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/40 text-xs">
                                    {message.metadata.assignmentTitle && (
                                      <Link
                                        to={
                                          user?.role === "COMPANY_ADMIN" ||
                                          user?.role === "SUPER_ADMIN"
                                            ? "/admin/projects"
                                            : "/intern"
                                        }
                                        className="flex items-center gap-2 text-foreground/90 font-medium hover:underline hover:text-primary transition-colors cursor-pointer"
                                      >
                                        <Briefcase className="size-3.5 text-primary shrink-0" />
                                        <span>Linked Project:</span>
                                        <span className="font-bold text-primary truncate max-w-[240px]">
                                          {message.metadata.assignmentTitle}
                                        </span>
                                      </Link>
                                    )}
                                    {message.metadata.taskTitle && (
                                      <Link
                                        to={
                                          user?.role === "COMPANY_ADMIN" ||
                                          user?.role === "SUPER_ADMIN"
                                            ? "/admin/tasks"
                                            : "/intern/tasks"
                                        }
                                        className="flex items-center gap-2 text-foreground/90 font-medium hover:underline hover:text-green-600 transition-colors cursor-pointer"
                                      >
                                        <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                                        <span>Linked Task:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400 truncate max-w-[240px]">
                                          {message.metadata.taskTitle}
                                        </span>
                                      </Link>
                                    )}
                                  </div>
                                )}

                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap pt-1 border-t border-border/60">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Standard Text Bubble Rendering */
                            <div
                              className={`rounded-2xl px-4 py-2.5 shadow-soft ${
                                isOwnMessage
                                  ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                                  : "bg-muted rounded-tl-none text-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-background/50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                disabled={sendMessageMutation.isPending}
                className="flex-1 bg-background/60"
              />
              <Button
                type="submit"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="bg-gradient-primary text-primary-foreground font-bold shadow-glow"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Directory Contacts Sidebar */}
        <Card className="lg:col-span-1 flex flex-col justify-between p-4 glass shadow-soft overflow-hidden h-full">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
              <Users className="size-5 text-primary" />
              <h3 className="font-bold text-sm">Workspace Directory</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Admins Section */}
              {admins.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="size-3 text-primary" /> Administrators
                  </span>
                  <div className="space-y-1.5">
                    {admins.map((admin) => {
                      const isSelected = selectedUserIds.includes(admin.id);
                      const name = admin.companyAdmin?.fullName || admin.email;
                      const isCurrentUser = admin.id === user?.id;

                      return (
                        <div
                          key={admin.id}
                          onClick={() => !isCurrentUser && toggleSelectUser(admin.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border border-transparent transition-all ${
                            isCurrentUser ? "opacity-70 cursor-default" : "cursor-pointer"
                          } ${
                            isSelected
                              ? "bg-primary/5 border-primary/20"
                              : !isCurrentUser
                                ? "hover:bg-muted/40"
                                : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-7 shadow-soft">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                                {name}
                                {isCurrentUser && (
                                  <span className="text-[9px] text-primary bg-primary/10 px-1 py-0.5 rounded font-bold">
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-muted-foreground truncate">
                                {admin.companyAdmin?.department || "HR Department"}
                              </div>
                            </div>
                          </div>

                          {!isCurrentUser && (
                            <div
                              className={`size-4.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && <Check className="size-3 stroke-[3]" />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interns Section */}
              {interns.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <User className="size-3 text-primary" /> Interns
                  </span>
                  <div className="space-y-1.5">
                    {interns.map((intern) => {
                      const isSelected = selectedUserIds.includes(intern.id);
                      const name = intern.intern?.fullName || intern.email;
                      const isCurrentUser = intern.id === user?.id;

                      return (
                        <div
                          key={intern.id}
                          onClick={() => !isCurrentUser && toggleSelectUser(intern.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border border-transparent transition-all ${
                            isCurrentUser ? "opacity-70 cursor-default" : "cursor-pointer"
                          } ${
                            isSelected
                              ? "bg-primary/5 border-primary/20"
                              : !isCurrentUser
                                ? "hover:bg-muted/40"
                                : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="size-7 shadow-soft">
                              <AvatarImage
                                src={intern.intern?.profilePhoto?.publicUrl}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-[10px] font-bold">
                                {getInitials(name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                                {name}
                                {isCurrentUser && (
                                  <span className="text-[9px] text-primary bg-primary/10 px-1 py-0.5 rounded font-bold">
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-[9px] text-muted-foreground truncate">
                                {intern.intern?.specialization || "Engineering"}
                              </div>
                            </div>
                          </div>

                          {!isCurrentUser && (
                            <div
                              className={`size-4.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && <Check className="size-3 stroke-[3]" />}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Compose Trigger */}
          {selectedUserIds.length > 0 && (
            <div className="pt-4 border-t border-border mt-3">
              <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 mb-3 text-center">
                <span className="text-xs font-bold text-primary">
                  {selectedUserIds.length} Recipients Selected
                </span>
              </div>
              <Button
                onClick={() => setDraftModalOpen(true)}
                className="w-full bg-gradient-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-2 h-10 text-xs"
              >
                <Megaphone className="size-3.5" />
                Draft Team Briefing
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Briefing Draft Composer Dialog */}
      <Dialog open={draftModalOpen} onOpenChange={setDraftModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="size-5 text-primary" /> Draft Team Briefing
            </DialogTitle>
            <DialogDescription>
              Compose a formatted announcement mail. It will be posted directly to the chat stream
              and trigger immediate login notifications for all tagged users.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Tagged Recipients list */}
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Recipients</Label>
              <div className="flex flex-wrap gap-1 mt-1.5 p-2 rounded-xl border border-border bg-muted/40 max-h-24 overflow-y-auto">
                {getSelectedNames().map((name, i) => (
                  <Badge
                    key={i}
                    className="text-[10px] font-bold bg-primary text-primary-foreground"
                  >
                    @{name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject" className="text-xs font-bold">
                Briefing Subject *
              </Label>
              <Input
                id="subject"
                value={draftData.subject}
                onChange={(e) => setDraftData({ ...draftData, subject: e.target.value })}
                placeholder="e.g. Sprint 3 Planning Update"
                className="mt-1.5 h-10"
              />
            </div>

            {/* Optional Project & Task binders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project" className="text-xs font-bold text-muted-foreground">
                  Link to Project (Optional)
                </Label>
                <Select
                  value={selectedAssignmentId}
                  onValueChange={(val) => {
                    setSelectedAssignmentId(val);
                    setSelectedTaskId("");
                  }}
                >
                  <SelectTrigger className="mt-1.5 h-10 bg-background/60">
                    <SelectValue placeholder="Select Project..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Project</SelectItem>
                    {assignments?.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task" className="text-xs font-bold text-muted-foreground">
                  Link to Task (Optional)
                </Label>
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={!selectedAssignmentId || selectedAssignmentId === "none"}
                >
                  <SelectTrigger className="mt-1.5 h-10 bg-background/60">
                    <SelectValue
                      placeholder={
                        !selectedAssignmentId || selectedAssignmentId === "none"
                          ? "Select Project First..."
                          : "Select Task..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Task</SelectItem>
                    {filteredTasks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <Label htmlFor="body" className="text-xs font-bold">
                Message Content *
              </Label>
              <Textarea
                id="body"
                value={draftData.body}
                onChange={(e) => setDraftData({ ...draftData, body: e.target.value })}
                placeholder="Write the briefing announcement body here..."
                className="mt-1.5"
                rows={5}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setDraftModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendDraft}
              disabled={
                !draftData.subject.trim() || !draftData.body.trim() || sendMessageMutation.isPending
              }
              className="bg-gradient-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-1.5"
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  Send Announcement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
