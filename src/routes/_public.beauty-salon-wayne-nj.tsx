import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { LANDING_PAGES, SITE_URL } from "@/data/seo-content";

const SLUG = "beauty-salon-wayne-nj";
const content = LANDING_PAGES[SLUG];

export const Route = createFileRoute("/_public/beauty-salon-wayne-nj")({
  head: () => ({
    meta: [
      { title: 'Beauty Salon in Wayne, NJ | SOI Threading Salon' },
      { name: "description", content: "SOI Threading Salon is a premium beauty salon in Wayne, NJ offering threading, waxing, facials, henna, hair care, eyelash services, and men's grooming." },
      { property: "og:title", content: 'Beauty Salon in Wayne, NJ | SOI Threading Salon' },
      { property: "og:description", content: "SOI Threading Salon is a premium beauty salon in Wayne, NJ offering threading, waxing, facials, henna, hair care, eyelash services, and men's grooming." },
      { property: "og:image", content: content.image.startsWith("http") ? content.image : `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Beauty Salon in Wayne, NJ | SOI Threading Salon' },
      { name: "twitter:description", content: "SOI Threading Salon is a premium beauty salon in Wayne, NJ offering threading, waxing, facials, henna, hair care, eyelash services, and men's grooming." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
  }),
  component: () => <LandingPage content={content} />,
});
