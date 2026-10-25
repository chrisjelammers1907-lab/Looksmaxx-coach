import type { DemoState, TopicId } from "./types";
import { topicName } from "./domain";
import { guides } from "./guides";
export interface CoachRequest {
  text: string;
  topic?: TopicId;
  hasPhoto: boolean;
  fileName?: string;
  state: DemoState;
}
export interface CoachResponse {
  text: string;
  proposal?: string;
  guide?: TopicId;
}
export interface CoachingService {
  reply(request: CoachRequest): Promise<CoachResponse>;
}
export interface ImageUnderstandingService {
  inspect(): Promise<{ status: "simulated"; observation: string }>;
}
export interface ImageGenerationService {
  preview(): Promise<{ status: "simulated"; label: string }>;
}
export interface ShoppingSearchService {
  search(): Promise<{ status: "simulated"; results: [] }>;
}
export function inferCoachTopic(
  text: string,
  fallback?: TopicId,
): TopicId | undefined {
  // Whole words only, so "chinos" is not "chin" and "handbag" is not "hands".
  const rules: [TopicId, RegExp][] = [
    // A named garment means the question is about clothing first.
    [
      "clothing",
      /\b(outfits?|wardrobe|capsule|shoes|sneakers|trainers|chinos|trousers|jeans|denim|shirts?|t-shirts?|tank tops?|suit|blazers?|jackets?|dress(es)?|handbags?)\b/i,
    ],
    [
      "makeup",
      /\b(makeup|make-up|concealer|foundation|mascara|contour|blush)\b/i,
    ],
    ["brows", /\b(brows?|eyebrows?|lashes|eyelash(es)?)\b/i],
    ["grooming", /\b(groom\w*|shav\w*|beards?|razors?|stubble)\b/i],
    [
      "face",
      /\b(jaw\w*|chin|cheekbones?|zygos?|zygomatic|maxilla|midface|mandible|mewing|eye area|under-eyes?|face shape)\b/i,
    ],
    [
      "colouring",
      /(?<!hair )\b(undertones?|colouring|coloring|tan|self-tan|contrast|palette)\b/i,
    ],
    ["sleep", /\b(sleep\w*|insomnia|tired|recovery|rest day)\b/i],
    ["presence", /\b(posture|presence|confiden\w*|eye contact|voice)\b/i],
    ["body", /\b(body lotion|nails?|cuticles?|deodorant|body care|hands?)\b/i],
    [
      "nutrition",
      /\b(calori\w*|protein|nutrition|food|meals?|diet\w*|macros?|weight loss|lose weight|losing weight|gain weight|fat loss)\b/i,
    ],
    [
      "skincare",
      /\b(skin\w*|acne|cleanser|moisturi\w*|sunscreen|spf|irritat\w*|retinol|serum|tretinoin|spironolactone)\b/i,
    ],
    ["hair", /\b(hair\w*|barbers?|shampoo|conditioner|fringe|scalp)\b/i],
    ["clothing", /\b(cloth\w*|wear\w*|style|fit|colour|color)\b/i],
    [
      "gym",
      /\b(gym|workouts?|train\w*|exercis\w*|mobility|weights?|muscles?)\b/i,
    ],
    ["smile", /\b(teeth|tooth|dental|smile|floss\w*|gums?|whiten\w*)\b/i],
    ["fragrance", /\b(fragrances?|perfumes?|scents?|cologne)\b/i],
    ["photos", /\b(journal|progress|before|after|comparison)\b/i],
  ];

  return (
    rules.find(([, pattern]) => pattern.test(text))?.[0] ||
    fallback ||
    (/\b(photo|picture|image)/i.test(text) ? "photos" : undefined)
  );
}
export const demoCoach: CoachingService = {
  async reply({ text, topic: entryTopic, hasPhoto, fileName, state }) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const topic = inferCoachTopic(
      text,
      entryTopic || [...state.chat].reverse().find((m) => m.guide)?.guide,
    );
    const owned =
      state.items
        .filter((item) => !topic || item.topic === topic)
        .slice(0, 4)
        .map((item) => item.name)
        .join(", ") || "No relevant items entered yet";
    const medical =
      /medicat|dnp|steroid|testosterone|spironolactone|dos(e|age)|diagnos|ghk|mk.?677|mounjaro|anavar|attractiveness score|bone measur/i.test(
        text,
      );
    const guide = topic ? guides[topic] : undefined;
    const opening =
      state.profile.coachStyle === "direct"
        ? "Let’s make this practical."
        : "Let’s find a manageable starting point for you.";
    const specific: Record<TopicId, string> = {
      skincare:
        "Keep it to cleanse, moisturise and SPF in the morning, and one treatment at night. Add one new product at a time and give it two weeks.",
      makeup:
        "Start with a sheer tint blended into the jaw, concealer only where needed, brows set and a coat of mascara. Less product, blended well, always looks better.",
      face: "The biggest levers are body fat, posture, sleep and how your hair and beard frame your face. Bone itself doesn’t change at home, so skip gadgets that promise it.",
      colouring:
        "Find your undertone and contrast first, then keep your best colours near your face. A gradual self-tan with daily SPF gives a glow without sun damage.",
      brows:
        "Brush up, trim what sticks out and only tweeze strays below and between. Set with gel. Doing a little less than planned usually looks best.",
      smile:
        "Two minutes twice a day with fluoride toothpaste, and clean between your teeth once a day. Pain, bleeding or swelling deserves a dentist.",
      hair: "Choose the cut first, then two or three products that hold it. Bring a front and a side photo to your barber or stylist.",
      grooming:
        "Prepare the skin, shave with the grain and finish with a balm. For a beard, one length and a neckline one finger above the Adam’s apple.",
      gym: "Three full-body sessions a week, a few compound lifts and a little more weight over time covers most beginner progress.",
      nutrition:
        "Set your calories with the calculator, then choose your carbs, protein and fat. Protein at every meal and the 7-day weight average keep you on track.",
      body: "Lotion on damp skin after the shower, short clean nails and cuticle oil at night. SPF on hands and neck too.",
      sleep:
        "A steady wake-up time, morning daylight, no caffeine after early afternoon and a cool, dark room do more than any supplement.",
      presence:
        "Shoulders back and down, chin level, five minutes of upper-back mobility and a beat longer eye contact. Speak a little slower than feels natural.",
      clothing:
        "Build one complete outfit from pieces you own. Fit first, three colours at most, and balance a loose piece with a fitted one.",
      fragrance:
        "Keep one fresh scent for the day and one warm scent for the evening. Test on skin and wait a few hours before you buy.",
      photos:
        "Same spot, same light, same distance, every few weeks. Compare months, not days.",
    };
    const nextQuestion: Record<TopicId, string> = {
      skincare: "Which products do you use now, and how does your skin feel?",
      makeup: "Is this for every day, or for an evening or photos?",
      face: "Which area would you like to work on first: eyes, midface, cheekbones or jaw?",
      colouring: "Do gold or silver look better against your skin?",
      brows: "Are your brows sparse, unruly or just in need of shape?",
      smile: "Is this about daily care, or is something bothering you?",
      hair: "What length and how much styling time do you want each morning?",
      grooming: "Clean shave, stubble or a full beard?",
      gym: "How many sessions fit your week, and what’s your experience?",
      nutrition: "Would you like to lose, maintain or gain weight?",
      body: "Which part matters most to you: skin, hands or nails?",
      sleep:
        "What time do you usually wake up, and how do you feel in the morning?",
      presence:
        "Where would you like to feel more confident: at work, on dates or in photos?",
      clothing:
        "Which occasion are you dressing for, and which pieces do you own?",
      fragrance: "What do you already enjoy, and when do you want to wear it?",
      photos: "What would you like to track over the next months?",
    };
    const proposal =
      topic === "clothing"
        ? "Plan one outfit using my owned pieces"
        : topic === "gym"
          ? "Log one comfortable training session this week"
          : topic === "photos"
            ? "Record one private dated observation"
            : topic === "hair"
              ? "Review two saved hairstyle references"
              : "Spend five minutes reviewing my personal routine";
    const priceQuestion = /budget|buy|shop|cost|price|afford/i.test(text);
    return {
      text: `${opening}\n\n${medical ? "I cannot diagnose, score attractiveness, infer bone measurements, or recommend medication/dose changes. The uploaded treatment references are unvalidated. Discuss treatment questions with a qualified clinician.\n\n" : ""}${topic ? `ABOUT ${topicName[topic].toUpperCase()}\n` : "YOUR NEXT STEP\n"}${topic ? specific[topic] : "Choose one small change that connects to your goal. Start with what you own and a routine that fits your week. You can ask about style, care, training or a specific next step in your own words."}\n\nYour stated goal: ${state.profile.goals || "Not provided"}.\nOwned items in this context: ${owned}.${priceQuestion ? `\nYour saved budget: ${state.profile.currency} ${state.profile.budget}. Demo prices are examples, not live offers.` : ""}\n\n${(topic ? nextQuestion[topic] : undefined) || "What would you like to work on first?"}${hasPhoto ? "\n\nPHOTO FEEDBACK EXAMPLE · Your attached photo has not been analyzed. No feature measurement or diagnosis is inferred." : ""}${fileName ? `\n\nATTACHED FILE · ${fileName} stays in this session. This demo coach does not read file contents yet, so tell me what you would like to know about it.` : ""}\n\nSimulated coach · This sample uses message keywords and your session context; it is not a live AI assessment.${guide ? " The guide for this category goes deeper." : ""}`,
      proposal,
      guide: topic,
    };
  },
};
export const demoImageUnderstanding: ImageUnderstandingService = {
  async inspect() {
    return {
      status: "simulated",
      observation: "Example only. No image analyzed.",
    };
  },
};
export const demoImageGeneration: ImageGenerationService = {
  async preview() {
    return {
      status: "simulated",
      label: "Visualization placeholder. No image generated.",
    };
  },
};
export const demoShopping: ShoppingSearchService = {
  async search() {
    return { status: "simulated", results: [] };
  },
};
