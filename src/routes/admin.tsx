import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, adminNavItems } from "@/components/dashboard/AppSidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ensureRole } from "@/lib/auth/route-guards";
import { AuthLoading } from "@/components/auth/auth-loading";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const user = await ensureRole(context.queryClient, "COMPANY_ADMIN", "SUPER_ADMIN");
    return { user };
  },
  pendingComponent: () => <AuthLoading label="Loading workspace…" />,
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar items={adminNavItems} footerLabel="Pro Tip" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar user={user} />
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
