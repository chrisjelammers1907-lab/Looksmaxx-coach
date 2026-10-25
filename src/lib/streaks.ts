import type { Streak, TrainingSession } from "./types";
import { addDays } from "./training";

export const rewards = [
  { days: 3, id: "stickers", label: "Streak sticker pack" },
  { days: 7, id: "themes", label: "Chat themes" },
  { days: 30, id: "badge", label: "Streak badge on your profile" },
  { days: 100, id: "gold", label: "Gold leaf chat theme" },
] as const;

/** Whether `last` is within `grace` days before `date` (1 = yesterday). */
const kept = (last: string, date: string, grace: number) =>
  last >= addDays(date, -grace) && last <= date;

/**
 * Counts today once; a missed day restarts the streak at 1. With a grace of
 * 2 (Signature), one missed day is forgiven.
 */
export function bump(
  streak: Streak | undefined,
  date: string,
  grace = 1,
): Streak {
  if (!streak) return { count: 1, last: date };
  if (streak.last === date) return streak;
  if (kept(streak.last, date, grace))
    return { count: streak.count + 1, last: date };
  return { count: 1, last: date };
}

/** A streak shown today is still alive if it was kept within the grace. */
export const alive = (streak: Streak | undefined, date: string, grace = 1) =>
  streak && kept(streak.last, date, grace) ? streak.count : 0;

/** The reward newly reached when a streak moves from `before` to `after`. */
export const unlocked = (before: number, after: number) =>
  rewards.find((r) => before < r.days && after >= r.days);

export const hasReward = (best: number, id: (typeof rewards)[number]["id"]) =>
  best >= rewards.find((r) => r.id === id)!.days;

/** Planned sessions completed in a row, newest first, until a skip. */
export function trainingStreak(sessions: TrainingSession[]) {
  let count = 0;
  for (const s of [...sessions].sort((a, b) => b.date.localeCompare(a.date))) {
    if (s.status !== "done") break;
    count++;
  }
  return count;
}
