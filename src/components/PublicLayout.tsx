import { Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTracker } from "./PageTracker";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageTracker />
      <div className="fixed top-0 inset-x-0 z-[60] h-10 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] text-white flex items-center overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 flex items-center justify-center gap-x-3 text-center text-[11px] sm:text-sm leading-tight whitespace-nowrap overflow-hidden">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <p className="font-medium truncate">
            Walk-ins are always welcome. No appointment is needed, but advance bookings are available for your convenience.
          </p>
        </div>
      </div>
      <Header />
      <main className="flex-1 pt-[calc(4rem+2.5rem)] md:pt-[calc(5rem+2.5rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}