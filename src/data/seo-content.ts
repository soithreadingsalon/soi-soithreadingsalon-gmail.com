import threadingImg from "@/assets/eyebrow-threading-wayne-nj.jpg";
import facialImg from "@/assets/facial-salon-wayne-nj.jpg";
import waxingImg from "@/assets/waxing-salon-wayne-nj.jpg";
import hennaImg from "@/assets/henna-services-wayne-nj.jpg";
import eyelashImg from "@/assets/eyelash-services-wayne-nj.jpg";
import mensImg from "@/assets/mens-grooming-wayne-nj.jpg";
import heroImg from "@/assets/soi-threading-salon-hero.jpg";

export const SITE_URL = "https://soithreadingandsalon.com";

export const FAQS = [
  { q: "Where is SOI Threading Salon located?", a: "SOI Threading Salon is located at 180 Hamburg Turnpk, Wayne, NJ 07470." },
  { q: "What services does SOI Threading Salon offer?", a: "SOI Threading Salon offers eyebrow threading, full face threading, waxing, facials, hair care, henna, eyelash lifting, eyelash extensions, and men's grooming services." },
  { q: "How much is eyebrow threading at SOI Threading Salon?", a: "Eyebrow threading is $10. Men's eyebrow threading is $11." },
  { q: "Does SOI Threading Salon offer waxing?", a: "Yes. SOI Threading Salon offers full face waxing, full hand waxing, full leg waxing, underarms, bikini line, Brazilian, full back, full stomach, and body waxing." },
  { q: "Does SOI Threading Salon offer facials?", a: "Yes. SOI Threading Salon offers mini facial, acne facial, gold facial, oxygen facial, Casmara Gold, teenage facial, and skin care services." },
  { q: "Does SOI Threading Salon offer eyelash services?", a: "Yes. SOI Threading Salon offers eyelash lifting and eyelash extension services." },
  { q: "Does SOI Threading Salon offer men's grooming services?", a: "Yes. SOI Threading Salon offers men's eyebrow threading, nose hair removal, blackhead removal, ear wax, back wax, and chest wax services." },
  { q: "How can I book an appointment?", a: "Customers can call 551-301-3894 or submit an appointment request through the website." },
  { q: "What are the salon hours?", a: "SOI Threading Salon is open Monday to Friday from 10:00 AM to 7:00 PM and Saturday from 10:00 AM to 6:00 PM. Closed on Sunday." },
];

export const SERVICE_AREAS = "Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Fairfield, Clifton, Lincoln Park, Pompton Plains, Franklin Lakes, Oakland, and surrounding Passaic County and North Jersey communities.";

export type LandingContent = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  serviceName: string;
  intro: string;
  paragraphs: string[];
  pricing: { label: string; price: string }[];
  faqs?: { q: string; a: string }[];
};

export const LANDING_PAGES: Record<string, LandingContent> = {
  "eyebrow-threading-wayne-nj": {
    slug: "eyebrow-threading-wayne-nj",
    h1: "Eyebrow Threading in Wayne, NJ",
    title: "Eyebrow Threading in Wayne, NJ | SOI Threading Salon",
    description: "Get precise eyebrow threading in Wayne, NJ at SOI Threading Salon. Visit us for clean, natural-looking brows and expert threading services.",
    image: threadingImg,
    alt: "Eyebrow threading service at SOI Threading Salon in Wayne NJ",
    serviceName: "Eyebrow Threading",
    intro: "SOI Threading Salon is the destination for precise, natural-looking eyebrow threading in Wayne, NJ. Our expert technicians shape and define your brows with the ancient art of threading — the cleanest, most accurate hair removal method for delicate areas.",
    paragraphs: [
      "Eyebrow threading uses a fine cotton thread to remove individual hairs at the follicle, creating sharper, more controlled lines than wax or tweezers. The result is a brow shape tailored to your face — clean arches, defined edges, and absolutely no skin pulling or chemical irritation.",
      "At SOI Threading Salon we serve clients across Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Clifton, Pompton Plains, Franklin Lakes, and the wider Passaic County area. Walk-ins are welcome, but we recommend booking an appointment to skip the wait.",
      "Beyond brows, we offer upper lip threading, chin threading, sideburns, full face threading, and full face with neck threading. We also have a loyalty card: complete 9 eyebrow visits and your 10th visit is free.",
      "Hygiene is at the heart of our salon. Every thread is fresh, single-use. Our space is clean, welcoming, and designed for comfort — whether it's your first threading visit or you're a long-time client looking for the best threading salon Wayne NJ has to offer.",
    ],
    pricing: [
      { label: "Eyebrow Threading", price: "$10" },
      { label: "Men's Eyebrow Threading", price: "$11" },
      { label: "Upper Lip Threading", price: "$6" },
      { label: "Chin Threading", price: "$8" },
      { label: "Sideburns Threading", price: "$15" },
      { label: "Full Face Threading", price: "$35" },
      { label: "Full Face with Neck", price: "$40" },
    ],
  },
  "waxing-wayne-nj": {
    slug: "waxing-wayne-nj",
    h1: "Waxing Services in Wayne, NJ",
    title: "Waxing Services in Wayne, NJ | SOI Threading Salon",
    description: "SOI Threading Salon offers full face waxing, full hand waxing, full leg waxing, underarms, bikini line, Brazilian, full back, full stomach, and body waxing in Wayne, NJ.",
    image: waxingImg,
    alt: "Premium waxing service in Wayne NJ at SOI Threading Salon",
    serviceName: "Waxing",
    intro: "SOI Threading Salon offers smooth, comfortable waxing services in Wayne, NJ — from a quick lip wax to full body waxing. Our technicians use premium wax and gentle techniques designed to deliver long-lasting results with minimal discomfort.",
    paragraphs: [
      "Whether you're after a clean upper lip, smooth legs, or a full Brazilian, every waxing service at SOI is performed in a private, hygienic space. Single-use applicators, fresh wax for every client, and meticulous attention to skin care before and after treatment.",
      "Our most-requested services include Brazilian waxing, full leg waxing, underarms waxing, and the popular full body wax for clients preparing for a special occasion or simply maintaining a smooth routine. Pair waxing with one of our facials for a complete refresh.",
      "We welcome customers from Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, Pompton Lakes, Clifton, Lincoln Park, Pompton Plains, Franklin Lakes, Oakland, and the rest of Passaic County. We're known across North Jersey for being a clean, professional waxing salon Wayne NJ residents trust.",
      "First-time waxing client? We'll walk you through everything — what to expect, aftercare, and how to keep skin smooth between visits. Book online or call 551-301-3894.",
    ],
    pricing: [
      { label: "Full Face Waxing", price: "$40" },
      { label: "Full Hand Waxing", price: "$30" },
      { label: "Full Leg Waxing", price: "$45" },
      { label: "Underarms", price: "$15" },
      { label: "Bikini Line", price: "$25" },
      { label: "Brazilian Waxing", price: "$45" },
      { label: "Full Back", price: "$45" },
      { label: "Full Stomach", price: "$30" },
      { label: "Body Wax", price: "$180 & up" },
    ],
  },
  "facials-wayne-nj": {
    slug: "facials-wayne-nj",
    h1: "Facials and Skin Care in Wayne, NJ",
    title: "Facials and Skin Care in Wayne, NJ | SOI Threading Salon",
    description: "Book premium facials and skin care services in Wayne, NJ, including mini facial, acne facial, gold facial, oxygen facial, Casmara Gold, and teenage facial.",
    image: facialImg,
    alt: "Facial and skin care service at SOI Threading Salon in Wayne NJ",
    serviceName: "Facials",
    intro: "Restore your glow with a custom facial at SOI Threading Salon in Wayne, NJ. From a quick mini facial refresh to indulgent gold and oxygen rituals, our skin care menu is built around radiance, hydration, and visible results.",
    paragraphs: [
      "Each facial begins with a brief consultation so we can match the treatment to your skin type and concerns. We address dullness, congestion, fine lines, breakouts, and uneven tone using premium professional products and gentle, expert technique.",
      "Our most-loved facials include the Acne Facial for clarifying problem skin, the Gold Facial for a luminous finish, the Oxygen Facial for instant freshness, the Casmara Gold for a deeply nourishing experience, and the Teenage Facial designed for younger skin starting their skin care journey.",
      "We're known as a top facial salon Wayne NJ clients return to month after month. We welcome regulars from Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, Pompton Lakes, Clifton, and across Passaic County.",
      "Pair any facial with eyebrow threading or hair care for a complete refresh in a single visit. Call 551-301-3894 or request an appointment online.",
    ],
    pricing: [
      { label: "Mini Facial", price: "$45" },
      { label: "Acne Facial", price: "$65" },
      { label: "Gold Facial", price: "$65" },
      { label: "Oxygen Facial", price: "$90" },
      { label: "Casmara Gold Facial", price: "$95" },
      { label: "Teenage Facial", price: "$45" },
    ],
  },
  "henna-wayne-nj": {
    slug: "henna-wayne-nj",
    h1: "Henna Services in Wayne, NJ",
    title: "Henna Services in Wayne, NJ | SOI Threading Salon",
    description: "Visit SOI Threading Salon for henna services in Wayne, NJ, including simple tattoo henna designs inspired by timeless Indian beauty traditions.",
    image: hennaImg,
    alt: "Henna service at SOI Threading Salon in Wayne NJ",
    serviceName: "Henna",
    intro: "Celebrate any moment with beautiful henna art at SOI Threading Salon in Wayne, NJ. From simple decorative tattoos to ornate bridal-style designs, our henna services bring the timeless artistry of Indian mehndi into a modern salon setting.",
    paragraphs: [
      "Henna is a natural plant-based dye traditionally used to create intricate body art for weddings, festivals, and special occasions. Our henna designs are made with fresh, all-natural henna paste — never any chemicals, dyes, or 'black henna' substitutes that can irritate the skin.",
      "Whether you'd like a small ankle design, a finger or wrist accent, or a full hand mehndi, we'll design something that matches your style. Walk-ins are welcome for simple designs; larger pieces and bridal henna should be booked in advance.",
      "Clients come to us for henna from Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Woodland Park, Haledon, and across Passaic County. We're proud to be the henna Wayne NJ destination for natural mehndi artistry.",
      "Looking for a unique gift or want to host a small henna party? Call us at 551-301-3894 to discuss options.",
    ],
    pricing: [
      { label: "Simple Henna Tattoo", price: "$15 & up" },
      { label: "Custom Henna Design", price: "Contact for quote" },
    ],
  },
  "threading-salon-wayne-nj": {
    slug: "threading-salon-wayne-nj",
    h1: "Threading Salon in Wayne, NJ",
    title: "Threading Salon in Wayne, NJ | SOI Threading Salon",
    description: "SOI Threading Salon offers expert threading services in Wayne, NJ including eyebrow threading, upper lip threading, chin threading, sideburns, full face threading, and full face with neck.",
    image: threadingImg,
    alt: "Threading salon in Wayne NJ — SOI Threading Salon",
    serviceName: "Threading",
    intro: "SOI Threading Salon is the dedicated threading salon Wayne NJ residents trust for precision brows and clean, natural-looking facial hair removal. Our specialists have years of experience with the threading technique — and it shows in every visit.",
    paragraphs: [
      "Threading is the cleanest, gentlest, and most precise hair removal method for the face. Unlike waxing or tweezing, threading lifts hair directly from the follicle without pulling on the skin, making it ideal for sensitive areas around the eyes, lips, and chin.",
      "Our full threading menu covers eyebrows (men's and women's), upper lip, chin, sideburns, full face, and full face with neck. Combine services to refresh your entire look in a single visit.",
      "We're proud to be a go-to Indian beauty salon Wayne NJ has welcomed for years. Clients drive to us from Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Clifton, Pompton Plains, and the rest of Passaic County for our consistent, expert threading.",
      "Don't forget to ask about our loyalty card — your 10th eyebrow visit is on us.",
    ],
    pricing: [
      { label: "Eyebrow Threading", price: "$10" },
      { label: "Men's Eyebrow Threading", price: "$11" },
      { label: "Upper Lip Threading", price: "$6" },
      { label: "Chin Threading", price: "$8" },
      { label: "Sideburns", price: "$15" },
      { label: "Full Face Threading", price: "$35" },
      { label: "Full Face with Neck", price: "$40" },
    ],
  },
  "beauty-salon-wayne-nj": {
    slug: "beauty-salon-wayne-nj",
    h1: "Beauty Salon in Wayne, NJ",
    title: "Beauty Salon in Wayne, NJ | SOI Threading Salon",
    description: "SOI Threading Salon is a premium beauty salon in Wayne, NJ offering threading, waxing, facials, henna, hair care, eyelash services, and men's grooming.",
    image: heroImg,
    alt: "SOI Threading Salon — premium beauty salon in Wayne NJ",
    serviceName: "Beauty Salon",
    intro: "SOI Threading Salon is a full-service beauty salon Wayne NJ clients call home for everything from quick brow refreshes to a complete pre-event glow-up. Located at 180 Hamburg Turnpk, we bring the elegance of Indian beauty traditions together with modern salon care.",
    paragraphs: [
      "Our menu covers every essential: precision threading, smooth and comfortable waxing, glow-restoring facials, scalp and hair care rituals, all-natural henna art, eyelash lifting and extensions, and a full men's grooming line. Whatever you walked in needing, you'll leave refreshed.",
      "Inside, the salon is clean, calm, and welcoming — the kind of place where regulars become friends. Walk-ins are always welcome, but if you have a specific time in mind, request an appointment and we'll confirm by phone.",
      "Customers travel to us from across Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Fairfield, Clifton, Lincoln Park, Pompton Plains, Franklin Lakes, Oakland, and Passaic County. Many tell us we're the salon near me they've been searching for.",
      "Ask about our current offers and the eyebrow loyalty card — 10th visit free.",
    ],
    pricing: [
      { label: "Eyebrow Threading", price: "$10" },
      { label: "Mini Facial", price: "$45" },
      { label: "Brazilian Waxing", price: "$45" },
      { label: "Eyelash Lifting", price: "$75" },
      { label: "Henna Tattoo", price: "$15 & up" },
    ],
  },
  "eyelash-services-wayne-nj": {
    slug: "eyelash-services-wayne-nj",
    h1: "Eyelash Lifting & Extensions in Wayne, NJ",
    title: "Eyelash Lifting & Extensions in Wayne, NJ | SOI Threading Salon",
    description: "Visit SOI Threading Salon in Wayne, NJ for eyelash lifting, eyelash extensions, threading, facials, waxing, and complete beauty care.",
    image: eyelashImg,
    alt: "Eyelash lifting and extensions at SOI Threading Salon in Wayne NJ",
    serviceName: "Eyelash Services",
    intro: "Open up your eyes with eyelash lifting or eyelash extensions at SOI Threading Salon in Wayne, NJ. Both services are designed to give you longer, fuller-looking lashes — without the daily mascara routine.",
    paragraphs: [
      "Eyelash lifting is the perfect low-maintenance enhancement: we curl your natural lashes from the base, lifting and lengthening them for results that last 6–8 weeks. No extensions, no glue — just your own lashes, beautifully lifted.",
      "Eyelash extensions add length and volume by attaching individual synthetic lashes to your natural ones. The result is a defined, wide-awake look that's perfect for everyday wear or special events.",
      "Both services are performed in a calm, comfortable setting using premium products. We serve clients across Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Pompton Plains, Franklin Lakes, and Passaic County.",
      "Pair lash work with eyebrow threading for a complete eye-area refresh. Call 551-301-3894 to book.",
    ],
    pricing: [
      { label: "Eyelash Lifting", price: "$75" },
      { label: "Eyelash Extension", price: "$60" },
    ],
  },
  "mens-grooming-wayne-nj": {
    slug: "mens-grooming-wayne-nj",
    h1: "Men's Grooming Services in Wayne, NJ",
    title: "Men's Grooming Services in Wayne, NJ | SOI Threading Salon",
    description: "SOI Threading Salon offers men's eyebrow threading, nose hair removal, blackhead removal, ear wax, back wax, and chest wax services in Wayne, NJ.",
    image: mensImg,
    alt: "Men's grooming services at SOI Threading Salon in Wayne NJ",
    serviceName: "Men's Grooming",
    intro: "Look sharp with men's grooming services at SOI Threading Salon in Wayne, NJ. From precise eyebrow threading to back and chest waxing, we've built a clean, professional menu for the modern man who cares about the details.",
    paragraphs: [
      "Men's eyebrow threading is one of our most popular services — a fast, precise way to clean up brows, remove the unibrow, and shape without taking away the natural masculine line. We also offer nose hair removal, ear wax, blackhead removal, and full facial cleanups.",
      "For body grooming, we handle back wax, chest wax, full back, and other targeted areas in a private, hygienic setting. New to waxing? We'll walk you through the process and aftercare.",
      "We're a trusted men's eyebrow threading Wayne NJ destination for clients across Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Pompton Plains, Fairfield, Lincoln Park, and Passaic County.",
      "Call 551-301-3894 or book online for fast, no-fuss appointments.",
    ],
    pricing: [
      { label: "Men's Eyebrow Threading", price: "$11" },
      { label: "Nose Hair Removal", price: "$10" },
      { label: "Ear Wax", price: "$10" },
      { label: "Blackhead Removal", price: "$25" },
      { label: "Back Wax", price: "$45" },
      { label: "Chest Wax", price: "$35" },
    ],
  },
};