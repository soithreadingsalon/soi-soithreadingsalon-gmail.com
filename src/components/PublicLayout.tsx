import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTracker } from "./PageTracker";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageTracker />
      <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-[var(--gold)] to-[var(--gold-deep)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center text-[11px] sm:text-sm leading-tight">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <p className="font-medium">
            Walk-ins are always welcome. No appointment is needed, but advance bookings are available for your convenience.
          </p>
          <Link to="/booking" className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-90">
            Book now <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <Header />
      <main className="flex-1 pt-[calc(4rem+var(--announcement-h,2.5rem))] md:pt-[calc(5rem+var(--announcement-h,2.5rem))]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}