import type { AppSettings } from "./types";

type WeightUnit = AppSettings["weightUnit"];
const LB_PER_KG = 2.2046226218;
const CM_PER_INCH = 2.54;

const round = (value: number, step = 0.1) => Math.round(value / step) * step;

/** Weights are stored in kilograms and shown in the person's unit. */
export const fromKg = (kg: number, unit: WeightUnit) =>
  Number(round(unit === "lb" ? kg * LB_PER_KG : kg).toFixed(1));

export const toKg = (value: number, unit: WeightUnit) =>
  unit === "lb" ? value / LB_PER_KG : value;

export const weightLabel = (kg: number, unit: WeightUnit) =>
  `${fromKg(kg, unit)} ${unit}`;

export const cmFromFeet = (feet: number, inches: number) =>
  (feet * 12 + inches) * CM_PER_INCH;

export function feetFromCm(cm: number) {
  const total = Math.round(cm / CM_PER_INCH);
  return { feet: Math.floor(total / 12), inches: total % 12 };
}
