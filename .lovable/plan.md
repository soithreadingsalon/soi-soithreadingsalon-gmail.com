## Replace hero image with uploaded video and reposition Visit Us card

**File:** `src/routes/_public.index.tsx`

- Upload the video to Lovable Assets CDN:
  - `lovable-assets create --file /mnt/user-uploads/WhatsApp_Video_2026-07-13_at_21.20.07.mp4 --filename hero-salon.mp4 > src/assets/hero-salon.mp4.asset.json`
- Import the pointer JSON at the top of the file alongside the existing `heroImg` import.
- Replace the `<img src={heroImg} ...>` (line 242) with an autoplaying, not muted, looping, playsInline `<video>` using the same dimensions, rounded corners, and gold border wrapper. Keep the existing hero image as a `poster` fallback so LCP still renders instantly.
- Move the "Visit Us" floating card so it no longer overlaps the video body:
  - Change positioning from `-left-4 lg:-left-12 bottom-6 lg:bottom-12` (over the video) to `left-1/2 -translate-x-1/2 -bottom-8 lg:-bottom-10` on mobile/tablet, and on `lg:` place it just outside/under-right of the video (`lg:left-auto lg:right-0 lg:translate-x-0 lg:-bottom-14`), so the card sits under the corner rather than covering the subject.
  - Add `max-w-[260px]` and slightly reduce padding to keep it compact.
  - Add bottom margin (`mb-16 lg:mb-20`) to the video wrapper so the card doesn't overflow into the next section.
- Keep the top-right "Trusted in Wayne" badge unchanged.

No backend or business logic changes.