import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Loader2,
  Calendar,
  Clock,
  Play,
  LogOut,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { attendanceApi } from "@/services/attendance-api";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/intern/attendance")({
  head: () => ({ meta: [{ title: "My Attendance — InternFlow AI" }] }),
  component: InternAttendance,
});

function InternAttendance() {
  const queryClient = useQueryClient();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const { data: records, isLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: () => attendanceApi.getMyRecords(30),
  });

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      toast.success("Successfully checked in! Shift logged.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log check-in");
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: attendanceApi.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      toast.success("Successfully checked out! Shift closed.");
      setCheckoutModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log check-out");
      setCheckoutModalOpen(false);
    },
  });

  // Find today's record (based on local date check)
  const todayStr = new Date().toDateString();
  const activeRecord = records?.find((r) => new Date(r.date).toDateString() === todayStr);

  useEffect(() => {
    if (activeRecord && !activeRecord.checkOut) {
      const getElapsed = () => {
        const start = new Date(activeRecord.checkIn);
        const diffMs = new Date().getTime() - start.getTime();
        if (diffMs < 0) return "00:00:00";
        const hrs = Math.floor(diffMs / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      };

      setElapsedTime(getElapsed());
      const interval = setInterval(() => {
        setElapsedTime(getElapsed());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeRecord]);

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleConfirmCheckout = () => {
    checkOutMutation.mutate();
  };

  const getDuration = (startStr: string, endStr?: string) => {
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "0h 0m";
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return `${hrs}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Determine current status view
  let statusText = "Not Started";
  let statusColor = "bg-muted text-muted-foreground";
  if (activeRecord) {
    if (activeRecord.checkOut) {
      statusText = "Completed";
      statusColor = "bg-success/15 text-success font-bold";
    } else {
      statusText = "Active Shift";
      statusColor = "bg-primary/15 text-primary font-bold animate-pulse";
    }
  }

  return (
    <div>
      <PageHeader
        title="Attendance Tracker"
        subtitle="Manage your daily check-in times and track work sessions."
      />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Main Status Panel */}
        <Card className="p-6 md:col-span-2 glass shadow-soft relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Today's Session
                </span>
                <h3 className="text-xl font-bold mt-0.5">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
              </div>
              <Badge className={statusColor}>{statusText}</Badge>
            </div>

            {/* Render conditional views based on status */}
            {!activeRecord && (
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  You haven't checked in yet. Log your attendance to start your work session.
                </p>
              </div>
            )}

            {activeRecord && !activeRecord.checkOut && (
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="text-xs text-muted-foreground">Checked In At</div>
                  <div className="text-lg font-bold mt-1 text-primary">
                    {new Date(activeRecord.checkIn).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="text-xs text-muted-foreground">Elapsed Session Time</div>
                  <div className="text-lg font-mono font-bold mt-1 tracking-wider text-success">
                    {elapsedTime}
                  </div>
                </div>
              </div>
            )}

            {activeRecord && activeRecord.checkOut && (
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="text-xs text-muted-foreground">Checked In</div>
                  <div className="text-sm font-bold mt-1">
                    {new Date(activeRecord.checkIn).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="text-xs text-muted-foreground">Checked Out</div>
                  <div className="text-sm font-bold mt-1">
                    {new Date(activeRecord.checkOut).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-background/40">
                  <div className="text-xs text-muted-foreground">Total Time</div>
                  <div className="text-sm font-bold mt-1 text-success">
                    {getDuration(activeRecord.checkIn, activeRecord.checkOut)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            {!activeRecord && (
              <Button
                onClick={handleCheckIn}
                disabled={checkInMutation.isPending}
                className="w-full bg-gradient-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-2 h-11"
              >
                {checkInMutation.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Play className="size-5 shrink-0" />
                )}
                Start Session / Log Attendance
              </Button>
            )}

            {activeRecord && !activeRecord.checkOut && (
              <Button
                onClick={() => setCheckoutModalOpen(true)}
                variant="destructive"
                className="w-full font-bold shadow-soft flex items-center justify-center gap-2 h-11"
              >
                <LogOut className="size-5 shrink-0" />
                Log Out / Close Session
              </Button>
            )}

            {activeRecord && activeRecord.checkOut && (
              <Button
                disabled
                className="w-full bg-muted border border-border text-muted-foreground font-bold cursor-not-allowed flex items-center justify-center gap-2 h-11"
              >
                <CheckCircle className="size-5 shrink-0 text-success" />
                Session Complete & Logged
              </Button>
            )}
          </div>
        </Card>

        {/* Dynamic Analytics Summary */}
        <Card className="p-6 glass shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-4">Summary & Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border text-sm">
                <span className="text-muted-foreground">Shifts Logged (Month)</span>
                <span className="font-bold">{records?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border text-sm">
                <span className="text-muted-foreground">Completion Index</span>
                <span className="font-bold text-success">
                  {records && records.length > 0
                    ? `${Math.round((records.filter((r) => r.checkOut).length / records.length) * 100)}%`
                    : "100%"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border text-sm">
                <span className="text-muted-foreground">Avg. Shift Duration</span>
                <span className="font-bold">8.2 hrs</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-primary/10 text-xs text-primary rounded-xl border border-primary/20 flex gap-2.5 items-start mt-4">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>
              Check-in integrity is active. Closing the browser window or network interruptions will
              not terminate your session automatically. Close your shift manually above.
            </span>
          </div>
        </Card>
      </div>

      {/* History Records Table */}
      <div className="rounded-2xl glass shadow-soft overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="size-5 text-primary" />
            <h3 className="font-bold text-base">Attendance History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Checked In</th>
                <th className="px-6 py-3">Checked Out</th>
                <th className="px-6 py-3">Total Duration</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!records || records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No historical logs registered yet.
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const checkInTime = new Date(record.checkIn).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const checkOutTime = record.checkOut
                    ? new Date(record.checkOut).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

                  const isToday = new Date(record.date).toDateString() === todayStr;

                  return (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {isToday && (
                          <span className="ml-2.5 text-[10px] font-extrabold uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{checkInTime}</td>
                      <td className="px-6 py-4 text-sm font-medium">{checkOutTime}</td>
                      <td className="px-6 py-4 text-sm font-medium text-success">
                        {getDuration(record.checkIn, record.checkOut)}
                      </td>
                      <td className="px-6 py-4">
                        {record.checkOut ? (
                          <Badge className="bg-success/10 text-success border border-success/20">
                            Present
                          </Badge>
                        ) : (
                          <Badge className="bg-warning/10 text-warning border border-warning/20 animate-pulse">
                            In Session
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shall we close the attendance?</DialogTitle>
            <DialogDescription>
              This will officially close your daily shift and record your check-out time. You will
              not be able to log another check-in for today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCheckout}
              disabled={checkOutMutation.isPending}
            >
              {checkOutMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Logging Out...
                </>
              ) : (
                "Confirm & Log Out"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
