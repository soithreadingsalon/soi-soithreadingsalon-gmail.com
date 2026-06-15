## Plan: Google Reviews + Social CTAs on Home Page

All changes are on `src/routes/_public.index.tsx` (no backend, no new routes).

### 1. Trust strip under hero CTAs (matches first reference image)

Right under the "Book Appointment / Call Now / Get Directions" row in the hero, add a small block containing:

- A row of 4 small overlapping avatar circles (initials P, S, A, J in pink/purple/amber/emerald) next to:
  - 5 gold stars + **"4.7 ★ · 138+ Google reviews"** — the whole line is a link to the provided Google Reviews URL (opens in new tab).
- A second small row: **"Follow us"** label + two pill buttons:
  - Instagram → `https://www.instagram.com/soithreadingsalon/`
  - Facebook → `https://www.facebook.com/people/SOI-Threading-Salon/61590260705927/`
  - Each opens in a new tab (`target="_blank" rel="noopener noreferrer"`).

Styling reuses existing tokens (`glass-panel`, gold/blush palette) so it matches the salon's gold/cream theme rather than the purple of the reference — the reference is for layout only.

### 2. Reviews carousel section (matches second reference image)

Replace the existing single-Instagram "Follow our journey" section with a new **"Trusted by Thousands Across Wayne, NJ"** section placed after the Loyalty Card:

- Eyebrow: "What Clients Say"
- Title: "Trusted by Thousands Across Wayne, NJ"
- Subtitle: "Real reviews from real clients who keep coming back — and send their friends."
- Stat row: ★★★★★ 4.7  |  Google logo 138+ Google Reviews  |  15+ Years in Wayne, NJ
- Horizontally scrollable strip of ~6 review cards (snap scroll, hidden scrollbar, edge fade masks on left/right). Each card: 5 stars, quote, reviewer name, service · time-ago, "Verified" pill. Reviews are hardcoded from the reference image (Priya M., Sara L., Divya K., Maria G., Jennifer T., plus one more) so we ship real-looking content without a Google API.
- CTA button below: **"Read all 138+ reviews on Google ↗"** linking to the provided Google search URL (new tab).
- A smaller "Follow us on Instagram / Facebook" pill row beneath the CTA so the social links remain near the reviews too.

### 3. Technical notes

- Pure presentational change in one file; no new dependencies.
- New `lucide-react` icons: `Facebook` (Instagram already imported). Google "G" logo rendered as a small inline SVG (multi-color) since lucide has no branded Google mark.
- Carousel = `overflow-x-auto snap-x snap-mandatory` with `scrollbar-hide` utility (already in Tailwind via existing styles; if missing I'll add a tiny inline `style` block to hide the scrollbar).
- All external links: `target="_blank" rel="noopener noreferrer"`.
- No changes to routing, SEO head, or data fetching.
