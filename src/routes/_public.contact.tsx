import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { useServerFn } from "@tanstack/react-start";
import { notifyInquiryByEmail } from "@/lib/inquiries.functions";
import { SITE_URL } from "@/data/seo-content";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact SOI Threading Salon | Wayne, NJ — Call 551-301-3894" },
      { name: "description", content: "Contact SOI Threading Salon at 180 Hamburg Turnpk, Wayne, NJ 07470. Call 551-301-3894 or send a message to book threading, waxing, facials, henna and more." },
      { property: "og:title", content: "Contact SOI Threading Salon — Wayne, NJ" },
      { property: "og:description", content: "Call 551-301-3894, email, or visit our salon at 180 Hamburg Turnpk, Wayne, NJ." },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
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
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "SOI Threading Salon",
    image: `${SITE_URL}/og-image.jpg`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: "+1-551-301-3894",
    email: "soithreadingsalon@gmail.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "180 Hamburg Turnpk",
      addressLocality: "Wayne",
      addressRegion: "NJ",
      postalCode: "07470",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "10:00", closes: "19:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "16:00" },
    ],
    sameAs: ["https://instagram.com/SOITHREADINGSALON"],
  };
  const [form, setForm] = useState({ name: "", phone: "", email: "", service_interest: "", preferred_date: "", preferred_time: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const notify = useServerFn(notifyInquiryByEmail);

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
    const { data: inserted, error } = await supabase.from("inquiries").insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      service_interest: form.service_interest || null,
      preferred_date: form.preferred_date || null,
      preferred_time: form.preferred_time || null,
      message: form.message || null,
    }).select("id").single();
    setSubmitting(false);
    if (error) {
      toast.error("Could not send your message. Please try again.");
    } else {
      toast.success("Thank you. We'll be in touch shortly.");
      setForm({ name: "", phone: "", email: "", service_interest: "", preferred_date: "", preferred_time: "", message: "" });
      if (inserted?.id) {
        notify({ data: { inquiryId: inserted.id } }).catch((e) => console.error("notify failed", e));
      }
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <SectionHeading eyebrow="Say Hello" title="Get in Touch" subtitle="Questions, bookings or just to say hi — we'd love to hear from you." />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8">
        <div className="glass-panel rounded-3xl p-6 md:p-8 gold-border">
          <h3 className="font-serif text-2xl mb-5">Visit & Connect</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><MapPin className="h-5 w-5 text-gold mt-0.5" /><span>180 Hamburg Turnpk<br />Wayne, NJ 07470</span></li>
            <li><a href="tel:5513013894" className="flex gap-3 hover:text-gold"><Phone className="h-5 w-5 text-gold mt-0.5" />551-301-3894</a></li>
            <li><a href="mailto:soithreadingsalon@gmail.com" className="flex gap-3 hover:text-gold break-all"><Mail className="h-5 w-5 text-gold mt-0.5" />soithreadingsalon@gmail.com</a></li>
            <li className="flex gap-3"><Clock className="h-5 w-5 text-gold mt-0.5" /><span>M–F: 10am–7pm<br />Sat: 10am–6pm<br />Sun: 11am–4pm</span></li>
            <li><a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-gold"><Instagram className="h-5 w-5 text-gold mt-0.5" />@SOITHREADINGSALON</a></li>
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <a href="tel:5513013894" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold btn-gold">Call Now</a>
            <a href="mailto:soithreadingsalon@gmail.com" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Email</a>
            <a href="https://maps.google.com/?q=180+Hamburg+Turnpk+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Directions</a>
            <a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="text-center px-4 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">Instagram</a>
          </div>

          <div className="mt-6 rounded-2xl overflow-hidden gold-border">
            <iframe title="Map" src="https://www.google.com/maps?q=180+Hamburg+Turnpk,+Wayne,+NJ+07470&output=embed" className="w-full h-56 border-0" loading="lazy" />
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
            <Field label="Preferred Time">
              <TimeSlotPicker
                date={form.preferred_date}
                value={form.preferred_time}
                onChange={(v) => setForm({ ...form, preferred_time: v })}
                className="input"
              />
            </Field>
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