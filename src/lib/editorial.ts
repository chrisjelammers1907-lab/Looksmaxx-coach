import type { TopicId } from "./types";

/** The real editorial photo for a category, e.g. `photo-skincare`. */
export const topicPhoto = (id: TopicId) => `photo-${id}`;

/**
 * Where the subject of each photo sits, as x% y%: usually the face. Every
 * crop (a round thumbnail, a wide strip, a 4:5 feed post) keeps this point in
 * view, so a face is never cut in half.
 */
export const photoFocus: Record<string, string> = {
  "photo-ad-gym": "55% 20%",
  "photo-ad-serum": "55% 45%",
  "photo-ad-shirt": "55% 45%",
  "photo-body": "45% 25%",
  "photo-brows": "70% 50%",
  "photo-clothing": "50% 25%",
  "photo-colouring": "55% 38%",
  "photo-face": "40% 35%",
  "photo-feed-autumn": "40% 30%",
  "photo-feed-cuff": "55% 50%",
  "photo-feed-hair": "55% 22%",
  "photo-feed-lift": "45% 45%",
  "photo-feed-linen": "50% 30%",
  "photo-feed-lounge": "65% 45%",
  "photo-feed-mirror": "50% 15%",
  "photo-feed-motion": "50% 60%",
  "photo-feed-night": "55% 25%",
  "photo-feed-ritual": "55% 35%",
  "photo-feed-shave": "80% 35%",
  "photo-feed-smile": "50% 25%",
  "photo-feed-sunday": "45% 40%",
  "photo-fragrance": "60% 35%",
  "photo-grooming": "65% 25%",
  "photo-gym": "50% 45%",
  "photo-hair": "55% 22%",
  "photo-home-hero": "50% 25%",
  "photo-makeup": "45% 30%",
  "photo-nutrition": "45% 35%",
  "photo-photos": "55% 42%",
  "photo-presence": "45% 35%",
  "photo-skincare": "25% 45%",
  "photo-sleep": "45% 52%",
  "photo-smile": "50% 25%",
  "photo-style-athleisure": "50% 65%",
  "photo-style-bohemian": "50% 25%",
  "photo-style-dark-casual": "50% 40%",
  "photo-style-minimalist": "50% 70%",
  "photo-style-old-money": "65% 40%",
  "photo-style-preppy": "50% 40%",
  "photo-style-smart-casual": "55% 50%",
  "photo-style-streetwear": "45% 40%",
};

/** The focus of a photo key, centred a little high when it has none. */
export const focusOf = (key = "") => photoFocus[key] ?? "50% 30%";

/** Inline style that keeps a photo's subject in view in any crop. */
export const focusStyle = (key = "") => ({ objectPosition: focusOf(key) });
