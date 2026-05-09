# Complete Admin Panel + CMS + Analytics Build

## 1. Admin login

- Update credentials to **`soi` / `Soi@wayne2026`** (replace current `test123/test123` in `src/lib/admin-auth.ts`).
- Keep the existing localStorage-based gate for now (matches your "simple" preference). All admin routes already redirect to `/admin` if unauthenticated.

## 2. Homepage offer carousel (replaces the static "lady face" flyer)

- Add a new `hero_slides` table OR — per your answer — auto-build slides from **active offers that have an `image_url`**. We'll go with the latter: zero extra admin work.
- Build `<OfferCarousel />` on the homepage where the flyer currently sits: auto-rotates every 5s, swipe on mobile, dots + arrows, each slide links to `/offers`.
- In **Admin → Offers**, add an image uploader (Supabase Storage bucket `offer-images`, public). Any active offer with an image automatically appears in the homepage carousel.
- Fallback: if no offers have images, show the current single flyer.

## 3. Time picker on Booking & Contact forms

- Replace the free-text "preferred time" with a **dropdown of 30-min slots** generated from `site_settings` business hours for the chosen day (e.g. Mon–Fri 10:00 AM–7:00 PM).
- Disable already-booked slots by checking `appointments` for that date.
- Apply to both `/booking` and `/contact`.

## 4. Google Calendar sync (one salon calendar)

- Use the **Google Calendar connector** (single connection, OAuth handled for you — you click "Connect" once after deploy).
- New server function `syncAppointmentToCalendar`: when admin marks an appointment as **confirmed**, it creates a Google Calendar event (title = service + customer name, start = preferred date/time, duration 30 min, description = phone + notes). Status changes to **cancelled** delete the event. Store `google_event_id` on the appointment row.
- Add a **"Sync to Calendar"** toggle in Admin → Settings so you can pause it.

## 5. Admin → Dashboard (analytics)

Replace the stub with a real dashboard:

- **KPI cards**: Today's appointments, This week, New inquiries, Revenue this month (sum of service prices for `completed` appointments), Page views (last 7 days).
- **Charts** (recharts, already typical): appointments per day (last 30d), appointments by service category (pie), inquiries vs bookings (conversion), top viewed pages.
- **Recent activity feed**: latest 10 bookings + inquiries combined.

## 6. Admin → Appointments (full workflow)

Currently a stub list. Rebuild as a real management screen:

- Table with filters (status, date range, service, search by name/phone) and sort.
- **Status pipeline** with colored badges: `new` → `confirmed` → `in_progress` → `completed` → (or `cancelled` / `no_show`). Click a badge to advance.
- Detail drawer: full info, edit any field, internal notes, "Send WhatsApp" link (`https://wa.me/...`), "Add to Calendar" (manual sync), delete.
- Calendar/day view toggle so the operator sees today at a glance.
- Real-time updates via Supabase Realtime — multiple operators see status changes instantly with no refresh.

## 7. Admin → Inquiries (full hub)

- Same table pattern: search, filter by read/unread, sort by date.
- Mark read/unread, add internal notes, **"Convert to appointment"** button that pre-fills a booking, reply via WhatsApp/email links.
- Realtime so new inquiries pop in live with a toast + sound.

## 8. Admin → Services CMS

- Inline-editable table grouped by category. Add/edit/delete service, change price, toggle `featured`, drag-to-reorder (`sort_order`).
- "New category" button. Bulk price edit.

## 9. Admin → Offers CMS

- Add/edit/delete offers. Image upload (powers homepage carousel). Toggle active. Set expiry date. Reorder.
- Live preview of how the offer card will look.

## 10. Admin → Gallery CMS

- Upload images to `gallery-images` bucket. Assign category, caption, reorder. Bulk delete.

## 11. Admin → Settings CMS

- Edit everything in `site_settings` (salon info, hours, hero copy, social, QR codes) from one form.
- Upload new logo / hero image. Toggle Calendar sync.

## 12. Traffic analytics (lightweight, in-house)

- New `page_views` table (path, referrer, user_agent, created_at) — no third party, no cookies, GDPR-friendly.
- `<PageTracker />` in `_public.tsx` posts a row to a `/api/public/track` server route on every route change.
- Dashboard reads aggregates (top pages, daily trend) from this table.

## 13. Database changes (one migration)

- `appointments`: add `google_event_id text`, `internal_notes` already exists, ensure `status` allows the new values.
- `offers`: ensure `image_url` writable; create `offer-images` storage bucket (public).
- New `page_views` table + indexes.
- `site_settings`: add `calendar_sync_enabled boolean default true`.
- Storage buckets: `offer-images`, `gallery-images`, `site-assets` (all public read; public write via existing pattern).

## Technical notes

- Stack: TanStack Start server functions for all writes, Supabase Realtime for live admin updates, recharts for graphs, Google Calendar via Lovable's connector gateway (no API key needed from you — you'll get a "Connect Google Calendar" button after deploy).
- Mobile: every admin screen designed mobile-first so you can manage on your phone.
- All existing public routes untouched except homepage (carousel) and booking/contact (time picker).

## What I'll need from you after the build

1. Click **Connect Google Calendar** once when prompted (one-tap OAuth).
2. Upload your offer flyer images in Admin → Offers (existing offers will keep working without images).