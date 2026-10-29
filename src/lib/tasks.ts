import type { Goal } from "./types";
import { addDays, weekdayOf } from "./training";

export type TaskGroup = "overdue" | "today" | "week" | "later";
export const groupLabels: Record<TaskGroup, string> = {
  overdue: "Overdue",
  today: "Today",
  week: "This week",
  later: "Later",
};

export const repeatOf = (g: Goal) =>
  g.repeat ??
  (g.cadence === "Daily"
    ? "daily"
    : g.cadence === "Weekly"
      ? "weekly"
      : "none");

export function isDone(g: Goal, date: string) {
  const repeat = repeatOf(g);
  if (repeat === "daily") return g.doneOn === date;
  if (repeat === "weekly")
    return !!g.doneOn && g.doneOn > addDays(date, -7) && g.doneOn <= date;
  return g.done;
}

/** Where a task belongs today; finished one-off tasks from the past drop out. */
export function groupOf(g: Goal, date: string): TaskGroup | undefined {
  const repeat = repeatOf(g);
  if (repeat === "daily") return "today";
  if (repeat === "weekly")
    return g.due && weekdayOf(g.due) === weekdayOf(date) ? "today" : "week";
  if (!g.due) return "later";
  if (g.due < date) return g.done ? undefined : "overdue";
  if (g.due === date) return "today";
  return g.due <= addDays(date, 6) ? "week" : "later";
}

export function toggleDone(g: Goal, date: string): Goal {
  if (repeatOf(g) === "none") return { ...g, done: !g.done };
  return { ...g, doneOn: isDone(g, date) ? undefined : date };
}
