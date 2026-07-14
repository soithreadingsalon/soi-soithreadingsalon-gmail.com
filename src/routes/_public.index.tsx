import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone, MapPin, Clock, Sparkles, Flower2, Leaf, ShieldCheck, Star, ArrowRight, Instagram, Facebook, ArrowUpRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import heroImg from "@/assets/hero-salon.jpg";
import heroVideo from "@/assets/hero-salon.mp4.asset.json";
import threadingImg from "@/assets/service-threading.jpg";
import facialImg from "@/assets/service-facial.jpg";
import waxingImg from "@/assets/service-waxing.jpg";
import haircareImg from "@/assets/service-haircare.jpg";
import hennaImg from "@/assets/service-henna.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { OfferCarousel } from "@/components/OfferCarousel";
import { FAQS, SITE_URL } from "@/data/seo-content";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews.functions";

const GOOGLE_REVIEWS_URL =
  "https://search.google.com/local/reviews?placeid=ChIJFWU6oxf9wokRmpTavWu8g9s";
const DEFAULT_REVIEW_RATING = "5.0";
const DEFAULT_REVIEW_COUNT_LABEL = "50+";
const INSTAGRAM_URL = "https://www.instagram.com/soithreadingsalon/";
const FACEBOOK_URL = "https://www.facebook.com/people/SOI-Threading-Salon/61590260705927/";

const REVIEW_AVATARS = [
  { initial: "H", bg: "bg-fuchsia-500" },
  { initial: "S", bg: "bg-red-500" },
  { initial: "R", bg: "bg-emerald-500" },
  { initial: "J", bg: "bg-emerald-700" },
];

const REVIEWS = [
  { name: "Heather Grella", initial: "H", bg: "bg-fuchsia-500", service: "Eyebrow Threading", time: "2 weeks ago", text: "10/10 would recommend! The owner was so nice. My eyebrows have never looked better! I was certainly impressed considering it was my first time getting my brows threaded. Price was affordable." },
  { name: "Archana Barvalia", initial: "A", bg: "bg-zinc-700", service: "Full Face Threading", time: "a week ago", text: "I had the full face service at SOI, which included eyebrows, upper lips, sides, forehead, chin, and more. The experience was absolutely amazing! The staff is the best — professional, friendly, and very skilled." },
  { name: "Soniya Herapara", initial: "S", bg: "bg-red-500", service: "Waxing, Threading & Scalp Massage", time: "3 weeks ago", text: "Jenny was awesome. She caught on real quickly about my sensitive skin and went gentle when threading my eyebrows. The scalp massage felt so relaxing. Waxing was painless as well. Great customer service." },
  { name: "Samantha Leahy-Beers", initial: "S", bg: "bg-amber-600", service: "Eyebrow Threading", time: "3 weeks ago", text: "I've been going to Jinal for quite some time and when she opened her salon, I had to come! She has always taken such good care of my eyebrows. She's extremely kind, quick, and always giving helpful tips." },
  { name: "Radhika Dave", initial: "R", bg: "bg-emerald-500", service: "Eyebrow Threading", time: "a week ago", text: "Jinal was so friendly and my eyebrows have never looked better!" },
  { name: "Danielle Germano", initial: "D", bg: "bg-zinc-600", service: "Brow Threading & Tint + Lip", time: "a day ago", text: "I had my eyebrows threaded and tinted, as well as my upper lip threaded, and I couldn't be happier with the results. The staff was incredibly friendly and welcoming, and they really took their time to make sure everything was perfect." },
  { name: "tejaswini dange", initial: "T", bg: "bg-sky-500", service: "Eyebrow Threading", time: "3 days ago", text: "I am very happy with my eye brows. Jinal did awesome job. Thank you Jinal." },
  { name: "Chinwe Atkinson", initial: "C", bg: "bg-orange-500", service: "Threading & Waxing", time: "3 days ago", text: "Lovely customer service. Jinal is nice. Nicely done threading and waxing. Clean and welcoming environment for all ages." },
  { name: "payal kakadiya", initial: "P", bg: "bg-emerald-500", service: "Facial", time: "4 days ago", text: "Facial was amazing!" },
  { name: "Danielle Vecchione", initial: "D", bg: "bg-red-500", service: "Threading", time: "4 days ago", text: "Great service. Very knowledgeable! Will be going back in the future ❤️" },
  { name: "Jessica F.", initial: "J", bg: "bg-emerald-800", service: "Threading", time: "5 days ago", text: "Been here 2x and will keep coming back. Excellent work at a great price. It's right next to the Quick Check." },
  { name: "Rashmi Dhekne", initial: "R", bg: "bg-fuchsia-500", service: "Haircut with Priyanka", time: "a week ago", text: "Priyanka does a great haircut! Thank you!" },
  { name: "Kumud Bansal", initial: "K", bg: "bg-amber-700", service: "Facial with Priyanka", time: "a week ago", text: "Facial is very very good. Priyanka is very good." },
  { name: "Jasica Mehta", initial: "J", bg: "bg-stone-600", service: "Eyebrow Threading", time: "a week ago", text: "Great experience, very nice customer service, friendly and did a great job with the eyebrows." },
  { name: "Mary Elizabeth Selvakumar", initial: "M", bg: "bg-emerald-600", service: "Beauty Services", time: "2 weeks ago", text: "Excellent service!" },
  { name: "Francine Selvakumar", initial: "F", bg: "bg-teal-600", service: "Threading & Waxing", time: "2 weeks ago", text: "Excellent service! Highly recommend!!" },
  { name: "Khushi Gandhi", initial: "K", bg: "bg-zinc-500", service: "Lash Lift & Eyebrow Threading", time: "2 weeks ago", text: "It was a great experience. I got a lash lift and my eyebrows threaded. They worked efficiently and my eyebrows have never looked better. The customer service was nice and enjoyable. I would highly recommend to anyone in the NJ/NYC area!" },
  { name: "Bhumika Khunt", initial: "B", bg: "bg-zinc-600", service: "Eyebrow Threading", time: "3 weeks ago", text: "Must visit this place. Art nice customer service and love the way they did my eye brows." },
  { name: "Kenisha Rao", initial: "K", bg: "bg-pink-500", service: "Eyebrow Threading", time: "2 weeks ago", text: "Absolutely obsessed with my eyebrows 😍 Perfect shape, clean work, and natural look!" },
  { name: "Rashmika Dave", initial: "R", bg: "bg-orange-500", service: "Eyebrow Threading", time: "a week ago", text: "Wonderful customer service, both my eyebrows and my daughters' eyebrows came out perfect. 👌" },
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

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showCenter, setShowCenter] = useState(true);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowCenter(false), 1500);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden shadow-lift gold-border p-1 bg-[var(--champagne)]"
      onMouseEnter={() => setShowCenter(true)}
      onMouseLeave={() => { if (isPlaying) scheduleHide(); }}
    >
      <div className="relative w-full aspect-video rounded-[1.75rem] overflow-hidden">
        <video
          ref={videoRef}
          src={heroVideo.url}
          poster={heroImg}
          muted
          loop
          playsInline
          preload="metadata"
          onClick={togglePlay}
          onPlay={() => { setIsPlaying(true); scheduleHide(); }}
          onPause={() => { setIsPlaying(false); setShowCenter(true); }}
          onVolumeChange={() => { const v = videoRef.current; if (v) setIsMuted(v.muted); }}
          aria-label="SOI Threading Salon, expert threading, facials, waxing, hair care and henna"
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {/* Center Play/Pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, margin: "auto" }}
          className={`h-16 w-16 lg:h-20 lg:w-20 rounded-full btn-gold flex items-center justify-center shadow-lift transition-opacity duration-300 ${showCenter || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
        </button>

        {/* Bottom-right Mute */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="h-10 w-10 rounded-full btn-gold flex items-center justify-center shadow-soft"
          style={{ position: "absolute", bottom: 12, right: 12, left: "auto", top: "auto" }}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
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
  { name: "Threading", desc: "Precision shaping for perfectly defined brows.", img: threadingImg, from: "$10", to: "/services" as const },
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
  const [liveReviews, setLiveReviews] = useState<GoogleReview[]>([]);
  const [liveRating, setLiveRating] = useState<string>(DEFAULT_REVIEW_RATING);
  const [liveCountLabel, setLiveCountLabel] = useState<string>(DEFAULT_REVIEW_COUNT_LABEL);

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

  useEffect(() => {
    let cancelled = false;
    getGoogleReviews()
      .then((res) => {
        if (cancelled) return;
        if (res.reviews.length > 0) setLiveReviews(res.reviews);
        if (typeof res.rating === "number") setLiveRating(res.rating.toFixed(1));
        if (typeof res.userRatingCount === "number" && res.userRatingCount > 0) {
          setLiveCountLabel(String(res.userRatingCount));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Live Google reviews first, then curated fallback reviews (dedup by name).
  const displayedReviews = (() => {
    const seen = new Set(liveReviews.map((r) => r.name.toLowerCase()));
    const extras = REVIEWS.filter((r) => !seen.has(r.name.toLowerCase()));
    return [...liveReviews, ...extras];
  })();

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
              <WhatsAppButton
                label="WhatsApp 551-301-3894"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors shadow-soft"
              />
              <a href="tel:9733218374" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/5 transition-colors">
                <Phone className="h-4 w-4" /> Call (973) 321-8374
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
                aria-label="Read 50+ Google reviews for SOI Threading Salon"
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
                    {liveRating} <Star className="inline h-3.5 w-3.5 fill-current -mt-0.5" /> · {liveCountLabel} Google reviews
                  </span>
                </div>
              </a>
              <SocialPills />
            </div>
          </div>

          <div className="relative animate-fade-up mt-2 lg:mt-0" style={{ animationDelay: "0.15s" }}>
            <HeroVideo />

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

      {/* REVIEWS — auto-scrolling carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 overflow-hidden">
        <SectionHeading
          eyebrow="What Clients Say"
          title="Loved by Our Wayne, NJ Community"
          subtitle="Real reviews from real clients at our brand-new Wayne salon."
        />

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8 text-sm">
          <div className="inline-flex items-center gap-2">
            <GoldStars />
            <span className="font-semibold text-foreground">{liveRating}</span>
          </div>
          <div className="hidden md:block h-5 w-px bg-border" />
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold transition-colors">
            <GoogleG /> <span className="font-semibold">{liveCountLabel} Google Reviews</span>
          </a>
          <div className="hidden md:block h-5 w-px bg-border" />
          <div className="inline-flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-gold" /> <span className="font-semibold">Now Open in Wayne, NJ</span>
          </div>
        </div>

        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Fade masks on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-background to-transparent" />

          <div className="reviews-track flex gap-4 md:gap-5 hover:[animation-play-state:paused]">
            {[...displayedReviews, ...displayedReviews].map((r, idx) => (
              <article
                key={`${r.name}-${idx}`}
                className="shrink-0 w-[85%] sm:w-[340px] glass-panel gold-border rounded-2xl p-5 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <span className={`${r.bg} h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {r.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base text-foreground truncate">{r.name}</p>
                    <GoldStars size="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90 flex-1">“{r.text}”</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate">{r.service} · {r.time}</p>
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
            <GoogleG className="h-4 w-4" /> Read all {liveCountLabel} reviews on Google <ArrowUpRight className="h-4 w-4" />
          </a>
          <SocialPills size="md" />
        </div>

        <style>{`
          @keyframes scroll-reviews {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .reviews-track {
            animation: scroll-reviews 60s linear infinite;
            width: max-content;
          }
          .reviews-track:hover {
            animation-play-state: paused;
          }
        `}</style>
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