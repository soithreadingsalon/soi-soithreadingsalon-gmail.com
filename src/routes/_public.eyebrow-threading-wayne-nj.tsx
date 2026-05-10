import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { LANDING_PAGES, SITE_URL } from "@/data/seo-content";

const SLUG = "eyebrow-threading-wayne-nj";
const content = LANDING_PAGES[SLUG];

export const Route = createFileRoute("/_public/eyebrow-threading-wayne-nj")({
  head: () => ({
    meta: [
      { title: 'Eyebrow Threading in Wayne, NJ | SOI Threading Salon' },
      { name: "description", content: 'Get precise eyebrow threading in Wayne, NJ at SOI Threading Salon. Visit us for clean, natural-looking brows and expert threading services.' },
      { property: "og:title", content: 'Eyebrow Threading in Wayne, NJ | SOI Threading Salon' },
      { property: "og:description", content: 'Get precise eyebrow threading in Wayne, NJ at SOI Threading Salon. Visit us for clean, natural-looking brows and expert threading services.' },
      { property: "og:image", content: content.image.startsWith("http") ? content.image : `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Eyebrow Threading in Wayne, NJ | SOI Threading Salon' },
      { name: "twitter:description", content: 'Get precise eyebrow threading in Wayne, NJ at SOI Threading Salon. Visit us for clean, natural-looking brows and expert threading services.' },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
  }),
  component: () => <LandingPage content={content} />,
});
