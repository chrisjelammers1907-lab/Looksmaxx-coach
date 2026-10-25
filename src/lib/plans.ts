import type { DemoState, PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Everything you need to start.",
    features: [
      "Feed, reels, stories and chats",
      "10 coach messages a day, 1 file",
      "Routines, tasks and guides",
      "Up to 3 training days a week",
      "Food log by hand",
      "Includes sponsored posts",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 9.99,
    yearly: 99.99,
    tagline: "No limits, no ads.",
    features: [
      "Everything in Free",
      "Unlimited coach messages and files",
      "Unlimited training days",
      "Barcode scan with nutrition data",
      "Make your own stickers",
      "No ads",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    monthly: 19.99,
    yearly: 199.99,
    tagline: "The full CHARETT experience.",
    features: [
      "Everything in Plus",
      "All chat themes and sticker packs from day one",
      "Streak protection: one missed day won’t break a streak",
      "Signature badge on your profile",
    ],
  },
];

export const freeLimits = { coachMessages: 10, coachFiles: 1, trainingDays: 3 };

export const planOf = (state: DemoState) =>
  plans.find((p) => p.id === state.subscription.plan) || plans[0];

export const isPaid = (state: DemoState) => state.subscription.plan !== "free";
export const isSignature = (state: DemoState) =>
  state.subscription.plan === "signature";

/** Days a streak may skip before it breaks: Signature forgives one. */
export const streakGrace = (state: DemoState) => (isSignature(state) ? 2 : 1);

/** Today's coach usage; it resets every day. */
export function coachUsage(state: DemoState, date: string) {
  const usage = state.coachUsage;
  return usage.date === date ? usage : { date, messages: 0, files: 0 };
}

export function coachLeft(state: DemoState, date: string) {
  if (isPaid(state)) return { messages: Infinity, files: Infinity };
  const used = coachUsage(state, date);
  return {
    messages: Math.max(0, freeLimits.coachMessages - used.messages),
    files: Math.max(0, freeLimits.coachFiles - used.files),
  };
}

export const euro = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    value,
  );

/** Yearly saving compared with paying monthly, in whole percent. */
export const yearlySaving = (plan: Plan) =>
  plan.monthly ? Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100) : 0;
