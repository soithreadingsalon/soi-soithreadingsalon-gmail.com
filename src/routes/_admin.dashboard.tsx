import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MessageSquare, Tag, Scissors, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/dashboard")({ component: Dashboard });

function Dashboard() {
  const [stats, setStats] = useState({ appts: 0, inquiries: 0, offers: 0, services: 0, gallery: 0 });
  useEffect(() => {
    Promise.all([
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("read", false),
      supabase.from("offers").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
    ]).then(([a, i, o, s, g]) => setStats({ appts: a.count ?? 0, inquiries: i.count ?? 0, offers: o.count ?? 0, services: s.count ?? 0, gallery: g.count ?? 0 }));
  }, []);

  const cards = [
    { label: "Appointment Requests", value: stats.appts, icon: Calendar, color: "var(--gold-deep)" },
    { label: "New Inquiries", value: stats.inquiries, icon: MessageSquare, color: "var(--brown)" },
    { label: "Active Offers", value: stats.offers, icon: Tag, color: "var(--gold)" },
    { label: "Services", value: stats.services, icon: Scissors, color: "var(--gold-deep)" },
    { label: "Gallery Images", value: stats.gallery, icon: ImageIcon, color: "var(--brown)" },
    { label: "Website Status", value: "Live", icon: CheckCircle2, color: "var(--gold)" },
  ];

  return (
    <AdminPage title="Dashboard" subtitle="An overview of your salon's activity">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="card-3d glass-panel rounded-2xl p-6 gold-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center"><c.icon className="h-5 w-5 text-white" /></div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className="font-serif text-3xl">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}