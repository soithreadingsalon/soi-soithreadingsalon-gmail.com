## Hero video adjustments on the home page

All changes in `src/routes/_public.index.tsx` only.

### 1. Show the full video (no cropping)
- Switch the video to `object-contain` inside a fixed-aspect wrapper (`aspect-[4/3]` mobile, `lg:aspect-[5/4]`) with a soft cream background behind any letterboxed edges, kept inside the existing gold border.
- Keep the current `heroImg` as `poster`.

### 2. Pin "Visit Us" to the bottom-right
- Reposition the floating card to `absolute right-0 -bottom-10 lg:-bottom-14` (drop the mobile centering), keep `max-w-[260px]` so it sits neatly at the video's bottom-right on every breakpoint.

### 3. Custom video controls (no native `controls` bar)
- **Center Play / Pause button** — large circular gold button absolutely centered over the video. Shows `Play` when paused, `Pause` when playing. Fades out ~1.5s after playback starts, fades back in on hover or when paused. Clicking anywhere on the video also toggles play/pause.
- **Bottom Mute / Unmute button** — small circular gold button pinned to `bottom-3 right-3` inside the video frame (Visit Us card sits below, outside the frame). Shows `Volume2` when unmuted, `VolumeX` when muted.
- State via `useState` (`isPlaying`, `isMuted`) + `useRef` to the `<video>`; wire `onPlay` / `onPause` / `onVolumeChange` so icons stay in sync.

### 4. Start unmuted
- Render the `<video>` with `autoPlay loop playsInline` and **no `muted` attribute**; initial `isMuted` state = `false`.
- In a `useEffect` on mount, call `videoRef.current.play()`. Browsers block unmuted autoplay, so wrap in a `.catch()`: if it rejects, fall back to setting `video.muted = true`, update `isMuted` state, and retry `play()` — so playback still starts and the user can click Unmute.
- Net effect: on browsers that allow it, the video starts with sound. On strict browsers (Chrome/Safari/iOS default), it starts muted with the unmute button clearly visible — no broken/paused hero.

### Files touched
- `src/routes/_public.index.tsx`

No backend or business-logic changes. Icons come from existing `lucide-react` (`Play`, `Pause`, `Volume2`, `VolumeX`).
