## Why POS isn't receiving bookings

The server-side push code (`src/lib/booking.functions.ts → pushToPos`) is already wired into the booking flow. It exits silently when either `BOOKING_INTEGRATION_SECRET` or `POS_WEBHOOK_URL` is missing — and neither has actually been saved yet (verified: only Google connector secrets + `LOVABLE_API_KEY` exist). That's the only thing blocking delivery.

## Plan

Add two backend secrets — no code changes needed:

| Secret | Value |
|---|---|
| `POS_WEBHOOK_URL` | `https://pos.soithreadingandsalon.com/api/public/website-appointment` |
| `BOOKING_INTEGRATION_SECRET` | the matching shared secret from the POS (the same value already pasted into the POS's `WEBSITE_BOOKING_SECRET` field) |

Once saved, every new booking will:

1. Insert into our `appointments` table (admin keeps working — unchanged).
2. POST to the POS URL with:
   - `Authorization: Bearer <BOOKING_INTEGRATION_SECRET>`
   - `X-Signature: sha256=<HMAC of the body using the same secret>`
   - JSON body `{ "event": "appointment.created", "appointment": { …full row… } }`

If the POS responds non-2xx, the failure is logged server-side but the customer still sees the success screen (we never want a POS hiccup to look like a booking failure to the visitor).

## Verification

After the secrets are saved I will:

1. Submit a test booking from the live preview.
2. Check the server logs for `[submitBooking] POS responded` errors.
3. Confirm the row appears both in admin Appointments and in the POS.

If the POS returns 401, the secret values don't match between the two systems — we re-sync them. If it returns 404, the path is wrong and we update `POS_WEBHOOK_URL`.

## Out of scope

- Backfilling past appointments to the POS (only new bookings going forward).
- Changing auth/signature scheme — staying on `Bearer` + `X-Signature sha256=…`.
- Two-way sync (POS → website is not part of this).