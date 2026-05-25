import { Link } from "@tanstack/react-router";
import { Phone, ArrowRight, Calendar, Sparkles, MapPin, Clock } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQS, SERVICE_AREAS, SITE_URL, type LandingContent } from "@/data/seo-content";

export function LandingPage({ content }: { content: LandingContent }) {
  const url = `${SITE_URL}/${content.slug}`;
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: content.serviceName,
    name: content.h1,
    description: content.description,
    url,
    areaServed: ["Wayne NJ","Totowa NJ","Little Falls NJ","Woodland Park NJ","Paterson NJ","Haledon NJ","North Haledon NJ","Pompton Lakes NJ","Clifton NJ","Passaic County NJ"],
    provider: {
      "@type": "BeautySalon",
      name: "SOI Threading Salon",
      telephone: "+1-551-301-3894",
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "180 Hamburg Turnpk",
        addressLocality: "Wayne",
        addressRegion: "NJ",
        postalCode: "07470",
        addressCountry: "US",
      },
    },
    offers: content.pricing.map((p) => ({ "@type": "Offer", name: p.label, price: p.price.replace(/[^\d.]/g, "") || undefined, priceCurrency: "USD" })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--ivory)] via-[var(--champagne)] to-[var(--blush)]/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <p className="font-script text-2xl md:text-3xl text-gold mb-2">SOI Threading Salon · Wayne, NJ</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05]">{content.h1}</h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">{content.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold">
                <Calendar className="h-4 w-4" /> Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:5513013894" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/5">
                <Phone className="h-4 w-4" /> Call 551-301-3894
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] overflow-hidden gold-border shadow-lift p-1">
            <img src={content.image} alt={content.alt} loading="eager" width={1280} height={896} className="w-full h-[320px] md:h-[460px] object-cover rounded-[2rem]" />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="prose prose-lg max-w-none">
          {content.paragraphs.map((p, i) => (
            <p key={i} className="text-foreground/85 leading-relaxed mb-5 text-base md:text-lg">{p}</p>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <SectionHeading eyebrow="Pricing" title={`${content.serviceName} Pricing`} subtitle="Transparent, salon-confirmed pricing. Some services start at the listed price." />
        <div className="glass-panel gold-border rounded-3xl p-6 md:p-10">
          <ul className="divide-y divide-[var(--gold)]/20">
            {content.pricing.map((p) => (
              <li key={p.label} className="flex items-baseline justify-between py-3">
                <span className="font-serif text-lg">{p.label}</span>
                <span className="font-serif text-xl text-gold">{p.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/services" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold">View Full Menu</Link>
            <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold btn-gold">Book Now <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="rounded-3xl gradient-cream gold-border p-8 md:p-10 text-center">
          <Sparkles className="h-7 w-7 text-gold mx-auto mb-3" />
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Serving Wayne, NJ and Nearby Communities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{SERVICE_AREAS}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Quick answers about our salon and services." />
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="glass-panel gold-border rounded-2xl p-5">
              <summary className="font-serif text-lg cursor-pointer text-foreground">{f.q}</summary>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="rounded-[2rem] gradient-cream gold-border shadow-lift p-8 md:p-12 text-center relative overflow-hidden">
          <h2 className="font-serif text-3xl md:text-5xl mb-3">Ready to visit SOI Threading Salon?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">180 Hamburg Turnpk, Wayne, NJ 07470 · Call 551-301-3894 · Open 7 days a week.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold"><Calendar className="h-4 w-4" /> Book Appointment</Link>
            <a href="tel:5513013894" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold"><Phone className="h-4 w-4" /> Call Now</a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold"><MapPin className="h-4 w-4" /> Contact Us</Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground inline-flex items-center gap-2"><Clock className="h-3 w-3" /> Mon–Fri 10am–7pm · Sat 10am–6pm · Sun 11am–4pm</p>
        </div>
      </section>
    </>
  );
}