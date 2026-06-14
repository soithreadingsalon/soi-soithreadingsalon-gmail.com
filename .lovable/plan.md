## Diagnosis

The website is saving the appointment correctly in its own backend. The newest test appointment is present there.

The POS webhook call is failing with:

```text
[submitBooking] POS responded 401 {"error":"Invalid signature"}
```

The previous test also hit a 404, which means the POS endpoint path/deployment was not ready at that time. Now it reaches the POS endpoint, but authentication/signature verification fails.

## Root cause

The website sends the webhook like this:

- Body: `{ event: "appointment.created", appointment: ... }`
- Header: `X-Signature: sha256=<hmac>`
- Header: `Authorization: Bearer <secret>`

The POS endpoint expects this instead:

- Body: flat appointment fields like `customer_name`, `appointment_date`, `appointment_time`, etc.
- Header: `x-soi-signature: <hmac>` with no `sha256=` prefix
- Secret name on POS side: `WEBSITE_BOOKING_SECRET`

So the POS receives the request but rejects it before creating the appointment.

## Implementation plan

1. Update the website booking webhook sender in `src/lib/booking.functions.ts`.
2. Convert the saved website appointment into the flat POS payload the POS endpoint expects:
   - `customer_name` from `full_name`
   - `customer_phone` from `phone`
   - `customer_email` from `email`
   - `service_name` from `service` or `service_category`
   - `appointment_date` from `preferred_date`
   - `appointment_time` converted from display format like `10:00 AM` to `10:00:00`
   - `notes`, `external_booking_id`, `external_source`
3. Sign the exact JSON body with HMAC-SHA256 and send it as `x-soi-signature` without the `sha256=` prefix.
4. Keep `Authorization: Bearer <secret>` only as extra compatibility; POS currently ignores it.
5. Add concise logging that reports whether POS accepted, deduped, or rejected the appointment, without logging the secret.
6. Verify by submitting or simulating a test booking and checking the POS response/logs.

## Expected result

New preview/sandbox bookings will appear in the POS appointments list under `Environment: Test (sandbox)`. Production bookings will continue going to the production POS URL using the production environment configuration.