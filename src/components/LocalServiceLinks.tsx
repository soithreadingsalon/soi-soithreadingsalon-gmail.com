import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const LOCAL_PAGES: { to: string; label: string; blurb: string }[] = [
  { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow Threading in Wayne, NJ", blurb: "Precise brow shaping from $10, the service most of our clients book first." },
  { to: "/threading-salon-wayne-nj", label: "Threading Salon in Wayne, NJ", blurb: "Upper lip, chin, sideburns, full face, and full face with neck threading." },
  { to: "/waxing-wayne-nj", label: "Waxing Services in Wayne, NJ", blurb: "Face and body waxing, bikini, Brazilian, and full leg." },
  { to: "/facials-wayne-nj", label: "Facials and Skin Care in Wayne, NJ", blurb: "Mini, acne, gold, oxygen, Casmara Gold, and teenage facials." },
  { to: "/eyelash-services-wayne-nj", label: "Lash Lift and Extensions in Wayne, NJ", blurb: "Lifted, fuller-looking lashes that last six to eight weeks." },
  { to: "/henna-wayne-nj", label: "Henna in Wayne, NJ", blurb: "All-natural mehndi, from small designs to bridal henna." },
  { to: "/mens-grooming-wayne-nj", label: "Men's Grooming in Wayne, NJ", blurb: "Men's brow threading, nose and ear hair, back and chest waxing." },
  { to: "/beauty-salon-wayne-nj", label: "Beauty Salon in Wayne, NJ", blurb: "The full SOI menu in one place, at 180 Hamburg Turnpk." },
];

export function LocalServiceLinks({ exclude }: { exclude?: string }) {
  const pages = LOCAL_PAGES.filter((p) => p.to !== exclude);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <SectionHeading
        eyebrow="Explore"
        title="Our Services in Wayne, NJ"
        subtitle="Detailed pricing, what to expect, and client reviews for every service we offer."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {pages.map((p) => (
          <Link
            key={p.to}
            to={p.to as LinkProps["to"]}
            className="glass-panel gold-border rounded-2xl p-5 hover:shadow-lift transition-shadow flex flex-col"
          >
            <h3 className="font-serif text-lg text-gold mb-1 break-words">{p.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.blurb}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
