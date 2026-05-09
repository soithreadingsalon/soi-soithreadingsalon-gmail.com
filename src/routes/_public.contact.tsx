import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import qrInsta from "@/assets/qr-instagram.jpg";
import qrGoogle from "@/assets/qr-google.png";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact SOI Threading Salon | Wayne, NJ" },
      { name: "description", content: "Contact SOI Threading Salon in Wayne, NJ. Call 551-301-3894 or send us a message." },
      { property: "og:title", content: "Contact SOI Threading Salon" },
      { property: "og:description", content: "Call, email, or visit our salon in Wayne, NJ." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  service_interest: z.string().max(100).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().max(40).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service_interest: "", preferred_date: "", preferred_time: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

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
    const { error } = await supabase.from("inquiries").insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      service_interest: form.service_interest || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      message: form.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
    } else {
      toast.success("Thank you. We'll be in touch shortly.");
      setForm({ name: "", phone: "", email: "", service_interest: "", preferred_date: "", preferred_time: "", message: "" });
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading eyebrow="Say Hello" title="Get in Touch" subtitle="Questions, bookings or just to say hi — we'd love to hear from you." />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8">
        <div className="glass-panel rounded-3xl p-6 md:p-8 gold-border">
          <h3 className="font-serif text-2xl mb-5">Visit & Connect</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><MapPin className="h-5 w-5 text-gold mt-0.5" /><span>190 Hamburg Tpke<br />Wayne, NJ 07470</span></li>
            <li><a href="tel:5513013894" className="flex gap-3 hover:text-gold"><Phone className="h-5 w-5 text-gold mt-0.5" />551-301-3894</a></li>
            <li><a href="mailto:soithreadingsalon@gmail.com" className="flex gap-3 hover:text-gold break-all"><Mail className="h-5 w-5 text-gold mt-0.5" />soithreadingsalon@gmail.com</a></li>
            <li className="flex gap-3"><Clock className="h-5 w-5 text-gold mt-0.5" /><span>M–F: 10am–7pm<br />Sat: 10am–6pm<br />Sun: 11am–4pm</span></li>
            <li><a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-gold"><Instagram className="h-5 w-5 text-gold mt-0.5" />@SOITHREADINGSALON</a></li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <a href="tel:5513013894" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold btn-gold">Call Now</a>
            <a href="mailto:soithreadingsalon@gmail.com" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Email</a>
            <a href="https://maps.google.com/?q=190+Hamburg+Tpke+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Directions</a>
            <a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Instagram</a>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden gold-border">
            <iframe title="Map" src="https://www.google.com/maps?q=190+Hamburg+Tpke,+Wayne,+NJ+07470&output=embed" className="w-full h-56 border-0" loading="lazy" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center bg-card rounded-2xl p-3 gold-border">
              <img src={qrInsta} alt="Scan to follow us on Instagram" className="w-full h-auto rounded-lg bg-white p-1" />
              <p className="mt-2 text-xs font-semibold text-gold">Follow @soithreadingsalon</p>
            </div>
            <div className="text-center bg-card rounded-2xl p-3 gold-border">
              <img src={qrGoogle} alt="Scan to find us on Google Maps" className="w-full h-auto rounded-lg bg-white p-1" />
              <p className="mt-2 text-xs font-semibold text-gold">Find us on Google</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="glass-panel rounded-3xl p-6 md:p-8 gold-border space-y-4">
          <h3 className="font-serif text-2xl mb-1">Send a Message</h3>
          <p className="text-sm text-muted-foreground mb-4">We typically respond within one business day.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *"><input required value={form.name} onChange={handle("name")} className="input" /></Field>
            <Field label="Phone"><input value={form.phone} onChange={handle("phone")} className="input" /></Field>
          </div>
          <Field label="Email"><input type="email" value={form.email} onChange={handle("email")} className="input" /></Field>
          <Field label="Service Interested In">
            <select value={form.service_interest} onChange={handle("service_interest")} className="input">
              <option value="">Select…</option>
              {["Threading","Waxing","Facials","Hair Care","Henna","Men","Other"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Preferred Date"><input type="date" value={form.preferred_date} onChange={handle("preferred_date")} className="input" /></Field>
            <Field label="Preferred Time"><input value={form.preferred_time} onChange={handle("preferred_time")} className="input" placeholder="e.g. 2:00 PM" /></Field>
          </div>
          <Field label="Message"><textarea rows={4} value={form.message} onChange={handle("message")} className="input" /></Field>

          <button type="submit" disabled={submitting} className="w-full px-6 py-3.5 rounded-full text-sm font-semibold btn-gold disabled:opacity-60">
            {submitting ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>

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