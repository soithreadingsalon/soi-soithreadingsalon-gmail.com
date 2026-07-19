# Complete Google Search Console Setup

Your site is already verified and the sitemap is submitted. These are the remaining steps you do inside Google Search Console (https://search.google.com/search-console) to fully activate it.

## 1. Confirm properties
- Open Search Console and confirm both properties are listed:
  - `https://soithreadingandsalon.com`
  - `https://www.soithreadingandsalon.com`
- Set the apex (`https://soithreadingandsalon.com`) as your working property.

## 2. Verify sitemap is processed
- Go to **Indexing → Sitemaps**.
- Confirm `sitemap.xml` shows status **Success** (may take a few hours after submission).
- If it says "Couldn't fetch," click the row and re-submit.

## 3. Request indexing for key pages
- Use the **URL Inspection** tool (top search bar) for each priority URL:
  - `/`
  - `/services`
  - `/booking`
  - `/contact`
  - `/eyebrow-threading-wayne-nj`
  - `/waxing-wayne-nj`
  - `/facials-wayne-nj`
- For each: paste URL → **Request Indexing**.

## 4. Set international targeting & preferred domain
- **Settings → Ownership verification**: confirm META tag is green.
- Google no longer has a "preferred domain" setting; instead ensure the `www` version redirects to apex (already handled by hosting).

## 5. Link Google Business Profile & Analytics (optional but recommended)
- **Settings → Associations**: link your Google Business Profile ("SOI Threading Salon") so local search data flows in.
- Link Google Analytics 4 if/when set up.

## 6. Enable email alerts
- **Settings → Users and permissions**: confirm your email is Owner.
- **Settings → Preferences**: enable email notifications for coverage issues and manual actions.

## 7. Monitor after 3–7 days
- **Performance** report: check impressions/clicks for target keywords (threading, waxing, facials Wayne NJ).
- **Pages** report: confirm all 16 sitemap URLs are indexed. Fix any listed under "Not indexed."
- **Enhancements**: check FAQ and LocalBusiness structured data are detected without errors.

## Notes
- Nothing in the codebase needs to change for these steps — verification tag, sitemap, robots.txt, and structured data are already in place.
- Initial indexing typically takes 3–14 days. Request-indexing speeds up priority pages but isn't a guarantee.
