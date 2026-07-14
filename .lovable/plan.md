## Home page hero video + announcement bar

All changes in `src/routes/_public.index.tsx`. Plus one memory file so the "Visit Us" card can be restored later.

### 1. Remove the "Visit Us" floating card
- Delete the `<div className="absolute right-0 -bottom-12 …">Visit Us …</div>` block (currently ~lines 330–353) that sits over the hero video.
- Also drop the `mb-20 lg:mb-24` spacer on the video's parent wrapper (line 327) since that space existed only to make room for the card. Keep the animation/`relative` classes.

### 2. Save "Visit Us" content to memory for future restoration
- Create `mem://features/hero-visit-us-card.md` (type: feature) containing the exact JSX + copy (address, both phone numbers, WhatsApp link, "Today: {todayHours}" line, `glass-panel gold-border` styling, `absolute right-0 -bottom-12 lg:-bottom-14 max-w-[240px]` positioning) so it can be re-added on request.
- Add a one-line reference in `mem://index.md` under Memories.

### 3. Eliminate the white bars above/below the video
- The bars come from `aspect-[4/3] lg:aspect-[5/4]` + `object-contain` letterboxing the video inside a fixed-ratio box. Change the inner wrapper in `HeroVideo` (line 137) so its height is driven by the video's own aspect ratio:
  - Inner wrapper: `relative w-full rounded-[1.75rem] overflow-hidden` (drop `aspect-[4/3] lg:aspect-[5/4]` and `bg-[var(--ivory)]`).
  - `<video>`: `block w-full h-auto cursor-pointer` (drop `absolute inset-0 h-full object-contain`).
- Result: the gold border + rounded corners hug the video exactly; no cream/ivory strips top or bottom.
- Play/Pause button stays `absolute inset-0 m-auto` (still centered over the video).
- Mute button stays `absolute bottom-3 right-3` (bottom-right corner of the video).

### 4. Add a top announcement bar on the home page
- Insert a full-width one-liner at the very top of `HomePage`'s return, above the HERO `<section>`:
  - Gold gradient background (`bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] text-white`) with subtle `Sparkles` icon.
  - Text: **"Walk-ins are always welcome. No appointment is needed, but advance bookings are available for your convenience."**
  - Centered, `text-xs sm:text-sm`, `py-2 px-4`, single line on desktop, wraps on very small screens.
  - Inline CTA link "Book now →" pointing to `/booking`.

### Files touched
- `src/routes/_public.index.tsx` (edit)
- `mem://features/hero-visit-us-card.md` (new)
- `mem://index.md` (new/update)

No backend changes.
