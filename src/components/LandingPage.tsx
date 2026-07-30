import { Link, type LinkProps } from "@tanstack/react-router";
import { Phone, ArrowRight, Calendar, Sparkles, MapPin, Clock, Star, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { reviewsMatching } from "@/data/reviews-data";
import { FAQS, LANDING_EXTRAS, SERVICE_AREAS, SITE_URL, type LandingContent } from "@/data/seo-content";

const GOOGLE_REVIEWS_URL =
  "https://search.google.com/local/reviews?placeid=ChIJFWU6oxf9wokRmpTavWu8g9s";

export function LandingPage({ content }: { content: LandingContent }) {
  const url = `${SITE_URL}/${content.slug}`;
  const extras = LANDING_EXTRAS[content.slug];
  const pageFaqs = [...(content.faqs ?? []), ...(extras?.faqs ?? [])];
  const allFaqs = [...pageFaqs, ...FAQS];
  const pageReviews = extras ? reviewsMatching(extras.reviewKeywords, 3) : [];
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
      telephone: "+1-973-321-8374",
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
    mainEntity: allFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
              <a href="tel:9733218374" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold hover:bg-[var(--gold)]/5">
                <Phone className="h-4 w-4" /> Call (973) 321-8374
              </a>
              <WhatsAppButton className="px-7 py-3.5 text-sm" label="WhatsApp 551-301-3894" />
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

      {/* WHAT TO EXPECT */}
      {extras && extras.expect.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <SectionHeading
            eyebrow="What to Expect"
            title={`Your ${content.serviceName} Visit, Step by Step`}
            subtitle="Written for first-time clients so you know exactly how the appointment goes."
          />
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {extras.expect.map((s) => (
              <div key={s.title} className="glass-panel gold-border rounded-2xl p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            <WhatsAppButton className="px-5 py-2.5 text-xs" label="Ask on WhatsApp" />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {pageReviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <SectionHeading
            eyebrow="Client Reviews"
            title={`What Wayne Clients Say About Our ${content.serviceName}`}
            subtitle="Rated 5.0 across 50+ Google reviews."
          />
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {pageReviews.map((r) => (
              <figure key={r.name} className="glass-panel gold-border rounded-2xl p-5 flex flex-col">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground/85 leading-relaxed break-words flex-1">{r.text}</blockquote>
                <figcaption className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{r.name}</span> · {r.service}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-[var(--gold)] text-gold"
            >
              Read all reviews on Google <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      )}

      {/* RELATED SERVICES */}
      {extras && extras.related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <SectionHeading eyebrow="Also at SOI" title="Related Services in Wayne, NJ" subtitle="Add to your visit or explore the rest of the menu." />
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {extras.related.map((r) => (
              <Link
                key={r.to}
                to={r.to as LinkProps["to"]}
                className="glass-panel gold-border rounded-2xl p-5 hover:shadow-lift transition-shadow"
              >
                <h3 className="font-serif text-lg text-gold mb-1">{r.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
          {allFaqs.map((f) => (
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
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">180 Hamburg Turnpk, Wayne, NJ 07470 · Call (973) 321-8374 or 551-301-3894 · Open 7 days a week.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold btn-gold"><Calendar className="h-4 w-4" /> Book Appointment</Link>
            <a href="tel:9733218374" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold"><Phone className="h-4 w-4" /> Call Now</a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border border-[var(--gold)] text-gold"><MapPin className="h-4 w-4" /> Contact Us</Link>
            <WhatsAppButton className="px-7 py-3.5 text-sm" label="WhatsApp Us" />
          </div>
          <p className="mt-5 text-xs text-muted-foreground inline-flex items-center gap-2"><Clock className="h-3 w-3" /> Mon–Fri 10am–7pm · Sat 10am–6pm · Sun Closed</p>
        </div>
      </section>
    </>
  );
}