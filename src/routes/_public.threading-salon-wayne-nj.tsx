import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { LANDING_PAGES, SITE_URL } from "@/data/seo-content";

const SLUG = "threading-salon-wayne-nj";
const content = LANDING_PAGES[SLUG];

export const Route = createFileRoute("/_public/threading-salon-wayne-nj")({
  head: () => ({
    meta: [
      { title: 'Threading Salon in Wayne, NJ | SOI Threading Salon' },
      { name: "description", content: 'SOI Threading Salon offers expert threading in Wayne, NJ, eyebrow, upper lip, chin, sideburns, full face, and full face with neck.' },
      { property: "og:title", content: 'Threading Salon in Wayne, NJ | SOI Threading Salon' },
      { property: "og:description", content: 'SOI Threading Salon offers expert threading in Wayne, NJ, eyebrow, upper lip, chin, sideburns, full face, and full face with neck.' },
      { property: "og:image", content: content.image.startsWith("http") ? content.image : `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Threading Salon in Wayne, NJ | SOI Threading Salon' },
      { name: "twitter:description", content: 'SOI Threading Salon offers expert threading in Wayne, NJ, eyebrow, upper lip, chin, sideburns, full face, and full face with neck.' },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
  }),
  component: () => <LandingPage content={content} />,
});
