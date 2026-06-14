## Problem

Booking form fails with "Could not submit…" and no row reaches the admin Appointments list.

Two root causes on the `appointments` table:

1. **Missing Data-API GRANTs.** Only the sandbox role has `INSERT`/`SELECT`. `anon` and `authenticated` have no privileges, so the public booking form can't insert — PostgREST rejects it with `permission denied for table appointments` before RLS is even evaluated.
2. **`.select("id").single()` after insert is blocked by RLS.** The SELECT policy restricts reads to admins. Even once GRANTs are fixed, the returning-row read finds 0 rows and `.single()` throws — the insert silently rolls back from the client's perspective and the toast shows the failure path.

## Fix

### 1. Migration: add GRANTs on `appointments`

```sql
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
```

(SELECT is still gated by the admin RLS policy — granting the privilege only lets PostgREST consider the row; the policy still filters it.)

### 2. Move the whole submit flow to a server function

Create `src/lib/booking.functions.ts` exporting `submitBooking` — a public `createServerFn` (no auth middleware) that:

- validates the form payload with the same Zod schema,
- uses `supabaseAdmin` (loaded inside the handler via `await import(...)`) to insert and return `id`,
- calls the existing `notifyPosOfBooking` logic inline (or re-uses the helper) and swallows its error so a POS hiccup never blocks the user,
- returns `{ id }`.

This sidesteps the RLS read-after-insert problem entirely and keeps the POS notify server-side where the secret already lives.

### 3. Update `src/routes/_public.booking.tsx`

- Replace the direct `supabase.from("appointments").insert(...).select("id").single()` with `useServerFn(submitBooking)` + call it with the form payload.
- Drop the separate `notifyPosOfBooking` call from the client (folded into the server fn).
- Keep the existing success UI and toast.

## Out of scope

- No RLS policy changes — admin-only SELECT/UPDATE/DELETE stays as-is.
- No change to POS notify auth headers or signature format.
