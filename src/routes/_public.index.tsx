import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Sparkles, Flower2, Leaf, ShieldCheck, Star, ArrowRight, Instagram } from "lucide-react";
import offerFlyer from "@/assets/offer-flyer.png";
import heroImg from "@/assets/hero-salon.jpg";
import threadingImg from "@/assets/service-threading.jpg";
import facialImg from "@/assets/service-facial.jpg";
import waxingImg from "@/assets/service-waxing.jpg";
import haircareImg from "@/assets/service-haircare.jpg";
import hennaImg from "@/assets/service-henna.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "SOI Threading Salon | Style of India — Wayne, NJ" },
      { name: "description", content: "Premium threading, facials, waxing, hair care and henna in Wayne, NJ. Style of India — Enhance. Refresh. Radiate." },
      { property: "og:title", content: "SOI Threading Salon | Style of India" },
      { property: "og:description", content: "Premium threading, facials, waxing, hair care and henna in Wayne, NJ." },
    ],
  }),
  component: HomePage,
});

const SERVICES = [
  { name: "Threading", desc: "Precision shaping for perfectly defined brows.", img: threadingImg, from: "$6", to: "/services" as const },
  { name: "Facials", desc: "Glow-restoring rituals for every skin type.", img: facialImg, from: "$20", to: "/services" as const },
  { name: "Waxing", desc: "Smooth, comfortable, long-lasting results.", img: waxingImg, from: "$15", to: "/services" as const },
  { name: "Hair Care", desc: "Scalp massage, henna color, lash treatments.", img: haircareImg, from: "$30", to: "/services" as const },
  { name: "Henna", desc: "Beautiful, natural mehndi artistry.", img: hennaImg, from: "$15", to: "/services" as const },
];

const FEATURES = [
  { icon: Sparkles, title: "Expert Threading", desc: "Decades of experience for clean, lasting brow lines." },
  { icon: Flower2, title: "Advanced Skin Care", desc: "Premium facials with results you'll see and feel." },
  { icon: Leaf, title: "Natural & Safe", desc: "Gentle products and meticulous hygiene standards." },
  { icon: ShieldCheck, title: "Premium Waxing", desc: "Comfortable techniques for silky-smooth results." },
];

function HomePage() {
  const [todayHours, setTodayHours] = useState("10:00 AM – 7:00 PM");

  useEffect(() => {
    const day = new Date().getDay();
    if (day === 0) setTodayHours("11:00 AM – 4:00 PM");
    else if (day === 6) setTodayHours("10:00 AM – 6:00 PM");
    else setTodayHours("10:00 AM – 7:00 PM");
  }, []);

  const [offers, setOffers] = useState<Array<{ id: string; title: string; discount: string; description: string | null; expires_on: string | null }>>([]);

  useEffect(() => {
    supabase.from("offers").select("id,title,discount,description,expires_on").eq("active", true).order("sort_order").then(({ data }) => {
      if (data) setOffers(data);
    });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ivory)] via-[var(--champagne)] to-[var(--blush)]/40" />
          <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[var(--gold)]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[var(--blush)]/30 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-fade-up">
            <p className="font-script text-3xl md:text-4xl text-gold mb-2">Style of India</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground">
              Enhance. <span className="gradient-text-gold">Refresh.</span> Radiate.
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Experience expert care and timeless beauty with our premium threading, waxing, facials, hair care, henna and more — in Wayne, NJ.
            </p>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:5513013894" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/5 transition-colors">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href="https://maps.google.com/?q=190+Hamburg+Tpke+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-foreground hover:text-gold">
                <MapPin className="h-4 w-4" /> Get Directions
              </a>
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-deep">
              <span>Threading</span><span>·</span><span>Waxing</span><span>·</span><span>Facials</span><span>·</span><span>Hair Care</span><span>·</span><span>Henna</span>
            </div>
          </div>

          <div className="relative animate-fade-up mt-2 lg:mt-0" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-[2rem] overflow-hidden shadow-lift gold-border p-1">
              <img src={heroImg} alt="SOI Threading Salon — expert threading, facials, waxing, hair care and henna" className="w-full h-[340px] sm:h-[420px] lg:h-[520px] object-cover rounded-[2rem]" width={1600} height={1200} />
            </div>

            {/* Floating info card */}
            <div className="absolute -left-4 lg:-left-12 bottom-6 lg:bottom-12 glass-panel rounded-2xl p-5 shadow-lift max-w-[280px] animate-float gold-border">
              <p className="font-script text-2xl text-gold mb-1">Visit Us</p>
              <p className="font-serif text-sm text-foreground/90 leading-snug">190 Hamburg Tpke<br />Wayne, NJ 07470</p>
              <div className="my-3 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
              <a href="tel:5513013894" className="flex items-center gap-2 text-sm font-semibold text-gold">
                <Phone className="h-4 w-4" /> 551-301-3894
              </a>
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Today: {todayHours}
              </p>
            </div>

            <div className="hidden md:block absolute -top-6 -right-6 glass-panel rounded-2xl p-4 shadow-soft animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />)}
                </div>
                <span className="text-xs font-medium">Trusted in Wayne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading eyebrow="Why SOI" title="A Salon Inspired by Beauty & Tradition" subtitle="Where timeless Indian artistry meets modern luxury salon care." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-3d glass-panel rounded-2xl p-5 md:p-7 text-center animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="mx-auto mb-5 w-14 h-14 rounded-full gradient-gold flex items-center justify-center shadow-gold">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading eyebrow="Our Specialties" title="Premium Beauty Services" subtitle="Crafted rituals for refreshed skin, defined brows, and confident beauty." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map((s, i) => (
            <Link key={s.name} to={s.to} className="card-3d group relative overflow-hidden rounded-3xl bg-card animate-fade-up gold-border" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="aspect-[4/3] overflow-hidden">
                <img loading="lazy" src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-2xl">{s.name}</h3>
                  <span className="text-sm text-gold font-semibold">From {s.from}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                  View Details <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <SectionHeading eyebrow="Limited Time" title="Current Offers" subtitle="Indulge in a little more luxury with our exclusive promotions." />
          <div className="mb-6 rounded-2xl overflow-hidden gold-border shadow-card">
            <img src={offerFlyer} alt="SOI current promotional offers" className="w-full h-auto" loading="lazy" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {offers.map((o, i) => (
              <div key={o.id} className="card-3d relative rounded-2xl p-6 glass-panel gold-border text-center animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="absolute top-3 right-3 text-[10px] tracking-[0.2em] uppercase text-gold-deep">Coupon</div>
                <div className="font-serif text-4xl gradient-text-gold mb-2">{o.discount}</div>
                <div className="font-script text-2xl text-foreground/80 mb-3">{o.title}</div>
                <div className="my-3 ornament-divider"><span className="text-xs">✦</span></div>
                <p className="text-xs text-muted-foreground">
                  {o.expires_on ? `Expires ${new Date(o.expires_on).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Limited time"}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/offers" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
              View All Offers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* LOYALTY CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-[2rem] gradient-cream gold-border p-6 md:p-12 shadow-card text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--gold)]/10 blur-3xl" />
          <p className="font-script text-3xl text-gold mb-1">Loyalty Card</p>
          <h2 className="font-serif text-2xl md:text-4xl mb-3">Complete 9 Eyebrow Visits, Get the 10th <span className="gradient-text-gold">FREE</span></h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm md:text-base">Our way of saying thank you for being part of the SOI family.</p>

          <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-2xl mx-auto">
            {Array.from({ length: 10 }).map((_, i) => {
              const isFree = i === 9;
              return (
                <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-serif ${isFree ? "gradient-gold text-white shadow-gold" : "bg-card border border-[var(--gold)]/30"}`}>
                  {isFree ? (
                    <>
                      <Sparkles className="h-5 w-5 mb-0.5" />
                      <span className="text-xs font-bold tracking-wider">FREE</span>
                    </>
                  ) : (
                    <span className="text-2xl text-gold-deep">{i + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
              Ask Us About Our Loyalty Card
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-[2rem] glass-panel gold-border p-6 md:p-10 text-center">
          <Instagram className="h-10 w-10 text-gold mx-auto mb-4" />
          <p className="font-script text-3xl text-gold mb-2">Follow our journey</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-2">Follow SOI Threading Salon on Instagram</h2>
          <p className="text-muted-foreground mb-6">@SOITHREADINGSALON</p>
          <a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
            <Instagram className="h-4 w-4" /> Follow on Instagram
          </a>
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading eyebrow="Visit Us" title="Find Us in Wayne, NJ" subtitle="190 Hamburg Tpke, Wayne, NJ 07470 — easy parking, warm welcome." />
        <div className="rounded-[2rem] overflow-hidden gold-border shadow-card">
          <iframe
            title="SOI Threading Salon Location"
            src="https://www.google.com/maps?q=190+Hamburg+Tpke,+Wayne,+NJ+07470&output=embed"
            className="w-full h-[320px] md:h-[420px] border-0"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-6">
          <a href="https://maps.google.com/?q=190+Hamburg+Tpke+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
            <MapPin className="h-4 w-4" /> Get Directions
          </a>
        </div>
      </section>
    </>
  );
}