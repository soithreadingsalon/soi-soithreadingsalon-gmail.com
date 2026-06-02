import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Trash2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/storage";

export const Route = createFileRoute("/soi/gallery")({ component: AdminGallery });

type Row = { id: string; category: string; caption: string | null; image_url: string; sort_order: number };

function AdminGallery() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState({ category: "Salon Interior", caption: "", image_url: "", sort_order: 0 });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const load = () => supabase.from("gallery").select("*").order("sort_order").then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.image_url) return toast.error("Image URL required");
    const { error } = await supabase.from("gallery").insert({ category: form.category, caption: form.caption || null, image_url: form.image_url, sort_order: form.sort_order });
    if (error) toast.error(error.message);
    else { toast.success("Added"); setForm({ ...form, caption: "", image_url: "" }); load(); }
  }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("gallery").delete().eq("id", id); load(); }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try {
      const url = await uploadImage("gallery-images", f);
      setForm({ ...form, image_url: url });
      toast.success("Uploaded, click Add to save");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <AdminPage title="Gallery" subtitle="Manage gallery images (paste image URL)">
      <div className="glass-panel rounded-2xl p-5 gold-border mb-6 grid sm:grid-cols-[1fr_1fr_2fr_auto] gap-3">
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
          {["Threading","Facials","Waxing","Hair Care","Henna","Salon Interior","Offers"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="admin-input" />
        <div className="flex gap-2 items-center">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 rounded-full text-xs border border-[var(--gold)] text-gold inline-flex items-center gap-1 disabled:opacity-50 whitespace-nowrap">
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload"}
          </button>
          <input placeholder="or Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="admin-input" />
        </div>
        <button onClick={add} className="px-5 py-2.5 rounded-full text-xs font-semibold btn-gold inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="glass-panel rounded-2xl overflow-hidden gold-border">
            <img src={r.image_url} alt={r.caption || ""} className="w-full h-40 object-cover" />
            <div className="p-3 flex justify-between items-center text-xs">
              <div><p className="font-medium">{r.caption}</p><p className="text-muted-foreground">{r.category}</p></div>
              <button onClick={() => del(r.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <style>{`.admin-input { width:100%; padding:10px 12px; border-radius:12px; background:var(--background); border:1px solid var(--border); font-size:14px; outline:none; }`}</style>
    </AdminPage>
  );
}