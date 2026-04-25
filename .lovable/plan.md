## 1. Replace the SOI logo

- Copy the new uploaded logo (`user-uploads://Website_Logo.png`) into `src/assets/soi-logo.png`, **overwriting** the existing logo file.
- Because `src/components/Logo.tsx` already imports `@/assets/soi-logo.png`, the new artwork will automatically appear in the header, footer, hero, and any other place the `Logo` component is used — no code changes needed.
- The new image is wide (landscape, with cream background and decorative gold border). To keep it looking clean inside the header (currently `h-12`), I'll:
  - Keep the existing `Logo` component API but tighten how it renders so the cream/border background doesn't clash with dark sections.
  - Add an option (or use `object-contain`) so it scales nicely without distortion in header, hero, and footer.

## 2. Add "Select services & book" functionality on the Services page

Update `src/routes/_public.services.tsx` so customers can:

1. **Browse / review prices only** (current behavior preserved — search, category filter, sort).
2. **Select one or more services** by clicking an "Add" button on each service card. Selected cards get a gold highlight + checkmark, and the button toggles to "Remove".
3. **See a live "Selection Summary"** that:
   - Shows the list of selected services with their prices.
   - Shows the running **total estimated price** (using the existing `priceNumber` parser — flagged as "estimate" since some prices use "& up").
   - Has a **"Clear all"** button.
   - Has a **"Book These Services"** primary CTA.
4. **Book directly from the same page** via a modal/drawer (using existing shadcn `Dialog`) that contains a compact booking form:
   - Pre-fills the chosen services into a single field (comma-separated) and shows them as read-only chips at the top of the form.
   - Asks for: Full Name *, Phone *, Email, Preferred Date, Preferred Time, Notes.
   - Submits to the existing `appointments` Supabase table. The selected services are saved into the existing `service` column as a comma-separated string, and the categories into `service_category` (deduped), so no schema change is required.
   - On success: shows a confirmation toast, closes the modal, clears the selection, and shows the same "Thank you" confirmation pattern already used on `_public.booking.tsx`.

### UX details

- A **sticky bottom bar** appears on mobile when at least one service is selected, showing `N services • $X total` and a "Book" button — so customers don't lose track of their cart while scrolling.
- On desktop (lg+), the selection summary shows as a sticky right-side panel for easy review.
- If the user just wants to compare prices, they simply don't click "Add" — nothing changes from today's experience.
- Empty state: when nothing is selected, no summary bar/panel is shown.

### Files touched

- `src/assets/soi-logo.png` — replaced with new uploaded logo
- `src/components/Logo.tsx` — minor styling tweak (`object-contain`) for safety with new aspect ratio
- `src/routes/_public.services.tsx` — add selection state, selection summary panel, sticky mobile bar, and inline booking dialog wired to the `appointments` table

No database migrations needed — reusing the existing `appointments` table.
