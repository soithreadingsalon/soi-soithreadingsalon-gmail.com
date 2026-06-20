import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Phone } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { SITE_URL } from "@/data/seo-content";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/booking.functions";

export const Route = createFileRoute("/_public/booking")({
  head: () => ({
    meta: [
      { title: "Book an Appointment | SOI Threading Salon, Wayne, NJ" },
      { name: "description", content: "Request your appointment at SOI Threading Salon in Wayne, NJ. Threading, waxing, facials, hair care, henna, eyelash and men's grooming. Call (973) 321-8374 or 551-301-3894." },
      { property: "og:title", content: "Book an Appointment | SOI Threading Salon" },
      { property: "og:description", content: "Request your beauty appointment online or call (973) 321-8374." },
      { property: "og:url", content: `${SITE_URL}/booking` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/booking` }],
  }),
  component: BookingPage,
});

const schema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email("Please enter a valid email").max(255),
  service_category: z.string().trim().min(1, "Please select a service category").max(50),
  service: z.string().max(100).optional(),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function BookingPage() {
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", service_category: "", service: "", preferred_date: "", preferred_time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const submitBookingFn = useServerFn(submitBooking);
  const todayISO = new Date().toISOString().slice(0, 10);
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
    try {
      await submitBookingFn({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || null,
          service_category: form.service_category,
          service: form.service || null,
          preferred_date: form.preferred_date || null,
          preferred_time: form.preferred_time || null,
          notes: form.notes || null,
        },
      });
      setDone(true);
      toast.success("Appointment request received!");
    } catch (err) {
      console.error("submit booking failed", err);
      toast.error("Could not submit. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="glass-panel rounded-3xl p-10 gold-border animate-fade-up">
          <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl mb-3">Thank you for choosing SOI Threading Salon!</h1>
          <p className="text-muted-foreground mb-2">Your appointment details have been received for your requested date and time. We look forward to welcoming you soon.</p>
          <p className="text-xs text-muted-foreground mb-6">Disclaimer: Appointments are managed based on staff availability and salon schedule.</p>
          <a href="tel:9733218374" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold btn-gold">
            <Phone className="h-4 w-4" /> Call (973) 321-8374
          </a>
          <a href="tel:5513013894" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold">
            <Phone className="h-4 w-4" /> Call 551-301-3894
          </a>
          <a
            href="https://wa.me/15513013894?text=Hi%20SOI%20Threading%20Salon%2C%20I%27d%20like%20to%20book%20an%20appointment."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b]"
            aria-label="Chat with us on WhatsApp"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.78 3.41 4.74 4.34.616.287 2.035.973 2.694.973.59 0 1.32-.302 1.575-.945.075-.187.5-.972.5-1.276s-2.063-1.247-2.42-1.247zM16.97 30.595c-3.026 0-5.96-.86-8.477-2.595L1 30l2.34-7.336c-1.91-2.55-2.86-5.59-2.84-8.79.014-7.847 6.42-14.252 14.27-14.252 3.808.014 7.385 1.49 10.07 4.187a14.067 14.067 0 0 1 4.16 10.064c-.014 7.847-6.42 14.253-14.27 14.253-.014 0-.014 0 0 0z"/>
            </svg>
            WhatsApp 551-301-3894
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
        <Field label="Email *"><input type="email" required value={form.email} onChange={handle("email")} className="input" /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Service Category *">
            <select required value={form.service_category} onChange={handle("service_category")} className="input">
              <option value="">Select…</option>
              {["Threading","Waxing","Facials","Hair Care","Henna","Men"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Service"><input value={form.service} onChange={handle("service")} className="input" placeholder="e.g. Eyebrow threading" /></Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Preferred Date"><input type="date" min={todayISO} value={form.preferred_date} onChange={handle("preferred_date")} className="input" /></Field>
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