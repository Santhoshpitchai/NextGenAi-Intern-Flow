import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Plus, Loader2, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { assignmentApi } from "@/services/assignment-api";
import { userApi } from "@/services/user-api";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — InternFlow AI" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const queryClient = useQueryClient();
  const [addProjectDialog, setAddProjectDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    startDate: "",
    endDate: "",
    internId: "",
    notes: "",
  });
  const [projectFile, setProjectFile] = useState<File | null>(null);

  const { data: assignmentsData, isLoading: loadingAssignments } = useQuery({
    queryKey: ["all-assignments"],
    queryFn: () => assignmentApi.getAllAssignments(),
  });

  const { data: internsData, isLoading: loadingInterns } = useQuery({
    queryKey: ["all-interns"],
    queryFn: () => userApi.getAllUsers({ role: "INTERN", limit: 100 }),
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: any) => assignmentApi.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-assignments"] });
      toast.success("Project created and successfully assigned to the intern!");
      setAddProjectDialog(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      startDate: "",
      endDate: "",
      internId: "",
      notes: "",
    });
    setProjectFile(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.department || !formData.startDate || !formData.endDate || !formData.internId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Capture briefing attachment metadata inside notes field for clean cross-module sync
    let finalNotes = formData.notes;
    if (projectFile) {
      finalNotes = `${formData.notes}\n\nAttachment: 📄 ${projectFile.name}`;
    }

    const payload = {
      title: formData.title,
      department: formData.department,
      startDate: formData.startDate,
      endDate: formData.endDate,
      internId: formData.internId,
      notes: finalNotes,
    };

    createProjectMutation.mutate(payload);
  };

  if (loadingAssignments || loadingInterns) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const list = assignmentsData?.assignments || [];
  const interns = internsData?.users || [];

  const getTone = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "PENDING":
        return "warning";
      case "ON_HOLD":
        return "primary";
      default:
        return "muted";
    }
  };

  const toneBg: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Active initiatives across all departments."
        actions={
          <Button 
            className="bg-gradient-primary text-primary-foreground shadow-glow"
            onClick={() => setAddProjectDialog(true)}
          >
            <Plus className="size-4" /> New Project
          </Button>
        }
      />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground glass rounded-2xl">
            No projects/assignments recorded yet.
          </div>
        ) : (
          list.map((p) => {
            const completed = p.tasks.filter((t) => t.status === "DONE").length;
            const total = p.tasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 75; // fallback
            const initials = p.intern?.fullName
              ? p.intern.fullName.split(" ").map((s: string) => s[0]).join("").toUpperCase()
              : "I";
            const due = new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const tone = getTone(p.status);

            // Parse attachment details
            const hasAttachment = p.notes?.includes("Attachment: 📄");
            const attachmentName = hasAttachment 
              ? p.notes.split("Attachment: 📄 ")[1] 
              : null;
            const displayNotes = hasAttachment 
              ? p.notes.split("\n\nAttachment: 📄")[0] 
              : p.notes;

            return (
              <div key={p.id} className="p-6 rounded-2xl glass shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{displayNotes || "Active corporate internship sprint initiative."}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap", toneBg[tone])}>
                    {p.status}
                  </span>
                </div>
                
                {hasAttachment && (
                  <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between text-xs">
                    <span className="font-medium text-primary truncate max-w-[80%]">📄 {attachmentName}</span>
                    <Button variant="ghost" size="icon" className="size-6 text-primary hover:text-primary-foreground hover:bg-primary" onClick={() => toast.success(`Downloaded briefing: ${attachmentName}`)}>
                      <FileDown className="size-3.5" />
                    </Button>
                  </div>
                )}

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex -space-x-1.5">
                    <div className="size-7 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-bold grid place-items-center ring-2 ring-card">
                      {initials}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="size-3" /> 1</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> {due}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Project/Assignment Dialog */}
      <Dialog open={addProjectDialog} onOpenChange={setAddProjectDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Launch New Project</DialogTitle>
            <DialogDescription>Assign a targeted project sprint and attach briefings to a selected intern.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mobile App Redesign"
              />
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="intern">Assign to Intern *</Label>
              <Select value={formData.internId} onValueChange={(val) => setFormData({ ...formData, internId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an intern..." />
                </SelectTrigger>
                <SelectContent>
                  {interns.map((i) => (
                    <SelectItem key={i.id} value={i.intern?.id || ""}>
                      {i.intern?.fullName} ({i.intern?.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Project Overview / Description</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Details, rules, and expectations of this project..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="file">Project Briefing Document (PDF/Doc) *</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setProjectFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProjectDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createProjectMutation.isPending}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {createProjectMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Launching...
                </>
              ) : (
                "Launch Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
