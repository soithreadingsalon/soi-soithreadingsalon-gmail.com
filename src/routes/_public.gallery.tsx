import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import threadingImg from "@/assets/service-threading.jpg";
import facialImg from "@/assets/service-facial.jpg";
import waxingImg from "@/assets/service-waxing.jpg";
import haircareImg from "@/assets/service-haircare.jpg";
import hennaImg from "@/assets/service-henna.jpg";
import salonImg from "@/assets/salon-interior.jpg";
import heroImg from "@/assets/hero-salon.jpg";

type GalleryRow = { id: string; category: string; caption: string | null; image_url: string };

export const Route = createFileRoute("/_public/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | SOI Threading Salon" },
      { name: "description", content: "Take a look inside SOI Threading Salon — threading, facials, waxing, hair care, henna and our luxurious salon space." },
      { property: "og:title", content: "Gallery | SOI Threading Salon" },
      { property: "og:description", content: "Photos of our salon, services and beauty work." },
    ],
  }),
  component: GalleryPage,
});

const FALLBACK: GalleryRow[] = [
  { id: "f1", category: "Salon Interior", caption: "Our welcoming space", image_url: salonImg },
  { id: "f2", category: "Facials", caption: "Gold facial ritual", image_url: facialImg },
  { id: "f3", category: "Threading", caption: "Threading craft", image_url: threadingImg },
  { id: "f4", category: "Waxing", caption: "Premium waxing", image_url: waxingImg },
  { id: "f5", category: "Hair Care", caption: "Scalp oil ritual", image_url: haircareImg },
  { id: "f6", category: "Henna", caption: "Beautiful henna art", image_url: hennaImg },
  { id: "f7", category: "Salon Interior", caption: "Brow & beauty studio", image_url: heroImg },
];

const CATS = ["All", "Threading", "Facials", "Waxing", "Hair Care", "Henna", "Salon Interior", "Offers"];

function GalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<GalleryRow | null>(null);

  useEffect(() => {
    supabase.from("gallery").select("*").order("sort_order").then(({ data }) => {
      const fromDb = (data as GalleryRow[] | null) ?? [];
      setItems(fromDb.length > 0 ? fromDb : FALLBACK);
    });
  }, []);

  const filtered = useMemo(() => (cat === "All" ? items : items.filter((i) => i.category === cat)), [items, cat]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading eyebrow="A Glimpse Inside" title="Our Gallery" subtitle="Moments from the SOI Threading Salon experience." />

      <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all whitespace-nowrap shrink-0 ${
              cat === c ? "btn-gold" : "bg-card border border-border hover:border-[var(--gold)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No images yet in this category.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {filtered.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              className="break-inside-avoid mb-5 block w-full overflow-hidden rounded-2xl gold-border card-3d animate-fade-up"
              style={{ animationDelay: `${(i % 6) * 0.05}s` }}
            >
              <img src={g.image_url} alt={g.caption || g.category} loading="lazy" className="w-full object-cover transition-transform duration-700 hover:scale-105" />
              {g.caption && <div className="p-3 text-left bg-card text-xs text-muted-foreground"><span className="font-serif text-foreground">{g.caption}</span> · {g.category}</div>}
            </button>
          ))}
        </div>
      )}

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[60] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full">
            <button onClick={() => setActive(null)} className="absolute -top-12 right-0 text-white"><X className="h-6 w-6" /></button>
            <img src={active.image_url} alt={active.caption || active.category} className="w-full rounded-2xl" />
            {active.caption && <p className="mt-3 text-center text-white font-serif text-lg">{active.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}