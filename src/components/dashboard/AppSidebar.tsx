import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, FolderKanban, ListChecks, CalendarClock,
  Inbox, BarChart3, FileText, Calendar, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

export function AppSidebar({ items, footerLabel }: { items: NavItem[]; footerLabel: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => path === url || (url !== "/admin" && url !== "/intern" && path.startsWith(url));

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
                  <SidebarMenuButton asChild isActive={isActive(item.url)}
                    className="data-[active=true]:bg-gradient-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-glow data-[active=true]:hover:bg-gradient-primary">
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
        {!collapsed && (
          <div className="rounded-xl bg-gradient-primary p-4 text-primary-foreground mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{footerLabel}</p>
            <p className="text-sm mt-1">Upgrade to unlock AI Insights.</p>
            <button className="mt-3 text-xs font-semibold bg-background/20 hover:bg-background/30 px-3 py-1.5 rounded-lg w-full">Upgrade</button>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-3">
                <LogOut className="size-4" />{!collapsed && <span>Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
  { title: "Requests", url: "/intern/requests", icon: Inbox },
  { title: "Team Chat", url: "/intern/chat", icon: Users },
  { title: "Calendar", url: "/intern/calendar", icon: Calendar },
];
