import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQS, SERVICE_AREAS, SITE_URL } from "@/data/seo-content";

export const Route = createFileRoute("/_public/ai-business-summary")({
  head: () => ({
    meta: [
      { title: "SOI Threading Salon Business Summary | Wayne NJ Beauty Salon" },
      { name: "description", content: "Structured business summary for SOI Threading Salon in Wayne, NJ, including services, pricing, hours, location, and booking information." },
      { property: "og:title", content: "SOI Threading Salon Business Summary | Wayne NJ Beauty Salon" },
      { property: "og:description", content: "Structured business summary for SOI Threading Salon in Wayne, NJ, including services, pricing, hours, location, and booking information." },
      { property: "og:url", content: `${SITE_URL}/ai-business-summary` },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ai-business-summary` }],
  }),
  component: AiBusinessSummary,
});

const SERVICES = [
  ["Eyebrow Threading", "$10"],
  ["Men's Eyebrow Threading", "$11"],
  ["Upper Lip Threading", "$6"],
  ["Chin Threading", "$8"],
  ["Full Face Threading", "$35"],
  ["Full Face with Neck Threading", "$40"],
  ["Mini Facial", "$45"],
  ["Acne Facial", "$65"],
  ["Gold Facial", "$65"],
  ["Oxygen Facial", "$90"],
  ["Full Face Waxing", "$40"],
  ["Brazilian Waxing", "$45"],
  ["Body Waxing", "$180 & up"],
  ["Eyelash Lifting", "$75"],
  ["Eyelash Extension", "$60"],
  ["Simple Henna Tattoo", "$15 & up"],
];

const LINKS: { label: string; to: "/services" | "/eyebrow-threading-wayne-nj" | "/waxing-wayne-nj" | "/facials-wayne-nj" | "/henna-wayne-nj" | "/threading-salon-wayne-nj" | "/beauty-salon-wayne-nj" | "/eyelash-services-wayne-nj" | "/mens-grooming-wayne-nj" | "/offers" | "/contact" | "/booking" }[] = [
  { label: "Services & Pricing", to: "/services" },
  { label: "Eyebrow Threading", to: "/eyebrow-threading-wayne-nj" },
  { label: "Waxing", to: "/waxing-wayne-nj" },
  { label: "Facials", to: "/facials-wayne-nj" },
  { label: "Henna", to: "/henna-wayne-nj" },
  { label: "Threading Salon", to: "/threading-salon-wayne-nj" },
  { label: "Beauty Salon", to: "/beauty-salon-wayne-nj" },
  { label: "Eyelash Services", to: "/eyelash-services-wayne-nj" },
  { label: "Men's Grooming", to: "/mens-grooming-wayne-nj" },
  { label: "Offers", to: "/offers" },
  { label: "Contact", to: "/contact" },
  { label: "Booking", to: "/booking" },
];

function AiBusinessSummary() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${SITE_URL}/#business`,
    name: "SOI Threading Salon",
    url: SITE_URL,
    telephone: "+1-551-301-3894",
    email: "soithreadingsalon@gmail.com",
    priceRange: "$$",
    address: { "@type": "PostalAddress", streetAddress: "180 Hamburg Turnpk", addressLocality: "Wayne", addressRegion: "NJ", postalCode: "07470", addressCountry: "US" },
    sameAs: ["https://www.instagram.com/SOITHREADINGSALON"],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <SectionHeading eyebrow="Business Information" title="SOI Threading Salon — Wayne, NJ" subtitle="A structured summary of our salon, services, hours, and contact details." />

        <div className="glass-panel gold-border rounded-3xl p-6 md:p-10 space-y-6">
          <div>
            <h2 className="font-serif text-2xl mb-2">About</h2>
            <p className="text-muted-foreground leading-relaxed">SOI Threading Salon is a premium beauty salon in Wayne, NJ. We provide expert eyebrow threading, full face threading, waxing, facials, hair care, henna, eyelash lifting, eyelash extensions, and men's grooming services.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Contact</h2>
            <ul className="text-sm space-y-2">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold" /> 180 Hamburg Turnpk, Wayne, NJ 07470</li>
              <li className="flex gap-2"><Phone className="h-4 w-4 text-gold" /> <a href="tel:5513013894" className="hover:text-gold">551-301-3894</a></li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-gold" /> <a href="mailto:soithreadingsalon@gmail.com" className="hover:text-gold break-all">soithreadingsalon@gmail.com</a></li>
              <li className="flex gap-2"><Instagram className="h-4 w-4 text-gold" /> <a href="https://instagram.com/SOITHREADINGSALON" className="hover:text-gold">@SOITHREADINGSALON</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Hours</h2>
            <ul className="text-sm space-y-1">
              <li className="flex gap-2"><Clock className="h-4 w-4 text-gold" /> Monday – Friday: 10:00 AM – 7:00 PM</li>
              <li className="pl-6">Saturday: 10:00 AM – 6:00 PM</li>
              <li className="pl-6">Sunday: 11:00 AM – 4:00 PM</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Services & Pricing</h2>
            <ul className="text-sm divide-y divide-[var(--gold)]/15">
              {SERVICES.map(([n, p]) => (
                <li key={n} className="flex justify-between py-2"><span>{n}</span><span className="text-gold font-semibold">{p}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Service Areas</h2>
            <p className="text-sm text-muted-foreground">{SERVICE_AREAS}</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Booking</h2>
            <p className="text-sm text-muted-foreground">Call <a href="tel:5513013894" className="text-gold font-semibold">551-301-3894</a> or submit an appointment request through the website.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-3">FAQ</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <p className="font-serif text-base">{f.q}</p>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl mb-2">Important Pages</h2>
            <div className="flex flex-wrap gap-2">
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs px-3 py-1.5 rounded-full border border-[var(--gold)]/40 hover:bg-[var(--gold)]/10">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}