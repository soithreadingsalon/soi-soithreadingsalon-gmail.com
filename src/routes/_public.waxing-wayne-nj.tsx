import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { LANDING_PAGES, SITE_URL } from "@/data/seo-content";

const SLUG = "waxing-wayne-nj";
const content = LANDING_PAGES[SLUG];

export const Route = createFileRoute("/_public/waxing-wayne-nj")({
  head: () => ({
    meta: [
      { title: 'Waxing Services in Wayne, NJ | SOI Threading Salon' },
      { name: "description", content: 'SOI Threading Salon offers full face, leg, underarms, bikini, Brazilian, back, stomach, and body waxing in Wayne, NJ.' },
      { property: "og:title", content: 'Waxing Services in Wayne, NJ | SOI Threading Salon' },
      { property: "og:description", content: 'SOI Threading Salon offers full face, leg, underarms, bikini, Brazilian, back, stomach, and body waxing in Wayne, NJ.' },
      { property: "og:image", content: content.image.startsWith("http") ? content.image : `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Waxing Services in Wayne, NJ | SOI Threading Salon' },
      { name: "twitter:description", content: 'SOI Threading Salon offers full face, leg, underarms, bikini, Brazilian, back, stomach, and body waxing in Wayne, NJ.' },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
  }),
  component: () => <LandingPage content={content} />,
});
