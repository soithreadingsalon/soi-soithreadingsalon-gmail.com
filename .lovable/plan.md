## Fix hero video wrapper: no empty space, mute pinned bottom-right

Only file: `src/routes/_public.index.tsx` (inside `HeroVideo`).

Root cause: the inner wrapper is rendering ~120px taller than the video itself, so the gold border extends past the video and the play/mute buttons land in that empty cream area (with the mute even appearing on the wrong side). The video source is 1280x720 (16:9), so I'll lock the wrapper to that exact ratio and stretch the video to fill it — the border then hugs the video edge with no gap.

### Changes in `HeroVideo`

1. Inner wrapper (currently `relative w-full rounded-[1.75rem] overflow-hidden`):
   - Add `aspect-video` (16:9, matches the source).
   - Result: wrapper height is always `width * 9/16`, no extra vertical space.

2. `<video>` element (currently `block w-full h-auto`):
   - Change to `absolute inset-0 w-full h-full object-cover cursor-pointer`.
   - Since the video is already 16:9 and the wrapper is 16:9, `object-cover` shows the full frame with no cropping and no letterbox bars.

3. Mute button — keep it visibly at the bottom-right of the video no matter what:
   - Keep `absolute` positioning but replace the Tailwind `bottom-3 right-3` shortcuts with inline `style={{ bottom: 12, right: 12, left: 'auto', top: 'auto' }}` to defeat any inherited/utility conflict that is currently pushing it to the left.
   - Keep the same size and gold styling.

4. Play/Pause button stays centered via `absolute inset-0 m-auto` — with the wrapper now matching the video, it will center over the video correctly.

### Not changing
- No layout/grid changes elsewhere.
- Announcement bar, removed "Visit Us" card, and all other content stay as-is.
- No new dependencies.
