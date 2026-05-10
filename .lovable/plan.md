## Problem

After signing in at `/soi/login` with valid admin credentials, the dashboard never opens. The credentials are correct (verified in DB: `soi@soithreadingandsalon.com` has `admin` role), so the failure is in the client-side auth flow, not the database.

## Root cause

`src/lib/admin-auth.ts → useAdminAuth()` calls `checkAdminRole()` (an `await supabase.from('user_roles').select(...)`) directly inside the `supabase.auth.onAuthStateChange` callback. This is the well-known Supabase auth-state deadlock: the `gotrue-js` client holds an internal lock while firing `SIGNED_IN`, and any awaited Supabase call made synchronously inside the listener never resolves. As a result:

- The login page's `status` never transitions to `"authenticated"`, so its `useEffect` never runs `navigate({ to: "/soi/dashboard" })`.
- Even if the user manually visits `/soi/dashboard`, the layout's `useAdminAuth` can be in a similarly stuck state on a fresh tab.

## Fix

In `src/lib/admin-auth.ts`, defer the role check out of the auth-state callback so it runs after Supabase releases its lock. Minimal change — only the `useAdminAuth` hook is touched:

```ts
const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
  // Defer to avoid the Supabase auth-state deadlock when awaiting
  // another Supabase call inside the listener.
  setTimeout(() => {
    evaluate(session?.user?.id ?? null, session?.user?.email ?? null);
  }, 0);
});
```

No other behavior changes. `getSession()` on mount remains as-is (it already runs outside the lock).

## Verification

1. Open `/soi/login`, sign in with `soi@soithreadingandsalon.com` / `Soi@wayne2026`.
2. Confirm automatic redirect to `/soi/dashboard` and that the dashboard renders (KPI cards, charts, recent activity).
3. Click through sidebar: Appointments, Inquiries, Services, Offers, Gallery, Settings — confirm each loads without bouncing back to login.
4. Refresh `/soi/dashboard` directly — should stay on dashboard (session restored, no redirect to `/soi/login`).
5. Log out from the topbar — should land back on `/soi/login`.

## Out of scope

No database, RLS, route, or admin-page changes. The admin pages themselves were already wired up; the only blocker was the auth listener deadlock preventing the post-login redirect.
