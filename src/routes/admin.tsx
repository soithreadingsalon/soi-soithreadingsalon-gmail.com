import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { isAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = path === "/admin/login";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Auth gate (client-side; localStorage isn't available during SSR).
    if (!isLogin && !isAdmin()) {
      navigate({ to: "/admin/login" });
      return;
    }
    setReady(true);
  }, [isLogin, path, navigate]);

  // Login page renders without the shell.
  if (isLogin) return <Outlet />;

  if (!ready) return null;

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}