import { streakGrace } from "./plans";
import { useDemo } from "./store";
import { alive, bump, unlocked } from "./streaks";
import { today } from "./domain";

/** Marks a routine done for today once, keeping the routine streak alive. */
export function useCompleteRoutine() {
  const { state, update, toast } = useDemo();
  return (id: string) => {
    const date = today();
    if (state.routineLog[date]?.includes(id)) return;
    const grace = streakGrace(state);
    const before = alive(state.routineStreak, date, grace);
    const next = bump(state.routineStreak, date, grace);
    update((s) => ({
      ...s,
      routineLog: {
        ...s.routineLog,
        [date]: [...(s.routineLog[date] || []), id],
      },
      routineStreak: next,
    }));
    const reward = unlocked(before, next.count);
    toast(
      reward
        ? `${next.count}-day routine streak · Unlocked: ${reward.label}.`
        : `Routine done · ${next.count}-day streak`,
    );
  };
}
