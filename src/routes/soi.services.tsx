import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/soi/services")({ component: AdminServices });

type Row = { id: string; category: string; name: string; price: string; description: string | null; featured: boolean; sort_order: number };
const empty: Omit<Row, "id"> = { category: "Threading", name: "", price: "$0", description: "", featured: false, sort_order: 0 };

function AdminServices() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<(Partial<Row> & { id?: string }) | null>(null);
  const load = () => supabase.from("services").select("*").order("category").order("sort_order").then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    if (!editing.category || !editing.name || !editing.price) {
      toast.error("Category, name and price are required");
      return;
    }
    const payload = { category: editing.category, name: editing.name, price: editing.price, description: editing.description || null, featured: !!editing.featured, sort_order: editing.sort_order ?? 0 };
    const res = editing.id ? await supabase.from("services").update(payload).eq("id", editing.id) : await supabase.from("services").insert(payload);
    if (res.error) toast.error(res.error.message); else { toast.success("Saved"); setEditing(null); load(); }
  }
  async function del(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  return (
    <AdminPage title="Services" subtitle="Manage your salon menu" actions={
      <button onClick={() => setEditing({ ...empty })} className="px-5 py-2.5 rounded-full text-xs font-semibold btn-gold inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Service</button>
    }>
      <div className="overflow-x-auto rounded-2xl glass-panel gold-border">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr><th className="p-4">Category</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Featured</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-card/50">
                <td className="p-4">{r.category}</td>
                <td className="p-4 font-medium">{r.name}</td>
                <td className="p-4 text-gold">{r.price}</td>
                <td className="p-4">{r.featured && <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />}</td>
                <td className="p-4 text-right">
                  <button onClick={() => setEditing(r)} className="p-2 hover:text-gold"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(r.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-3xl p-6 max-w-lg w-full gold-border space-y-3">
            <h3 className="font-serif text-2xl">{editing.id ? "Edit" : "Add"} Service</h3>
            <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="admin-input">
              {["Threading","Waxing","Facials","Hair Care","Henna","Men"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Name" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" />
            <input placeholder="Price (e.g. $10)" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="admin-input" />
            <textarea placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="admin-input" rows={3} />
            <input type="number" placeholder="Sort order" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || "0") })} className="admin-input" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
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