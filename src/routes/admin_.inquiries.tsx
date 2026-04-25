import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin_/inquiries")({ component: AdminInquiries });

type Row = { id: string; name: string; phone: string | null; email: string | null; service_interest: string | null; preferred_date: string | null; preferred_time: string | null; message: string | null; read: boolean; notes: string | null; created_at: string };

function AdminInquiries() {
  const [rows, setRows] = useState<Row[]>([]);
  const load = () => supabase.from("inquiries").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);
  async function toggle(r: Row) { await supabase.from("inquiries").update({ read: !r.read }).eq("id", r.id); load(); }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("inquiries").delete().eq("id", id); load(); }
  async function setNotes(id: string, notes: string) { await supabase.from("inquiries").update({ notes }).eq("id", id); }

  return (
    <AdminPage title="Contact Inquiries" subtitle="Messages from your contact form">
      <div className="space-y-3">
        {rows.length === 0 && <p className="text-center text-muted-foreground py-12">No inquiries yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className={`glass-panel rounded-2xl p-5 gold-border ${!r.read ? "ring-1 ring-[var(--gold)]/40" : ""}`}>
            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-serif text-lg">{r.name}</h3>
                  {r.phone && <a href={`tel:${r.phone}`} className="text-sm text-gold">{r.phone}</a>}
                  {r.email && <a href={`mailto:${r.email}`} className="text-xs text-muted-foreground">{r.email}</a>}
                </div>
                {r.service_interest && <p className="text-sm text-muted-foreground mt-1">Interested in: {r.service_interest}</p>}
                {(r.preferred_date || r.preferred_time) && <p className="text-xs text-muted-foreground">{r.preferred_date && new Date(r.preferred_date).toLocaleDateString()} {r.preferred_time}</p>}
                {r.message && <p className="text-sm mt-2 p-3 bg-card rounded-xl">{r.message}</p>}
                <textarea placeholder="Internal notes…" defaultValue={r.notes || ""} onBlur={(e) => setNotes(r.id, e.target.value)} className="mt-2 w-full px-3 py-2 rounded-xl bg-background border border-border text-xs" rows={2} />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => toggle(r)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border">
                  {r.read ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />} {r.read ? "Read" : "Unread"}
                </button>
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