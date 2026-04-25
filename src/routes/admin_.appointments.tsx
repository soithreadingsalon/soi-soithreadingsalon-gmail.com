import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin_/appointments")({ component: AdminAppointments });

type Row = { id: string; full_name: string; phone: string; email: string | null; service_category: string | null; service: string | null; preferred_date: string | null; preferred_time: string | null; notes: string | null; status: string; internal_notes: string | null; created_at: string };
const STATUSES = ["new","contacted","confirmed","completed","cancelled"];

function AdminAppointments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const load = () => supabase.from("appointments").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => (filter === "all" || r.status === filter) && (!search || r.full_name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)));

  async function setStatus(id: string, status: string) { await supabase.from("appointments").update({ status }).eq("id", id); load(); toast.success("Updated"); }
  async function setNotes(id: string, internal_notes: string) { await supabase.from("appointments").update({ internal_notes }).eq("id", id); }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("appointments").delete().eq("id", id); load(); toast.success("Deleted"); }

  return (
    <AdminPage title="Appointments" subtitle="Manage booking requests">
      <div className="flex flex-wrap gap-2 mb-5">
        <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="px-4 py-2 rounded-full bg-card border border-border text-sm" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-full bg-card border border-border text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No appointment requests.</p>}
        {filtered.map((r) => (
          <div key={r.id} className="glass-panel rounded-2xl p-5 gold-border">
            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-serif text-lg">{r.full_name}</h3>
                  <a href={`tel:${r.phone}`} className="text-sm text-gold">{r.phone}</a>
                  {r.email && <span className="text-xs text-muted-foreground">{r.email}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{[r.service_category, r.service].filter(Boolean).join(" · ")}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.preferred_date && new Date(r.preferred_date).toLocaleDateString()} {r.preferred_time}</p>
                {r.notes && <p className="text-sm mt-2 p-3 bg-card rounded-xl">{r.notes}</p>}
                <textarea placeholder="Internal notes…" defaultValue={r.internal_notes || ""} onBlur={(e) => setNotes(r.id, e.target.value)} className="mt-2 w-full px-3 py-2 rounded-xl bg-background border border-border text-xs" rows={2} />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => del(r.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}