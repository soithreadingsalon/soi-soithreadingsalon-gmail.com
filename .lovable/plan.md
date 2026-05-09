## Why you don't see the CMS chrome today

The admin route files are named `admin_.dashboard.tsx`, `admin_.appointments.tsx`, etc. In TanStack Router, the **trailing underscore (`admin_.`) explicitly opts each page out of the `admin.tsx` parent layout**. That's why the nice sidebar in `src/components/AdminLayout.tsx` never renders — every admin page is being shown bare, with no nav, no header, no logout button.

Fix = nest them properly under a real layout, and upgrade that layout to a standard CMS shell users recognize (collapsible sidebar + topbar + breadcrumbs + user menu), like Shopify / Vercel / Supabase admin.

---

## Plan

### 1. Restructure admin routing (nest pages under a layout)

```text
src/routes/
  admin.login.tsx        ← login page (was admin.tsx)
  admin.tsx              ← NEW: layout shell (sidebar + topbar + Outlet)
  admin.index.tsx        ← redirects /admin → /admin/dashboard (or /admin/login)
  admin.dashboard.tsx    ← renamed from admin_.dashboard.tsx
  admin.appointments.tsx ← renamed
  admin.inquiries.tsx    ← renamed
  admin.services.tsx     ← renamed
  admin.offers.tsx       ← renamed
  admin.gallery.tsx      ← renamed
  admin.settings.tsx     ← renamed
```

Removing the `_` makes every `/admin/*` page render inside the shell automatically.

### 2. Replace custom AdminLayout with standard shadcn CMS shell

Use the project's existing `components/ui/sidebar.tsx` (Shadcn Sidebar) which gives the standard CMS pattern: collapsible left rail, icon-only collapsed mode, mobile drawer, keyboard shortcut (`Cmd/Ctrl + B`), persistent state in cookie.

**Sidebar (left)**
- Logo + "SOI Admin" at top
- Grouped nav:
  - **Overview** → Dashboard
  - **Operations** → Appointments (badge with today's count), Inquiries (badge with unread count)
  - **Catalog** → Services, Offers, Gallery
  - **Configuration** → Settings
- Footer: "View public site ↗" + version

**Topbar (right, sticky)**
- `SidebarTrigger` (collapse button)
- Breadcrumbs (Admin / Appointments / …)
- Right side: quick search (⌘K placeholder), notifications bell (unread inquiries), user dropdown (soi → Logout)

**Page wrapper** — replace `AdminPage.tsx` with a tighter version:
- Title + subtitle on left, action buttons on right
- Optional tabs row underneath
- Consistent `max-w-7xl` content area, `p-6` padding

### 3. Keep dashboard-first login flow (you liked this)

- `/admin` → if not authed, redirect to `/admin/login`; if authed, redirect to `/admin/dashboard`
- `/admin/login` → standalone (no sidebar)
- All other `/admin/*` → wrapped in shell, auth-gated in `admin.tsx` layout's component (returns `<Navigate to="/admin/login" />` if not authed, otherwise renders shell + `<Outlet />`)
- Dashboard stays exactly as it is — KPI cards, charts, recent activity. No changes to its content.

### 4. Polish across all admin pages
- Each page already has data tables/forms — just wrap with new `<AdminPage>` so they all inherit consistent header, padding, breadcrumb context
- Add active-route highlighting in sidebar via `Link` `activeProps`
- Mobile: sidebar becomes off-canvas drawer (Shadcn handles this automatically)
- Add a small "back to site" link in the sidebar footer

### 5. Files touched

**New**
- `src/routes/admin.tsx` (layout shell — replaces current login file)
- `src/routes/admin.index.tsx` (redirect)
- `src/routes/admin.login.tsx` (current login content moved here)
- `src/components/admin/AppSidebar.tsx`
- `src/components/admin/AdminTopbar.tsx`

**Renamed (drop the underscore)**
- `admin_.dashboard.tsx` → `admin.dashboard.tsx`
- `admin_.appointments.tsx` → `admin.appointments.tsx`
- `admin_.inquiries.tsx` → `admin.inquiries.tsx`
- `admin_.services.tsx` → `admin.services.tsx`
- `admin_.offers.tsx` → `admin.offers.tsx`
- `admin_.gallery.tsx` → `admin.gallery.tsx`
- `admin_.settings.tsx` → `admin.settings.tsx`

**Updated**
- `src/components/AdminPage.tsx` (tighter, breadcrumb-aware)
- Update any internal `<Link to="/admin">` that meant the dashboard to point to `/admin/dashboard`

**Removed**
- `src/components/AdminLayout.tsx` (replaced by `admin.tsx` + AppSidebar)

No database changes. No changes to the public website. No change to admin credentials (`soi` / `Soi@wayne2026`).

### What it'll feel like
After this, logging in lands you on the Dashboard inside a familiar CMS frame: collapsible sidebar on the left, sticky topbar with breadcrumbs and your user menu, mobile drawer on phones — same pattern as Vercel, Linear, Shopify admin.