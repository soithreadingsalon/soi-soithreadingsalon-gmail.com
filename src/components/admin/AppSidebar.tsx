import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Archive,
  MessageSquare,
  Scissors,
  Tag,
  Image as ImageIcon,
  Settings,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

type NavItem = {
  to: "/soi/dashboard" | "/soi/appointments" | "/soi/appointments-backup" | "/soi/inquiries" | "/soi/services" | "/soi/offers" | "/soi/gallery" | "/soi/settings";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: "today" | "unread";
};

const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ to: "/soi/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Operations",
    items: [
      { to: "/soi/appointments", label: "Appointments", icon: Calendar, badgeKey: "today" },
      { to: "/soi/appointments-backup", label: "Deleted (Backup)", icon: Archive },
      { to: "/soi/inquiries", label: "Inquiries", icon: MessageSquare, badgeKey: "unread" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { to: "/soi/services", label: "Services", icon: Scissors },
      { to: "/soi/offers", label: "Offers", icon: Tag },
      { to: "/soi/gallery", label: "Gallery", icon: ImageIcon },
    ],
  },
  { label: "Configuration", items: [{ to: "/soi/settings", label: "Settings", icon: Settings }] },
];

export function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [badges, setBadges] = useState<{ today: number; unread: number }>({ today: 0, unread: 0 });

  useEffect(() => {
    const load = async () => {
      const todayISO = new Date().toISOString().slice(0, 10);
      const [a, i] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("preferred_date", todayISO),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("read", false),
      ]);
      setBadges({ today: a.count ?? 0, unread: i.count ?? 0 });
    };
    load();
    const ch = supabase
      .channel("admin-sidebar-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <Logo className="h-8 w-auto shrink-0" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-serif text-sm">SOI Admin</p>
              <p className="text-[10px] text-muted-foreground">Style of India</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const isActive = path === item.to || path.startsWith(item.to + "/");
                  const badge = item.badgeKey ? badges[item.badgeKey] : 0;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {badge > 0 && !collapsed && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View public site">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span>View public site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}