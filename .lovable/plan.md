# POS Booking Integration

Goal: let the POS at `https://pos.soithreadingandsalon.com/` receive new appointments in real time AND pull them on demand, authenticated by a single shared secret.

## 1. Secret

- Generate a strong random token (48 hex chars) and store it as runtime secret `BOOKING_INTEGRATION_SECRET`.
- I'll display it to you once in chat after it's stored so you can paste it into the POS. It will not be shown again — rotate by re-running setup if lost.
- Also store `POS_WEBHOOK_URL = https://pos.soithreadingandsalon.com/api/bookings/incoming` (you can change the exact path) as a secret so the push target isn't hardcoded.

## 2. Pull endpoint (POS calls us)

New TanStack public server route: `GET /api/public/pos/appointments`

- Auth: requires header `Authorization: Bearer <BOOKING_INTEGRATION_SECRET>`. Constant-time compare; 401 on mismatch/missing.
- Query params (validated with Zod):
  - `since` (ISO timestamp, optional) — return appointments created/updated after this time.
  - `limit` (1–200, default 100).
  - `status` (optional) — filter so POS only fetches unprocessed bookings.
- Returns JSON `{ appointments: [...] }` with booking fields (id, full_name, phone, email, service_category, service, preferred_date, preferred_time, notes, status, created_at, updated_at).
- Uses `supabaseAdmin` (loaded inside the handler) to bypass RLS for this trusted caller.

## 3. Webhook push (we call POS)

When a new appointment is inserted via the booking form:

- After the existing Supabase insert succeeds in `src/routes/_public.booking.tsx`, call a new server fn `notifyPosOfBooking({ appointmentId })`.
- The server fn:
  - Loads the appointment via `supabaseAdmin`.
  - POSTs JSON to `POS_WEBHOOK_URL` with headers:
    - `Authorization: Bearer <BOOKING_INTEGRATION_SECRET>`
    - `X-Signature: sha256=<hmac(body, BOOKING_INTEGRATION_SECRET)>` so POS can verify integrity.
    - `Content-Type: application/json`
  - Body: `{ event: "appointment.created", appointment: {...} }`.
  - Fire-and-forget with timeout + error logging; failure does NOT block the user's booking confirmation (POS can recover via the pull endpoint).

## 4. POS-side verification (for your POS developer)

- Compare `Authorization` to the shared secret.
- Verify `X-Signature` = `sha256=` + HMAC-SHA256 of the raw request body using the same secret.
- Idempotency: dedupe on `appointment.id`.

## 5. Files

- New: `src/routes/api/public/pos.appointments.ts` (pull endpoint)
- New: `src/lib/pos.functions.ts` (notifyPosOfBooking server fn)
- New: `src/lib/pos.server.ts` (HMAC + fetch helper)
- Edit: `src/routes/_public.booking.tsx` (call notifyPosOfBooking after insert)
- Secrets: `BOOKING_INTEGRATION_SECRET`, `POS_WEBHOOK_URL`

## 6. Out of scope

- No changes to the `appointments` table schema.
- No POS-side code (that lives in the POS project).
- No retry queue beyond a single attempt with logs.

Approve to implement, and I'll reveal the generated secret in chat right after.
