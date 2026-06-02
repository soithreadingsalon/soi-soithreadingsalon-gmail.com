import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, ShieldCheck } from "lucide-react";
import salonImg from "@/assets/salon-interior.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE_URL } from "@/data/seo-content";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About SOI Threading Salon | Style of India, Wayne, NJ" },
      { name: "description", content: "SOI Threading Salon brings timeless Indian beauty traditions and modern salon care together in Wayne, NJ. Threading, waxing, facials, henna and more at 180 Hamburg Turnpk." },
      { property: "og:title", content: "About SOI Threading Salon, Style of India" },
      { property: "og:description", content: "Premium threading, facials, waxing, hair care and henna in Wayne, NJ." },
      { property: "og:image", content: salonImg },
      { property: "og:url", content: `${SITE_URL}/about` },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="animate-fade-up">
            <p className="font-script text-3xl text-gold mb-2">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-4 md:mb-6 leading-tight">Timeless beauty, <span className="gradient-text-gold">Style of India.</span></h1>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SOI Threading Salon brings timeless Indian beauty traditions together with modern salon care. Located in Wayne, NJ, SOI offers expert threading, facials, waxing, hair care, henna, and beauty services designed to help every client feel refreshed, confident, and radiant.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every visit is crafted around comfort and care, clean, welcoming spaces and meticulous attention to detail in every service we offer.
            </p>
            <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
              Book Your Visit
            </Link>
          </div>
          <div className="rounded-[2rem] overflow-hidden gold-border shadow-lift p-1">
            <img src={salonImg} alt="SOI Threading Salon interior" className="w-full h-[320px] md:h-[480px] lg:h-[520px] object-cover rounded-[2rem]" loading="lazy" width={1600} height={1000} />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <SectionHeading eyebrow="Our Promise" title="Our Beauty Philosophy" subtitle="Care, craftsmanship and warmth in every visit." />
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Heart, title: "Welcoming Comfort", desc: "A warm, clean space designed for relaxation and confidence, every detail considered for you." },
            { icon: Sparkles, title: "Expert Craftsmanship", desc: "Years of skill behind every brow shape, facial ritual, and waxing service. Precision you can feel." },
            { icon: ShieldCheck, title: "Safe & Natural", desc: "Premium products, hygienic tools, and gentle techniques. Your skin and well-being come first." },
          ].map((f, i) => (
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

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
        <p className="font-script text-3xl text-gold mb-2">Why clients love us</p>
        <h2 className="font-serif text-3xl md:text-5xl mb-4 md:mb-6">Look refreshed. Feel confident. <span className="gradient-text-gold">Radiate naturally.</span></h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From a quick brow refresh to a full beauty ritual, every SOI service is rooted in care, precision and a deep love for what we do.
        </p>
      </section>
    </>
  );
}