import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Bell,
  Search,
  MessageSquare,
  Moon,
  Sun,
  LogOut,
  Loader2,
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  CalendarClock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getDisplayName, getDisplayRole } from "@/lib/auth/redirects";
import type { User } from "@/types/auth";
import { resolveFileUrl } from "@/lib/env";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { attendanceApi } from "@/services/attendance-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { notificationApi } from "@/services/notification-api";
import { taskApi } from "@/services/task-api";
import { toast } from "sonner";

export function Topbar({ user: routeUser }: { user?: User }) {
  const { user: authUser, logout } = useAuth();
  const user = routeUser ?? authUser;
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutGuard, setShowLogoutGuard] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Dark/Night Mode state & persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return (
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Search shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const displayName = user ? getDisplayName(user) : "User";
  const displayRole = user ? getDisplayRole(user) : "";

  // Attendance query
  const { data: records } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: () => attendanceApi.getMyRecords(10),
    enabled: !!user && user.role === "INTERN",
  });

  // Notifications query
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications(),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const unreadNotifications = notifications?.filter((n) => !n.readAt) || [];
  const hasUnread = unreadNotifications.length > 0;

  // Tasks search index query
  const { data: myTasks } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskApi.getMyTasks(),
    enabled: !!user && user.role === "INTERN" && searchOpen,
  });

  const { data: allTasks } = useQuery({
    queryKey: ["all-tasks"],
    queryFn: () => taskApi.getAllTasks(),
    enabled: !!user && user.role.includes("ADMIN") && searchOpen,
  });

  const todayStr = new Date().toDateString();
  const todayRecord = records?.find((r) => new Date(r.date).toDateString() === todayStr);
  const hasActiveShift = todayRecord && !todayRecord.checkOut;

  const handleLogoutClick = () => {
    if (user?.role === "INTERN" && hasActiveShift) {
      setShowLogoutGuard(true);
    } else {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <div className="flex max-w-xl flex-1 items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
        <div
          onClick={() => setSearchOpen(true)}
          className="relative hidden flex-1 md:block max-w-xs cursor-pointer group"
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="h-10 w-full border border-border/60 bg-muted/40 rounded-xl pl-10 pr-12 flex items-center text-xs text-muted-foreground/80 hover:border-primary/40 hover:bg-muted/60 transition-all">
            Search interns, tasks, projects...
          </div>
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground md:hidden cursor-pointer"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4" />
        </Button>

        {/* Theme Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground transition-all duration-300 cursor-pointer"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
        >
          {isDarkMode ? (
            <Sun className="size-4 text-amber-500 animate-pulse" />
          ) : (
            <Moon className="size-4 text-slate-700 dark:text-slate-300" />
          )}
        </Button>

        {/* Message Loop Indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground cursor-pointer"
          onClick={() =>
            navigate({ to: user?.role.includes("ADMIN") ? "/admin/chat" : "/intern/chat" })
          }
        >
          <MessageSquare className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-secondary" />
        </Button>

        {/* Real-time Notifications Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground cursor-pointer"
            >
              <Bell className="size-4" />
              {hasUnread && (
                <span className="absolute right-2 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 shadow-medium border-border/80 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden"
            align="end"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 bg-muted/40">
              <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Notifications
              </span>
              {hasUnread && (
                <button
                  onClick={async () => {
                    await notificationApi.markAllAsRead();
                    refetchNotifications();
                    toast.success("All notifications marked as read");
                  }}
                  className="text-[10px] font-bold text-primary hover:underline transition-all cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
              {!notifications || notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground px-4">
                  <Bell className="size-8 mb-2 opacity-30 text-primary animate-pulse" />
                  <p className="text-xs font-semibold">All caught up!</p>
                  <p className="text-[10px] opacity-70">No new notifications at this time.</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const isUnread = !notification.readAt;
                  return (
                    <div
                      key={notification.id}
                      onClick={async () => {
                        if (isUnread) {
                          await notificationApi.markAsRead(notification.id);
                          refetchNotifications();
                        }
                        if (notification.actionUrl) {
                          navigate({ to: notification.actionUrl });
                        }
                      }}
                      className={`p-3.5 flex flex-col gap-1 transition-colors cursor-pointer hover:bg-muted/40 ${
                        isUnread ? "bg-primary/5 border-l-2 border-primary" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span
                          className={`text-xs font-bold leading-tight ${isUnread ? "text-foreground font-extrabold" : "text-foreground/70"}`}
                        >
                          {notification.title}
                        </span>
                        <span className="text-[9px] text-muted-foreground shrink-0">
                          {new Date(notification.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {notification.body}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Logout Action */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground cursor-pointer"
          onClick={handleLogoutClick}
          disabled={loggingOut}
          aria-label="Log out"
        >
          {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
        </Button>

        <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold leading-tight">{displayName}</div>
            <div className="text-[11px] text-muted-foreground">{displayRole}</div>
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-soft overflow-hidden border border-primary/20 shrink-0">
            {user?.internProfile?.profilePhotoUrl ? (
              <img
                src={resolveFileUrl(user.internProfile.profilePhotoUrl) ?? undefined}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : user?.companyAdminProfile?.logoUrl ? (
              <img
                src={resolveFileUrl(user.companyAdminProfile.logoUrl) ?? undefined}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <span>
                {displayName
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Search Command Dialog Palette */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type a command or search terms..." />
        <CommandList className="max-h-[350px] p-2">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Navigation">
            {user?.role.includes("ADMIN") ? (
              <>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin" });
                  }}
                >
                  <LayoutDashboard className="mr-2 size-4 text-primary" />
                  <span>Admin Dashboard</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/interns" });
                  }}
                >
                  <Users className="mr-2 size-4 text-primary" />
                  <span>Workspace Interns Directory</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/projects" });
                  }}
                >
                  <FolderKanban className="mr-2 size-4 text-primary" />
                  <span>Projects & Assignments</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/tasks" });
                  }}
                >
                  <ListChecks className="mr-2 size-4 text-primary" />
                  <span>Milestone Sprints & Tasks</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/chat" });
                  }}
                >
                  <MessageSquare className="mr-2 size-4 text-primary" />
                  <span>Team Chat & Loop Mail</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/attendance" });
                  }}
                >
                  <CalendarClock className="mr-2 size-4 text-primary" />
                  <span>Attendance Auditing</span>
                </CommandItem>
              </>
            ) : (
              <>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/intern" });
                  }}
                >
                  <LayoutDashboard className="mr-2 size-4 text-primary" />
                  <span>Intern Dashboard</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/intern/tasks" });
                  }}
                >
                  <ListChecks className="mr-2 size-4 text-primary" />
                  <span>Assigned Sprints & Tasks</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/intern/chat" });
                  }}
                >
                  <MessageSquare className="mr-2 size-4 text-primary" />
                  <span>Team Chat & Loop Mail</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/intern/attendance" });
                  }}
                >
                  <CalendarClock className="mr-2 size-4 text-primary" />
                  <span>Check In / Check Out Session</span>
                </CommandItem>
              </>
            )}
          </CommandGroup>

          {/* Dynamic Search Content for Intern Tasks */}
          {user?.role === "INTERN" && myTasks && myTasks.length > 0 && (
            <CommandGroup heading="My Tasks">
              {myTasks.slice(0, 8).map((t) => (
                <CommandItem
                  key={t.id}
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/intern/tasks" });
                  }}
                >
                  <CheckCircle2 className="mr-2 size-4 text-green-500" />
                  <span className="font-medium">{t.title}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground uppercase">
                    ({t.priority})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Dynamic Search Content for Admin Tasks */}
          {user?.role.includes("ADMIN") && allTasks && allTasks.length > 0 && (
            <CommandGroup heading="Active Tasks">
              {allTasks.slice(0, 8).map((t) => (
                <CommandItem
                  key={t.id}
                  onSelect={() => {
                    setSearchOpen(false);
                    navigate({ to: "/admin/tasks" });
                  }}
                >
                  <CheckCircle2 className="mr-2 size-4 text-green-500" />
                  <span className="font-medium">{t.title}</span>
                  <span className="ml-2 text-[10px] text-muted-foreground uppercase">
                    ({t.priority})
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>

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
    </header>
  );
}
