export type CuratedReview = {
  name: string;
  initial: string;
  bg: string;
  service: string;
  time: string;
  text: string;
};

export const CURATED_REVIEWS: CuratedReview[] = [
{ name: "Heather Grella", initial: "H", bg: "bg-fuchsia-500", service: "Eyebrow Threading", time: "2 weeks ago", text: "10/10 would recommend! The owner was so nice. My eyebrows have never looked better! I was certainly impressed considering it was my first time getting my brows threaded. Price was affordable." },
{ name: "Archana Barvalia", initial: "A", bg: "bg-zinc-700", service: "Full Face Threading", time: "a week ago", text: "I had the full face service at SOI, which included eyebrows, upper lips, sides, forehead, chin, and more. The experience was absolutely amazing! The staff is the best — professional, friendly, and very skilled." },
{ name: "Soniya Herapara", initial: "S", bg: "bg-red-500", service: "Waxing, Threading & Scalp Massage", time: "3 weeks ago", text: "Jenny was awesome. She caught on real quickly about my sensitive skin and went gentle when threading my eyebrows. The scalp massage felt so relaxing. Waxing was painless as well. Great customer service." },
{ name: "Samantha Leahy-Beers", initial: "S", bg: "bg-amber-600", service: "Eyebrow Threading", time: "3 weeks ago", text: "I've been going to Jinal for quite some time and when she opened her salon, I had to come! She has always taken such good care of my eyebrows. She's extremely kind, quick, and always giving helpful tips." },
{ name: "Radhika Dave", initial: "R", bg: "bg-emerald-500", service: "Eyebrow Threading", time: "a week ago", text: "Jinal was so friendly and my eyebrows have never looked better!" },
{ name: "Danielle Germano", initial: "D", bg: "bg-zinc-600", service: "Brow Threading & Tint + Lip", time: "a day ago", text: "I had my eyebrows threaded and tinted, as well as my upper lip threaded, and I couldn't be happier with the results. The staff was incredibly friendly and welcoming, and they really took their time to make sure everything was perfect." },
{ name: "tejaswini dange", initial: "T", bg: "bg-sky-500", service: "Eyebrow Threading", time: "3 days ago", text: "I am very happy with my eye brows. Jinal did awesome job. Thank you Jinal." },
{ name: "Chinwe Atkinson", initial: "C", bg: "bg-orange-500", service: "Threading & Waxing", time: "3 days ago", text: "Lovely customer service. Jinal is nice. Nicely done threading and waxing. Clean and welcoming environment for all ages." },
{ name: "payal kakadiya", initial: "P", bg: "bg-emerald-500", service: "Facial", time: "4 days ago", text: "Facial was amazing!" },
{ name: "Danielle Vecchione", initial: "D", bg: "bg-red-500", service: "Threading", time: "4 days ago", text: "Great service. Very knowledgeable! Will be going back in the future ❤️" },
{ name: "Jessica F.", initial: "J", bg: "bg-emerald-800", service: "Threading", time: "5 days ago", text: "Been here 2x and will keep coming back. Excellent work at a great price. It's right next to the Quick Check." },
{ name: "Rashmi Dhekne", initial: "R", bg: "bg-fuchsia-500", service: "Haircut with Priyanka", time: "a week ago", text: "Priyanka does a great haircut! Thank you!" },
{ name: "Kumud Bansal", initial: "K", bg: "bg-amber-700", service: "Facial with Priyanka", time: "a week ago", text: "Facial is very very good. Priyanka is very good." },
{ name: "Jasica Mehta", initial: "J", bg: "bg-stone-600", service: "Eyebrow Threading", time: "a week ago", text: "Great experience, very nice customer service, friendly and did a great job with the eyebrows." },
{ name: "Mary Elizabeth Selvakumar", initial: "M", bg: "bg-emerald-600", service: "Beauty Services", time: "2 weeks ago", text: "Excellent service!" },
{ name: "Francine Selvakumar", initial: "F", bg: "bg-teal-600", service: "Threading & Waxing", time: "2 weeks ago", text: "Excellent service! Highly recommend!!" },
{ name: "Khushi Gandhi", initial: "K", bg: "bg-zinc-500", service: "Lash Lift & Eyebrow Threading", time: "2 weeks ago", text: "It was a great experience. I got a lash lift and my eyebrows threaded. They worked efficiently and my eyebrows have never looked better. The customer service was nice and enjoyable. I would highly recommend to anyone in the NJ/NYC area!" },
{ name: "Bhumika Khunt", initial: "B", bg: "bg-zinc-600", service: "Eyebrow Threading", time: "3 weeks ago", text: "Must visit this place. Art nice customer service and love the way they did my eye brows." },
{ name: "Kenisha Rao", initial: "K", bg: "bg-pink-500", service: "Eyebrow Threading", time: "2 weeks ago", text: "Absolutely obsessed with my eyebrows 😍 Perfect shape, clean work, and natural look!" },
{ name: "Rashmika Dave", initial: "R", bg: "bg-orange-500", service: "Eyebrow Threading", time: "a week ago", text: "Wonderful customer service, both my eyebrows and my daughters' eyebrows came out perfect. 👌" },
];

/** Reviews whose service line matches any of the given keywords. */
export function reviewsMatching(keywords: string[], limit = 3): CuratedReview[] {
  const lower = keywords.map((k) => k.toLowerCase());
  return CURATED_REVIEWS.filter((r) =>
    lower.some((k) => r.service.toLowerCase().includes(k)),
  ).slice(0, limit);
}
