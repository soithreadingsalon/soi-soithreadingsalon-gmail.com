import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import offerFlyerFallback from "@/assets/offer-flyer.png";

type Slide = { id: string; title: string; discount: string; image_url: string | null; description: string | null };

export function OfferCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    supabase
      .from("offers")
      .select("id,title,discount,image_url,description")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => setSlides(((data as Slide[]) || []).filter((s) => s.image_url)));
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSel);
    onSel();
    const t = setInterval(() => embla.scrollNext(), 5000);
    return () => {
      clearInterval(t);
      embla.off("select", onSel);
    };
  }, [embla, slides.length]);

  // Fallback: single static flyer if no offers have images
  if (slides.length === 0) {
    return (
      <div className="rounded-3xl overflow-hidden gold-border shadow-card">
        <Link to="/offers"><img src={offerFlyerFallback} alt="SOI promotional offers" className="w-full h-auto block" loading="lazy" /></Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl gold-border shadow-card" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.id} className="flex-[0_0_100%] min-w-0 relative">
              <Link to="/offers" className="block group">
                <img src={s.image_url!} alt={`${s.discount} - ${s.title}`} className="w-full h-[280px] sm:h-[380px] md:h-[460px] object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 text-white">
                  <p className="font-script text-2xl md:text-3xl text-[var(--gold)] drop-shadow">{s.discount}</p>
                  <h3 className="font-serif text-2xl md:text-4xl drop-shadow">{s.title}</h3>
                  {s.description && <p className="text-sm md:text-base mt-1 max-w-xl opacity-90 drop-shadow">{s.description}</p>}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button aria-label="Previous" onClick={() => embla?.scrollPrev()} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow hover:bg-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button aria-label="Next" onClick={() => embla?.scrollNext()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center shadow hover:bg-white">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => embla?.scrollTo(i)} className={`w-2 h-2 rounded-full transition-all ${i === selected ? "bg-[var(--gold)] w-6" : "bg-white/70"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}