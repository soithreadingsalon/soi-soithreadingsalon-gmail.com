import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-charcoal text-[oklch(0.95_0.02_80)] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 grid gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="inline-flex items-center justify-center rounded-2xl bg-[oklch(0.97_0.02_85)] px-4 py-3 mb-3 shadow-soft">
            <Logo className="h-12 md:h-14 w-auto" />
          </div>
          <p className="font-script text-2xl text-gold-light">Style of India</p>
          <p className="text-sm text-[oklch(0.85_0.02_80)] mt-3 leading-relaxed max-w-sm">
            Threading, facials, waxing, hair care and henna, inspired by timeless Indian traditions and refined for modern elegance.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-gold-light">
            <Sparkles className="h-3.5 w-3.5" /> 9 eyebrow visits = 10th FREE
          </p>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-4 text-gold-light">Visit Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold-light shrink-0" /><span>180 Hamburg Turnpk,<br />Wayne, NJ 07470</span></li>
            <li><a href="tel:5513013894" className="flex gap-3 hover:text-gold-light"><Phone className="h-4 w-4 mt-0.5 text-gold-light" />551-301-3894</a></li>
            <li><a href="mailto:soithreadingsalon@gmail.com" className="flex gap-3 hover:text-gold-light break-all"><Mail className="h-4 w-4 mt-0.5 text-gold-light" />soithreadingsalon@gmail.com</a></li>
            <li><a href="https://instagram.com/SOITHREADINGSALON" target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-gold-light"><Instagram className="h-4 w-4 mt-0.5 text-gold-light" />@SOITHREADINGSALON</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-4 text-gold-light">Hours</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3"><Clock className="h-4 w-4 mt-0.5 text-gold-light shrink-0" /><span>Mon – Fri: 10:00 AM – 7:00 PM</span></li>
            <li className="pl-7">Saturday: 10:00 AM – 6:00 PM</li>
            <li className="pl-7">Sunday: Closed</li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-4 text-gold-light">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-gold-light">Services</Link></li>
            <li><Link to="/offers" className="hover:text-gold-light">Offers</Link></li>
            <li><Link to="/about" className="hover:text-gold-light">About</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-light">Gallery</Link></li>
            <li><Link to="/booking" className="hover:text-gold-light">Book Appointment</Link></li>
            <li><Link to="/contact" className="hover:text-gold-light">Contact</Link></li>
            <li><Link to="/ai-business-summary" className="hover:text-gold-light">Business Information</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[oklch(0.32_0.03_60)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[oklch(0.75_0.02_80)]">
          <p>© 2026 SOI Threading Salon. All rights reserved.</p>
          <a href="https://maps.google.com/?q=180+Hamburg+Turnpk+Wayne+NJ+07470" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">180 Hamburg Turnpk, Wayne, NJ 07470</a>
        </div>
      </div>
    </footer>
  );
}