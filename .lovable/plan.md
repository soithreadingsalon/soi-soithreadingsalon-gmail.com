## Booking form: stricter validation + future-only date/time

### Changes to `src/routes/_public.booking.tsx`
- Make **Email** required (add `required`, update label to `Email *`, update Zod schema to require a valid email — remove the `.optional()/literal("")` branch).
- Make **Service Category** required (add `required` on the `<select>`, label `Service Category *`, Zod: non-empty string).
- Update the `submit` handler to send `email` as a plain string (no `|| null`) and `service_category` as a string.
- Restrict **Preferred Date** input to today or later via `min={todayISO}` on the `<input type="date">`.

### Changes to `src/components/TimeSlotPicker.tsx` (and/or `src/lib/time-slots.ts`)
- When the selected date is **today**, filter out any slot whose time has already passed (compare against `new Date()` in local time).
- When the selected date is in the **past**, show no slots (the date input will already block this, but guard anyway).
- Future dates: unchanged behavior.

### Server-side validation (`src/lib/booking.functions.ts`)
- Tighten the `inputValidator` Zod schema to match: `email` required + valid, `service_category` required non-empty. This keeps the API consistent with the form so direct POSTs can't bypass the new rules.

### Out of scope
- No DB schema change. `appointments.email` and `service_category` remain nullable in the DB (existing rows keep working); only new submissions through the form/API are required to include them.
- Admin UI (`/soi/appointments`) is unchanged.

### Notes
- "Future only" for time uses the visitor's local clock — same basis the picker already uses to render slots.
- I'll read `TimeSlotPicker.tsx`, `src/lib/time-slots.ts`, and `src/lib/booking.functions.ts` before editing to match existing patterns.
