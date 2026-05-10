import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";
import { LANDING_PAGES, SITE_URL } from "@/data/seo-content";

const SLUG = "eyelash-services-wayne-nj";
const content = LANDING_PAGES[SLUG];

export const Route = createFileRoute("/_public/eyelash-services-wayne-nj")({
  head: () => ({
    meta: [
      { title: 'Eyelash Lifting & Extensions in Wayne, NJ | SOI Threading Salon' },
      { name: "description", content: 'Visit SOI Threading Salon in Wayne, NJ for eyelash lifting, eyelash extensions, threading, facials, waxing, and complete beauty care.' },
      { property: "og:title", content: 'Eyelash Lifting & Extensions in Wayne, NJ | SOI Threading Salon' },
      { property: "og:description", content: 'Visit SOI Threading Salon in Wayne, NJ for eyelash lifting, eyelash extensions, threading, facials, waxing, and complete beauty care.' },
      { property: "og:image", content: content.image.startsWith("http") ? content.image : `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: `${SITE_URL}/${SLUG}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Eyelash Lifting & Extensions in Wayne, NJ | SOI Threading Salon' },
      { name: "twitter:description", content: 'Visit SOI Threading Salon in Wayne, NJ for eyelash lifting, eyelash extensions, threading, facials, waxing, and complete beauty care.' },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/${SLUG}` }],
  }),
  component: () => <LandingPage content={content} />,
});
