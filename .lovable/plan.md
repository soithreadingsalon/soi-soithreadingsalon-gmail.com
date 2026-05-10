## Problem

`TimeSlotPicker` shows "Loading times…" and never renders slots. That branch only runs when the `site_settings` fetch hasn't resolved, so either the fetch is failing silently or the component never re-renders.

Verified working independently:
- `freeBusy` Google Calendar call returns 200 with `{ calendars.primary.busy: [] }` — so the calendar busy logic itself is healthy.
- Connector credentials verify OK.
- `site_settings` row exists (id=1) and has public read RLS, but no error logging is in place to confirm the client read.

## Fix

### 1. `src/components/TimeSlotPicker.tsx`
- Add error handling to both supabase queries; surface errors to console and to a small inline error state instead of silently leaving `settings === null`.
- Replace the silent `.then(({ data }) => …)` with `.then(({ data, error }) => …)` and log on error.
- Add an explicit "Times unavailable — please call us" fallback so the UI never gets stuck.
- Make the calendar-busy effect also log errors (currently swallowed by `.catch(() => …)`).
- Guard against settings columns being null with safe defaults (fall back to defaults from the table if any column is missing).

### 2. `src/lib/calendar.functions.ts`
- Wrap the freeBusy fetch in try/catch and always return `{ busy: [] }` on failure (already mostly there, but also catch network errors). Add `console.log` of the request/response for diagnostics.
- Use proper ET offset handling: `-05:00` is wrong half the year (DST). Use a date built from the local date string + Intl, or simply pass `timeZone` and use `00:00:00` with no offset and let Google interpret. Fix to use `-04:00` during DST (May = EDT). Best: compute offset using `Intl.DateTimeFormat` with `timeZoneName: 'shortOffset'`.

### 3. Verify end-to-end
- After the fix, open the booking dialog on `/services`, select a date, and confirm the dropdown lists 30-min slots and disables booked ones.
- Same on `/_public.contact` and `/_public.booking`.
- Test with a date that has a Google Calendar event to confirm those slots show "— booked".

## Out of scope
- No changes to email notifications, appointment writes, or admin UI.
- No layout/styling changes beyond the small inline error fallback.
