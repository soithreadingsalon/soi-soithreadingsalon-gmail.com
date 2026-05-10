## Goals

1. Time slots should auto-load on the booking, contact, AND services-page booking modal — based on business hours from settings.
2. Don't show time slots that are already booked — check both the `appointments` table AND the connected Google Calendar's busy times for the selected date.
3. When a customer submits the Contact Us form, email the full inquiry details to the salon's inbox using the connected Gmail account.

## What's broken today

- **Services page booking modal** (`src/routes/_public.services.tsx`) uses a plain text input for "Preferred Time" — that's why no times load there. The other two pages (`booking`, `contact`) already use `TimeSlotPicker`, but the picker only checks the local `appointments` table, not the Google Calendar. It also silently shows "Loading times…" if `site_settings` returns nothing.
- **No email goes out** when the contact form is submitted. Inquiries land in the DB only.
- **Calendar conflicts** are never consulted — admins can manually block time on Google Calendar but those slots still appear bookable on the site.

## Plan

### 1. Shared time-slot picker now reads calendar busy times

Update `src/components/TimeSlotPicker.tsx`:
- Keep the existing read of `site_settings` business hours and the `appointments` table.
- Additionally call a new server function `getCalendarBusySlots({ date })` that returns busy time labels (e.g. `["10:00 AM", "10:30 AM"]`) for the chosen date.
- Merge `appointments` taken-times + calendar busy times into one disabled set.
- Improve UX: when settings haven't loaded yet show "Loading times…"; when they load but the day is closed, show "Closed on this day — please pick another date."

### 2. New server function: query Google Calendar free/busy

Add to `src/lib/calendar.functions.ts`:
- `getCalendarBusySlots` — `createServerFn({ method: "POST" })` with Zod-validated `{ date: "YYYY-MM-DD" }`.
- Reads `calendar_sync_enabled` + `google_calendar_id` from `site_settings`. If disabled, returns `[]`.
- Calls Google Calendar `freeBusy.query` through the existing connector gateway for the day window in `America/New_York`.
- Converts each busy interval into the same 30-min slot labels the picker uses (reuse `generateSlots` logic or a small helper).
- Returns `{ busy: string[] }`.

This is read-only and safe to call from the public booking forms.

### 3. Wire the picker into the services-page booking modal

In `src/routes/_public.services.tsx`:
- Replace the plain `<input ... placeholder="e.g. 2:00 PM" />` for `preferred_time` with the existing `<TimeSlotPicker date={form.preferred_date} value={form.preferred_time} onChange={...} className="svc-input" />`.
- No business-logic changes beyond that.

### 4. Email inquiries to the salon (Gmail connector)

Set up Gmail-based notifications for the contact form only (per your choice — appointments stay as-is for now):

- Connect the Gmail connector (one-click; reuses your existing Google account).
- New server function `src/lib/inquiries.functions.ts` → `notifyInquiryByEmail({ inquiryId })`:
  - Loads the inquiry row with `supabaseAdmin`.
  - Builds an RFC 2822 message (`To: soithreadingsalon@gmail.com` from settings, `Subject: New inquiry from <name>`, body with name/phone/email/service/preferred date+time/message).
  - Sends via `POST https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send` using `LOVABLE_API_KEY` + `GOOGLE_MAIL_API_KEY`.
- Update `src/routes/_public.contact.tsx`: after the `inquiries.insert` succeeds, call `notifyInquiryByEmail` (fire-and-forget — toast still says "Thank you" even if the email is delayed; errors logged server-side).

Note: emails will come **from your connected Gmail address** straight to the salon inbox. No domain/DNS setup required.

### 5. (Calendar context for #2)

Booking + services-page submissions already insert into `appointments`. Admin "confirm" already syncs to Google Calendar via `syncAppointmentToCalendar`. With #2 in place, both DB-pending appointments and calendar-confirmed events will block their slots correctly going forward.

## Out of scope (intentionally)

- Email notifications for appointments (you chose "Inquiries only for now").
- Admin-side override to manually free a slot (calendar already serves as the source of truth).
- Per-service durations (slots stay 30 min as today).

## Files touched

- `src/components/TimeSlotPicker.tsx` — add calendar busy fetch + better empty/closed state.
- `src/lib/calendar.functions.ts` — add `getCalendarBusySlots`.
- `src/lib/inquiries.functions.ts` — new, sends Gmail.
- `src/routes/_public.services.tsx` — swap text input for `TimeSlotPicker`.
- `src/routes/_public.contact.tsx` — trigger inquiry email after insert.
- Connect the Gmail connector during implementation.
