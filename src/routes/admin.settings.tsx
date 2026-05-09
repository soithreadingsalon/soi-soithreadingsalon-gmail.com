import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminPage } from "@/components/AdminPage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

type Settings = {
  salon_name: string; tagline: string; phone: string; email: string; address: string; website: string; instagram: string;
  hours_weekday: string; hours_saturday: string; hours_sunday: string; maps_url: string;
  hero_headline: string; hero_subheadline: string; about_text: string;
  instagram_qr_url: string | null; google_qr_url: string | null;
  calendar_sync_enabled: boolean; google_calendar_id: string;
};

function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => { supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data as Settings)); }, []);

  async function save() {
    if (!s) return;
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    if (error) toast.error(error.message); else toast.success("Settings saved");
  }

  if (!s) return <AdminPage title="Settings"><p className="text-muted-foreground">Loading…</p></AdminPage>;

  const setF = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });

  return (
    <AdminPage title="Business Settings" subtitle="Update your business info, hours, and homepage content">
      <div className="space-y-6 max-w-3xl">
        <Section title="Business Info">
          <Row label="Salon Name"><input value={s.salon_name} onChange={(e) => setF("salon_name", e.target.value)} className="admin-input" /></Row>
          <Row label="Tagline"><input value={s.tagline} onChange={(e) => setF("tagline", e.target.value)} className="admin-input" /></Row>
          <Row label="Phone"><input value={s.phone} onChange={(e) => setF("phone", e.target.value)} className="admin-input" /></Row>
          <Row label="Email"><input value={s.email} onChange={(e) => setF("email", e.target.value)} className="admin-input" /></Row>
          <Row label="Address"><input value={s.address} onChange={(e) => setF("address", e.target.value)} className="admin-input" /></Row>
          <Row label="Website"><input value={s.website} onChange={(e) => setF("website", e.target.value)} className="admin-input" /></Row>
          <Row label="Instagram"><input value={s.instagram} onChange={(e) => setF("instagram", e.target.value)} className="admin-input" /></Row>
          <Row label="Maps URL"><input value={s.maps_url} onChange={(e) => setF("maps_url", e.target.value)} className="admin-input" /></Row>
        </Section>
        <Section title="Business Hours">
          <Row label="Mon–Fri"><input value={s.hours_weekday} onChange={(e) => setF("hours_weekday", e.target.value)} className="admin-input" /></Row>
          <Row label="Saturday"><input value={s.hours_saturday} onChange={(e) => setF("hours_saturday", e.target.value)} className="admin-input" /></Row>
          <Row label="Sunday"><input value={s.hours_sunday} onChange={(e) => setF("hours_sunday", e.target.value)} className="admin-input" /></Row>
        </Section>
        <Section title="Homepage Content">
          <Row label="Hero Headline"><input value={s.hero_headline} onChange={(e) => setF("hero_headline", e.target.value)} className="admin-input" /></Row>
          <Row label="Hero Subheadline"><textarea value={s.hero_subheadline} onChange={(e) => setF("hero_subheadline", e.target.value)} className="admin-input" rows={2} /></Row>
          <Row label="About Text"><textarea value={s.about_text} onChange={(e) => setF("about_text", e.target.value)} className="admin-input" rows={4} /></Row>
        </Section>
        <Section title="QR Codes">
          <Row label="Instagram QR (image URL)"><input value={s.instagram_qr_url || ""} onChange={(e) => setF("instagram_qr_url", e.target.value)} className="admin-input" /></Row>
          <Row label="Google Location QR (image URL)"><input value={s.google_qr_url || ""} onChange={(e) => setF("google_qr_url", e.target.value)} className="admin-input" /></Row>
        </Section>
        <Section title="Google Calendar Sync">
          <p className="text-xs text-muted-foreground -mt-2 mb-1">When ON, marking an appointment as <strong>confirmed</strong> creates a Google Calendar event automatically. Cancellation removes it.</p>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!s.calendar_sync_enabled} onChange={(e) => setF("calendar_sync_enabled", e.target.checked)} /> Sync confirmed appointments to Google Calendar</label>
          <Row label="Calendar ID (use 'primary' for your main calendar)"><input value={s.google_calendar_id || "primary"} onChange={(e) => setF("google_calendar_id", e.target.value)} className="admin-input" /></Row>
        </Section>
        <button onClick={save} className="px-6 py-3 rounded-full text-sm font-semibold btn-gold">Save All Settings</button>
      </div>
      <style>{`.admin-input { width:100%; padding:10px 12px; border-radius:12px; background:var(--background); border:1px solid var(--border); font-size:14px; outline:none; }`}</style>
    </AdminPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="glass-panel rounded-2xl p-6 gold-border space-y-3"><h3 className="font-serif text-xl mb-2">{title}</h3>{children}</div>;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>{children}</label>;
}