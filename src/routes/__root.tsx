import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-md text-center">
        <img src="/logo.png" alt="SOI Threading Salon logo" className="h-16 w-auto mx-auto mb-6 opacity-90" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
        <h1 className="font-serif text-8xl text-gold">404</h1>
        <h2 className="mt-4 text-2xl font-serif text-foreground">This page could not be found.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Try one of these instead.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-gold">Return Home</Link>
          <Link to="/services" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-[var(--gold)] text-gold">View Services</Link>
          <Link to="/booking" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border border-[var(--gold)] text-gold">Book Appointment</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SOI Threading Salon | Eyebrow Threading, Waxing, Facials & Beauty Salon in Wayne, NJ" },
      { name: "description", content: "Visit SOI Threading Salon in Wayne, NJ for expert eyebrow threading, waxing, facials, hair care, henna, eyelash services, and premium beauty care. Call 551-301-3894 to book your appointment." },
      { name: "keywords", content: "SOI Threading Salon, threading salon Wayne NJ, eyebrow threading Wayne NJ, eyebrow salon Wayne NJ, waxing salon Wayne NJ, facial salon Wayne NJ, beauty salon Wayne NJ, henna Wayne NJ, eyelash lifting Wayne NJ, Indian beauty salon Wayne NJ, hair care Wayne NJ, men eyebrow threading Wayne NJ, full face threading Wayne NJ, Brazilian waxing Wayne NJ, beauty services Wayne NJ" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: "SOI Threading Salon" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SOI Threading Salon" },
      { property: "og:url", content: "https://www.soithreadingandsalon.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "SOI Threading Salon | Premium Beauty Salon in Wayne, NJ" },
      { name: "twitter:title", content: "SOI Threading Salon | Threading, Waxing, Facials & Beauty Care" },
      { property: "og:description", content: "Expert eyebrow threading, waxing, facials, hair care, henna, and premium beauty care in Wayne, NJ." },
      { name: "twitter:description", content: "Premium threading, waxing, facials, henna, hair care, and beauty services in Wayne, NJ." },
      { property: "og:image", content: "https://www.soithreadingandsalon.com/og-image.jpg" },
      { name: "twitter:image", content: "https://www.soithreadingandsalon.com/og-image.jpg" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://www.soithreadingandsalon.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          "@id": "https://www.soithreadingandsalon.com/#business",
          name: "SOI Threading Salon",
          alternateName: "SOI Threading Salon - Style of India",
          description: "SOI Threading Salon is a premium beauty salon in Wayne, NJ offering eyebrow threading, waxing, facials, hair care, henna, eyelash services, and men's grooming.",
          image: "https://www.soithreadingandsalon.com/og-image.jpg",
          logo: "https://www.soithreadingandsalon.com/logo.png",
          telephone: "+1-551-301-3894",
          email: "soithreadingsalon@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "190 Hamburg Tpke",
            addressLocality: "Wayne",
            addressRegion: "NJ",
            postalCode: "07470",
            addressCountry: "US",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "10:00", closes: "19:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "11:00", closes: "16:00" },
          ],
          areaServed: ["Wayne NJ","Totowa NJ","Little Falls NJ","Woodland Park NJ","Paterson NJ","Haledon NJ","North Haledon NJ","Pompton Lakes NJ","Fairfield NJ","Clifton NJ","Lincoln Park NJ","Pompton Plains NJ","Franklin Lakes NJ","Oakland NJ","Passaic County NJ"],
          sameAs: ["https://www.instagram.com/SOITHREADINGSALON"],
          makesOffer: [
            { "@type": "Offer", name: "Eyebrow Threading", price: "10", priceCurrency: "USD", description: "Expert eyebrow threading service in Wayne, NJ." },
            { "@type": "Offer", name: "Full Face Threading", price: "35", priceCurrency: "USD", description: "Full face threading service at SOI Threading Salon." },
            { "@type": "Offer", name: "Mini Facial", price: "45", priceCurrency: "USD", description: "Mini facial service in Wayne, NJ." },
            { "@type": "Offer", name: "Body Wax", price: "180", priceCurrency: "USD", description: "Body waxing service starting at $180." },
          ],
          url: "https://www.soithreadingandsalon.com",
          priceRange: "$$",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  );
}
