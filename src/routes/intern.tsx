import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, internNavItems } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ensureRole } from "@/lib/auth/route-guards";
import { AuthLoading } from "@/components/auth/auth-loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/services/attendance-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/intern")({
  beforeLoad: async ({ context }) => {
    const user = await ensureRole(context.queryClient, "INTERN");
    return { user };
  },
  pendingComponent: () => <AuthLoading label="Loading workspace…" />,
  component: InternLayout,
});

function InternLayout() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: records, isLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: () => attendanceApi.getMyRecords(10),
  });

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-attendance"] });
      toast.success("Successfully logged attendance! Workspace unlocked.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log check-in");
    },
  });

  // Calculate check-in status
  const todayStr = new Date().toDateString();
  const todayRecord = records?.find((r) => new Date(r.date).toDateString() === todayStr);
  const hasCheckedInToday = !!todayRecord;

  const isAttendancePage = location.pathname === "/intern/attendance";

  // If loading records, show standard loading wrapper
  if (isLoading) {
    return <AuthLoading label="Verifying attendance session..." />;
  }

  // Determine if block overlay is active (not checked in today, and not on the check-in attendance page)
  const showBlockOverlay = !hasCheckedInToday && !isAttendancePage;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar items={internNavItems} footerLabel="Intern Tip" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar user={user} />
          <main className="flex-1 p-6 md:p-8">
            {showBlockOverlay ? (
              <div className="flex items-center justify-center min-h-[400px] py-12">
                <Card className="max-w-md w-full p-8 text-center glass shadow-soft relative overflow-hidden flex flex-col items-center">
                  <div className="size-16 rounded-full bg-gradient-primary text-primary-foreground text-xl font-bold grid place-items-center mb-6 animate-pulse shadow-glow">
                    <Lock className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Attendance Required</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Please mark your attendance before using the app. Daily attendance logging is
                    required to unlock your workspace metrics, tasks, and assignments.
                  </p>

                  <div className="w-full space-y-3">
                    <Button
                      onClick={() => checkInMutation.mutate()}
                      disabled={checkInMutation.isPending}
                      className="w-full bg-gradient-primary text-primary-foreground font-bold shadow-glow flex items-center justify-center gap-2 h-11"
                    >
                      {checkInMutation.isPending ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <Play className="size-5 shrink-0" />
                      )}
                      Log Attendance Now
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: "/intern/attendance" })}
                      className="w-full h-11"
                    >
                      Go to Attendance Panel
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
