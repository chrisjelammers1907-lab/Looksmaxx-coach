import { describe, expect, it } from "vitest";
import {
  estimateCalories,
  parseOpenFoodFacts,
  scaleTo,
  totals,
  weekAverage,
} from "../src/lib/nutrition";
import { groupOf, isDone, toggleDone } from "../src/lib/tasks";
import { fromKg, toKg } from "../src/lib/units";
import type { Food, Goal } from "../src/lib/types";

describe("nutrition", () => {
  it("reads Open Food Facts values per 100 g in the right units", () => {
    const product = parseOpenFoodFacts("123456", {
      product: {
        product_name: "Oats",
        brands: "Mill, Other",
        nutriments: {
          "energy-kcal_100g": 370,
          carbohydrates_100g: 60,
          proteins_100g: 13,
          fat_100g: 7,
          potassium_100g: 0.4,
          "vitamin-b12_100g": 0.000001,
        },
      },
    });
    expect(product).toMatchObject({
      name: "Oats",
      brand: "Mill",
      grams: 100,
      per100: { calories: 370, carbs: 60, protein: 13, fat: 7 },
    });
    expect(product!.per100.extra).toEqual({ potassium: 400, vitB12: 1 });
    expect(parseOpenFoodFacts("1", { status: 0 })).toBeNull();
  });

  it("scales to the amount eaten and adds up a day", () => {
    const per100 = {
      calories: 80,
      carbs: 4,
      protein: 10,
      fat: 2,
      extra: { salt: 0.1 },
    };
    expect(scaleTo(per100, 250)).toEqual({
      calories: 200,
      carbs: 10,
      protein: 25,
      fat: 5,
      extra: { salt: 0.3 },
    });
    const food = (calories: number, extra = {}): Food => ({
      id: String(calories),
      date: "2026-10-25",
      name: "x",
      calories,
      carbs: 1.15,
      protein: 2,
      fat: 3,
      source: "manual",
      extra,
    });
    expect(
      totals([food(100, { sugar: 2 }), food(250, { sugar: 3.5 })]),
    ).toEqual({
      calories: 350,
      carbs: 2.3,
      protein: 4,
      fat: 6,
      extra: { sugar: 5.5 },
    });
  });

  it("estimates calories safely", () => {
    const adult = {
      sex: "male" as const,
      age: 30,
      heightCm: 180,
      weightKg: 80,
      activity: "moderate" as const,
      goal: "lose" as const,
    };
    const result = estimateCalories(adult);
    expect(result.bmr).toBe(1780);
    expect(result.maintenance).toBe(2760);
    expect(result.target).toBe(2260);
    // Under 18 only maintenance is offered.
    const teen = estimateCalories({ ...adult, age: 16 });
    expect(teen.goal).toBe("maintain");
    expect(teen.target).toBe(teen.maintenance);
    // A small, sedentary person never gets a target under the floor.
    const small = estimateCalories({
      ...adult,
      sex: "female",
      heightCm: 150,
      weightKg: 45,
      age: 60,
      activity: "sedentary",
    });
    expect(small.floored).toBe(true);
    expect(small.target).toBeLessThanOrEqual(small.maintenance);
    expect(small.target).toBeGreaterThanOrEqual(
      Math.min(1200, small.maintenance),
    );
  });

  it("averages the last seven days of weight", () => {
    const entries = [
      { date: "2026-10-10", kg: 90 },
      { date: "2026-10-20", kg: 80 },
      { date: "2026-10-25", kg: 79 },
    ];
    expect(weekAverage(entries, "2026-10-25")).toBe(79.5);
    expect(weekAverage(entries, "2026-10-01")).toBeUndefined();
  });

  it("converts between kg and lb", () => {
    expect(fromKg(80, "lb")).toBe(176.4);
    expect(fromKg(toKg(176.4, "lb"), "lb")).toBe(176.4);
    expect(fromKg(62.5, "kg")).toBe(62.5);
  });
});

describe("tasks", () => {
  const task = (extra: Partial<Goal>): Goal => ({
    id: "t",
    text: "t",
    cadence: "Daily",
    done: false,
    repeat: "none",
    ...extra,
  });
  it("groups by date", () => {
    const date = "2026-10-25";
    expect(groupOf(task({ due: "2026-10-25" }), date)).toBe("today");
    expect(groupOf(task({ due: "2026-10-28" }), date)).toBe("week");
    expect(groupOf(task({ due: "2026-11-20" }), date)).toBe("later");
    expect(groupOf(task({}), date)).toBe("later");
    expect(groupOf(task({ due: "2026-10-20" }), date)).toBe("overdue");
    expect(
      groupOf(task({ due: "2026-10-20", done: true }), date),
    ).toBeUndefined();
    expect(groupOf(task({ repeat: "daily" }), date)).toBe("today");
  });
  it("daily tasks reset each day", () => {
    const daily = toggleDone(task({ repeat: "daily" }), "2026-10-25");
    expect(isDone(daily, "2026-10-25")).toBe(true);
    expect(isDone(daily, "2026-10-26")).toBe(false);
  });
});

describe("streak protection", () => {
  it("forgives one missed day only with a grace of two", async () => {
    const { alive, bump } = await import("../src/lib/streaks");
    const streak = { count: 5, last: "2026-10-23" };
    expect(alive(streak, "2026-10-25")).toBe(0);
    expect(alive(streak, "2026-10-25", 2)).toBe(5);
    expect(bump(streak, "2026-10-25").count).toBe(1);
    expect(bump(streak, "2026-10-25", 2).count).toBe(6);
  });
});
