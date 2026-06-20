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
            <li><a href="tel:9733218374" className="flex gap-3 hover:text-gold-light"><Phone className="h-4 w-4 mt-0.5 text-gold-light" />(973) 321-8374</a></li>
            <li><a href="tel:5513013894" className="flex gap-3 hover:text-gold-light"><Phone className="h-4 w-4 mt-0.5 text-gold-light" />551-301-3894</a></li>
            <li>
              <a
                href="https://wa.me/15513013894"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 hover:text-gold-light"
                aria-label="Chat with us on WhatsApp at 551-301-3894"
              >
                <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4 mt-0.5 text-gold-light" aria-hidden="true">
                  <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.78 3.41 4.74 4.34.616.287 2.035.973 2.694.973.59 0 1.32-.302 1.575-.945.075-.187.5-.972.5-1.276s-2.063-1.247-2.42-1.247zM16.97 30.595c-3.026 0-5.96-.86-8.477-2.595L1 30l2.34-7.336c-1.91-2.55-2.86-5.59-2.84-8.79.014-7.847 6.42-14.252 14.27-14.252 3.808.014 7.385 1.49 10.07 4.187a14.067 14.067 0 0 1 4.16 10.064c-.014 7.847-6.42 14.253-14.27 14.253-.014 0-.014 0 0 0z"/>
                </svg>
                WhatsApp 551-301-3894
              </a>
            </li>
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