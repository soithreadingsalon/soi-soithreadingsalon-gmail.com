import { Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Scissors, Tag, Calendar, MessageSquare, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { isAdmin, logoutAdmin } from "@/lib/admin-auth";
import { Logo } from "./Logo";

const NAV = [
  { to: "/admin/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services" as const, label: "Services", icon: Scissors },
  { to: "/admin/offers" as const, label: "Offers", icon: Tag },
  { to: "/admin/appointments" as const, label: "Appointments", icon: Calendar },
  { to: "/admin/inquiries" as const, label: "Inquiries", icon: MessageSquare },
  { to: "/admin/gallery" as const, label: "Gallery", icon: ImageIcon },
  { to: "/admin/settings" as const, label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { if (!isAdmin()) navigate({ to: "/admin" }); }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen flex bg-charcoal text-[oklch(0.95_0.02_80)]">
      <aside className="w-64 shrink-0 border-r border-[oklch(0.32_0.03_60)] flex flex-col">
        <div className="p-6 border-b border-[oklch(0.32_0.03_60)]">
          <Logo invert className="h-10 w-auto" />
          <p className="font-script text-gold-light mt-1 text-lg">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-[oklch(0.28_0.02_60)] transition-colors"
              activeProps={{ className: "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm bg-[oklch(0.28_0.02_60)] text-gold-light" }}>
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[oklch(0.32_0.03_60)]">
          <button onClick={() => { logoutAdmin(); navigate({ to: "/admin" }); }} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:bg-[oklch(0.28_0.02_60)]">
            <LogOut className="h-4 w-4" /> Logout
          </button>
          <Link to="/" className="block mt-2 text-center text-xs text-muted-foreground hover:text-gold-light">← View Website</Link>
        </div>
      </aside>
      <main className="flex-1 bg-ivory text-foreground overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}