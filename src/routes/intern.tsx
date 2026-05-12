import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, internNavItems } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/intern")({ component: InternLayout });

function InternLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar items={internNavItems} footerLabel="Intern Tip" />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar user="Alex Rivera" role="Intern · Engineering" />
          <main className="flex-1 p-6 md:p-8"><Outlet /></main>
        </div>
      </div>
    </SidebarProvider>
  );
}
