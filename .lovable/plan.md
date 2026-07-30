# Improve rankings and links for soithreadingandsalon.com

## Where things stand (from Semrush)

- 36 organic keywords, ~171 visits/mo estimated. Almost all of it is brand traffic ("soi eyebrow", "soi threading", "soi brow"). Non-brand local terms bring in essentially nothing.
- 9 referring domains, and nearly all are spam/PBN sites. Real local citations: close to zero.
- The Wayne NJ landing pages already exist (threading, eyebrow threading, waxing, facials, henna, eyelash, men's grooming, beauty salon) and are in the sitemap, but none of them rank.

So the problem is not "missing pages". It is that the existing pages are thin on local proof, and nothing trustworthy links to the site.

## Part 1: Make the existing local pages actually competitive

Rather than adding new pages, deepen the ones already there. Priority order based on real search demand:

| Page | Target queries | Volume signal |
|---|---|---|
| /eyebrow-threading-wayne-nj | threading salon near me, salon near me for eyebrows, eyebrow stylist near me | 1,000-2,900/mo each, KD 18 for the geo version |
| /threading-salon-wayne-nj | indian salon near me, salons near me for threading | 2,900-4,400/mo |
| /henna-wayne-nj | henna brows near me | 1,900/mo |
| /waxing-wayne-nj, /facials-wayne-nj | service + Wayne/Passaic County terms | lower, but easy |

On each of those pages add:

- A price table for that service (real prices, the ones already on /services).
- "How long it takes / what to expect" section written for a first-time client.
- 3-4 Google reviews specific to that service, pulled from the reviews already loaded on the homepage.
- Nearby-area mentions in the copy: Wayne, Totowa, Pompton Lakes, Haledon, Paterson, Little Falls, Passaic County.
- Photos from the gallery with descriptive alt text.
- A FAQ block with Q&A structured data for questions people actually ask about that service.
- One clear booking action plus the WhatsApp number.

Also: internal-link each service page from the homepage and from /services with descriptive anchor text, and cross-link related pages (threading -> henna brows, waxing -> facials).

## Part 2: Fix the link profile

No code can produce links, but these are the ones that matter for a local salon, in order:

1. Google Business Profile: complete every field, add service list with prices, post weekly, keep asking for reviews. This is the single biggest local ranking factor and it is free.
2. Core citations with identical name/address/phone: Apple Business Connect, Bing Places, Yelp, Nextdoor, Facebook, Instagram bio link, Yellow Pages, Foursquare.
3. Local/community: Wayne Chamber of Commerce, Passaic County business directories, Wayne Patch and TAPinto Wayne business listings, local school or temple sponsorship pages.
4. Niche directories: StyleSeat, Booksy, Vagaro, Fresha, Thumbtack, and Indian/South Asian community directories in North Jersey.
5. Ignore the PBN links already pointing at the site. They are not helping, and disavowing is not worth the effort at this volume.

I will build a `/locations` style hub or a printable citation checklist page only if you want it; the list above is something you or a staff member works through.

## Part 3: Verify

- Run a fresh SEO scan after the page changes ship, and confirm no new technical findings.
- Re-check rankings for the target local terms in about 4-6 weeks with Semrush.

## Technical notes

- Page content lives in `src/data/seo-content.ts` (`LANDING_PAGES`) and renders through `src/components/LandingPage.tsx`. The richer sections (price table, FAQ, service-specific reviews, area list) require extending the content shape and the `LandingPage` component, then filling in per-page data.
- FAQ structured data goes in each route's `head()` as JSON-LD, alongside the existing meta tags.
- Google review data is already fetched by `src/lib/reviews.functions.ts`; service pages can reuse it rather than hardcoding.
- `public/sitemap.xml` needs updated `lastmod` values once pages change.

## Scope check

Part 1 is the build work. Part 2 is off-platform and yours to execute. Tell me if you want me to start with the two highest-value pages (eyebrow threading and threading salon) rather than all eight at once.