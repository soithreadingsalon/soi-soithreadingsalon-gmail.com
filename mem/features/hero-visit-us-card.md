---
name: Hero Visit Us floating card
description: Removed floating "Visit Us" info card that overlaid the home hero video (bottom-right). Restore verbatim if user asks to bring it back.
type: feature
---
Location: `src/routes/_public.index.tsx`, inside the hero right column wrapper (`<div className="relative animate-fade-up ...">`), immediately after `<HeroVideo />`. The parent wrapper also needs `mb-20 lg:mb-24` re-added to make room below the video.

Exact JSX to restore:

```tsx
{/* Floating info card, pinned to bottom-right, outside the video frame */}
<div className="absolute right-0 -bottom-12 lg:-bottom-14 glass-panel rounded-2xl p-4 shadow-lift max-w-[240px] w-[calc(100%-2rem)] sm:w-auto animate-float gold-border">
  <p className="font-script text-2xl text-gold mb-1">Visit Us</p>
  <p className="font-serif text-sm text-foreground/90 leading-snug">180 Hamburg Turnpk<br />Wayne, NJ 07470</p>
  <div className="my-3 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
  <a href="tel:9733218374" className="flex items-center gap-2 text-sm font-semibold text-gold">
    <Phone className="h-4 w-4" /> (973) 321-8374
  </a>
  <a href="tel:5513013894" className="mt-1 flex items-center gap-2 text-sm font-medium text-gold/80">
    <Phone className="h-4 w-4" /> 551-301-3894
  </a>
  <a
    href="https://wa.me/15513013894"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#128C7E] hover:text-[#25D366]"
    aria-label="Chat with us on WhatsApp"
  >
    <WhatsAppIcon className="h-4 w-4" /> WhatsApp Us
  </a>
  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
    <Clock className="h-3.5 w-3.5" /> Today: {todayHours}
  </p>
</div>
```

Also re-add the `WhatsAppIcon` import: `import { WhatsAppButton, WhatsAppIcon } from "@/components/WhatsAppButton";`