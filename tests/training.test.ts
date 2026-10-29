import { describe, expect, it } from "vitest";
import { makeInitialState } from "../src/lib/data";
import {
  addDays,
  autoLog,
  bestWeight,
  nextDateFor,
  planFor,
  weekdayOf,
} from "../src/lib/training";
import type { DemoState } from "../src/lib/types";

let n = 0;
const id = () => `id-${++n}`;
// 2026-10-19 is a Monday.
const base = (): DemoState => ({
  ...makeInitialState(),
  trainingSince: "2026-10-19",
  sessions: [],
  trainingProgress: {},
  workouts: [
    {
      id: "w",
      date: "2026-10-12",
      exercise: "Bench press",
      sets: 3,
      reps: 8,
      weight: 60,
    },
  ],
});

describe("training planner", () => {
  it("maps dates to weekdays and finds the next matching day", () => {
    expect(weekdayOf("2026-10-19")).toBe("Monday");
    expect(weekdayOf("2026-10-25")).toBe("Sunday");
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(nextDateFor("Wednesday", "2026-10-19")).toBe("2026-10-21");
  });

  it("repeats weekly days and keeps one-off days to their date", () => {
    const state = base();
    expect(planFor(state.trainingWeek, "2026-10-26")?.name).toBe("Upper");
    const once = {
      ...state.trainingWeek,
      Tuesday: {
        ...state.trainingWeek.Monday!,
        repeat: false,
        date: "2026-10-20",
      },
    };
    expect(planFor(once, "2026-10-20")).toBeDefined();
    expect(planFor(once, "2026-10-27")).toBeUndefined();
  });

  it("logs past days automatically: ticked sets as done, untouched as skipped", () => {
    const state = base();
    state.trainingProgress = {
      "2026-10-19": {
        "ex-bench": [
          { reps: 8, weight: 62.5, done: true },
          { reps: 8, weight: 62.5, done: false },
        ],
      },
    };
    const result = autoLog(state, "2026-10-22", id)!;
    expect(result.sessions!.map((s) => [s.date, s.status])).toEqual([
      ["2026-10-19", "done"],
      ["2026-10-21", "skipped"],
    ]);
    const bench = result.workouts!.find((w) => w.date === "2026-10-19")!;
    expect(bench).toMatchObject({
      exercise: "Bench press",
      sets: 1,
      weight: 62.5,
    });
    expect(result.trainingProgress).toEqual({});
    expect(bestWeight(result.workouts!, "bench press")).toBe(62.5);
    // Running again on the same day changes nothing.
    expect(autoLog({ ...state, ...result }, "2026-10-22", id)).toBeUndefined();
  });

  it("never backfills days before the plan started", () => {
    const state = { ...base(), trainingSince: "2026-10-22" };
    expect(autoLog(state, "2026-10-22", id)).toBeUndefined();
  });
});
