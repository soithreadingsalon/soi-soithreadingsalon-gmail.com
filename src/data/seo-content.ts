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
  { q: "How can I book an appointment?", a: "Customers can call (973) 321-8374 or 551-301-3894, or submit an appointment request through the website." },
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
    intro: "SOI Threading Salon is the destination for precise, natural-looking eyebrow threading in Wayne, NJ. Our expert technicians shape and define your brows with the ancient art of threading, the cleanest, most accurate hair removal method for delicate areas.",
    paragraphs: [
      "Eyebrow threading uses a fine cotton thread to remove individual hairs at the follicle, creating sharper, more controlled lines than wax or tweezers. The result is a brow shape tailored to your face, clean arches, defined edges, and absolutely no skin pulling or chemical irritation.",
      "At SOI Threading Salon we serve clients across Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Clifton, Pompton Plains, Franklin Lakes, and the wider Passaic County area. Walk-ins are welcome, but we recommend booking an appointment to skip the wait.",
      "Beyond brows, we offer upper lip threading, chin threading, sideburns, full face threading, and full face with neck threading. We also have a loyalty card: complete 9 eyebrow visits and your 10th visit is free.",
      "Hygiene is at the heart of our salon. Every thread is fresh, single-use. Our space is clean, welcoming, and designed for comfort, whether it's your first threading visit or you're a long-time client looking for the best threading salon Wayne NJ has to offer.",
    ],
    pricing: [
      { label: "Eyebrow Threading", price: "$10" },
      { label: "Men's Eyebrow Threading", price: "$11" },
      { label: "Upper Lip Threading", price: "$10" },
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
    intro: "SOI Threading Salon offers smooth, comfortable waxing services in Wayne, NJ, from a quick lip wax to full body waxing. Our technicians use premium wax and gentle techniques designed to deliver long-lasting results with minimal discomfort.",
    paragraphs: [
      "Whether you're after a clean upper lip, smooth legs, or a full Brazilian, every waxing service at SOI is performed in a private, hygienic space. Single-use applicators, fresh wax for every client, and meticulous attention to skin care before and after treatment.",
      "Our most-requested services include Brazilian waxing, full leg waxing, underarms waxing, and the popular full body wax for clients preparing for a special occasion or simply maintaining a smooth routine. Pair waxing with one of our facials for a complete refresh.",
      "We welcome customers from Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, Pompton Lakes, Clifton, Lincoln Park, Pompton Plains, Franklin Lakes, Oakland, and the rest of Passaic County. We're known across North Jersey for being a clean, professional waxing salon Wayne NJ residents trust.",
      "First-time waxing client? We'll walk you through everything, what to expect, aftercare, and how to keep skin smooth between visits. Book online or call (973) 321-8374.",
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
      "Pair any facial with eyebrow threading or hair care for a complete refresh in a single visit. Call (973) 321-8374 or request an appointment online.",
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
      "Henna is a natural plant-based dye traditionally used to create intricate body art for weddings, festivals, and special occasions. Our henna designs are made with fresh, all-natural henna paste, never any chemicals, dyes, or 'black henna' substitutes that can irritate the skin.",
      "Whether you'd like a small ankle design, a finger or wrist accent, or a full hand mehndi, we'll design something that matches your style. Walk-ins are welcome for simple designs; larger pieces and bridal henna should be booked in advance.",
      "Clients come to us for henna from Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Woodland Park, Haledon, and across Passaic County. We're proud to be the henna Wayne NJ destination for natural mehndi artistry.",
      "Looking for a unique gift or want to host a small henna party? Call us at (973) 321-8374 or 551-301-3894 to discuss options.",
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
    alt: "Threading salon in Wayne NJ, SOI Threading Salon",
    serviceName: "Threading",
    intro: "SOI Threading Salon is the dedicated threading salon Wayne NJ residents trust for precision brows and clean, natural-looking facial hair removal. Our specialists have years of experience with the threading technique, and it shows in every visit.",
    paragraphs: [
      "Threading is the cleanest, gentlest, and most precise hair removal method for the face. Unlike waxing or tweezing, threading lifts hair directly from the follicle without pulling on the skin, making it ideal for sensitive areas around the eyes, lips, and chin.",
      "Our full threading menu covers eyebrows (men's and women's), upper lip, chin, sideburns, full face, and full face with neck. Combine services to refresh your entire look in a single visit.",
      "We're proud to be a go-to Indian beauty salon Wayne NJ has welcomed for years. Clients drive to us from Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Clifton, Pompton Plains, and the rest of Passaic County for our consistent, expert threading.",
      "Don't forget to ask about our loyalty card, your 10th eyebrow visit is on us.",
    ],
    pricing: [
      { label: "Eyebrow Threading", price: "$10" },
      { label: "Men's Eyebrow Threading", price: "$11" },
      { label: "Upper Lip Threading", price: "$10" },
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
    alt: "SOI Threading Salon, premium beauty salon in Wayne NJ",
    serviceName: "Beauty Salon",
    intro: "SOI Threading Salon is a full-service beauty salon Wayne NJ clients call home for everything from quick brow refreshes to a complete pre-event glow-up. Located at 180 Hamburg Turnpk, we bring the elegance of Indian beauty traditions together with modern salon care.",
    paragraphs: [
      "Our menu covers every essential: precision threading, smooth and comfortable waxing, glow-restoring facials, scalp and hair care rituals, all-natural henna art, eyelash lifting and extensions, and a full men's grooming line. Whatever you walked in needing, you'll leave refreshed.",
      "Inside, the salon is clean, calm, and welcoming, the kind of place where regulars become friends. Walk-ins are always welcome, but if you have a specific time in mind, request an appointment and we'll confirm by phone.",
      "Customers travel to us from across Wayne, Totowa, Little Falls, Woodland Park, Paterson, Haledon, North Haledon, Pompton Lakes, Fairfield, Clifton, Lincoln Park, Pompton Plains, Franklin Lakes, Oakland, and Passaic County. Many tell us we're the salon near me they've been searching for.",
      "Ask about our current offers and the eyebrow loyalty card, 10th visit free.",
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
    intro: "Open up your eyes with eyelash lifting or eyelash extensions at SOI Threading Salon in Wayne, NJ. Both services are designed to give you longer, fuller-looking lashes, without the daily mascara routine.",
    paragraphs: [
      "Eyelash lifting is the perfect low-maintenance enhancement: we curl your natural lashes from the base, lifting and lengthening them for results that last 6–8 weeks. No extensions, no glue, just your own lashes, beautifully lifted.",
      "Eyelash extensions add length and volume by attaching individual synthetic lashes to your natural ones. The result is a defined, wide-awake look that's perfect for everyday wear or special events.",
      "Both services are performed in a calm, comfortable setting using premium products. We serve clients across Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Pompton Plains, Franklin Lakes, and Passaic County.",
      "Pair lash work with eyebrow threading for a complete eye-area refresh. Call (973) 321-8374 to book.",
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
      "Men's eyebrow threading is one of our most popular services, a fast, precise way to clean up brows, remove the unibrow, and shape without taking away the natural masculine line. We also offer nose hair removal, ear wax, blackhead removal, and full facial cleanups.",
      "For body grooming, we handle back wax, chest wax, full back, and other targeted areas in a private, hygienic setting. New to waxing? We'll walk you through the process and aftercare.",
      "We're a trusted men's eyebrow threading Wayne NJ destination for clients across Wayne, Totowa, Little Falls, Paterson, Clifton, Pompton Lakes, Pompton Plains, Fairfield, Lincoln Park, and Passaic County.",
      "Call (973) 321-8374 or 551-301-3894, or book online for fast, no-fuss appointments.",
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
export type LandingExtras = {
  /** "What to expect" steps for a first-time client. */
  expect: { title: string; body: string }[];
  /** Service-specific FAQs, rendered above the sitewide FAQs. */
  faqs: { q: string; a: string }[];
  /** Keywords matched against curated Google review service lines. */
  reviewKeywords: string[];
  /** Related service pages to cross-link. */
  related: { to: string; label: string; blurb: string }[];
};

export const LANDING_EXTRAS: Record<string, LandingExtras> = {
  "eyebrow-threading-wayne-nj": {
    expect: [
      { title: "Consultation, 2 minutes", body: "We look at your natural brow line and talk through the shape you want, thinner, fuller, more arch, or just a clean-up of the existing shape." },
      { title: "Threading, 10 to 15 minutes", body: "A fresh cotton thread removes hair row by row at the follicle. Most clients are in and out of the chair in under fifteen minutes." },
      { title: "Soothing finish", body: "We apply a calming gel to reduce redness. Any pinkness usually settles within an hour." },
      { title: "Aftercare", body: "Skip heavy makeup and sun exposure for a few hours. Most clients come back every three to four weeks to keep the shape crisp." },
    ],
    faqs: [
      { q: "How much is eyebrow threading in Wayne, NJ?", a: "Eyebrow threading is $10 at SOI Threading Salon, 180 Hamburg Turnpk, Wayne, NJ. Men's eyebrow threading is $11." },
      { q: "Does eyebrow threading hurt?", a: "Threading is quick and most clients describe it as a light stinging that stops as soon as the pass is done. It does not pull the skin the way waxing does, so it suits sensitive skin." },
      { q: "How long does eyebrow threading last?", a: "Most clients get three to four weeks out of a threading appointment before regrowth is noticeable." },
      { q: "Do I need an appointment for eyebrow threading?", a: "Walk-ins are always welcome. Booking ahead simply guarantees your time slot, especially on Saturdays." },
      { q: "Is threading better than waxing for eyebrows?", a: "Threading gives a more precise line and does not lift the top layer of skin, which makes it a better fit for the delicate brow area and for anyone using retinol or acne treatments." },
    ],
    reviewKeywords: ["eyebrow", "brow", "threading"],
    related: [
      { to: "/threading-salon-wayne-nj", label: "Full threading menu", blurb: "Upper lip, chin, sideburns, and full face threading." },
      { to: "/henna-wayne-nj", label: "Henna and brow art", blurb: "Natural mehndi designs by the same team." },
      { to: "/eyelash-services-wayne-nj", label: "Lash lift and extensions", blurb: "Pair with brows for a full eye-area refresh." },
    ],
  },
  "threading-salon-wayne-nj": {
    expect: [
      { title: "Pick your areas", body: "Eyebrows, upper lip, chin, sideburns, forehead, or the full face and neck package. Mix and match in one sitting." },
      { title: "Fresh thread every time", body: "Every client gets a new, single-use cotton thread. Nothing is reused between appointments." },
      { title: "Full face, 30 to 40 minutes", body: "A full face session is quick enough to fit into a lunch break and leaves skin smooth, not waxed-looking." },
      { title: "Loyalty card", body: "Nine eyebrow visits and your tenth is on us. We track it for you at the desk." },
    ],
    faqs: [
      { q: "What is the best threading salon in Wayne, NJ?", a: "SOI Threading Salon at 180 Hamburg Turnpk has a 5.0 rating across 50+ Google reviews from clients across Wayne and Passaic County." },
      { q: "Do you offer full face threading?", a: "Yes. Full face threading is $35 and full face with neck is $40. Both include eyebrows, upper lip, chin, forehead, and sides." },
      { q: "Is this an Indian threading salon?", a: "Yes. SOI Threading Salon is an Indian-owned salon in Wayne, NJ, using the traditional threading technique alongside modern waxing, facial, and lash services." },
      { q: "Can men get threading here?", a: "Yes. Men's eyebrow threading is $11, and we also offer nose hair removal, ear wax, and back and chest waxing." },
      { q: "What are your threading salon hours?", a: "Monday to Friday 10:00 AM to 7:00 PM, Saturday 10:00 AM to 6:00 PM, closed Sunday." },
    ],
    reviewKeywords: ["threading", "face"],
    related: [
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "Our most-booked service, $10." },
      { to: "/waxing-wayne-nj", label: "Waxing services", blurb: "Face, body, and Brazilian waxing." },
      { to: "/beauty-salon-wayne-nj", label: "Full salon menu", blurb: "Facials, hair care, lashes, and henna." },
    ],
  },
  "waxing-wayne-nj": {
    expect: [
      { title: "Patch check", body: "For first-time clients we check how your skin reacts before treating a larger area." },
      { title: "Premium wax, single-use tools", body: "Applicators are never double-dipped, and wax is fresh for every client." },
      { title: "Private room", body: "Bikini, Brazilian, and body waxing are done in a private, closed treatment space." },
      { title: "Aftercare", body: "Avoid heat, swimming, and heavy exercise for 24 hours. We recommend gentle exfoliation from day three to keep ingrowns away." },
    ],
    faqs: [
      { q: "How much is a Brazilian wax in Wayne, NJ?", a: "Brazilian waxing is $45 at SOI Threading Salon. Bikini line is $25 and underarms are $15." },
      { q: "How long does hair need to be for waxing?", a: "About a quarter inch, roughly two weeks of growth, so the wax has something to grip." },
      { q: "How often should I get waxed?", a: "Every four to six weeks keeps regrowth on the same cycle and makes each appointment more comfortable." },
      { q: "Do you wax men?", a: "Yes. Back, chest, and full back waxing are on the men's grooming menu." },
    ],
    reviewKeywords: ["waxing", "wax"],
    related: [
      { to: "/facials-wayne-nj", label: "Facials and skin care", blurb: "Book with waxing for a complete refresh." },
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "Gentler than wax on the brow area." },
      { to: "/mens-grooming-wayne-nj", label: "Men's grooming", blurb: "Back, chest, and ear waxing." },
    ],
  },
  "facials-wayne-nj": {
    expect: [
      { title: "Skin consultation", body: "We look at your skin type and concerns, congestion, dullness, breakouts, or dryness, and match a facial to it." },
      { title: "Cleanse, exfoliate, extract", body: "Deep cleansing and gentle extractions clear congestion without leaving skin raw." },
      { title: "Mask and massage", body: "A treatment mask plus facial and shoulder massage. This is the part clients tell us they book for." },
      { title: "Finish and advice", body: "Serum, moisturiser, and SPF, plus a simple home routine so results hold between visits." },
    ],
    faqs: [
      { q: "How much is a facial in Wayne, NJ?", a: "Facials at SOI start at $45 for a mini facial. Acne and gold facials are $65, oxygen facial is $90, and Casmara Gold is $95." },
      { q: "Which facial is best for acne?", a: "The Acne Facial at $65 is built for congested and breakout-prone skin, with deep cleansing and gentle extractions." },
      { q: "How often should I get a facial?", a: "Every four to six weeks matches the skin's renewal cycle. Clients preparing for an event often book one to two weeks ahead." },
      { q: "Do you offer facials for teenagers?", a: "Yes. The Teenage Facial is $45 and is designed for younger skin just starting a skin care routine." },
    ],
    reviewKeywords: ["facial"],
    related: [
      { to: "/waxing-wayne-nj", label: "Waxing services", blurb: "Common add-on before an event." },
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "Finish the look in the same visit." },
      { to: "/beauty-salon-wayne-nj", label: "Full salon menu", blurb: "See everything we offer." },
    ],
  },
  "henna-wayne-nj": {
    expect: [
      { title: "Choose a design", body: "Simple ankle or wrist accents, festival designs, or full hand bridal mehndi. Bring a reference photo if you have one." },
      { title: "Natural paste only", body: "We use fresh, all-natural henna paste. No chemical black henna, which can burn or scar skin." },
      { title: "Drying time", body: "Keep the paste on for four to six hours, longer for a deeper stain. Scrape, do not wash, it off." },
      { title: "Colour development", body: "The stain darkens over 24 to 48 hours and typically lasts one to two weeks." },
    ],
    faqs: [
      { q: "How much does henna cost in Wayne, NJ?", a: "Simple henna tattoos start at $15. Larger and bridal designs are quoted after we see the design." },
      { q: "Do you do bridal mehndi?", a: "Yes. Bridal and party henna should be booked in advance so we can set aside enough time." },
      { q: "Is your henna natural?", a: "Yes. We use only fresh plant-based henna paste and never black henna." },
      { q: "How long does henna last?", a: "One to two weeks depending on placement and how often the area is washed." },
    ],
    reviewKeywords: ["henna"],
    related: [
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "Popular with henna clients before events." },
      { to: "/facials-wayne-nj", label: "Facials", blurb: "Book before a wedding or festival." },
      { to: "/beauty-salon-wayne-nj", label: "Full salon menu", blurb: "Event-ready packages." },
    ],
  },
  "beauty-salon-wayne-nj": {
    expect: [
      { title: "Walk in or book", body: "Walk-ins are always welcome. Booking online holds a specific time, which helps on Fridays and Saturdays." },
      { title: "One visit, several services", body: "Threading, waxing, a facial, and lashes can all be done back to back so you only make one trip." },
      { title: "Clean, calm space", body: "Single-use tools, private rooms for body services, and a salon designed to feel unhurried." },
      { title: "Easy to find", body: "180 Hamburg Turnpk, Wayne, NJ 07470, next to the QuickChek, with parking at the door." },
    ],
    faqs: [
      { q: "Where is SOI Threading Salon in Wayne, NJ?", a: "180 Hamburg Turnpk, Wayne, NJ 07470, next to the QuickChek, with free parking." },
      { q: "Do you take walk-ins?", a: "Yes, walk-ins are always welcome. Appointments are available for convenience but are not required." },
      { q: "What services does the salon offer?", a: "Threading, waxing, facials and skin care, hair care, henna, eyelash lifting and extensions, and men's grooming." },
      { q: "What areas do you serve?", a: "Wayne plus Totowa, Little Falls, Woodland Park, Paterson, Haledon, Pompton Lakes, Clifton, Franklin Lakes, and the wider Passaic County area." },
    ],
    reviewKeywords: ["beauty", "threading", "facial", "haircut"],
    related: [
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "$10, our signature service." },
      { to: "/facials-wayne-nj", label: "Facials and skin care", blurb: "From mini facials to Casmara Gold." },
      { to: "/waxing-wayne-nj", label: "Waxing services", blurb: "Face and body waxing." },
    ],
  },
  "eyelash-services-wayne-nj": {
    expect: [
      { title: "Which service fits", body: "A lift enhances your own lashes. Extensions add length and volume. We help you pick based on your natural lash length." },
      { title: "Lash lift, about 45 minutes", body: "Lashes are curled from the base and set. Results last six to eight weeks with no daily upkeep." },
      { title: "Extensions, 60 to 90 minutes", body: "Individual lashes are applied one at a time for a defined, wide-awake look." },
      { title: "Aftercare", body: "Keep lashes dry for 24 hours and avoid oil-based cleansers around the eye area." },
    ],
    faqs: [
      { q: "How much is a lash lift in Wayne, NJ?", a: "Eyelash lifting is $75 and eyelash extensions start at $60 at SOI Threading Salon." },
      { q: "How long does a lash lift last?", a: "Six to eight weeks, which is the natural growth cycle of your lashes." },
      { q: "Lash lift or extensions, which should I get?", a: "A lift is best if you already have decent lash length and want low maintenance. Extensions are best when you want visible added length and volume." },
      { q: "Can I get lashes and brows in one visit?", a: "Yes, and most clients do. Lash lift plus eyebrow threading is our most common pairing." },
    ],
    reviewKeywords: ["lash"],
    related: [
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "The natural pairing with lash work." },
      { to: "/facials-wayne-nj", label: "Facials", blurb: "Complete the pre-event routine." },
      { to: "/beauty-salon-wayne-nj", label: "Full salon menu", blurb: "Everything under one roof." },
    ],
  },
  "mens-grooming-wayne-nj": {
    expect: [
      { title: "Natural shape, not overdone", body: "Men's brow threading cleans up the unibrow and stray hair while keeping the natural masculine line." },
      { title: "In and out fast", body: "A men's brow clean-up takes about ten minutes. Most clients come on the way to or from work." },
      { title: "Body work in private", body: "Back and chest waxing is done in a closed treatment room with fresh wax and single-use applicators." },
      { title: "First time?", body: "We explain the process and aftercare before we start. No pressure to add services you did not ask for." },
    ],
    faqs: [
      { q: "How much is men's eyebrow threading in Wayne, NJ?", a: "Men's eyebrow threading is $11. Nose hair removal and ear wax are $10 each." },
      { q: "Do you do back and chest waxing for men?", a: "Yes. Back wax is $45 and chest wax is $35." },
      { q: "Will threading make my brows look thin?", a: "No. For men we only remove strays and the unibrow, keeping the natural thickness and line." },
      { q: "Do I need an appointment?", a: "Walk-ins are welcome. Booking ahead is useful for longer services like back waxing." },
    ],
    reviewKeywords: ["threading", "wax"],
    related: [
      { to: "/eyebrow-threading-wayne-nj", label: "Eyebrow threading", blurb: "Full threading price list." },
      { to: "/waxing-wayne-nj", label: "Waxing services", blurb: "Full body waxing menu." },
      { to: "/beauty-salon-wayne-nj", label: "Full salon menu", blurb: "Everything the salon offers." },
    ],
  },
};
