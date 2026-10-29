import type { DemoState, PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  /** What the plan lets you do, in order of what matters. */
  features: string[];
  /** The small extras, named once and quietly. */
  extras?: string;
}

export interface Limits {
  coachMessages: number;
  coachFiles: number;
  trainingDays: number;
  scans: number;
  customStickers: number;
  ads: boolean;
}

/** Daily limits per plan; Signature has none. */
export const limits: Record<PlanId, Limits> = {
  free: {
    coachMessages: 10,
    coachFiles: 1,
    trainingDays: 3,
    scans: 0,
    customStickers: 0,
    ads: true,
  },
  plus: {
    coachMessages: 50,
    coachFiles: 5,
    trainingDays: 5,
    scans: 10,
    customStickers: 10,
    ads: false,
  },
  signature: {
    coachMessages: Infinity,
    coachFiles: Infinity,
    trainingDays: 7,
    scans: Infinity,
    customStickers: Infinity,
    ads: false,
  },
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Start your routines and find your style.",
    features: [
      "Routines, tasks and every beginner’s guide",
      "A coach check-in: 10 messages and 1 photo a day",
      "Plan 3 training days a week",
      "Log what you eat by hand",
      "The feed, reels and messages, with sponsored posts",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 9.99,
    yearly: 99.99,
    tagline: "Build the whole plan: face, body and style.",
    features: [
      "Everything in Free, without ads",
      "Your coach on hand: 50 messages and 5 photos a day",
      "Plan 5 training days a week",
      "Scan food barcodes, 10 a day",
    ],
    extras: "Also: up to 10 photo stickers of your own.",
  },
  {
    id: "signature",
    name: "Signature",
    monthly: 19.99,
    yearly: 199.99,
    tagline: "No limits, and your streaks are protected.",
    features: [
      "Everything in Plus",
      "Unlimited coach messages and photos",
      "Train every day and scan without limits",
      "Streak protection: one missed day won’t break a streak",
    ],
    extras:
      "Also: every chat theme and sticker pack, your own stickers without limit, and the Signature badge.",
  },
];

export const planOf = (state: DemoState) =>
  plans.find((p) => p.id === state.subscription.plan) || plans[0];

export const limitsOf = (state: DemoState) => limits[state.subscription.plan];

export const isPaid = (state: DemoState) => state.subscription.plan !== "free";
export const isSignature = (state: DemoState) =>
  state.subscription.plan === "signature";

/** The cheapest plan that lifts a limit, for upgrade prompts. */
export const nextPlan = (state: DemoState) =>
  state.subscription.plan === "free" ? "Plus" : "Signature";

/** Days a streak may skip before it breaks: Signature forgives one. */
export const streakGrace = (state: DemoState) => (isSignature(state) ? 2 : 1);

/** Today's coach and scan usage; it resets every day. */
export function coachUsage(state: DemoState, date: string) {
  const usage = state.coachUsage;
  return usage.date === date
    ? { scans: 0, ...usage }
    : { date, messages: 0, files: 0, scans: 0 };
}

export function coachLeft(state: DemoState, date: string) {
  const limit = limitsOf(state);
  const used = coachUsage(state, date);
  return {
    messages: Math.max(0, limit.coachMessages - used.messages),
    files: Math.max(0, limit.coachFiles - used.files),
    scans: Math.max(0, limit.scans - used.scans),
  };
}

export const euro = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    value,
  );

/** Yearly saving compared with paying monthly, in whole percent. */
export const yearlySaving = (plan: Plan) =>
  plan.monthly ? Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100) : 0;
