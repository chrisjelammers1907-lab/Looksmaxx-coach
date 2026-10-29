import { describe, expect, it } from "vitest";
import { alive, keepDemoStreaks } from "../src/lib/streaks";
import { addDays } from "../src/lib/training";

const today = "2026-10-29";
const seed = {
  mira: { count: 6, last: addDays(today, -1) },
  noor: { count: 2, last: addDays(today, -1) },
};

describe("demo chat streaks", () => {
  it("keeps a seeded streak alive while the visitor never touched it", () => {
    const saved = { mira: { count: 6, last: "2026-10-24" } };
    const kept = keepDemoStreaks(saved, seed);
    expect(alive(kept.mira, today)).toBe(6);
    expect(alive(kept.noor, today)).toBe(2);
  });

  it("leaves a streak the visitor built or broke themselves alone", () => {
    const saved = {
      mira: { count: 7, last: "2026-10-24" },
      noor: { count: 1, last: today },
    };
    const kept = keepDemoStreaks(saved, seed);
    expect(alive(kept.mira, today)).toBe(0);
    expect(kept.noor).toEqual({ count: 1, last: today });
  });
});
