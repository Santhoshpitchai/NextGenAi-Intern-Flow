import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListChecks,
  CalendarClock,
  Inbox,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "@/services/attendance-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

export function AppSidebar({ items, footerLabel }: { items: NavItem[]; footerLabel: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) =>
    path === url || (url !== "/admin" && url !== "/intern" && path.startsWith(url));

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutGuard, setShowLogoutGuard] = useState(false);

  const { data: records } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: () => attendanceApi.getMyRecords(10),
    enabled: !!user && user.role === "INTERN",
  });

  const todayStr = new Date().toDateString();
  const todayRecord = records?.find((r) => new Date(r.date).toDateString() === todayStr);
  const hasActiveShift = todayRecord && !todayRecord.checkOut;

  const handleLogoutClick = async () => {
    if (user?.role === "INTERN" && hasActiveShift) {
      setShowLogoutGuard(true);
    } else {
      await logout();
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center justify-center px-4">
        {collapsed ? <Logo size="sm" className="[&>span]:hidden" /> : <Logo />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-glow data-[active=true]:hover:bg-primary"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="size-4" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogoutClick}
              className="w-full justify-start cursor-pointer"
            >
              <LogOut className="size-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Logout Warning Dialog */}
        <Dialog open={showLogoutGuard} onOpenChange={setShowLogoutGuard}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Active Session Detected</DialogTitle>
              <DialogDescription className="text-sm">
                Please check the attendance. Do you want to stop the check-in and check-out before
                logging out? If yes, please redirect to attendance to stop your session.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => setShowLogoutGuard(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground font-bold shadow-soft"
                onClick={() => {
                  setShowLogoutGuard(false);
                  navigate({ to: "/intern/attendance" });
                }}
              >
                Yes, go to Attendance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Interns", url: "/admin/interns", icon: Users },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Tasks", url: "/admin/tasks", icon: ListChecks },
  { title: "Attendance", url: "/admin/attendance", icon: CalendarClock },
  { title: "Requests", url: "/admin/requests", icon: Inbox },
  { title: "Team Chat", url: "/admin/chat", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export const internNavItems: NavItem[] = [
  { title: "My Dashboard", url: "/intern", icon: LayoutDashboard },
  { title: "My Tasks", url: "/intern/tasks", icon: ListChecks },
  { title: "Daily Updates", url: "/intern/updates", icon: FileText },
  { title: "Performance", url: "/intern/performance", icon: BarChart3 },
  { title: "Attendance", url: "/intern/attendance", icon: CalendarClock },
  { title: "Requests", url: "/intern/requests", icon: Inbox },
  { title: "Team Chat", url: "/intern/chat", icon: Users },
  { title: "Calendar", url: "/intern/calendar", icon: Calendar },
  { title: "Settings", url: "/intern/settings", icon: Settings },
];
