import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Clock, AlertCircle, Loader2, Download, Search } from "lucide-react";
import { userApi } from "@/services/user-api";
import { requestApi } from "@/services/request-api";
import { attendanceApi } from "@/services/attendance-api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/attendance")({
  head: () => ({ meta: [{ title: "Attendance — InternFlow AI" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: internsData, isLoading: loadingInterns } = useQuery({
    queryKey: ["all-interns"],
    queryFn: () => userApi.getAllUsers({ role: "INTERN", limit: 100 }),
  });

  const { data: requestsData, isLoading: loadingRequests } = useQuery({
    queryKey: ["all-requests"],
    queryFn: () => requestApi.getAllRequests(),
  });

  const { data: todayRecords, isLoading: loadingTodayRecords } = useQuery({
    queryKey: ["today-attendance"],
    queryFn: () => attendanceApi.getTodayRecords(),
  });

  if (loadingInterns || loadingRequests || loadingTodayRecords) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const interns = internsData?.users || [];
  const requests = requestsData || [];
  const todayAttendance = todayRecords || [];

  // Filter interns who are on approved leave today (e.g. starting today or date overlapping today)
  const todayStr = new Date().toDateString();
  const onLeaveInterns = new Set(
    requests
      .filter((r) => r.type === "LEAVE" && r.status === "APPROVED" && new Date(r.createdAt).toDateString() === todayStr)
      .map((r) => r.createdBy.id)
  );

  // Compute attendance stats
  const total = interns.length;
  const leaveCount = interns.filter((i) => onLeaveInterns.has(i.id)).length;
  const presentCount = todayAttendance.length;
  const absentCount = Math.max(0, total - presentCount - leaveCount);
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  const filteredInterns = interns.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.intern?.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.intern?.college.toLowerCase().includes(searchLower)
    );
  });

  const handleExport = () => {
    // Generate beautiful CSV export
    const rows = [
      ["Attendance Audit Trail", ""],
      ["Generated At", new Date().toLocaleString()],
      ["", ""],
      ["Intern Name", "Email Address", "Institution", "Check-in Time", "Check-out Time", "Duration", "Status"]
    ];

    filteredInterns.forEach((user) => {
      const record = todayAttendance.find((r) => r.userId === user.id);
      const onLeave = onLeaveInterns.has(user.id);

      let status = "Not Logged";
      let checkIn = "—";
      let checkOut = "—";
      let duration = "—";

      if (record) {
        status = record.checkOut ? "Completed" : "In Session";
        checkIn = new Date(record.checkIn).toLocaleTimeString();
        checkOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "—";
        
        if (record.checkOut) {
          const diffMs = new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime();
          const hrs = Math.floor(diffMs / 3600000);
          const mins = Math.floor((diffMs % 3600000) / 60000);
          duration = `${hrs}h ${mins}m`;
        }
      } else if (onLeave) {
        status = "On Leave";
      }

      rows.push([
        user.intern?.fullName || "",
        user.email,
        user.intern?.college || "",
        checkIn,
        checkOut,
        duration,
        status
      ]);
    });

    const csvContent = rows
      .map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendance_Audit_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendance audit log exported successfully!");
  };

  return (
    <div>
      <PageHeader
        title="Attendance Dashboard"
        subtitle="Real-time attendance tracking integrated with active leave requests."
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="size-4" /> Export Audit Log
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Headcount" value={total.toString()} tone="primary" />
        <StatCard icon={CheckCircle} label="Active & Present" value={presentCount.toString()} tone="success" />
        <StatCard icon={Clock} label="Not Logged / Absent" value={absentCount.toString()} tone="warning" />
        <StatCard icon={AlertCircle} label="Approved Leave" value={leaveCount.toString()} tone="secondary" />
      </div>

      <div className="rounded-2xl glass shadow-soft overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row gap-3 md:items-center justify-between border-b border-border">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search active records..."
              className="pl-10 bg-background/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full">
            Today's Attendance Rate: {attendanceRate}%
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-3">Intern</th>
                <th className="px-6 py-3">College & Specialization</th>
                <th className="px-6 py-3">Check-in</th>
                <th className="px-6 py-3">Check-out</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInterns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredInterns.map((user) => {
                  const record = todayAttendance.find((r) => r.userId === user.id);
                  const onLeave = onLeaveInterns.has(user.id);
                  
                  let statusLabel = "Not Logged";
                  let dotColor = "bg-muted";
                  let statusStyle = "bg-muted text-muted-foreground border border-border";
                  let checkIn = "—";
                  let checkOut = "—";

                  if (record) {
                    checkIn = new Date(record.checkIn).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    
                    if (record.checkOut) {
                      statusLabel = "Completed";
                      dotColor = "bg-success";
                      statusStyle = "bg-success/10 text-success border border-success/20";
                      checkOut = new Date(record.checkOut).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    } else {
                      statusLabel = "In Session";
                      dotColor = "bg-primary";
                      statusStyle = "bg-primary/10 text-primary border border-primary/20 animate-pulse";
                    }
                  } else if (onLeave) {
                    statusLabel = "On Leave";
                    dotColor = "bg-secondary-foreground";
                    statusStyle = "bg-secondary text-secondary-foreground border border-secondary-foreground/20";
                  } else {
                    dotColor = "bg-warning";
                    statusStyle = "bg-warning/10 text-warning border border-warning/20";
                  }

                  const initials = user.intern?.fullName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase() || "I";

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{user.intern?.fullName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>{user.intern?.college}</div>
                        <div className="text-[11px] text-muted-foreground">{user.intern?.specialization}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{checkIn}</td>
                      <td className="px-6 py-4 text-sm font-medium">{checkOut}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5", statusStyle)}>
                          <span className={cn("size-1.5 rounded-full", dotColor)} />
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
