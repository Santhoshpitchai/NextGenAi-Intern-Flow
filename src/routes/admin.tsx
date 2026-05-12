import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, adminNavItems } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar items={adminNavItems} footerLabel="Pro Tip" />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar user="Jane Doe" role="Admin" />
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
