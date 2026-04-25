import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, X, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

type Offer = { id: string; title: string; description: string | null; discount: string; expires_on: string | null; terms: string | null; image_url: string | null };

export const Route = createFileRoute("/_public/offers")({
  head: () => ({
    meta: [
      { title: "Current Offers & Coupons | SOI Threading Salon" },
      { name: "description", content: "Save with current SOI Threading Salon offers — facials, waxing, hair massage and brow combos in Wayne, NJ." },
      { property: "og:title", content: "Current Offers | SOI Threading Salon" },
      { property: "og:description", content: "Limited-time savings on facials, waxing, hair massage and brow combos." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [active, setActive] = useState<Offer | null>(null);

  useEffect(() => {
    supabase.from("offers").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      if (data) setOffers(data as Offer[]);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading eyebrow="Indulge More" title="Current Offers" subtitle="Make your next visit even more special with our exclusive savings." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {offers.map((o) => (
          <div key={o.id} className="card-3d relative rounded-3xl overflow-hidden glass-panel gold-border p-7">
            <div className="absolute top-0 left-0 w-24 h-24 bg-[var(--gold)]/10 rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[var(--blush)]/30 rounded-tl-full" />
            <div className="relative grid sm:grid-cols-[auto_1fr] gap-5 items-center">
              <div className="text-center">
                <Sparkles className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="font-serif text-5xl gradient-text-gold">{o.discount}</div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold-deep mt-1">Coupon</p>
              </div>
              <div className="border-l-2 border-dashed border-[var(--gold)]/40 pl-5">
                <h3 className="font-serif text-2xl">{o.title}</h3>
                {o.description && <p className="text-sm text-muted-foreground mt-1">{o.description}</p>}
                <p className="text-xs text-muted-foreground mt-3">
                  {o.expires_on ? `Valid through ${new Date(o.expires_on).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : "Limited time"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="tel:5513013894" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-gold">
                    <Phone className="h-3.5 w-3.5" /> Call to Redeem
                  </a>
                  <button onClick={() => setActive(o)} className="inline-flex items-center px-5 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">
                    Show Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[60] bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-md w-full bg-card rounded-3xl p-8 gold-border shadow-lift text-center">
            <button onClick={() => setActive(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            <p className="font-script text-2xl text-gold mb-1">SOI Threading Salon</p>
            <div className="font-serif text-7xl gradient-text-gold my-3">{active.discount}</div>
            <p className="font-serif text-xl mb-2">{active.title}</p>
            {active.description && <p className="text-sm text-muted-foreground mb-4">{active.description}</p>}
            <div className="ornament-divider my-4"><span className="text-xs">✦</span></div>
            {active.terms && <p className="text-xs text-muted-foreground">{active.terms}</p>}
            {active.expires_on && <p className="text-xs text-gold mt-2">Valid through {new Date(active.expires_on).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>}
            <a href="tel:5513013894" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold btn-gold">
              <Phone className="h-4 w-4" /> Call 551-301-3894
            </a>
          </div>
        </div>
      )}
    </section>
  );
}