import type { Item, Post } from "./types";
export const today = () => new Date().toISOString().slice(0, 10);
export const uid = () => crypto.randomUUID();
export function totalPrice(items: Item[]): string {
  if (!items.length) return "No items yet";
  const known = items.filter((i) => i.price !== null);
  const currencies = [...new Set(items.map((i) => i.currency))];
  if (currencies.length > 1) return "Mixed currencies · no combined total";
  const value = known.reduce((sum, i) => sum + (i.price ?? 0), 0);
  if (!known.length) return "Price unavailable";
  return `${money(value, currencies[0])}${known.length < items.length ? " + unpriced items" : ""}`;
}
export function money(value: number, currency = "EUR") {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}
export const safePurchaseUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
};
export function mayViewPost(
  post: Post | undefined,
  viewer = "you",
  blocked: string[] = [],
  accountVisibility: "public" | "private" = "public",
  approvedFollowers: string[] = [],
) {
  if (!post || blocked.includes(post.author)) return false;
  if (post.author === viewer) return true;
  if (post.draft) return false;
  if (post.media?.origin === "private-upload" || post.audience === "private")
    return false;
  if (
    post.author === "you" &&
    (accountVisibility === "private" || post.audience === "followers")
  )
    return approvedFollowers.includes(viewer);
  return post.audience === "public";
}
export function maySharePost(
  post: Post | undefined,
  blocked: string[] = [],
  accountVisibility: "public" | "private" = "public",
  recipient?: string,
  approvedFollowers: string[] = [],
) {
  if (!post || post.audience === "private" || post.draft) return false;
  if (post.media?.origin === "private-upload") return false;
  return mayViewPost(
    post,
    recipient || "visitor",
    blocked,
    accountVisibility,
    approvedFollowers,
  );
}
export function workoutVolume(sets: number, reps: number, weight: number) {
  return sets * reps * weight;
}
export const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export const asset = (key: string) =>
  `/assets/${key}.${key.startsWith("sound-") ? "mp3" : key === "motion" ? "mp4" : ["skin", "gym", "smile", "fragrance", "shirt", "tee", "denim", "food"].includes(key) ? "svg" : "jpg"}`;
export const topicName: Record<string, string> = {
  skincare: "Skincare",
  clothing: "Clothing & Style",
  hair: "Hair",
  gym: "Gym, Nutrition & Posture",
  grooming: "Brows & Grooming",
  smile: "Teeth & Smile",
  fragrance: "Fragrance",
  photos: "Photos & Progress",
};
