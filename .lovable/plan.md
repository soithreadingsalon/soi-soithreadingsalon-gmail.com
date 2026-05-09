
## Goal

Make the SOI Threading Salon site fully reflect the uploaded brand assets (menu PDF, offer flyer, visiting card, QR codes), fix branding, tighten spacing, and verify mobile layout end-to-end.

## 1. Branding cleanup

- Remove the "Premium Threading & Beauty Care" / "Premium Beauty Care" tagline that appears beneath "Style of India" (logo lockup area on home + footer).
- Keep the lockup as: SOI THREADING SALON  →  *Style of India*  (italic gold), nothing else.
- Replace the placeholder hero subheadline with the official line from the menu: *"Experience expert care and timeless beauty with our premium threading, waxing, facials, hair care, henna and more."*
- Add a small chip under the logo: `THREADING • WAXING • FACIALS • HAIR CARE • HENNA` (from menu cover).

## 2. Seed services from menu PDF (replace existing prices)

Wipe `services` table and re-seed with the exact menu, organized by the existing 6 categories. Prices below are taken verbatim from the PDF.

**Threading**: Eyebrow $10 · Upper Lip $6 · Chin $8 · Cheeks $8 · Forehead $8 · Sideburns $12 · Full Face $35 · Full Face with Neck $40

**Waxing**: Full Face $40 · Full Hand $30 · Full Leg $45 · Upper Leg $35 · Lower Leg $30 · Under Arms $15 · Bikini Line $20 · Brazilian $45 · Full Back $40 · Full Stomach $40 · Full Body Wax $180 & up

**Facials**: Mini Facial $45 · Teenage Facial $55 · Acne Facial $65 · Gold Facial $65 · Casmara Gold $75 · Oxygen Facial $90 · Shiner $20

**Hair Care**: Scalp Oil Massage $35 · Henna Hair Dye $30 & up · Eyelash Lifting $75 · Eyelash Extension $60

**Henna**: Simple Tattoo $15 & up

**Men**: Eyebrow $11 · Nose Hair Removal $15 · Blackhead Removal $15 · Ear Wax $15 · Back Wax $45 & up · Chest Wax $45 & up

Mark a small set as `featured` for the homepage highlights (Eyebrow Threading, Gold Facial, Full Leg Waxing, Eyelash Extension).

## 3. Replace offers with the flyer's 4 promos

Reset `offers` and seed:
- $10 OFF – Facial
- $10 OFF – Wax
- $5 OFF – Hot Oil Hair Massage
- $2 OFF – Eyebrow & Lip

Add the flyer image as the top banner of `/offers` and as a teaser card on the homepage.

## 4. QR codes & visiting-card content

- Copy `user-uploads://Insta.jpeg` → `src/assets/qr-instagram.jpg` and `user-uploads://Google_address.png` → `src/assets/qr-google.jpg`.
- Show both QR codes on `/contact` (with captions "Follow @soithreadingsalon" and "Find us on Google Maps") and in the footer on desktop.
- Add the loyalty line from the visiting card to the footer / offers page: *"Complete 9 eyebrow visits, get the 10th FREE."*

## 5. Asset import + flyer

- Copy `user-uploads://Offer.png` → `src/assets/offer-flyer.jpg` and use it as the banner on `/offers`.
- Keep the existing logo (already replaced earlier).

## 6. Spacing & alignment audit

Across `_public.index`, `_public.services`, `_public.offers`, `_public.about`, `_public.gallery`, `_public.contact`, `Header`, `Footer`:
- Reduce vertical section padding (`py-24/py-20` → `py-12 md:py-16`).
- Reduce hero top padding so content sits closer to the header.
- Tighten card gaps (`gap-8` → `gap-4 md:gap-6`).
- Remove empty wrapper divs that add stray margin.
- Standardize container to `max-w-6xl mx-auto px-4 md:px-6`.

## 7. Mobile responsiveness pass

- Header: hamburger menu under `md`; ensure logo scales (`h-10 md:h-14`).
- Services page: collapse sticky sidebar into the existing bottom selection bar at `<lg`; make category tabs horizontally scrollable.
- Offers grid: 1 col mobile, 2 col tablet, 4 col desktop.
- Footer: stack columns on mobile, center QR codes.
- Contact: map + form stack vertically under `md`.
- Tap targets ≥ 44px; test at 375px, 768px, 1024px.

## 8. Verification

After edits, visually QA `/`, `/services`, `/offers`, `/contact` at 375px and 1024px viewports and confirm:
- "Premium Beauty Care" no longer appears anywhere.
- All menu prices match the PDF.
- 4 offer cards render with correct discounts.
- QR codes load on `/contact`.
- No oversized whitespace between sections.

## Technical notes

- Services + offers reseed via a single SQL migration (DELETE + INSERT) — no schema change needed (tables already match).
- QR / flyer images imported as ES6 modules from `src/assets`.
- No new routes or dependencies.
