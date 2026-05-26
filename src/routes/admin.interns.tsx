import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, Download, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { userApi } from "@/services/user-api";
import { assignmentApi } from "@/services/assignment-api";
import { authApi } from "@/services/auth-api";
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
  score >= 90 ? "bg-success/10 text-success" : 
  score >= 70 ? "bg-warning/10 text-warning" : 
  "bg-muted text-muted-foreground";

const dot = (s: string) =>
  s === "online" ? "bg-success" : s === "away" ? "bg-warning" : "bg-muted-foreground";

function InternsPage() {
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [addInternDialog, setAddInternDialog] = useState(search.add === true || search.add === "true");

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
    endDate: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const limit = 50;

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
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone ||
        !formData.college || !formData.degree || !formData.branch || !formData.internshipRole ||
        !formData.skills || !formData.startDate || !formData.endDate || !resumeFile || !photoFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create FormData object
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

  // Filter interns based on search
  const filteredInterns = interns.filter((intern) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      intern.intern?.fullName.toLowerCase().includes(searchLower) ||
      intern.email.toLowerCase().includes(searchLower) ||
      intern.intern?.college.toLowerCase().includes(searchLower) ||
      intern.intern?.specialization.toLowerCase().includes(searchLower)
    );
  });

  // Calculate stats for each intern
  const getInternStats = (internId: string, specialization?: string) => {
    const internAssignments = allAssignments?.assignments?.filter((a: any) => a.internId === internId) || [];
    const allTasks = internAssignments.flatMap((a: any) => a.tasks || []);
    const completedTasks = allTasks.filter((t: any) => t.status === "DONE");
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    // Calculate score based on completion rate and task count
    const score = totalTasks > 0 ? Math.min(100, Math.round((completedTasks.length / totalTasks) * 100)) : 0;
    
    return {
      tasksCompleted: completedTasks.length,
      totalTasks,
      completionRate,
      score,
      department: internAssignments[0]?.department || specialization || "Unassigned",
    };
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
        title="Interns"
        subtitle={`${totalInterns} active interns in the system.`}
        actions={
          <>
            <Button variant="outline">
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
        <div className="p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between border-b border-border">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search interns..." 
              className="pl-10 bg-background/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Department
            </Button>
            <Button variant="outline" size="sm">Status</Button>
            <Button variant="outline" size="sm">Score</Button>
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
                    {searchQuery ? "No interns found matching your search" : "No interns yet"}
                  </td>
                </tr>
              ) : (
                filteredInterns.map((user) => {
                  if (!user.intern) return null;
                  
                  const stats = getInternStats(user.intern.id, user.intern.specialization);
                  const initials = user.intern.fullName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{user.intern.fullName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{stats.department}</td>
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
                      <td className="px-6 py-4 text-sm">{user.intern.college}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold", toneClass(stats.score))}>
                          {stats.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 rounded-full", dot("online"))} />
                          <span className="text-xs capitalize text-muted-foreground">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Intern Dialog */}
      <Dialog open={addInternDialog} onOpenChange={(open) => {
        if (!open) {
          handleCloseDialog();
        } else {
          setAddInternDialog(true);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Intern</DialogTitle>
            <DialogDescription>Fill in the intern's information to add them to the system</DialogDescription>
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
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="resume">Resume (PDF) *</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="photo">Profile Photo *</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={addInternMutation.isPending}
            >
              {addInternMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Adding...
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
