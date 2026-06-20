import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/soi/inquiries")({ component: AdminInquiries });

type Row = { id: string; name: string; phone: string | null; email: string | null; service_interest: string | null; preferred_date: string | null; preferred_time: string | null; message: string | null; read: boolean; notes: string | null; created_at: string };

function AdminInquiries() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const load = () => supabase.from("inquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));

  useEffect(() => {
    load();
    const ch = supabase
      .channel("inquiries-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "inquiries" }, (payload) => {
        load();
        if (payload.eventType === "INSERT") {
          const r = payload.new as Row;
          toast.success(`New message from ${r.name}`, { duration: 6000 });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = rows.filter((r) => {
    if (filter === "unread" && r.read) return false;
    if (filter === "read" && !r.read) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!r.name.toLowerCase().includes(s) && !(r.phone || "").includes(search) && !(r.email || "").toLowerCase().includes(s)) return false;
    }
    return true;
  });

  async function toggle(r: Row) { await supabase.from("inquiries").update({ read: !r.read }).eq("id", r.id); }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("inquiries").delete().eq("id", id); toast.success("Deleted"); }
  async function setNotes(id: string, notes: string) { await supabase.from("inquiries").update({ notes }).eq("id", id); }

  async function convertToBooking(r: Row) {
    if (!r.read) await supabase.from("inquiries").update({ read: true }).eq("id", r.id);
    const { data, error } = await supabase.from("appointments").insert({
      full_name: r.name,
      phone: r.phone || "",
      email: r.email,
      service_category: r.service_interest,
      preferred_date: r.preferred_date,
      preferred_time: r.preferred_time,
      notes: r.message,
      status: "new",
    }).select().single();
    if (error || !data) { toast.error("Could not convert"); return; }
    toast.success("Converted to appointment");
    navigate({ to: "/soi/appointments" });
  }

  return (
    <AdminPage title="Contact Inquiries" subtitle="Live updates from your contact form">
      <div className="flex flex-wrap gap-2 mb-4">
        <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 min-w-[180px] px-4 py-2 rounded-full bg-card border border-border text-sm" />
        <div className="flex rounded-full bg-card border border-border text-xs overflow-hidden">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 capitalize ${filter === f ? "bg-[var(--gold)] text-white" : ""}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No inquiries.</p>}
        {filtered.map((r) => {
          const phoneDigits = (r.phone || "").replace(/\D/g, "");
          return (
            <div key={r.id} className={`glass-panel rounded-2xl p-4 md:p-5 gold-border ${!r.read ? "ring-1 ring-[var(--gold)]/40" : ""}`}>
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-serif text-lg">{r.name}</h3>
                    {!r.read && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold)] text-white">New</span>}
                    {r.phone && <a href={`tel:${r.phone}`} className="text-sm text-gold">{r.phone}</a>}
                    {r.email && <a href={`mailto:${r.email}`} className="text-xs text-muted-foreground">{r.email}</a>}
                  </div>
                  {r.service_interest && <p className="text-sm text-muted-foreground mt-1">Interested in: <strong>{r.service_interest}</strong></p>}
                  {(r.preferred_date || r.preferred_time) && <p className="text-xs text-muted-foreground">{r.preferred_date && new Date(r.preferred_date + "T12:00:00").toLocaleDateString()} {r.preferred_time}</p>}
                  {r.message && <p className="text-sm mt-2 p-3 bg-card rounded-xl">{r.message}</p>}
                  <textarea placeholder="Internal notes…" defaultValue={r.notes || ""} onBlur={(e) => setNotes(r.id, e.target.value)} className="mt-2 w-full px-3 py-2 rounded-xl bg-background border border-border text-xs" rows={2} />
                </div>
                <div className="flex flex-wrap md:flex-col gap-2 items-start md:items-end">
                  <button onClick={() => toggle(r)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border">
                    {r.read ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />} {r.read ? "Read" : "Unread"}
                  </button>
                  {phoneDigits && <a href={`tel:${phoneDigits}`} className="p-2 rounded-full border border-border" title="Call"><Phone className="h-4 w-4" /></a>}
                  {phoneDigits && <a href={`https://wa.me/1${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>}
                  <button onClick={() => convertToBooking(r)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-full btn-gold font-semibold"><ArrowRight className="h-3.5 w-3.5" /> To Booking</button>
                  <button onClick={() => del(r.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminPage>
  )
}
