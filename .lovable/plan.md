## Problem

On mobile (≤414px) and small tablets, the "What Clients Say" review carousel on the home page renders each card wider than the screen. Text like "great service!" gets cut off on the right, the "Verified" badge disappears, and cards become unnaturally tall with empty space.

Root cause: cards use `w-[85%]` inside a flex track whose parent is `width: max-content`. A percentage width against a `max-content` parent doesn't resolve to viewport width, so the cards end up sized based on their (unwrapped) content, overflowing the screen.

## Fix (frontend only, single file: `src/routes/_public.index.tsx`)

1. **Reviews carousel card sizing** — replace `w-[85%] sm:w-[340px]` with viewport-relative + capped widths so cards always fit the screen:
   - `w-[78vw] max-w-[320px] sm:w-[320px] md:w-[340px]`
   - Add `min-h-[220px]` so short reviews don't collapse and tall reviews don't blow out neighbors.
2. **Inner text wrapping** — add `break-words` on the quote `<p>` and remove `truncate` on the footer meta line (use `line-clamp-1` instead) so the "Verified" pill stays visible.
3. **Header row inside card** — ensure `min-w-0` on the name column (already there) and `shrink-0` on the avatar (already there); keep as-is.
4. **Edge fade masks** — narrow to `w-6 sm:w-10 lg:w-16` so on small screens they don't obscure the first/last card's content.
5. **Gap** — reduce mobile gap to `gap-3` (from `gap-4`) so more of the next card peeks in as a scroll affordance.

## Quick audit for other mobile/tablet breakage

While in the file, verify and fix only if actually broken:
- Trust row under the badges (`{liveRating} 5.0 · 59 Google Reviews · Now Open in Wayne, NJ`) — already wraps via `flex-wrap`, leave as-is.
- Hero, offers carousel, features grid, footer — screenshots show these render correctly on 360px and 768px; no change.

No other files, no logic changes, no backend changes.

## Verification

Re-run Playwright at 360, 390, 768, 1024 widths and screenshot the reviews section. Confirm:
- Each card fits within the viewport with the next card peeking in.
- Quote text wraps fully, no horizontal clipping.
- "Verified" badge visible on every card.
- Desktop layout unchanged.