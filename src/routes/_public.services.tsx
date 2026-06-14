import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown, Check, Plus, X, ShoppingBag, Trash2, CheckCircle2, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { SITE_URL } from "@/data/seo-content";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking as submitBookingRequest } from "@/lib/booking.functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Service = { id: string; category: string; name: string; price: string; description: string | null; featured: boolean; sort_order: number };

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing | SOI Threading Salon, Wayne, NJ" },
      { name: "description", content: "Full menu and pricing for threading, waxing, facials, hair care, henna, eyelash services and men's grooming at SOI Threading Salon in Wayne, NJ." },
      { property: "og:title", content: "Services & Pricing | SOI Threading Salon" },
      { property: "og:description", content: "Threading, waxing, facials, hair care, henna, eyelash and men's grooming pricing in Wayne, NJ." },
      { property: "og:url", content: `${SITE_URL}/services` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/services` }],
  }),
  component: ServicesPage,
});

const CATEGORIES = ["All", "Threading", "Waxing", "Facials", "Hair Care", "Henna", "Men"];

function priceNumber(p: string) {
  const m = p.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

const bookingSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(30),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "" });
  const submitBookingFn = useServerFn(submitBookingRequest);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setServices(data as Service[]);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = services;
    if (cat !== "All") list = list.filter((s) => s.category === cat);
    if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "asc") list = [...list].sort((a, b) => priceNumber(a.price) - priceNumber(b.price));
    if (sort === "desc") list = [...list].sort((a, b) => priceNumber(b.price) - priceNumber(a.price));
    return list;
  }, [services, cat, search, sort]);

  const grouped = useMemo(() => {
    const g: Record<string, Service[]> = {};
    for (const s of filtered) (g[s.category] ||= []).push(s);
    return g;
  }, [filtered]);

  const selected = useMemo(() => services.filter((s) => selectedIds.has(s.id)), [services, selectedIds]);
  const totalEstimate = useMemo(() => selected.reduce((sum, s) => sum + priceNumber(s.price), 0), [selected]);
  const hasUpPricing = useMemo(() => selected.some((s) => /& up|and up/i.test(s.price)), [selected]);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  function clearAll() { setSelectedIds(new Set()); }

  function openBooking() {
    if (selected.length === 0) return;
    setBookingDone(false);
    setBookingOpen(true);
  }

  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }
    setSubmitting(true);
    const serviceNames = selected.map((s) => s.name).join(", ");
    const cats = Array.from(new Set(selected.map((s) => s.category))).join(", ");
    const notesWithEstimate = [
      form.notes,
      `Selected services: ${selected.map((s) => `${s.name} (${s.price})`).join("; ")}`,
      `Estimated total: $${totalEstimate}${hasUpPricing ? "+" : ""}`,
    ].filter(Boolean).join("\n");

    try {
      await submitBookingFn({
        data: {
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || null,
          service_category: cats || null,
          service: serviceNames || null,
          preferred_date: form.preferred_date || null,
          preferred_time: form.preferred_time || null,
          notes: notesWithEstimate,
        },
      });
    } catch (error) {
      setSubmitting(false);
      toast.error("Could not submit. Please try again or call us.");
      return;
    }
    setSubmitting(false);
    setBookingDone(true);
    toast.success("Appointment request received!");
    setSelectedIds(new Set());
    setForm({ full_name: "", phone: "", email: "", preferred_date: "", preferred_time: "", notes: "" });
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 pb-32 lg:pb-14">
        <SectionHeading eyebrow="Our Menu" title="Services & Pricing" subtitle="Every ritual is designed to refresh, refine, and restore your natural radiance." />

        <div className="text-center mb-6 -mt-4">
          <p className="text-sm text-muted-foreground">
            Browse to compare prices, or <span className="text-gold font-semibold">tap “Add”</span> on any service to build your appointment.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-3 md:p-5 mb-6 md:mb-8 flex flex-col md:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm"
            />
          </div>
          <div className="flex flex-nowrap md:flex-wrap gap-1.5 overflow-x-auto -mx-1 px-1 md:mx-0 md:px-0 pb-1 md:pb-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all whitespace-nowrap shrink-0 ${
                  cat === c ? "btn-gold" : "bg-card border border-border hover:border-[var(--gold)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSort(sort === "default" ? "asc" : sort === "asc" ? "desc" : "default")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold uppercase tracking-wide"
          >
            <ArrowUpDown className="h-4 w-4" /> Price {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <div className="min-w-0">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading services…</p>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No services match your search.</p>
            ) : (
              <div className="space-y-8 md:space-y-10">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="flex items-center gap-4 mb-4 md:mb-5">
                      <h2 className="font-serif text-2xl md:text-3xl text-foreground">{category}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-[var(--gold)] to-transparent" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      {items.map((s) => {
                        const isSelected = selectedIds.has(s.id);
                        return (
                          <div
                            key={s.id}
                            className={`card-3d rounded-2xl p-4 md:p-5 gold-border transition-all ${
                              isSelected ? "bg-[var(--gold)]/8 ring-2 ring-[var(--gold)]" : "glass-panel"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-serif text-lg">{s.name}</h3>
                                  {s.featured && <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full gradient-gold text-white">Popular</span>}
                                </div>
                                {s.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.description}</p>}
                              </div>
                              <div className="font-serif text-xl text-gold whitespace-nowrap">{s.price}</div>
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                              <button
                                onClick={() => toggle(s.id)}
                                aria-pressed={isSelected}
                                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                  isSelected
                                    ? "bg-[var(--gold)] text-white shadow-gold"
                                    : "border border-[var(--gold)]/60 text-gold hover:bg-[var(--gold)]/10"
                                }`}
                              >
                                {isSelected ? (<><Check className="h-3.5 w-3.5" /> Added</>) : (<><Plus className="h-3.5 w-3.5" /> Add</>)}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop summary panel */}
          <aside className="hidden lg:block sticky top-24">
            <div className="glass-panel rounded-3xl p-6 gold-border">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="h-4 w-4 text-gold" />
                <p className="font-script text-2xl text-gold">Your Selection</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {selected.length === 0
                  ? "Select one or more services to begin."
                  : `${selected.length} service${selected.length > 1 ? "s" : ""} selected`}
              </p>

              {selected.length > 0 && (
                <>
                  <ul className="space-y-2 max-h-[40vh] overflow-y-auto pr-1 mb-4">
                    {selected.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-sm bg-card/60 rounded-lg px-3 py-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.category}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-gold font-semibold">{s.price}</span>
                          <button
                            onClick={() => toggle(s.id)}
                            aria-label={`Remove ${s.name}`}
                            className="p-1 rounded-full text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[var(--gold)]/30 pt-3 mb-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Total</span>
                      <span className="font-serif text-2xl text-gold">${totalEstimate}{hasUpPricing && "+"}</span>
                    </div>
                    {hasUpPricing && <p className="text-[10px] text-muted-foreground mt-1">Some services start from this price; final total confirmed in salon.</p>}
                  </div>

                  <button onClick={openBooking} className="w-full px-5 py-3 rounded-full text-xs font-semibold btn-gold mb-2">
                    Book These Services
                  </button>
                  <button onClick={clearAll} className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground py-1">
                    <Trash2 className="h-3 w-3" /> Clear all
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky bottom bar */}
      {selected.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--gold)]/30 glass-panel shadow-lift">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={clearAll} aria-label="Clear" className="p-2 rounded-full bg-card border border-border">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">{selected.length} selected</p>
              <p className="font-serif text-lg text-gold leading-tight">${totalEstimate}{hasUpPricing && "+"} <span className="text-[10px] text-muted-foreground font-sans normal-case tracking-normal">est.</span></p>
            </div>
            <button onClick={openBooking} className="px-5 py-2.5 rounded-full text-xs font-semibold btn-gold whitespace-nowrap">
              Book Now
            </button>
          </div>
        </div>
      )}

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto bg-card gold-border rounded-3xl p-6">
          {bookingDone ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-14 w-14 text-gold mx-auto mb-3" />
              <DialogTitle className="font-serif text-2xl">Thank you!</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 mb-5">
                Your appointment request has been received. SOI Threading Salon will contact you to confirm.
              </DialogDescription>
              <a href="tel:5513013894" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-gold">
                <Phone className="h-4 w-4" /> Call 551-301-3894
              </a>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Book Your Appointment</DialogTitle>
                <DialogDescription>
                  We'll confirm your booking by phone. Required fields are marked with *.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl bg-[var(--ivory)] p-3 border border-[var(--gold)]/30">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Selected services</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selected.map((s) => (
                    <span key={s.id} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-card border border-[var(--gold)]/40">
                      {s.name} <span className="text-gold font-semibold">{s.price}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline justify-between text-xs pt-2 border-t border-[var(--gold)]/20">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-serif text-lg text-gold">${totalEstimate}{hasUpPricing && "+"}</span>
                </div>
              </div>

              <form onSubmit={submitBooking} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full Name *"><input required value={form.full_name} onChange={handle("full_name")} className="svc-input" /></Field>
                  <Field label="Phone *"><input required value={form.phone} onChange={handle("phone")} className="svc-input" /></Field>
                </div>
                <Field label="Email"><input type="email" value={form.email} onChange={handle("email")} className="svc-input" /></Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Preferred Date"><input type="date" value={form.preferred_date} onChange={handle("preferred_date")} className="svc-input" /></Field>
                  <Field label="Preferred Time">
                    <TimeSlotPicker
                      date={form.preferred_date}
                      value={form.preferred_time}
                      onChange={(v) => setForm((f) => ({ ...f, preferred_time: v }))}
                      className="svc-input"
                    />
                  </Field>
                </div>
                <Field label="Notes"><textarea rows={3} value={form.notes} onChange={handle("notes")} className="svc-input" placeholder="Anything we should know?" /></Field>

                <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-full text-sm font-semibold btn-gold disabled:opacity-60">
                  {submitting ? "Submitting…" : `Request Appointment (${selected.length})`}
                </button>
              </form>
            </>
          )}
          <style>{`.svc-input { width:100%; padding:11px 13px; border-radius:12px; background:var(--background); border:1px solid var(--border); font-size:14px; outline:none; transition:border-color .2s; }
          .svc-input:focus { border-color: var(--gold); }`}</style>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}