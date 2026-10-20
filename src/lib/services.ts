import type { DemoState, TopicId } from "./types";
import { topicName } from "./domain";
import { guides } from "./guides";
export interface CoachRequest {
  text: string;
  topic?: TopicId;
  hasPhoto: boolean;
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
  const rules: [TopicId, RegExp][] = [
    [
      "grooming",
      /\b(brows?|eyebrows?|lashes|eyelash|groom|shav|beard|makeup|concealer)/i,
    ],
    [
      "skincare",
      /\b(skin|acne|cleanser|moisturi|sunscreen|spf|irritat|retinol|serum|tretinoin|spironolactone)/i,
    ],
    ["hair", /\b(hair|barber|shampoo|conditioner|fringe|scalp)/i],
    [
      "clothing",
      /\b(outfit|wardrobe|cloth|wear|shirt|denim|dress|style|fit|colour|color|shoes|jacket)/i,
    ],
    [
      "gym",
      /\b(gym|workout|train|exercise|protein|calori|nutrition|food|meal|posture|mobility|weight|muscle)/i,
    ],
    ["smile", /\b(teeth|tooth|dental|smile|floss|gum|whiten)/i],
    ["fragrance", /\b(fragrance|perfume|scent|cologne)/i],
    ["photos", /\b(journal|progress|before|after|comparison)/i],
  ];
  return (
    rules.find(([, pattern]) => pattern.test(text))?.[0] ||
    fallback ||
    (/\b(photo|picture|image)/i.test(text) ? "photos" : undefined)
  );
}
export const demoCoach: CoachingService = {
  async reply({ text, topic: entryTopic, hasPhoto, state }) {
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
    const specific: Partial<Record<TopicId, string>> = {
      skincare:
        "Keep cleansing, moisturising and sun protection as separate jobs. Start with what you already tolerate, then record one change at a time. Compatibility depends on full formulas and your response; a product name is not enough to establish it.",
      clothing:
        "Build one complete outfit from your own pieces first. Compare fit and colours for the occasion you actually have in mind. A reference is a starting point; adjust it to your preferences instead of replacing your whole wardrobe.",
      hair: "Save a couple of references and note what you like about their length, texture or colour. Compare maintenance as well as appearance. A visualization is inspiration, not a prediction of a result.",
      gym: "Start with your current week and comfortable experience level. Log exercises, sets, repetitions and load; keep nutrition estimates and their sources separate from measured facts. The demo’s starter targets are not calculated personal requirements.",
      grooming:
        "Start with clean tools and a small, reversible change. Brow shape and darkness are preferences, not universal ideals. Keep ordinary hair dyes and heated tools away from your eyes; lash-growth claims in the references do not establish suitability for you.",
      smile:
        "Keep daily brushing and interdental care manageable, following suitable dental and product guidance. A photo cannot diagnose a dental problem or predict whitening. A dental professional can help with clinical questions.",
      fragrance:
        "Start with what you own, how it smells to you over time and the setting you want it for. Compare samples within your budget rather than assuming a popular scent will suit everyone.",
      photos:
        "Keep dates, light, camera distance and pose consistent when comparing real progress. Record a neutral observation. Separate edited or generated inspiration from real photos, and keep your journal audience independent of account visibility.",
    };
    const nextQuestion: Partial<Record<TopicId, string>> = {
      skincare:
        "Which products are you using now, and how does your skin feel?",
      clothing:
        "Which occasion are you dressing for, and which owned pieces would you like to use?",
      hair: "What length, texture and maintenance level are you aiming for?",
      gym: "What is your current experience, and how many sessions fit your week?",
      grooming:
        "Are you interested in maintenance, shaping or a reversible cosmetic change?",
      smile:
        "Are you organising daily care, or is there a symptom you need help describing to a professional?",
      fragrance: "What do you already enjoy, and when do you want to wear it?",
      photos:
        "What would you like to observe, and do you have comparable dates and lighting?",
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
      text: `${opening}\n\n${medical ? "I cannot diagnose, score attractiveness, infer bone measurements, or recommend medication/dose changes. The uploaded treatment references are unvalidated. Discuss treatment questions with a qualified clinician.\n\n" : ""}${topic ? `ABOUT ${topicName[topic].toUpperCase()}\n` : "YOUR NEXT STEP\n"}${topic ? specific[topic] : "Choose one small change that connects to your goal. Start with what you own and a routine that fits your week. You can ask about style, care, training or a specific next step in your own words."}\n\nYour stated goal: ${state.profile.goals || "Not provided"}.\nOwned items in this context: ${owned}.${priceQuestion ? `\nYour saved budget: ${state.profile.currency} ${state.profile.budget}. Demo prices are examples, not live offers.` : ""}\n\n${(topic ? nextQuestion[topic] : undefined) || "What would you like to work on first?"}${hasPhoto ? "\n\nPHOTO FEEDBACK EXAMPLE · Your attached photo has not been analyzed. No feature measurement or diagnosis is inferred." : ""}\n\nSimulated coach · This sample uses message keywords and your session context; it is not a live AI assessment.${guide ? " The linked beginner guide explains the reference material behind this topic." : ""}`,
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
