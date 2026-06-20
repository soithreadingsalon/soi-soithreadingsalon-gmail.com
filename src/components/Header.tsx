import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

const NAV = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/offers" as const, label: "Offers" },
  { to: "/about" as const, label: "About" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/contact" as const, label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <Logo className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-script text-gold text-xl">Style of India</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-2 text-sm font-medium tracking-wide text-foreground/80 hover:text-gold transition-colors relative group"
              activeProps={{ className: "px-4 py-2 text-sm font-medium tracking-wide text-gold relative" }}
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent transition-all duration-300 group-hover:w-3/4" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a
            href="tel:9733218374"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-[var(--gold)] shrink-0"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">(973) 321-8374</span>
          </a>
          <Link
            to="/booking"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold btn-gold shrink-0"
          >
            Book
          </Link>
          <WhatsAppButton
            label=""
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1ebe5b] transition-colors shadow-soft shrink-0"
          />
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-foreground shrink-0"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass-panel border-t border-[var(--gold)]/20 animate-fade-up">
          <nav className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-base font-medium border-b border-border/40 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-3 px-5 py-3 rounded-full text-center text-sm font-semibold btn-gold"
            >
              Book Appointment
            </Link>
            <WhatsAppButton
              label="WhatsApp 551-301-3894"
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-center text-sm font-semibold bg-[#25D366] text-white"
            />
            <a href="tel:9733218374" className="mt-2 px-5 py-3 rounded-full text-center text-sm font-semibold btn-gold">
              Call (973) 321-8374
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}