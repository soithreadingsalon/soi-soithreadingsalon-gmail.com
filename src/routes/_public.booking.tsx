import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Phone } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";

export const Route = createFileRoute("/_public/booking")({
  head: () => ({
    meta: [
      { title: "Book Appointment | SOI Threading Salon, Wayne NJ" },
      { name: "description", content: "Request your appointment at SOI Threading Salon in Wayne, NJ. Threading, facials, waxing, hair care and henna." },
      { property: "og:title", content: "Book Appointment | SOI Threading Salon" },
      { property: "og:description", content: "Request your beauty appointment online or call 551-301-3894." },
    ],
  }),
  component: BookingPage,
});

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  service_category: z.string().max(50).optional(),
  service: z.string().max(100).optional(),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function BookingPage() {
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", service_category: "", service: "", preferred_date: "", preferred_time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      full_name: form.full_name,
      phone: form.phone,
      email: form.email || null,
      service_category: form.service_category || null,
      service: form.service || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) toast.error("Could not submit. Please try again or call us.");
    else { setDone(true); toast.success("Appointment request received!"); }
  }

  if (done) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="glass-panel rounded-3xl p-10 gold-border animate-fade-up">
          <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl mb-3">Thank you!</h1>
          <p className="text-muted-foreground mb-6">Your appointment request has been received. SOI Threading Salon will contact you to confirm your appointment.</p>
          <a href="tel:5513013894" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold btn-gold">
            <Phone className="h-4 w-4" /> Call 551-301-3894
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading eyebrow="Reserve Your Spot" title="Book an Appointment" subtitle="Tell us a little about your visit and we'll confirm by phone." />
      <form onSubmit={submit} className="glass-panel rounded-3xl p-8 gold-border space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name *"><input required value={form.full_name} onChange={handle("full_name")} className="input" /></Field>
          <Field label="Phone Number *"><input required value={form.phone} onChange={handle("phone")} className="input" /></Field>
        </div>
        <Field label="Email"><input type="email" value={form.email} onChange={handle("email")} className="input" /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Service Category">
            <select value={form.service_category} onChange={handle("service_category")} className="input">
              <option value="">Select…</option>
              {["Threading","Waxing","Facials","Hair Care","Henna","Men"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Service"><input value={form.service} onChange={handle("service")} className="input" placeholder="e.g. Eyebrow threading" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Preferred Date"><input type="date" value={form.preferred_date} onChange={handle("preferred_date")} className="input" /></Field>
          <Field label="Preferred Time">
            <TimeSlotPicker
              date={form.preferred_date}
              value={form.preferred_time}
              onChange={(v) => setForm({ ...form, preferred_time: v })}
              className="input"
            />
          </Field>
        </div>
        <Field label="Notes"><textarea rows={4} value={form.notes} onChange={handle("notes")} className="input" placeholder="Anything we should know?" /></Field>
        <button type="submit" disabled={submitting} className="w-full px-6 py-3.5 rounded-full text-sm font-semibold btn-gold disabled:opacity-60">
          {submitting ? "Submitting…" : "Request Appointment"}
        </button>
      </form>
      <style>{`.input { width:100%; padding:12px 14px; border-radius:14px; background:var(--card); border:1px solid var(--border); font-size:14px; outline:none; transition:border-color .2s; }
      .input:focus { border-color: var(--gold); }`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}