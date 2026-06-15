import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, MapPin, Clock, Sparkles, Flower2, Leaf, ShieldCheck, Star, ArrowRight, Instagram, Facebook, ArrowUpRight } from "lucide-react";
import heroImg from "@/assets/hero-salon.jpg";
import threadingImg from "@/assets/service-threading.jpg";
import facialImg from "@/assets/service-facial.jpg";
import waxingImg from "@/assets/service-waxing.jpg";
import haircareImg from "@/assets/service-haircare.jpg";
import hennaImg from "@/assets/service-henna.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { OfferCarousel } from "@/components/OfferCarousel";
import { FAQS, SITE_URL } from "@/data/seo-content";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=1d2bc8c14a52b799&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOe8mCMlMk3wimdIbBWEUGC0UVpgFnFRppc7jPAY97XmzGYsxrm7s_OBmv6k7xWVNmjUavcOVWcFEaJFexHtKnd1284k7gfpgNanNNK_Qzh7bU5q2EQ%3D%3D&q=SOI+THREADING+SALON+Reviews&sa=X&ved=2ahUKEwjnh9eUloiVAxV-jYkEHWZ8HmwQ0bkNegQINRAH&biw=1512&bih=740&dpr=2";
const REVIEW_RATING = "5.0";
const REVIEW_COUNT_LABEL = "25+";
const INSTAGRAM_URL = "https://www.instagram.com/soithreadingsalon/";
const FACEBOOK_URL = "https://www.facebook.com/people/SOI-Threading-Salon/61590260705927/";

const REVIEW_AVATARS = [
  { initial: "P", bg: "bg-pink-400" },
  { initial: "S", bg: "bg-violet-400" },
  { initial: "A", bg: "bg-amber-400" },
  { initial: "J", bg: "bg-emerald-400" },
];

const REVIEWS = [
  { name: "Priya S.", service: "Eyebrow Threading", time: "a few days ago", text: "Beautiful new salon in Wayne! Got my brows threaded and the shape is perfect. So clean and welcoming — already booked my next visit." },
  { name: "Sneha P.", service: "Full Face Threading", time: "a week ago", text: "Visited right after their grand opening. The staff is so warm and the threading was quick, precise, and painless. Highly recommend!" },
  { name: "Anjali K.", service: "Facial", time: "a week ago", text: "Loved my facial — my skin felt fresh and glowing for days. The space is gorgeous and everything is spotless. 5 stars all around." },
  { name: "Jasmine R.", service: "Eyebrow Threading", time: "a few days ago", text: "Best brows I've had in Wayne. They listened to exactly what I wanted and the shaping is on point. New favorite spot!" },
  { name: "Maya T.", service: "Waxing", time: "a week ago", text: "Smooth, comfortable, and so professional. Such a relief to find a salon this clean and friendly right in our neighborhood." },
  { name: "Rita D.", service: "Henna", time: "a few days ago", text: "Got henna done for a family event — beautifully detailed work and lovely staff. Will be coming back for threading too." },
];

function GoogleG({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C40.9 35.2 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function GoldStars({ size = "h-4 w-4" }: { size?: string }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${size} fill-[var(--gold)] text-[var(--gold)]`} />
      ))}
    </div>
  );
}

function SocialPills({ size = "sm" }: { size?: "sm" | "md" }) {
  const pad = size === "md" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs";
  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Follow us</span>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${pad} rounded-full bg-card border border-border hover:border-[var(--gold)] font-semibold transition-colors`}>
        <Instagram className="h-4 w-4 text-gold" /> Instagram
      </a>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${pad} rounded-full bg-card border border-border hover:border-[var(--gold)] font-semibold transition-colors`}>
        <Facebook className="h-4 w-4 text-gold" /> Facebook
      </a>
    </div>
  );
}

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "SOI Threading Salon | Threading, Waxing, Facials & Henna in Wayne, NJ" },
      { name: "description", content: "Premium threading, waxing, facials, hair care, henna, eyelash and men's grooming in Wayne, NJ. Visit SOI Threading Salon at 180 Hamburg Turnpk." },
      { name: "keywords", content: "threading salon Wayne NJ, eyebrow threading Wayne NJ, facial salon Wayne NJ, waxing Wayne NJ, henna Wayne NJ, beauty salon Wayne NJ, Indian beauty salon Wayne NJ, men's eyebrow threading Wayne NJ, eyelash extensions Wayne NJ" },
      { property: "og:title", content: "SOI Threading Salon | Threading, Waxing, Facials & Henna in Wayne, NJ" },
      { property: "og:description", content: "Premium threading, waxing, facials, hair care, henna and men's grooming in Wayne, NJ." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
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
    if (day === 0) setTodayHours("Closed");
    else if (day === 6) setTodayHours("10:00 AM – 6:00 PM");
    else setTodayHours("10:00 AM – 7:00 PM");
  }, []);

  const [offers, setOffers] = useState<Array<{ id: string; title: string; discount: string; description: string | null; expires_on: string | null }>>([]);

  useEffect(() => {
    supabase.from("offers").select("id,title,discount,description,expires_on").eq("active", true).order("sort_order").then(({ data }) => {
      if (data) setOffers(data);
    });
  }, []);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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
              Experience expert care and timeless beauty with our premium threading, waxing, facials, hair care, henna and more, in Wayne, NJ.
            </p>

            <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:5513013894" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/5 transition-colors">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href="https://maps.google.com/?q=180+Hamburg+Turnpk+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-foreground hover:text-gold">
                <MapPin className="h-4 w-4" /> Get Directions
              </a>
            </div>

            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold-deep">
              <span>Threading</span><span>·</span><span>Waxing</span><span>·</span><span>Facials</span><span>·</span><span>Hair Care</span><span>·</span><span>Henna</span>
            </div>

            {/* Trust strip: avatars + Google rating + socials */}
            <div className="mt-6 md:mt-8 flex flex-col gap-4">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 group w-fit"
                aria-label="Read 138+ Google reviews for SOI Threading Salon"
              >
                <div className="flex -space-x-2">
                  {REVIEW_AVATARS.map((a) => (
                    <span key={a.initial} className={`${a.bg} h-9 w-9 rounded-full ring-2 ring-background flex items-center justify-center text-white text-xs font-bold shadow-soft`}>
                      {a.initial}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col">
                  <GoldStars />
                  <span className="text-sm font-semibold text-foreground mt-0.5 group-hover:text-gold transition-colors">
                    {REVIEW_RATING} <Star className="inline h-3.5 w-3.5 fill-current -mt-0.5" /> · {REVIEW_COUNT_LABEL} Google reviews
                  </span>
                </div>
              </a>
              <SocialPills />
            </div>
          </div>

          <div className="relative animate-fade-up mt-2 lg:mt-0" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-[2rem] overflow-hidden shadow-lift gold-border p-1">
              <img src={heroImg} alt="SOI Threading Salon, expert threading, facials, waxing, hair care and henna" className="w-full h-[340px] sm:h-[420px] lg:h-[520px] object-cover rounded-[2rem]" width={1600} height={1200} fetchPriority="high" decoding="async" />
            </div>

            {/* Floating info card */}
            <div className="absolute -left-4 lg:-left-12 bottom-6 lg:bottom-12 glass-panel rounded-2xl p-5 shadow-lift max-w-[280px] animate-float gold-border">
              <p className="font-script text-2xl text-gold mb-1">Visit Us</p>
              <p className="font-serif text-sm text-foreground/90 leading-snug">180 Hamburg Turnpk<br />Wayne, NJ 07470</p>
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

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading
          eyebrow="What Clients Say"
          title="Loved by Our Wayne, NJ Community"
          subtitle="Real reviews from real clients at our brand-new Wayne salon."
        />

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8 text-sm">
          <div className="inline-flex items-center gap-2">
            <GoldStars />
            <span className="font-semibold text-foreground">{REVIEW_RATING}</span>
          </div>
          <div className="hidden md:block h-5 w-px bg-border" />
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
            <GoogleG /> <span className="font-semibold">{REVIEW_COUNT_LABEL} Google Reviews</span>
          </a>
          <div className="hidden md:block h-5 w-px bg-border" />
          <div className="inline-flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-gold" /> <span className="font-semibold">Now Open in Wayne, NJ</span>
          </div>
        </div>

        <div className="relative">
          <div className="reviews-scroller flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {REVIEWS.map((r) => (
              <article
                key={r.name}
                className="snap-start shrink-0 w-[85%] sm:w-[340px] glass-panel gold-border rounded-2xl p-5 flex flex-col"
              >
                <GoldStars />
                <p className="mt-3 text-sm leading-relaxed text-foreground/90 flex-1">“{r.text}”</p>
                <div className="mt-4 pt-4 border-t border-border flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-base text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.service} · {r.time}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <GoogleG className="h-3 w-3" /> Verified
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 flex flex-col items-center gap-5">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold"
          >
            <GoogleG className="h-4 w-4" /> Read all {REVIEW_COUNT_LABEL} reviews on Google <ArrowUpRight className="h-4 w-4" />
          </a>
          <SocialPills size="md" />
        </div>

        <style>{`.reviews-scroller::-webkit-scrollbar { display: none; } .reviews-scroller { scrollbar-width: none; }`}</style>
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
          <div className="mb-6">
            <OfferCarousel />
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

      {/* LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading eyebrow="Visit Us" title="Find Us in Wayne, NJ" subtitle="180 Hamburg Turnpk, Wayne, NJ 07470, easy parking, warm welcome." />
        <div className="rounded-[2rem] overflow-hidden gold-border shadow-card">
          <iframe
            title="SOI Threading Salon Location"
            src="https://www.google.com/maps?q=180+Hamburg+Turnpk,+Wayne,+NJ+07470&output=embed"
            className="w-full h-[320px] md:h-[420px] border-0"
            loading="lazy"
          />
        </div>
        <div className="text-center mt-6">
          <a href="https://maps.google.com/?q=180+Hamburg+Turnpk+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
            <MapPin className="h-4 w-4" /> Get Directions
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Quick answers about SOI Threading Salon in Wayne, NJ." />
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-panel gold-border rounded-2xl p-5">
              <summary className="font-serif text-lg cursor-pointer text-foreground">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}