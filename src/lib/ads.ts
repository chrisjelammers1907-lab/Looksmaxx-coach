/** Fictional sponsors, shown to Free members only. */
export interface Ad {
  id: string;
  brand: string;
  initials: string;
  headline: string;
  text: string;
  image: string;
  cta: string;
}

export const ads: Ad[] = [
  {
    id: "ad-verde",
    brand: "Maison Verde",
    initials: "MV",
    headline: "Linen, cut for long evenings.",
    text: "A relaxed shirt in washed linen, in five quiet colours.",
    image: "photo-ad-shirt",
    cta: "Shop the edit",
  },
  {
    id: "ad-nord",
    brand: "Atelier Nord",
    initials: "AN",
    headline: "Three steps. That’s the routine.",
    text: "Cleanser, moisturiser and SPF made to work together.",
    image: "photo-ad-serum",
    cta: "Learn more",
  },
  {
    id: "ad-forma",
    brand: "Forma Studio",
    initials: "FS",
    headline: "Strength, one session at a time.",
    text: "Small-group training for beginners, every weekday morning.",
    image: "photo-ad-gym",
    cta: "Book a trial",
  },
];

/** Feed position after which an ad appears (every sixth post). */
export const AD_EVERY = 6;
/** Story groups between sponsored stories. */
export const STORY_AD_EVERY = 3;
