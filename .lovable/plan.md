## Goals

1. **Consistent logo** across the site (header + footer use the same `Logo` component, same proportions, no inverted/recolored variant).
2. **Remove the static offer flyer image** (`src/assets/offer-flyer.png`) wherever it appears, and let the dynamic offers (managed from the admin panel) drive the homepage and Offers page presentation instead.
3. **Remove the Instagram and Google Maps QR codes** from the footer.

No backend, routing, or admin changes — purely presentation.

---

## Changes

### 1. Footer (`src/components/Footer.tsx`)
- Drop the two QR images and their imports (`qrInsta`, `qrGoogle`) and the wrapper div that holds them.
- Replace the `invert` styling on the footer logo with the regular `Logo` so it matches the header exactly. To keep it readable on the dark footer, place it inside a small soft-background pill (rounded container with subtle ivory/champagne background) so the same gold logo reads cleanly without filter hacks.
- Keep all text links and contact info.

### 2. Logo component (`src/components/Logo.tsx`)
- Remove the `invert` prop entirely (no longer needed once footer uses the standard logo). Single source of truth for sizing/spacing so header and footer render identically.

### 3. Offers page (`src/routes/_public.offers.tsx`)
- Remove the `import offerFlyer from "@/assets/offer-flyer.png"` and the `<img src={offerFlyer} … />` block.
- Replace it with a smarter, dynamic hero strip that uses the **first active offer with an image** as a featured banner (falls back gracefully to a styled headline card if no offer has an image yet). This keeps the visual richness without hard-coding outdated discounts.

### 4. Homepage offers section (`src/routes/_public.index.tsx` + `src/components/OfferCarousel.tsx`)
- In `OfferCarousel`, remove the `offerFlyerFallback` import and the static-image fallback branch. If there are no active offers with images, render nothing (the homepage already conditionally hides the whole "Current Offers" section when `offers.length === 0`, and the small coupon cards under the carousel still display when offers exist without images).
- Make the carousel render even when offers don't have images by showing a stylized gradient slide with the discount/title/description (so the section still looks finished while the admin uploads flyers).

### 5. Cleanup
- Delete `src/assets/offer-flyer.png` (no longer referenced).

---

## Files touched

- `src/components/Footer.tsx` — remove QRs, normalize logo
- `src/components/Logo.tsx` — remove `invert` prop
- `src/components/OfferCarousel.tsx` — remove static fallback, add styled no-image slide
- `src/routes/_public.offers.tsx` — remove flyer image, add dynamic featured banner
- `src/routes/_public.index.tsx` — no logic change (carousel already handles empty state)
- `src/assets/offer-flyer.png` — delete

No DB, no auth, no admin route changes.
