import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/soi/AppSidebar";
import { AdminTopbar } from "@/components/soi/AdminTopbar";
import { useAdminAuth, signOutAdmin } from "@/lib/soi-auth";

export const Route = createFileRoute("/soi")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = path === "/soi/login";
  const { status } = useAdminAuth();

  useEffect(() => {
    if (isLogin) return;
    if (status === "unauthenticated") navigate({ to: "/soi/login" });
    if (status === "forbidden") {
      // Signed in but not an admin — sign them out and bounce to login.
      signOutAdmin().then(() => navigate({ to: "/soi/login" }));
    }
  }, [isLogin, status, navigate]);

  if (isLogin) return <Outlet />;
  if (status !== "authenticated") return null;

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