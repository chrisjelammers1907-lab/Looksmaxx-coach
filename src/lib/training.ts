import type {
  DemoState,
  SetProgress,
  TrainingDay,
  TrainingSession,
  Weekday,
  Workout,
} from "./types";

export const weekdays: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const asDate = (date: string) => new Date(`${date}T12:00:00`);
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const weekdayOf = (date: string): Weekday =>
  weekdays[(asDate(date).getDay() + 6) % 7];

export const addDays = (date: string, days: number) => {
  const next = asDate(date);
  next.setDate(next.getDate() + days);
  return iso(next);
};

/** Next calendar date (today included) that falls on `day`. */
export const nextDateFor = (day: Weekday, from: string) => {
  for (let i = 0; i < 7; i++) {
    const date = addDays(from, i);
    if (weekdayOf(date) === day) return date;
  }
  return from;
};

export function planFor(
  week: DemoState["trainingWeek"],
  date: string,
): TrainingDay | undefined {
  const day = week[weekdayOf(date)];
  if (!day || !day.exercises.length) return undefined;
  return day.repeat || day.date === date ? day : undefined;
}

/** Progress for a date, falling back to the planned sets (not yet ticked). */
export function progressFor(
  state: Pick<DemoState, "trainingWeek" | "trainingProgress">,
  date: string,
) {
  const plan = planFor(state.trainingWeek, date);
  const saved = state.trainingProgress[date] || {};
  return (plan?.exercises || []).map((exercise) => ({
    exercise,
    sets:
      saved[exercise.id] ||
      exercise.sets.map((set): SetProgress => ({ ...set, done: false })),
  }));
}

export const bestWeight = (workouts: Workout[], exercise: string) =>
  Math.max(
    0,
    ...workouts
      .filter((w) => w.exercise.toLowerCase() === exercise.toLowerCase())
      .map((w) => w.weight),
  );

/** Turns one day's progress into a session plus history rows. */
export function logDay(
  state: Pick<DemoState, "trainingWeek" | "trainingProgress">,
  date: string,
  id: () => string,
): { session?: TrainingSession; workouts: Workout[] } {
  const plan = planFor(state.trainingWeek, date);
  if (!plan) return { workouts: [] };
  const performed = progressFor(state, date);
  const workouts = performed
    .map(({ exercise, sets }) => {
      const done = sets.filter((s) => s.done);
      if (!done.length) return undefined;
      return {
        id: id(),
        date,
        exercise: exercise.name,
        sets: done.length,
        reps: Math.max(...done.map((s) => s.reps)),
        weight: Math.max(...done.map((s) => s.weight)),
      };
    })
    .filter((w): w is Workout => !!w);
  return {
    workouts,
    session: {
      id: id(),
      date,
      name: plan.name,
      status: workouts.length ? "done" : "skipped",
      exercises: performed.map(({ exercise, sets }) => ({
        name: exercise.name,
        sets,
      })),
    },
  };
}

/**
 * Logs every finished day (before `today`) that had a planned session and is
 * not logged yet. Untouched sessions are recorded as skipped.
 */
export function autoLog(
  state: DemoState,
  todayDate: string,
  id: () => string,
): Partial<DemoState> | undefined {
  const logged = new Set(state.sessions.map((s) => s.date));
  const start = [state.trainingSince, addDays(todayDate, -14)].sort()[1];
  const sessions = [...state.sessions];
  const workouts = [...state.workouts];
  const progress = { ...state.trainingProgress };
  let changed = false;
  for (let date = start; date < todayDate; date = addDays(date, 1)) {
    if (logged.has(date)) continue;
    const result = logDay(state, date, id);
    if (!result.session) continue;
    sessions.push(result.session);
    workouts.push(...result.workouts);
    delete progress[date];
    changed = true;
  }
  return changed
    ? { sessions, workouts, trainingProgress: progress }
    : undefined;
}
