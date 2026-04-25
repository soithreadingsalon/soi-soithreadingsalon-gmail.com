import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/offers")({ component: AdminOffers });

type Row = { id: string; title: string; description: string | null; discount: string; expires_on: string | null; terms: string | null; image_url: string | null; active: boolean; sort_order: number };
const empty: Omit<Row, "id"> = { title: "", description: "", discount: "$10 OFF", expires_on: null, terms: "", image_url: "", active: true, sort_order: 0 };

function AdminOffers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Partial<Row> & { id?: string }) | null>(null);
  const load = () => supabase.from("offers").select("*").order("sort_order").then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const payload = { title: editing.title, description: editing.description || null, discount: editing.discount, expires_on: editing.expires_on || null, terms: editing.terms || null, image_url: editing.image_url || null, active: !!editing.active, sort_order: editing.sort_order ?? 0 };
    const res = editing.id ? await supabase.from("offers").update(payload).eq("id", editing.id) : await supabase.from("offers").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Saved"); setEditing(null); load(); }
  }
  async function del(id: string) {
    if (!confirm("Delete this offer?")) return;
    await supabase.from("offers").delete().eq("id", id); toast.success("Deleted"); load();
  }
  async function toggle(r: Row) {
    await supabase.from("offers").update({ active: !r.active }).eq("id", r.id); load();
  }

  return (
    <AdminPage title="Offers" subtitle="Manage promotional coupons" actions={
      <button onClick={() => setEditing({ ...empty })} className="px-5 py-2.5 rounded-full text-xs font-semibold btn-gold inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Offer</button>
    }>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="glass-panel rounded-2xl p-5 gold-border">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-serif text-3xl gradient-text-gold">{r.discount}</div>
                <div className="font-serif text-xl">{r.title}</div>
                {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                {r.expires_on && <p className="text-xs text-muted-foreground mt-2">Expires {new Date(r.expires_on).toLocaleDateString()}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => toggle(r)} className={`text-xs px-3 py-1 rounded-full ${r.active ? "bg-[var(--gold)]/20 text-gold" : "bg-muted text-muted-foreground"}`}>{r.active ? "Active" : "Inactive"}</button>
                <button onClick={() => setEditing(r)} className="p-1.5 hover:text-gold"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => del(r.id)} className="p-1.5 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl p-6 max-w-lg w-full gold-border space-y-3">
            <h3 className="font-serif text-2xl">{editing.id ? "Edit" : "Add"} Offer</h3>
            <input placeholder="Title" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="admin-input" />
            <input placeholder="Discount (e.g. $10 OFF)" value={editing.discount || ""} onChange={(e) => setEditing({ ...editing, discount: e.target.value })} className="admin-input" />
            <textarea placeholder="Description" rows={2} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input" />
            <input type="date" value={editing.expires_on || ""} onChange={(e) => setEditing({ ...editing, expires_on: e.target.value })} className="admin-input" />
            <textarea placeholder="Terms" rows={2} value={editing.terms || ""} onChange={(e) => setEditing({ ...editing, terms: e.target.value })} className="admin-input" />
            <input placeholder="Image URL (optional)" value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="admin-input" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <div className="flex gap-2 pt-2">
              <button onClick={save} className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold btn-gold">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-full text-xs font-semibold border border-border">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.admin-input { width:100%; padding:10px 12px; border-radius:12px; background:var(--background); border:1px solid var(--border); font-size:14px; outline:none; }`}</style>
    </AdminPage>
  );
}