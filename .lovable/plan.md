## Hero video: start muted by default

Single change in `src/routes/_public.index.tsx` inside `HeroVideo`.

### Change
- Add `muted` attribute to the `<video>` element so browsers reliably autoplay with sound off.
- Initial `isMuted` state = `true` (was `false`).
- Simplify the mount effect: just call `videoRef.current.play().catch(() => {})`. Drop the unmuted-first / fallback-to-muted retry logic since we're intentionally starting muted.
- The existing bottom-right mute button already toggles `video.muted` and the icon, so the user can click it to unmute and hear audio.

No other files change. No layout, no styling changes.
