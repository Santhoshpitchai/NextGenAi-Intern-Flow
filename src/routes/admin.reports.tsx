import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Award, Briefcase, Calendar, Mail, User, GraduationCap } from "lucide-react";
import { userApi } from "@/services/user-api";
import { assignmentApi } from "@/services/assignment-api";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — InternFlow AI" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [selectedInternId, setSelectedInternId] = useState<string>("");

  const { data: internsData, isLoading: loadingInterns } = useQuery({
    queryKey: ["all-interns"],
    queryFn: () => userApi.getAllUsers({ role: "INTERN", limit: 100 }),
  });

  const { data: assignmentsData, isLoading: loadingAssignments } = useQuery({
    queryKey: ["all-assignments"],
    queryFn: () => assignmentApi.getAllAssignments(),
  });

  const interns = internsData?.users || [];
  const assignments = assignmentsData?.assignments || [];

  // Automatically select the first intern if none is selected
  if (!selectedInternId && interns.length > 0) {
    setSelectedInternId(interns[0].id);
  }

  const selectedIntern = interns.find((i) => i.id === selectedInternId);

  // Compute intern-specific statistics
  const getInternStats = (internId: string) => {
    if (!selectedIntern?.intern) return null;
    const internAssignments = assignments.filter((a) => a.internId === selectedIntern.intern!.id) || [];
    const allTasks = internAssignments.flatMap((a) => a.tasks || []);
    const completedTasks = allTasks.filter((t) => t.status === "DONE");
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    const score = totalTasks > 0 ? Math.min(100, Math.round((completedTasks.length / totalTasks) * 100)) : 85;

    let grade = "A";
    if (score >= 95) grade = "A+";
    else if (score >= 80) grade = "B+";
    else if (score >= 70) grade = "B";

    return {
      assignmentsCount: internAssignments.length,
      tasksCount: totalTasks,
      completedCount: completedTasks.length,
      completionRate,
      score,
      grade,
    };
  };

  const stats = selectedIntern ? getInternStats(selectedIntern.id) : null;

  const handleExportPdf = () => {
    if (!selectedIntern) return;
    
    const reportElement = document.getElementById("report-preview");
    if (!reportElement) {
      toast.error("Report preview element not found!");
      return;
    }

    // Create temporary print iframe to avoid printing navigation/sidebars
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      toast.error("Could not generate PDF briefing.");
      return;
    }

    // Pull current Stylesheets to maintain CSS/Tailwind rules in the iframe
    let stylesHtml = "";
    try {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          let rules = "";
          for (const rule of Array.from(sheet.cssRules)) {
            rules += rule.cssText;
          }
          stylesHtml += `<style>${rules}</style>`;
        } catch (e) {
          if (sheet.href) {
            stylesHtml += `<link rel="stylesheet" href="${sheet.href}">`;
          }
        }
      }
    } catch (err) {
      console.error("Gathering styles failed, proceeding with print styles", err);
    }

    const internName = selectedIntern.intern?.fullName || "Intern";

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Performance Report - ${internName}</title>
          ${stylesHtml}
          <style>
            @media print {
              body {
                background: white !important;
                color: black !important;
                padding: 30px !important;
                font-family: system-ui, -apple-system, sans-serif !important;
              }
              /* Force background colors and gradients to print correctly */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .glass {
                background: white !important;
                border: 1px solid #e2e8f0 !important;
                box-shadow: none !important;
              }
              /* Prevent breaking sections awkwardly */
              .p-4, .p-5, .p-8 {
                page-break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="p-6 max-w-4xl mx-auto space-y-6">
            ${reportElement.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
    toast.success(`PDF briefing print/download window opened for ${internName}!`);
  };

  const handleExportCsv = () => {
    if (!selectedIntern) return;

    const internName = selectedIntern.intern?.fullName || "Intern";
    const specialization = selectedIntern.intern?.specialization || "Unassigned";
    const college = selectedIntern.intern?.college || "N/A";
    const degree = selectedIntern.intern?.degree || "N/A";
    const email = selectedIntern.email || "";
    const startDate = selectedIntern.intern?.durationStart 
      ? new Date(selectedIntern.intern.durationStart).toLocaleDateString() 
      : "N/A";

    const rows = [
      ["Intern Performance Report", ""],
      ["Generated At", new Date().toLocaleString()],
      ["", ""],
      ["Intern Profile Details", ""],
      ["Full Name", internName],
      ["Specialization", specialization],
      ["Email Address", email],
      ["College / Institution", college],
      ["Degree", degree],
      ["Internship Start Date", startDate],
      ["", ""],
      ["Program Metrics", ""],
      ["Active Assignments", stats?.assignmentsCount?.toString() || "0"],
      ["Total Tasks Assigned", stats?.tasksCount?.toString() || "0"],
      ["Completed Tasks", stats?.completedCount?.toString() || "0"],
      ["Completion Rate", `${stats?.completionRate || 0}%`],
      ["Performance Score", `${stats?.score || 0}%`],
      ["Grade Level", stats?.grade || "N/A"]
    ];

    const csvContent = rows
      .map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Intern_Performance_${internName.replace(/\s+/g, "_")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`CSV briefing successfully downloaded for ${internName}!`);
  };

  if (loadingInterns || loadingAssignments) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Performance Reports"
        subtitle="Generate, preview, and download custom intern performance briefings."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Selection Sidebar */}
        <div className="p-6 rounded-2xl glass shadow-soft h-fit space-y-4">
          <h3 className="font-semibold text-sm">Select Intern</h3>
          <div className="space-y-2">
            <Select value={selectedInternId} onValueChange={setSelectedInternId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an intern..." />
              </SelectTrigger>
              <SelectContent>
                {interns.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.intern?.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIntern && (
            <div className="pt-4 border-t border-border space-y-3">
              <Button onClick={handleExportPdf} className="w-full bg-gradient-primary text-primary-foreground shadow-glow justify-center gap-2">
                <Download className="size-4" /> Download PDF Report
              </Button>
              <Button onClick={handleExportCsv} variant="outline" className="w-full justify-center gap-2">
                <FileText className="size-4" /> Export CSV Briefing
              </Button>
            </div>
          )}
        </div>

        {/* Report Preview */}
        <div id="report-preview" className="lg:col-span-2 p-8 rounded-2xl glass shadow-soft space-y-6">
          {selectedIntern ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold grid place-items-center">
                    {selectedIntern.intern?.fullName
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .toUpperCase() || "I"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedIntern.intern?.fullName}</h2>
                    <p className="text-sm text-primary font-semibold">{selectedIntern.intern?.specialization || "Unassigned"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                  <Calendar className="size-3.5" /> Start: {new Date(selectedIntern.intern?.durationStart || "").toLocaleDateString()}
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background/50">
                  <GraduationCap className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">College & Degree</div>
                    <div className="font-semibold">{selectedIntern.intern?.college} ({selectedIntern.intern?.degree})</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background/50">
                  <Mail className="size-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email Contact</div>
                    <div className="font-semibold">{selectedIntern.email}</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              {stats && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">Program Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-background/50 text-center">
                      <Briefcase className="size-5 mx-auto text-primary mb-1" />
                      <div className="text-xs text-muted-foreground">Assignments</div>
                      <div className="text-xl font-bold mt-1">{stats.assignmentsCount}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 text-center">
                      <FileText className="size-5 mx-auto text-primary mb-1" />
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                      <div className="text-xl font-bold mt-1">{stats.tasksCount}</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 text-center">
                      <Award className="size-5 mx-auto text-primary mb-1" />
                      <div className="text-xs text-muted-foreground">Overall Score</div>
                      <div className="text-xl font-bold mt-1 text-success">{stats.score}%</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 text-center">
                      <User className="size-5 mx-auto text-primary mb-1" />
                      <div className="text-xs text-muted-foreground">Grade Level</div>
                      <div className="text-xl font-bold mt-1 text-primary">{stats.grade}</div>
                    </div>
                  </div>

                  {/* Task Progress Bar */}
                  <div className="p-5 rounded-xl border border-border bg-background/50 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold">Task Completion Rate</span>
                      <span className="font-bold text-primary">{stats.completionRate}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground pt-1 flex justify-between">
                      <span>{stats.completedCount} Shipped Tasks</span>
                      <span>{stats.tasksCount - stats.completedCount} Pending Sprints</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              Select an intern to view the performance briefing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
