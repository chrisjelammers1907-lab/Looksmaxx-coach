import type { ExtraNutrients, Food, Macros } from "./types";

export const macroFields = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "carbs", label: "Carbohydrates", unit: "g" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
] as const;

export interface ExtraNutrient {
  key: string;
  label: string;
  unit: "g" | "mg" | "µg";
  group: "Details" | "Minerals" | "Vitamins";
  /** Open Food Facts nutriment name; its `_100g` values are in grams. */
  off: string;
}

export const extraNutrients: ExtraNutrient[] = [
  { key: "fibre", label: "Fibre", unit: "g", group: "Details", off: "fiber" },
  { key: "sugar", label: "Sugars", unit: "g", group: "Details", off: "sugars" },
  {
    key: "satFat",
    label: "Saturated fat",
    unit: "g",
    group: "Details",
    off: "saturated-fat",
  },
  { key: "salt", label: "Salt", unit: "g", group: "Details", off: "salt" },
  {
    key: "cholesterol",
    label: "Cholesterol",
    unit: "mg",
    group: "Details",
    off: "cholesterol",
  },
  {
    key: "sodium",
    label: "Sodium",
    unit: "mg",
    group: "Minerals",
    off: "sodium",
  },
  {
    key: "potassium",
    label: "Potassium",
    unit: "mg",
    group: "Minerals",
    off: "potassium",
  },
  {
    key: "calcium",
    label: "Calcium",
    unit: "mg",
    group: "Minerals",
    off: "calcium",
  },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mg",
    group: "Minerals",
    off: "magnesium",
  },
  { key: "iron", label: "Iron", unit: "mg", group: "Minerals", off: "iron" },
  { key: "zinc", label: "Zinc", unit: "mg", group: "Minerals", off: "zinc" },
  {
    key: "vitA",
    label: "Vitamin A",
    unit: "µg",
    group: "Vitamins",
    off: "vitamin-a",
  },
  {
    key: "vitB6",
    label: "Vitamin B6",
    unit: "mg",
    group: "Vitamins",
    off: "vitamin-b6",
  },
  {
    key: "vitB12",
    label: "Vitamin B12",
    unit: "µg",
    group: "Vitamins",
    off: "vitamin-b12",
  },
  {
    key: "folate",
    label: "Folate (B9)",
    unit: "µg",
    group: "Vitamins",
    off: "vitamin-b9",
  },
  {
    key: "vitC",
    label: "Vitamin C",
    unit: "mg",
    group: "Vitamins",
    off: "vitamin-c",
  },
  {
    key: "vitD",
    label: "Vitamin D",
    unit: "µg",
    group: "Vitamins",
    off: "vitamin-d",
  },
  {
    key: "vitE",
    label: "Vitamin E",
    unit: "mg",
    group: "Vitamins",
    off: "vitamin-e",
  },
  {
    key: "vitK",
    label: "Vitamin K",
    unit: "µg",
    group: "Vitamins",
    off: "vitamin-k",
  },
];

const fromGrams = { g: 1, mg: 1000, µg: 1_000_000 } as const;
const tidy = (value: number) =>
  value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;

export interface ScannedProduct {
  barcode: string;
  name: string;
  brand?: string;
  /** Suggested amount in grams (one serving, else 100 g). */
  grams: number;
  per100: Macros & { extra?: ExtraNutrients };
}

/** Reads an Open Food Facts v2 product response. */
export function parseOpenFoodFacts(
  barcode: string,
  json: unknown,
): ScannedProduct | null {
  if (!json || typeof json !== "object") return null;
  const product = (json as { product?: Record<string, unknown> }).product;
  if (!product || typeof product !== "object") return null;
  const n = (product.nutriments || {}) as Record<string, unknown>;
  const num = (key: string) => {
    const value = Number(n[`${key}_100g`]);
    return Number.isFinite(value) && value >= 0 ? value : undefined;
  };
  const kcal = num("energy-kcal") ?? (num("energy") ?? 0) / 4.184;
  const extra: ExtraNutrients = {};
  for (const nutrient of extraNutrients) {
    const grams = num(nutrient.off);
    if (grams !== undefined)
      extra[nutrient.key] = tidy(grams * fromGrams[nutrient.unit]);
  }
  const serving = Number(product.serving_quantity);
  return {
    barcode,
    name: String(product.product_name || "").trim() || `Product ${barcode}`,
    brand:
      String(product.brands || "")
        .split(",")[0]
        .trim() || undefined,
    grams: Number.isFinite(serving) && serving > 0 ? serving : 100,
    per100: {
      calories: Math.round(kcal),
      carbs: tidy(num("carbohydrates") ?? 0),
      protein: tidy(num("proteins") ?? 0),
      fat: tidy(num("fat") ?? 0),
      extra,
    },
  };
}

export async function lookUpBarcode(barcode: string) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=product_name,brands,nutriments,serving_quantity`,
  );
  if (!response.ok) return null;
  return parseOpenFoodFacts(barcode, await response.json());
}

/** Scales per-100 g values to the amount eaten. */
export function scaleTo(
  per100: NonNullable<Food["per100"]>,
  grams: number,
): Macros & { extra: ExtraNutrients } {
  const f = grams / 100;
  const extra: ExtraNutrients = {};
  for (const [key, value] of Object.entries(per100.extra || {}))
    if (value !== undefined) extra[key] = tidy(value * f);
  return {
    calories: Math.round(per100.calories * f),
    carbs: tidy(per100.carbs * f),
    protein: tidy(per100.protein * f),
    fat: tidy(per100.fat * f),
    extra,
  };
}

export function totals(foods: Food[]) {
  const sum: Macros & { extra: ExtraNutrients } = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    extra: {},
  };
  for (const food of foods) {
    sum.calories += food.calories;
    sum.carbs += food.carbs;
    sum.protein += food.protein;
    sum.fat += food.fat;
    for (const [key, value] of Object.entries(food.extra || {}))
      if (value !== undefined) sum.extra[key] = (sum.extra[key] || 0) + value;
  }
  sum.carbs = tidy(sum.carbs);
  sum.protein = tidy(sum.protein);
  sum.fat = tidy(sum.fat);
  for (const key of Object.keys(sum.extra))
    sum.extra[key] = tidy(sum.extra[key]!);
  return sum;
}

export type Sex = "female" | "male";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very";
export type CalorieGoal = "lose" | "maintain" | "gain";

export const activityLevels: Record<
  Activity,
  { label: string; factor: number }
> = {
  sedentary: { label: "Mostly sitting, little exercise", factor: 1.2 },
  light: { label: "Light: exercise 1–3 days a week", factor: 1.375 },
  moderate: { label: "Moderate: exercise 3–5 days a week", factor: 1.55 },
  active: { label: "Active: hard exercise 6–7 days a week", factor: 1.725 },
  very: { label: "Very active: physical job and training", factor: 1.9 },
};

export interface CalorieInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: CalorieGoal;
}

/** Lowest daily target the calculator will suggest. */
export const calorieFloor = (sex: Sex) => (sex === "male" ? 1500 : 1200);

/**
 * Mifflin-St Jeor estimate. Under 18 it only gives maintenance; a deficit is
 * at most 500 kcal or 20 % of maintenance and never below the floor.
 */
export function estimateCalories(input: CalorieInput) {
  const bmr =
    10 * input.weightKg +
    6.25 * input.heightCm -
    5 * input.age +
    (input.sex === "male" ? 5 : -161);
  const maintenance = bmr * activityLevels[input.activity].factor;
  const minor = input.age < 18;
  const goal: CalorieGoal = minor ? "maintain" : input.goal;
  let target = maintenance;
  if (goal === "lose") target = maintenance - Math.min(500, maintenance * 0.2);
  if (goal === "gain") target = maintenance + 300;
  const floor = calorieFloor(input.sex);
  const floored = goal === "lose" && target < floor;
  // Never below the floor, and never a surplus when the aim is to lose.
  if (floored) target = Math.min(floor, maintenance);
  const ten = (value: number) => Math.round(value / 10) * 10;
  return {
    bmr: ten(bmr),
    maintenance: ten(maintenance),
    target: ten(target),
    goal,
    minor,
    floored,
  };
}

/** Average of the entries in the seven days up to and including `date`. */
export function weekAverage(
  entries: { date: string; kg: number }[],
  date: string,
) {
  const end = new Date(`${date}T12:00:00`).getTime();
  const inWeek = entries.filter((e) => {
    const t = new Date(`${e.date}T12:00:00`).getTime();
    return t <= end && end - t < 7 * 86_400_000;
  });
  if (!inWeek.length) return undefined;
  return inWeek.reduce((a, e) => a + e.kg, 0) / inWeek.length;
}
