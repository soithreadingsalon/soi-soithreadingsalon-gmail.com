import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, MessageSquare, Tag, Eye, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/soi/dashboard")({ component: Dashboard });

type Appt = { id: string; full_name: string; service: string | null; service_category: string | null; preferred_date: string | null; status: string; created_at: string };
type Inq = { id: string; name: string; created_at: string; read: boolean };
type Service = { name: string; price: string; category: string };
type PV = { path: string; created_at: string; session_id: string | null };

const COLORS = ["#c9a84c", "#8b6f3a", "#d4af37", "#b08d2f", "#e8c87a", "#6b5424"];

function parsePrice(p: string): number {
  const m = p.match(/\$?\s*(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function Dashboard() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [inquiries, setInquiries] = useState<Inq[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pvs, setPvs] = useState<PV[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("appointments").select("id,full_name,service,service_category,preferred_date,status,created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("inquiries").select("id,name,created_at,read").order("created_at", { ascending: false }).limit(200),
      supabase.from("services").select("name,price,category"),
      supabase.from("page_views").select("path,created_at,session_id").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    ]).then(([a, i, s, p]) => {
      setAppts((a.data as Appt[]) ?? []);
      setInquiries((i.data as Inq[]) ?? []);
      setServices((s.data as Service[]) ?? []);
      setPvs((p.data as PV[]) ?? []);
    });
  }, []);

  const priceByService = useMemo(() => {
    const m = new Map<string, number>();
    services.forEach((s) => m.set(s.name.toLowerCase(), parsePrice(s.price)));
    return m;
  }, [services]);

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().slice(0, 10);
    const weekStart = new Date(today.getTime() - 6 * 86400000);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayCount = appts.filter((a) => a.preferred_date === todayISO).length;
    const weekCount = appts.filter((a) => a.preferred_date && new Date(a.preferred_date) >= weekStart).length;
    const newInq = inquiries.filter((i) => !i.read).length;
    const revenue = appts
      .filter((a) => a.status === "completed" && new Date(a.created_at) >= monthStart)
      .reduce((sum, a) => sum + (priceByService.get((a.service || "").toLowerCase()) || 0), 0);
    const pv7 = pvs.filter((v) => new Date(v.created_at) >= new Date(Date.now() - 7 * 86400000));
    const uniqueSessions = new Set(pv7.map((v) => v.session_id || v.path)).size;

    return { todayCount, weekCount, newInq, revenue, pageViews: pv7.length, uniqueVisitors: uniqueSessions };
  }, [appts, inquiries, priceByService, pvs]);

  // Last 30 days bookings
  const bookingsTrend = useMemo(() => {
    const days: { day: string; bookings: number; inquiries: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const bookings = appts.filter((a) => a.created_at.slice(0, 10) === iso).length;
      const inq = inquiries.filter((q) => q.created_at.slice(0, 10) === iso).length;
      days.push({ day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), bookings, inquiries: inq });
    }
    return days;
  }, [appts, inquiries]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    appts.forEach((a) => {
      const k = a.service_category || "Other";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [appts]);

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    appts.forEach((a) => map.set(a.status, (map.get(a.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [appts]);

  const topPages = useMemo(() => {
    const map = new Map<string, number>();
    pvs.forEach((v) => map.set(v.path, (map.get(v.path) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, views]) => ({ path, views }));
  }, [pvs]);

  const recent = useMemo(() => {
    const all = [
      ...appts.slice(0, 10).map((a) => ({ kind: "Booking" as const, id: a.id, label: a.full_name, sub: a.service || a.service_category || "", time: a.created_at, status: a.status })),
      ...inquiries.slice(0, 10).map((i) => ({ kind: "Inquiry" as const, id: i.id, label: i.name, sub: i.read ? "Read" : "Unread", time: i.created_at, status: i.read ? "read" : "new" })),
    ].sort((a, b) => +new Date(b.time) - +new Date(a.time)).slice(0, 12);
    return all;
  }, [appts, inquiries]);

  const cards = [
    { label: "Today's Appointments", value: stats.todayCount, icon: Calendar, link: "/soi/appointments" },
    { label: "This Week", value: stats.weekCount, icon: TrendingUp, link: "/soi/appointments" },
    { label: "Unread Inquiries", value: stats.newInq, icon: MessageSquare, link: "/soi/inquiries" },
    { label: "Revenue (Month)", value: `$${stats.revenue.toFixed(0)}`, icon: DollarSign, link: "/soi/appointments" },
    { label: "Page Views (7d)", value: stats.pageViews, icon: Eye, link: "/soi/dashboard" },
    { label: "Unique Visitors (7d)", value: stats.uniqueVisitors, icon: Tag, link: "/soi/dashboard" },
  ];

  return (
    <AdminPage title="Dashboard" subtitle="Live overview of your salon's activity">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className="card-3d glass-panel rounded-2xl p-4 gold-border">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center"><c.icon className="h-4 w-4 text-white" /></div>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">{c.label}</p>
            <p className="font-serif text-2xl mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="glass-panel rounded-2xl p-5 gold-border">
          <h3 className="font-serif text-lg mb-3">Bookings & Inquiries, Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="#c9a84c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="inquiries" stroke="#8b6f3a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-2xl p-5 gold-border">
          <h3 className="font-serif text-lg mb-3">By Service Category</h3>
          {byCategory.length === 0 ? <p className="text-sm text-muted-foreground py-12 text-center">No data yet.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.name}: ${e.value}`} labelLine={false} fontSize={11}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="glass-panel rounded-2xl p-5 gold-border">
          <h3 className="font-serif text-lg mb-3">Status Breakdown</h3>
          {statusBreakdown.length === 0 ? <p className="text-sm text-muted-foreground py-12 text-center">No appointments yet.</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#c9a84c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-5 gold-border">
          <h3 className="font-serif text-lg mb-3">Top Pages (30d)</h3>
          {topPages.length === 0 ? <p className="text-sm text-muted-foreground py-12 text-center">No traffic data yet.</p> : (
            <div className="space-y-2">
              {topPages.map((p) => (
                <div key={p.path} className="flex justify-between items-center text-sm py-1.5 border-b border-border/50 last:border-0">
                  <span className="font-mono text-xs">{p.path}</span>
                  <span className="text-gold font-semibold">{p.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 gold-border">
        <h3 className="font-serif text-lg mb-3">Recent Activity</h3>
        {recent.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Nothing yet.</p> : (
          <div className="divide-y divide-border/50">
            {recent.map((r) => (
              <Link key={`${r.kind}-${r.id}`} to={r.kind === "Booking" ? "/soi/appointments" : "/soi/inquiries"} className="flex items-center justify-between py-2.5 hover:bg-card/50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${r.kind === "Booking" ? "bg-[var(--gold)]/20 text-gold" : "bg-muted text-muted-foreground"}`}>{r.kind}</span>
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.sub}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.time).toLocaleString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}
