import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, MessageSquare, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar({ user = "Jane Doe", role = "Admin" }: { user?: string; role?: string }) {
  return (
    <header className="h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search interns, tasks, projects..." className="pl-10 h-10 bg-muted/40 border-border/60" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground"><Moon className="size-4" /></Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <MessageSquare className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 bg-secondary rounded-full" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-2 size-2 bg-destructive rounded-full ring-2 ring-background" />
        </Button>
        <div className="ml-2 flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold leading-tight">{user}</div>
            <div className="text-[11px] text-muted-foreground">{role}</div>
          </div>
          <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm shadow-soft">
            {user.split(" ").map((s) => s[0]).join("")}
          </div>
        </div>
      </div>
    </header>
  );
}
