## Goal

Preview/sandbox bookings should land in the **test** POS, while production bookings keep going to the live POS — using the same booking code and the same shared secret.

## How it works

Lovable Cloud keeps two independent secret stores:

- **Production environment** (served from `soithreadingandsalon.com` and `sois-beauty-suite.lovable.app`)
- **Preview/Dev environment** (served from `id-preview--…lovable.app` and any `*-dev.lovable.app` URL)

Our booking code already reads `POS_WEBHOOK_URL` at runtime, so the same code can deliver to two different POS instances just by giving each environment its own value for that secret. No code changes.

## Changes

1. **Preview environment secret** — set:
   - `POS_WEBHOOK_URL` = `https://project--f66027a0-e6c6-4be1-a361-27e67adff7d8-dev.lovable.app/api/public/website-appointment`
   - `BOOKING_INTEGRATION_SECRET` = the same shared secret (so HMAC + bearer match the POS's `WEBSITE_BOOKING_SECRET`)

2. **Production environment secret** — leave as-is:
   - `POS_WEBHOOK_URL` = `https://pos.soithreadingandsalon.com/api/public/website-appointment`
   - `BOOKING_INTEGRATION_SECRET` = unchanged

3. **No code edits.** `src/lib/booking.functions.ts → pushToPos` already:
   - reads both env vars at call time,
   - signs the body with HMAC-SHA256,
   - sends `Authorization: Bearer <secret>` + `X-Signature: sha256=…`,
   - logs (but doesn't fail the booking) on non-2xx.

4. **No publish required for this routing to work in preview** — preview already runs the latest code with the preview-environment secrets. Publishing is only needed if the user also wants the production POS URL or any other prod change to go live.

## Verification

After the preview secrets are saved:

1. Submit a test booking from the preview site (`id-preview--…lovable.app/booking`).
2. Confirm it appears in the **test/sandbox** POS at `project--f66027a0…-dev.lovable.app/appointments` under Environment: Test.
3. Confirm production bookings (from `soithreadingandsalon.com`) still land in the live POS.

If the test POS returns 401, the secret values don't match between this project's preview env and the test POS's `WEBSITE_BOOKING_SECRET` — re-sync them. If 404, the path on the test POS isn't deployed yet.

## Out of scope

- Code changes to `booking.functions.ts` (not needed — env-var driven).
- Backfilling past appointments.
- A separate `POS_WEBHOOK_URL_TEST` variable (unnecessary; environment-scoped secrets already give us per-environment routing).
