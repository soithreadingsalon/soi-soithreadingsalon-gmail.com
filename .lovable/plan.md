## Goal
1. Send customers a **branded HTML confirmation email** (matching SOI's gold/dark theme) when they book.
2. Send a **SMS confirmation** to the phone number entered.
3. Add a **consent note** at the bottom of the booking form.

## Free service choices

- **Email — Gmail connector (already connected, free).** SOI's Gmail is already wired up in `src/lib/inquiries.functions.ts`. No new secret, no cost. We'll swap the plain-text body used for admin notifications for a full branded HTML email when sending to the customer.
- **SMS — Twilio (free trial credit, ~$15).** There is no permanently-free SMS provider for US numbers; every reliable carrier gateway charges per message. Twilio's free trial covers hundreds of confirmations and its gateway is already documented in Lovable. When the trial runs out the salon tops up (pay-as-you-go, ~$0.008/SMS). Requires:
  - Connecting the **Twilio** connector (`standard_connectors--connect`) — provides `TWILIO_API_KEY`.
  - One secret: `TWILIO_FROM_NUMBER` (the Twilio phone number to send from).
  - I'll flag this cost tradeoff clearly; if the salon prefers zero-cost, we can skip SMS and keep email only.

## Changes

### 1. `src/lib/booking.functions.ts`
After a successful `appointments` insert, in parallel with the POS push:
- **Customer email** (if `email` present + valid): send branded HTML email via Gmail gateway.
  - Subject: `Your appointment request at SOI Threading Salon`
  - HTML body themed to match the site: dark background `#0b0b0d`, gold accent `#c9a961`, serif heading (Playfair-style web-safe fallback: Georgia), rounded card, logo header, appointment summary table (service, date, time, notes), salon contact block (phone, WhatsApp, address), footer.
  - Reply-To set to the salon's Gmail so replies land in their inbox.
  - Header sanitization (strip CR/LF, cap length) — same helpers as inquiries.
- **Customer SMS** (if Twilio secrets available): POST to Twilio `/Messages.json` via connector gateway.
  - Body: `Hi {name}, we received your appointment request at SOI Threading Salon for {date} at {time}. We'll confirm shortly. Call (973) 321-8374 with questions. Reply STOP to opt out.`
  - Normalize phone to E.164 (US default: prepend `+1` if 10 digits, else pass through with `+`).
- Both wrapped in try/catch — failures logged, booking still succeeds.

### 2. `src/routes/_public.booking.tsx`
- Add a small consent note above the submit button:
  > *By submitting, you agree that SOI Threading Salon may contact you by email, phone, and SMS regarding your appointment and occasional promotions. Message and data rates may apply. Reply STOP to opt out of SMS.*
- Styled muted / small text, same rounded card, no new colors.
- No checkbox — implicit consent on submit (standard for booking forms). Can switch to a required checkbox if preferred.

### 3. Secrets / connectors setup (in build)
- Connect Twilio connector → `TWILIO_API_KEY` env var populated.
- Add secret `TWILIO_FROM_NUMBER` (E.164, e.g. `+15551234567`).

## Out of scope
- No template scaffolding via `email_domain--*` tools (would require custom sender domain + DNS). Gmail sending stays as-is since it's already working for inquiries.
- No admin/staff notification changes (existing POS + inquiries flows untouched).
- No unsubscribe DB / suppression list — Gmail replies + SMS "STOP" handled by Twilio automatically.

## Question before I build
Should I proceed with **Twilio for SMS** (free trial → tiny per-message cost after) — or skip SMS entirely and do email-only? There is no fully-free SMS option that's reliable for US mobile numbers.
