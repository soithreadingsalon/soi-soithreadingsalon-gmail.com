import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Trash2, Phone, Mail, MessageCircle, Calendar as CalendarIcon, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";
import { syncAppointmentToCalendar, deleteCalendarEvent } from "@/lib/calendar.functions";

export const Route = createFileRoute("/admin_/appointments")({ component: AdminAppointments });

type Row = {
  id: string; full_name: string; phone: string; email: string | null;
  service_category: string | null; service: string | null;
  preferred_date: string | null; preferred_time: string | null;
  notes: string | null; status: string; internal_notes: string | null;
  google_event_id: string | null; calendar_synced_at: string | null;
  created_at: string;
};

const STATUSES: { value: string; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "confirmed", label: "Confirmed", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "no_show", label: "No-show", color: "bg-gray-200 text-gray-700 border-gray-300" },
];

function statusMeta(s: string) { return STATUSES.find((x) => x.value === s) || { value: s, label: s, color: "bg-muted text-foreground border-border" }; }

function AdminAppointments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [view, setView] = useState<"list" | "today">("list");
  const [drawer, setDrawer] = useState<Row | null>(null);
  const syncFn = useServerFn(syncAppointmentToCalendar);
  const delEventFn = useServerFn(deleteCalendarEvent);

  const load = () =>
    supabase.from("appointments").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));

  useEffect(() => {
    load();
    const ch = supabase
      .channel("appointments-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, (payload) => {
        load();
        if (payload.eventType === "INSERT") {
          const r = payload.new as Row;
          toast.success(`New booking from ${r.full_name}`, { duration: 6000 });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const todayISO = new Date().toISOString().slice(0, 10);
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!r.full_name.toLowerCase().includes(s) && !r.phone.includes(s)) return false;
      }
      if (dateFilter === "today" && r.preferred_date !== todayISO) return false;
      if (dateFilter === "week") {
        const cutoff = new Date(Date.now() - 7 * 86400000);
        if (!r.preferred_date || new Date(r.preferred_date) < cutoff) return false;
      }
      if (dateFilter === "month") {
        const cutoff = new Date(Date.now() - 30 * 86400000);
        if (!r.preferred_date || new Date(r.preferred_date) < cutoff) return false;
      }
      if (view === "today" && r.preferred_date !== todayISO) return false;
      return true;
    });
  }, [rows, filter, search, dateFilter, view]);

  async function setStatus(id: string, status: string) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    toast.success("Status updated");
    if (status === "confirmed") {
      try {
        await syncFn({ data: { appointmentId: id } });
        toast.success("Synced to Google Calendar");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Calendar sync failed";
        toast.error(msg);
      }
    }
    if (status === "cancelled") {
      try { await delEventFn({ data: { appointmentId: id } }); } catch { /* ignore */ }
    }
  }

  async function manualSync(id: string) {
    try {
      const res = await syncFn({ data: { appointmentId: id } });
      if ("skipped" in res && res.skipped) toast.info("Calendar sync is disabled in Settings");
      else toast.success("Synced to Google Calendar");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    }
  }

  async function setNotes(id: string, internal_notes: string) {
    await supabase.from("appointments").update({ internal_notes }).eq("id", id);
  }
  async function del(id: string) {
    if (!confirm("Delete this appointment?")) return;
    try { await delEventFn({ data: { appointmentId: id } }); } catch { /* ignore */ }
    await supabase.from("appointments").delete().eq("id", id);
    toast.success("Deleted");
    setDrawer(null);
  }

  return (
    <AdminPage title="Appointments" subtitle="Live updates · Click status to advance · Sync to Google Calendar">
      <div className="flex flex-wrap gap-2 mb-4">
        <input placeholder="Search name or phone…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[180px] px-4 py-2 rounded-full bg-card border border-border text-sm" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-full bg-card border border-border text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)} className="px-4 py-2 rounded-full bg-card border border-border text-sm">
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
        <div className="flex rounded-full bg-card border border-border text-xs overflow-hidden">
          <button onClick={() => setView("list")} className={`px-3 py-2 ${view === "list" ? "bg-[var(--gold)] text-white" : ""}`}>List</button>
          <button onClick={() => setView("today")} className={`px-3 py-2 ${view === "today" ? "bg-[var(--gold)] text-white" : ""}`}>Today</button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No appointments.</p>}
        {filtered.map((r) => {
          const s = statusMeta(r.status);
          const phoneDigits = r.phone.replace(/\D/g, "");
          return (
            <div key={r.id} className="glass-panel rounded-2xl p-4 md:p-5 gold-border">
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <button onClick={() => setDrawer(r)} className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-lg">{r.full_name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
                    {r.google_event_id && <span title="On Google Calendar" className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800"><CalendarIcon className="h-3 w-3" /> Synced</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{[r.service_category, r.service].filter(Boolean).join(" · ") || "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.preferred_date && new Date(r.preferred_date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} {r.preferred_time && `· ${r.preferred_time}`}
                  </p>
                </button>
                <div className="flex flex-wrap gap-2 items-start justify-end">
                  <a href={`tel:${phoneDigits}`} className="p-2 rounded-full border border-border hover:text-gold" title="Call"><Phone className="h-4 w-4" /></a>
                  <a href={`https://wa.me/1${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:text-gold" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
                  {r.email && <a href={`mailto:${r.email}`} className="p-2 rounded-full border border-border hover:text-gold" title="Email"><Mail className="h-4 w-4" /></a>}
                  <button onClick={() => manualSync(r.id)} className="p-2 rounded-full border border-border hover:text-gold" title="Sync to Calendar"><CalendarIcon className="h-4 w-4" /></button>
                  <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs">
                    {STATUSES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex md:items-center md:justify-end" onClick={() => setDrawer(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background w-full md:max-w-md md:h-full overflow-y-auto p-6 space-y-4 mt-auto md:mt-0 rounded-t-3xl md:rounded-none">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl">{drawer.full_name}</h2>
              <button onClick={() => setDrawer(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="text-sm space-y-1">
              <p><strong>Phone:</strong> <a href={`tel:${drawer.phone}`} className="text-gold">{drawer.phone}</a></p>
              {drawer.email && <p><strong>Email:</strong> {drawer.email}</p>}
              {drawer.service_category && <p><strong>Category:</strong> {drawer.service_category}</p>}
              {drawer.service && <p><strong>Service:</strong> {drawer.service}</p>}
              {drawer.preferred_date && <p><strong>Date:</strong> {new Date(drawer.preferred_date + "T12:00:00").toLocaleDateString()}</p>}
              {drawer.preferred_time && <p><strong>Time:</strong> {drawer.preferred_time}</p>}
              {drawer.notes && <p className="mt-2 p-3 bg-card rounded-xl"><strong className="block mb-1">Customer notes:</strong>{drawer.notes}</p>}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Internal notes</label>
              <textarea defaultValue={drawer.internal_notes || ""} onBlur={(e) => setNotes(drawer.id, e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-card border border-border text-sm" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s.value} onClick={() => { setStatus(drawer.id, s.value); setDrawer({ ...drawer, status: s.value }); }} className={`text-xs px-3 py-1.5 rounded-full border ${drawer.status === s.value ? s.color : "bg-card border-border text-muted-foreground"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => manualSync(drawer.id)} className="px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold inline-flex items-center justify-center gap-2"><RefreshCw className="h-4 w-4" /> Sync Calendar</button>
              <button onClick={() => del(drawer.id)} className="px-4 py-2.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/30 inline-flex items-center justify-center gap-2"><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
            {drawer.calendar_synced_at && <p className="text-xs text-muted-foreground">Last synced {new Date(drawer.calendar_synced_at).toLocaleString()}</p>}
          </div>
        </div>
      )}
    </AdminPage>
  );
}
