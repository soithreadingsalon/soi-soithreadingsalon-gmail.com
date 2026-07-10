import { createServerFn } from "@tanstack/react-start";

const PLACE_ID = "ChIJFWU6oxf9wokRmpTavWu8g9s";

export type GoogleReview = {
  name: string;
  initial: string;
  bg: string;
  service: string;
  time: string;
  text: string;
  rating: number;
};

export type GoogleReviewsResponse = {
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
};

const AVATAR_COLORS = [
  "bg-fuchsia-500", "bg-red-500", "bg-emerald-500", "bg-emerald-700",
  "bg-amber-600", "bg-sky-500", "bg-orange-500", "bg-zinc-600",
  "bg-pink-500", "bg-teal-600",
];

function pickColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export const getGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<GoogleReviewsResponse> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return { rating: null, userRatingCount: null, reviews: [] };
    }
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "rating,userRatingCount,reviews",
          },
        },
      );
      if (!res.ok) {
        const body = await res.text();
        console.error(`[getGoogleReviews] Places API ${res.status}: ${body}`);
        return { rating: null, userRatingCount: null, reviews: [] };
      }
      const json = (await res.json()) as {
        rating?: number;
        userRatingCount?: number;
        reviews?: Array<{
          rating?: number;
          text?: { text?: string };
          originalText?: { text?: string };
          relativePublishTimeDescription?: string;
          authorAttribution?: { displayName?: string };
        }>;
      };
      const reviews: GoogleReview[] = (json.reviews ?? []).map((r) => {
        const name = r.authorAttribution?.displayName ?? "Google User";
        const initial = name.trim().charAt(0).toUpperCase() || "G";
        return {
          name,
          initial,
          bg: pickColor(name),
          service: "Verified Google Review",
          time: r.relativePublishTimeDescription ?? "recently",
          text: r.text?.text ?? r.originalText?.text ?? "",
          rating: r.rating ?? 5,
        };
      }).filter((r) => r.text.length > 0);
      return {
        rating: json.rating ?? null,
        userRatingCount: json.userRatingCount ?? null,
        reviews,
      };
    } catch (err) {
      console.error("[getGoogleReviews] fetch failed", err);
      return { rating: null, userRatingCount: null, reviews: [] };
    }
  },
);