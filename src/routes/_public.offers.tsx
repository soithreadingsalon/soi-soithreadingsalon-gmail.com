import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, X, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/data/seo-content";

type Offer = { id: string; title: string; description: string | null; discount: string; expires_on: string | null; terms: string | null; image_url: string | null };

export const Route = createFileRoute("/_public/offers")({
  head: () => ({
    meta: [
      { title: "Current Offers & Coupons | SOI Threading Salon, Wayne, NJ" },
      { name: "description", content: "Save on threading, facials, waxing, hair massage and brow combos at SOI Threading Salon in Wayne, NJ. View limited-time coupons and call to redeem." },
      { property: "og:title", content: "Current Offers | SOI Threading Salon" },
      { property: "og:description", content: "Limited-time savings on facials, waxing, hair massage and brow combos in Wayne, NJ." },
      { property: "og:url", content: `${SITE_URL}/offers` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/offers` }],
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading eyebrow="Indulge More" title="Current Offers" subtitle="Make your next visit even more special with our exclusive savings." />

      {(() => {
        const featured = offers.find((o) => o.image_url);
        if (featured) {
          return (
            <div className="mb-8 rounded-3xl overflow-hidden gold-border shadow-lift relative">
              <img src={featured.image_url!} alt={`${featured.discount}, ${featured.title}`} className="w-full h-[280px] sm:h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <p className="font-script text-2xl md:text-3xl text-[var(--gold)] drop-shadow">{featured.discount}</p>
                <h3 className="font-serif text-3xl md:text-5xl drop-shadow">{featured.title}</h3>
                {featured.description && <p className="mt-2 max-w-xl drop-shadow opacity-90">{featured.description}</p>}
              </div>
            </div>
          );
        }
        if (offers.length > 0) {
          return (
            <div className="mb-8 rounded-3xl gradient-cream gold-border shadow-lift p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[var(--gold)]/15 blur-3xl" />
              <Sparkles className="h-7 w-7 text-gold mx-auto mb-3" />
              <p className="font-script text-3xl md:text-4xl text-gold">Exclusive Savings</p>
              <h3 className="font-serif text-3xl md:text-5xl mt-2">Treat yourself this season</h3>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Browse our current coupons below and call to redeem.</p>
            </div>
          );
        }
        return null;
      })()}

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        {offers.map((o) => (
          <div key={o.id} className="card-3d relative rounded-3xl overflow-hidden glass-panel gold-border p-5 md:p-7">
            <div className="absolute top-0 left-0 w-24 h-24 bg-[var(--gold)]/10 rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[var(--blush)]/30 rounded-tl-full" />
            <div className="relative grid grid-cols-[auto_1fr] gap-4 md:gap-5 items-center">
              <div className="text-center">
                <Sparkles className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="font-serif text-4xl md:text-5xl gradient-text-gold whitespace-nowrap">{o.discount}</div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold-deep mt-1">Coupon</p>
              </div>
              <div className="border-l-2 border-dashed border-[var(--gold)]/40 pl-4 md:pl-5 min-w-0">
                <h3 className="font-serif text-xl md:text-2xl">{o.title}</h3>
                {o.description && <p className="text-sm text-muted-foreground mt-1">{o.description}</p>}
                <p className="text-xs text-muted-foreground mt-3">
                  {o.expires_on ? `Valid through ${new Date(o.expires_on).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : "Limited time"}
                </p>
                <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
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

      <p className="text-center mt-8 text-sm text-muted-foreground italic">
        ✦ Loyalty card: Complete 9 eyebrow visits, get the 10th FREE.
      </p>

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