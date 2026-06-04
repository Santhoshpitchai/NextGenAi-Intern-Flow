import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Loader2,
  UploadCloud,
  Eye,
  FileText,
  KeyRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { resolveFileUrl } from "@/lib/env";
import { userApi } from "@/services/user-api";
import { assignmentApi } from "@/services/assignment-api";
import { authApi } from "@/services/auth-api";
import { env } from "@/lib/env";
import { toast } from "sonner";
import { z } from "zod";

const internsSearchSchema = z.object({
  add: z.any().optional(),
});

export const Route = createFileRoute("/admin/interns")({
  validateSearch: (search) => internsSearchSchema.parse(search),
  head: () => ({ meta: [{ title: "Interns — InternFlow AI" }] }),
  component: InternsPage,
});

const toneClass = (score: number) =>
  score >= 90
    ? "bg-success/10 text-success"
    : score >= 70
      ? "bg-warning/10 text-warning"
      : "bg-muted text-muted-foreground";

const dot = (s: string) =>
  s === "online" ? "bg-success" : s === "away" ? "bg-warning" : "bg-muted-foreground";

function InternsPage() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addInternDialog, setAddInternDialog] = useState(
    search.add === true || search.add === "true",
  );
  const [viewIntern, setViewIntern] = useState<any>(null); // State for the Details Dialog
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{ userId: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Filter States
  const [branchFilter, setBranchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");

  const handleCloseDialog = () => {
    setAddInternDialog(false);
    navigate({ search: { add: undefined }, replace: true });
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    internshipRole: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "", // Optional now
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const limit = 50;

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      const res = await fetch(`${env.apiUrl}/users/${userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to reset password");
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      setResetPasswordDialog(null);
      setNewPassword("");
    },
    onError: (err: any) => toast.error(err.message || "Failed to reset password"),
  });

  // Fetch all interns
  const { data: internsData, isLoading } = useQuery({
    queryKey: ["all-interns", page],
    queryFn: () => userApi.getAllUsers({ role: "INTERN", page, limit }),
  });

  // Fetch all assignments to calculate task completion
  const { data: allAssignments } = useQuery({
    queryKey: ["all-assignments"],
    queryFn: () => assignmentApi.getAllAssignments(),
  });

  // Add intern mutation
  const addInternMutation = useMutation({
    mutationFn: authApi.registerIntern,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-interns"] });
      toast.success("Intern added successfully!");
      handleCloseDialog();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add intern");
    },
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      college: "",
      degree: "",
      branch: "",
      internshipRole: "",
      skills: "",
      linkedinUrl: "",
      githubUrl: "",
      startDate: "",
      endDate: "",
    });
    setResumeFile(null);
    setPhotoFile(null);
  };

  const handleSubmit = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.college ||
      !formData.degree ||
      !formData.branch ||
      !formData.internshipRole ||
      !formData.skills ||
      !formData.startDate ||
      !resumeFile ||
      !photoFile
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      confirmPassword: formData.password,
      terms: true,
      resume: resumeFile,
      profilePhoto: photoFile,
    };
    addInternMutation.mutate(submitData);
  };

  const interns = internsData?.users || [];
  const totalInterns = internsData?.pagination.total || 0;

  // Calculate stats for each intern
  const getInternStats = (internId: string, branch?: string) => {
    const internAssignments =
      allAssignments?.assignments?.filter((a: any) => a.internId === internId) || [];
    const allTasks = internAssignments.flatMap((a: any) => a.tasks || []);
    const completedTasks = allTasks.filter((t: any) => t.status === "DONE");
    const totalTasks = allTasks.length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    const score =
      totalTasks > 0 ? Math.min(100, Math.round((completedTasks.length / totalTasks) * 100)) : 85;

    return {
      tasksCompleted: completedTasks.length,
      totalTasks,
      completionRate,
      score,
      branch: internAssignments[0]?.department || branch || "Unassigned",
    };
  };

  // Filter interns based on search AND filters
  const filteredInterns = interns.filter((user) => {
    if (!user.internProfile) return false;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.internProfile.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.internProfile.college.toLowerCase().includes(searchLower) ||
      user.internProfile.branch.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    const stats = getInternStats(user.internProfile.id, user.internProfile.branch);

    if (branchFilter !== "all" && stats.branch !== branchFilter) return false;
    if (statusFilter !== "all" && statusFilter !== "active") return false;

    if (scoreFilter === "high" && stats.score < 90) return false;
    if (scoreFilter === "medium" && (stats.score < 70 || stats.score >= 90)) return false;
    if (scoreFilter === "low" && stats.score >= 70) return false;

    return true;
  });

  const handleExportCsv = () => {
    const rows = [
      ["Intern List Export", ""],
      ["Generated At", new Date().toLocaleString()],
      ["", ""],
      ["Full Name", "Email", "Department", "College", "Score", "Tasks Completed", "Status"],
    ];
    filteredInterns.forEach((user) => {
      const stats = getInternStats(user.internProfile!.id, user.internProfile!.branch);
      rows.push([
        user.internProfile!.fullName,
        user.email,
        stats.branch,
        user.internProfile!.college,
        stats.score.toString(),
        `${stats.tasksCompleted}/${stats.totalTasks}`,
        "Active",
      ]);
    });
    const csvContent = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Interns_List_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Interns list exported successfully");
  };

  // Extract unique branches for the filter dropdown
  const branches = Array.from(new Set(interns.map((i) => i.internProfile?.branch || "Unassigned")));

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
        title="Interns"
        subtitle={`${totalInterns} active interns in the system.`}
        actions={
          <>
            <Button variant="outline" onClick={handleExportCsv}>
              <Download className="size-4" /> Export
            </Button>
            <Button
              className="bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => setAddInternDialog(true)}
            >
              <Plus className="size-4" /> Add Intern
            </Button>
          </>
        }
      />
      <div className="rounded-2xl glass shadow-soft overflow-hidden">
        <div className="p-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between border-b border-border">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search interns by name, college, email..."
              className="pl-10 bg-background/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-32 h-9 bg-background/60">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9 bg-background/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-32 h-9 bg-background/60">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (90-100)</SelectItem>
                <SelectItem value="medium">Medium (70-89)</SelectItem>
                <SelectItem value="low">Low (&lt; 70)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Tasks</th>
                <th className="px-6 py-3">College</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInterns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {searchQuery ? "No interns found matching your filters" : "No interns yet"}
                  </td>
                </tr>
              ) : (
                filteredInterns.map((user) => {
                  if (!user.internProfile) return null;

                  const stats = getInternStats(user.internProfile.id, user.internProfile.branch);
                  const initials = user.internProfile.fullName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.internProfile.profilePhotoUrl ? (
                            <img
                              src={resolveFileUrl(user.internProfile.profilePhotoUrl) ?? undefined}
                              alt={user.internProfile.fullName}
                              className="size-10 rounded-full object-cover shadow-sm border border-border"
                            />
                          ) : (
                            <div className="size-10 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-sm">
                              {user.internProfile.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{stats.branch}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold w-12">
                            {stats.tasksCompleted}/{stats.totalTasks}
                          </span>
                          {stats.totalTasks > 0 && (
                            <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-primary"
                                style={{ width: `${stats.completionRate}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{user.internProfile.college}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold",
                            toneClass(stats.score),
                          )}
                        >
                          {stats.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 rounded-full", dot("online"))} />
                          <span className="text-xs capitalize text-muted-foreground">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewIntern(user)}>
                              <Eye className="size-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate({ to: "/admin/reports" })}>
                              <FileText className="size-4 mr-2" /> View Reports
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setResetPasswordDialog({ userId: user.id, name: user.internProfile.fullName })}
                            >
                              <KeyRound className="size-4 mr-2" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                if (confirm(`Delete ${user.internProfile.fullName}? This cannot be undone.`)) {
                                  fetch(`${env.apiUrl}/users/${user.id}`, { method: "DELETE", credentials: "include" })
                                    .then(r => r.ok ? (toast.success("Intern deleted"), queryClient.invalidateQueries({ queryKey: ["all-interns"] })) : toast.error("Failed to delete"))
                                    .catch(() => toast.error("Failed to delete"));
                                }
                              }}
                            >
                              <span className="size-4 mr-2">🗑</span> Delete Intern
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intern Details Modal */}
      <Dialog open={!!viewIntern} onOpenChange={(open) => !open && setViewIntern(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Intern Profile</DialogTitle>
          </DialogHeader>
          {viewIntern && viewIntern.internProfile && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                {viewIntern.internProfile.profilePhotoUrl ? (
                  <img
                    src={resolveFileUrl(viewIntern.internProfile.profilePhotoUrl) ?? undefined}
                    alt="Profile"
                    className="size-20 rounded-full object-cover shadow-sm border border-border"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold grid place-items-center">
                    {viewIntern.internProfile.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{viewIntern.internProfile.fullName}</h3>
                  <p className="text-muted-foreground text-sm">{viewIntern.email}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                      {viewIntern.internProfile.branch}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">College & Degree</div>
                  <div className="font-medium">
                    {viewIntern.internProfile.college} ({viewIntern.internProfile.degree})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Duration</div>
                  <div className="font-medium">
                    {new Date(viewIntern.internProfile.startDate).toLocaleDateString()} -{" "}
                    {viewIntern.internProfile.endDate
                      ? new Date(viewIntern.internProfile.endDate).toLocaleDateString()
                      : "Present"}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">Skills</div>
                  <div className="font-medium">{viewIntern.internProfile.skills}</div>
                </div>
                {(viewIntern.internProfile.linkedinUrl || viewIntern.internProfile.githubUrl) && (
                  <div className="col-span-2 flex gap-4 pt-2">
                    {viewIntern.internProfile.linkedinUrl && (
                      <a
                        href={viewIntern.internProfile.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                    {viewIntern.internProfile.githubUrl && (
                      <a
                        href={viewIntern.internProfile.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        GitHub Profile
                      </a>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter className="border-t border-border pt-4 sm:justify-between">
                <Button variant="outline" onClick={() => setViewIntern(null)}>
                  Close
                </Button>
                {viewIntern.internProfile.resumeUrl ? (
                  <Button
                    asChild
                    className="bg-gradient-primary text-primary-foreground shadow-glow"
                  >
                    <a href={resolveFileUrl(viewIntern.internProfile.resumeUrl) ?? "#"} target="_blank" rel="noreferrer">
                      <Download className="size-4 mr-2" /> Download Resume
                    </a>
                  </Button>
                ) : (
                  <Button disabled>No Resume Provided</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordDialog} onOpenChange={(open) => { if (!open) { setResetPasswordDialog(null); setNewPassword(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {resetPasswordDialog?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetPasswordDialog(null); setNewPassword(""); }}>Cancel</Button>
            <Button
              disabled={newPassword.length < 8 || resetPasswordMutation.isPending}
              onClick={() => resetPasswordMutation.mutate({ userId: resetPasswordDialog!.userId, password: newPassword })}
              className="bg-gradient-primary text-primary-foreground"
            >
              {resetPasswordMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Intern Dialog */}
      <Dialog
        open={addInternDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Intern</DialogTitle>
            <DialogDescription>
              Fill in the intern's information to add them to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="college">College *</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="MIT"
              />
            </div>
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <Label htmlFor="branch">Branch/Specialization *</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="internshipRole">Internship Role *</Label>
              <Input
                id="internshipRole"
                value={formData.internshipRole}
                onChange={(e) => setFormData({ ...formData, internshipRole: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills (comma-separated) *</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, Node.js, Python"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/johndoe"
              />
            </div>
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
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            {/* Custom Styled File Inputs */}
            <div>
              <Label className="block mb-2">Resume (PDF/DOCX) *</Label>
              <Label
                htmlFor="resume"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                  resumeFile
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-primary/5 border-primary/20 hover:bg-primary/10 text-muted-foreground hover:border-primary/50",
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud
                    className={cn("size-6 mb-2", resumeFile ? "text-primary" : "text-primary/60")}
                  />
                  <p className="text-xs font-semibold text-center px-4 truncate w-full">
                    {resumeFile
                      ? `Resume uploaded: ${resumeFile.name}`
                      : "Click to select a document"}
                  </p>
                </div>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </Label>
            </div>

            <div>
              <Label className="block mb-2">Profile Photo *</Label>
              <Label
                htmlFor="photo"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                  photoFile
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-primary/5 border-primary/20 hover:bg-primary/10 text-muted-foreground hover:border-primary/50",
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud
                    className={cn("size-6 mb-2", photoFile ? "text-primary" : "text-primary/60")}
                  />
                  <p className="text-xs font-semibold text-center px-4 truncate w-full">
                    {photoFile ? `Photo uploaded: ${photoFile.name}` : "Click to select an image"}
                  </p>
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                />
              </Label>
            </div>
          </div>
          <DialogFooter className="mt-4 border-t border-border pt-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addInternMutation.isPending}
              className="bg-gradient-primary text-primary-foreground shadow-glow"
            >
              {addInternMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Adding...
                </>
              ) : (
                "Add Intern"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
