import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-20">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-8xl text-gold">404</h1>
        <h2 className="mt-4 text-2xl font-serif text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold btn-gold"
          >
            Return Home
          </Link>
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
      { title: "SOI Threading Salon | Threading, Waxing, Facials & Beauty Care in Wayne, NJ" },
      { name: "description", content: "Visit SOI Threading Salon in Wayne, NJ for expert threading, facials, waxing, hair care, henna, and premium beauty services. Call 551-301-3894 to book your appointment." },
      { name: "author", content: "SOI Threading Salon" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "SOI Threading Salon | Threading, Waxing, Facials & Beauty Care in Wayne, NJ" },
      { name: "twitter:title", content: "SOI Threading Salon | Threading, Waxing, Facials & Beauty Care in Wayne, NJ" },
      { property: "og:description", content: "Visit SOI Threading Salon in Wayne, NJ for expert threading, facials, waxing, hair care, henna, and premium beauty services. Call 551-301-3894 to book your appointment." },
      { name: "twitter:description", content: "Visit SOI Threading Salon in Wayne, NJ for expert threading, facials, waxing, hair care, henna, and premium beauty services. Call 551-301-3894 to book your appointment." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/10eaf844-a35b-4b2e-827d-801a0f2c4cbc" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/10eaf844-a35b-4b2e-827d-801a0f2c4cbc" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: "SOI Threading Salon",
          image: "https://www.soithreadingandsalon.com/og.jpg",
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
          openingHours: ["Mo-Fr 10:00-19:00", "Sa 10:00-18:00", "Su 11:00-16:00"],
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
