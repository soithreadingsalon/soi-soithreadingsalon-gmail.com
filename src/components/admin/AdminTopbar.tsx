import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, User, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAdmin, useAdminAuth } from "@/lib/admin-auth";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  appointments: "Appointments",
  inquiries: "Inquiries",
  services: "Services",
  offers: "Offers",
  gallery: "Gallery",
  settings: "Settings",
  login: "Login",
};

export function AdminTopbar() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { email } = useAdminAuth();
  const displayName = email ?? "admin";
  const initial = (displayName[0] ?? "A").toUpperCase();
  const segments = path.split("/").filter(Boolean); // e.g. ["admin", "appointments"]
  const crumbs = segments.map((seg, i) => ({
    label: LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 backdrop-blur px-3 md:px-5">
      <SidebarTrigger className="-ml-1" />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground overflow-hidden">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1 truncate">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
            {i === crumbs.length - 1 ? (
              <span className="text-foreground font-medium truncate">{c.label}</span>
            ) : (
              <Link to={c.href as "/admin/dashboard"} className="hover:text-foreground truncate">{c.label}</Link>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted text-sm">
            <span className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center text-white text-xs font-semibold uppercase">
              {initial}
            </span>
            <span className="hidden sm:inline font-medium truncate max-w-[160px]">{displayName}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="truncate">Signed in as <span className="font-semibold">{displayName}</span></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/settings"><User className="h-4 w-4 mr-2" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => { await signOutAdmin(); navigate({ to: "/admin/login" }); }}>
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}