import type { DemoState, TopicId } from "./types";
import { topicName } from "./domain";
export interface CoachRequest {
  text: string;
  topic?: TopicId;
  hasPhoto: boolean;
  state: DemoState;
}
export interface CoachResponse {
  text: string;
  proposal?: string;
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
export const demoCoach: CoachingService = {
  async reply({ text, topic, hasPhoto, state }) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const owned =
      state.items
        .filter((i) => !topic || i.topic === topic)
        .map((i) => i.name)
        .slice(0, 4)
        .join(", ") || "No relevant products entered";
    const routines =
      state.routines
        .filter((r) => !topic || r.topic === topic)
        .map((r) => r.title)
        .join(", ") || "No relevant routines entered";
    const caution =
      /medicat|dnp|steroid|testosterone|spironolactone|dose|diagnos|ghk|mk.?677|mounjaro|anavar|score|bone/i.test(
        text,
      );
    const advice: Record<string, string> = {
      skincare:
        "1. Start with the products you already tolerate. A gentle cleanse, moisturizer and sunscreen are an example starting point.\n2. Keep a dated note of comfort or irritation. Full ingredients and your response matter; compatibility is uncertain.\n3. Review one change at a time. Persistent irritation belongs with a qualified clinician.",
      clothing:
        "1. Start with an outfit from your owned pieces. This respects your budget and shows what is missing.\n2. Compare fit at shoulders and length using your own notes; no fit is inferred from an image.\n3. Try one neutral combination and save what feels like you. Price suggestions in this demo are examples.",
      hair: "1. Save two references with a texture you enjoy. A reference is not a prediction of your result.\n2. Note your own length, texture and maintenance preference.\n3. Try gentle styling with products you already tolerate; color changes may need a qualified stylist.",
      gym: "1. Review your current training schedule rather than assuming example history is current.\n2. Log one comfortable session and a meal with a clearly stated estimate source.\n3. Include a comfortable movement break. Nutrition targets are user-entered examples, not calculated requirements.",
      grooming:
        "1. Choose the detail you want to maintain, without chasing a single ideal shape.\n2. Keep tools clean and make small changes only if comfortable.\n3. Write down what you like so your routine reflects your preference.",
      smile:
        "1. Keep a manageable daily brushing and interdental-care routine following professional and product guidance.\n2. Note your own comfort.\n3. A dental professional can address symptoms or clinical concerns. No whitening result or diagnosis can be predicted here.",
      fragrance:
        "1. Start from your collection and the occasion.\n2. Compare your own notes over time; scents develop differently.\n3. Shortlist within your stated budget before shopping. Example prices and products are not live offers.",
      photos:
        "1. Select two real photos from the same topic.\n2. Keep lighting, pose, lens and editing as consistent as possible.\n3. Record a neutral observation. No measurement, attractiveness score or transformation is inferred.",
      general:
        "1. Pick one manageable daily ritual connected to your goal.\n2. Start with what you own instead of buying a complete routine.\n3. Review how it fits your week before adding more. Your plan is editable, and no existing routine will be overwritten.",
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
    return {
      text: `${state.profile.coachStyle === "direct" ? "Let’s choose a clear next step." : "A little consistency can be a kind place to start."}\n\nPROFILE CONTEXT · FICTIONAL STARTER OR YOUR SESSION EDITS\nGoal: ${state.profile.goals || "Not provided"}. Preferences: ${state.profile.preferences || "Not provided"}. Restrictions: ${state.profile.restrictions || "Not provided; none assumed"}. Budget: ${state.profile.currency} ${state.profile.budget}.\nOwned: ${owned}.\nRoutines: ${routines}. Current plan: ${state.goals.length} goals.\n\nEXAMPLE ${topic ? topicName[topic].toUpperCase() : "GENERAL"} GUIDANCE\n${caution ? "I cannot diagnose, score attractiveness, infer bone measurements, or recommend medication/dose changes. Uploaded PDFs and prior AI suggestions are unvalidated references. Discuss treatment questions with a qualified clinician.\n\n" : ""}${advice[topic || "general"]}\n\n${hasPhoto ? "PHOTO FEEDBACK EXAMPLE · Your attached photo has not been analyzed. A real review would need your context; this demo can only suggest consistent lighting and user-controlled observations.\n\n" : ""}This is a deterministic demo response, not a live AI assessment.`,
      proposal,
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
