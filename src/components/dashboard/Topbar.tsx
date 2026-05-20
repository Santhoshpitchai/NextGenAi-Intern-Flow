import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, MessageSquare, Moon, LogOut, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { getDisplayName, getDisplayRole } from "@/lib/auth/redirects";
import type { User } from "@/types/auth";
import { useState } from "react";

export function Topbar({ user: routeUser }: { user?: User }) {
  const { user: authUser, logout } = useAuth();
  const user = routeUser ?? authUser;
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user ? getDisplayName(user) : "User";
  const displayRole = user ? getDisplayRole(user) : "";

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
        <div className="relative hidden flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search interns, tasks, projects..."
            className="h-10 border-border/60 bg-muted/40 pl-10"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Moon className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <MessageSquare className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-secondary" />
        </Button>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="size-4" />
          <span className="absolute right-2 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={handleLogout}
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
          <div className="grid size-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-soft">
            {displayName
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
