import { WhatsAppIcon } from "./WhatsAppButton";

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/15513013894?text=Hi%20SOI%20Threading%20Salon%2C%20I%27d%20like%20to%20book%20an%20appointment."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SOI Threading Salon on WhatsApp at 551-301-3894"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-[#25D366] text-white shadow-lift hover:bg-[#1ebe5b] transition-colors"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75 animate-ping" />
        <WhatsAppIcon className="relative h-5 w-5" />
      </span>
      <span className="hidden sm:inline text-sm font-semibold">Chat on WhatsApp</span>
    </a>
  );
}