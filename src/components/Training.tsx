import HScroll from "./HScroll";
import { useEffect, useState } from "react";
import { Check, Dumbbell, Plus, Repeat, Trash2, Trophy, X } from "lucide-react";
import { fromKg, toKg, weightLabel } from "../lib/units";
import { useDemo } from "../lib/store";
import { dateLabel, today, uid } from "../lib/domain";
import {
  addDays,
  autoLog,
  bestWeight,
  logDay,
  nextDateFor,
  planFor,
  progressFor,
  weekdayOf,
  weekdays,
} from "../lib/training";
import type { SetProgress, TrainingDay, Weekday } from "../lib/types";
import { trainingStreak } from "../lib/streaks";
import { Button, Field, Modal, SectionTitle } from "./ui";
import { StoryComposer } from "./Stories";

function DayEditor({ day, onClose }: { day: Weekday; onClose: () => void }) {
  const { state, update, toast } = useDemo();
  const unit = state.settings.weightUnit;
  const Unit = unit === "kg" ? "Kg" : "Lb";
  const existing = state.trainingWeek[day];
  const [draft, setDraft] = useState<TrainingDay>(
    existing
      ? structuredClone(existing)
      : {
          name: "",
          repeat: true,
          exercises: [{ id: uid(), name: "", sets: [{ reps: 8, weight: 20 }] }],
        },
  );
  const setExercise = (index: number, next: TrainingDay["exercises"][0]) =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map((e, i) => (i === index ? next : e)),
    });
  return (
    <Modal title={`Plan ${day}`} onClose={onClose} wide>
      <form
        className="day-editor"
        onSubmit={(e) => {
          e.preventDefault();
          const exercises = draft.exercises
            .map((ex) => ({ ...ex, name: ex.name.trim() }))
            .filter((ex) => ex.name && ex.sets.length);
          update((s) => ({
            ...s,
            trainingWeek: {
              ...s.trainingWeek,
              [day]: {
                ...draft,
                name: draft.name.trim() || "Training",
                exercises,
                date: draft.repeat ? undefined : nextDateFor(day, today()),
              },
            },
          }));
          toast(`${day} saved.`);
          onClose();
        }}
      >
        <Field
          label="Session name"
          placeholder="Upper, Lower, Push…"
          maxLength={40}
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <div className="exercise-editor-list">
          {draft.exercises.map((exercise, index) => (
            <fieldset className="exercise-editor" key={exercise.id}>
              <legend className="visually-hidden">Exercise {index + 1}</legend>
              <div className="exercise-editor-head">
                <Field
                  label={`Exercise ${index + 1}`}
                  placeholder="Bench press"
                  required
                  maxLength={60}
                  value={exercise.name}
                  onChange={(e) =>
                    setExercise(index, { ...exercise, name: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Remove exercise ${index + 1}`}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      exercises: draft.exercises.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="set-rows">
                <div className="set-row set-head" aria-hidden="true">
                  <span />
                  <span>Reps</span>
                  <span>{Unit}</span>
                  <span />
                </div>
                {exercise.sets.map((set, setIndex) => (
                  <div className="set-row" key={setIndex}>
                    <span className="set-number">Set {setIndex + 1}</span>
                    <Field
                      label={`Reps, exercise ${index + 1} set ${setIndex + 1}`}
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={set.reps}
                      onChange={(e) =>
                        setExercise(index, {
                          ...exercise,
                          sets: exercise.sets.map((s, i) =>
                            i === setIndex
                              ? { ...s, reps: Number(e.target.value) }
                              : s,
                          ),
                        })
                      }
                    />
                    <Field
                      label={`${Unit}, exercise ${index + 1} set ${setIndex + 1}`}
                      type="number"
                      min="0"
                      max="2000"
                      step="0.5"
                      required
                      value={fromKg(set.weight, unit)}
                      onChange={(e) =>
                        setExercise(index, {
                          ...exercise,
                          sets: exercise.sets.map((s, i) =>
                            i === setIndex
                              ? {
                                  ...s,
                                  weight: toKg(Number(e.target.value), unit),
                                }
                              : s,
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Remove set ${setIndex + 1} of exercise ${index + 1}`}
                      disabled={exercise.sets.length === 1}
                      onClick={() =>
                        setExercise(index, {
                          ...exercise,
                          sets: exercise.sets.filter((_, i) => i !== setIndex),
                        })
                      }
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  setExercise(index, {
                    ...exercise,
                    sets: [
                      ...exercise.sets,
                      { ...(exercise.sets.at(-1) || { reps: 8, weight: 20 }) },
                    ],
                  })
                }
              >
                <Plus size={14} /> Add set
              </button>
            </fieldset>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary small"
          onClick={() =>
            setDraft({
              ...draft,
              exercises: [
                ...draft.exercises,
                { id: uid(), name: "", sets: [{ reps: 8, weight: 20 }] },
              ],
            })
          }
        >
          <Plus size={15} /> Add exercise
        </Button>
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={draft.repeat}
            onChange={(e) => setDraft({ ...draft, repeat: e.target.checked })}
          />
          Repeat every {day}
        </label>
        <div className="modal-actions">
          {existing && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                update((s) => {
                  const week = { ...s.trainingWeek };
                  delete week[day];
                  return { ...s, trainingWeek: week };
                });
                toast(`${day} is now a rest day.`);
                onClose();
              }}
            >
              Make rest day
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save day</Button>
        </div>
      </form>
    </Modal>
  );
}

function TodayCard({ onPlan }: { onPlan: (day: Weekday) => void }) {
  const { state, update, toast } = useDemo();
  const unit = state.settings.weightUnit;
  const [story, setStory] = useState("");
  const date = today();
  const plan = planFor(state.trainingWeek, date);
  const logged = state.sessions.find((s) => s.date === date);
  if (!plan)
    return (
      <div className="today-card rest">
        <span className="eyebrow">Today · {weekdayOf(date)}</span>
        <h3>Rest day</h3>
        <p>Recovery is part of the plan.</p>
        <Button
          variant="secondary small"
          onClick={() => onPlan(weekdayOf(date))}
        >
          Plan today
        </Button>
      </div>
    );
  if (logged)
    return (
      <div className="today-card">
        <span className="eyebrow">Today · {plan.name}</span>
        <h3>
          <Check size={22} /> Session logged
        </h3>
        <p>
          {logged.status === "done"
            ? "Nice work. It’s in your history."
            : "Logged as skipped."}
        </p>
      </div>
    );
  const progress = progressFor(state, date);
  const save = (exerciseId: string, sets: SetProgress[]) =>
    update((s) => ({
      ...s,
      trainingProgress: {
        ...s.trainingProgress,
        [date]: { ...(s.trainingProgress[date] || {}), [exerciseId]: sets },
      },
    }));
  return (
    <section className="today-card" aria-label={`Today: ${plan.name}`}>
      <header>
        <div>
          <span className="eyebrow">Today · {weekdayOf(date)}</span>
          <h3>{plan.name}</h3>
        </div>
        <small>Logs itself after midnight</small>
      </header>
      {progress.map(({ exercise, sets }) => {
        const previous = bestWeight(state.workouts, exercise.name);
        const top = Math.max(
          0,
          ...sets.filter((s) => s.done).map((s) => s.weight),
        );
        const pr = previous > 0 && top > previous;
        return (
          <div className="today-exercise" key={exercise.id}>
            <div className="today-exercise-head">
              <strong>{exercise.name}</strong>
              {pr && (
                <span className="pr-badge">
                  <Trophy size={14} /> New PR
                </span>
              )}
            </div>
            <div className="today-sets">
              {sets.map((set, i) => (
                <div className={`today-set ${set.done ? "done" : ""}`} key={i}>
                  <span className="set-number">{i + 1}</span>
                  <label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      aria-label={`${exercise.name} set ${i + 1} reps`}
                      value={set.reps}
                      onChange={(e) =>
                        save(
                          exercise.id,
                          sets.map((s, j) =>
                            j === i
                              ? { ...s, reps: Number(e.target.value) }
                              : s,
                          ),
                        )
                      }
                    />
                    reps
                  </label>
                  <label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.5"
                      aria-label={`${exercise.name} set ${i + 1} ${unit}`}
                      value={fromKg(set.weight, unit)}
                      onChange={(e) =>
                        save(
                          exercise.id,
                          sets.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  weight: toKg(Number(e.target.value), unit),
                                }
                              : s,
                          ),
                        )
                      }
                    />
                    {unit}
                  </label>
                  <button
                    type="button"
                    className="set-check"
                    aria-label={`Done: ${exercise.name} set ${i + 1}`}
                    aria-pressed={set.done}
                    onClick={() =>
                      save(
                        exercise.id,
                        sets.map((s, j) =>
                          j === i ? { ...s, done: !s.done } : s,
                        ),
                      )
                    }
                  >
                    <Check size={16} />
                  </button>
                </div>
              ))}
            </div>
            {pr && (
              <div className="pr-banner">
                <span>
                  {exercise.name}: {fromKg(previous, unit)} →{" "}
                  {weightLabel(top, unit)}
                </span>
                <Button
                  variant="small"
                  onClick={() =>
                    setStory(
                      `New PR · ${exercise.name} ${fromKg(previous, unit)} → ${weightLabel(top, unit)}`,
                    )
                  }
                >
                  Share as story
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <div className="today-actions">
        <Button
          variant="secondary small"
          onClick={() => {
            const result = logDay(state, date, uid);
            if (!result.session) return;
            update((s) => {
              const rest = { ...s.trainingProgress };
              delete rest[date];
              return {
                ...s,
                sessions: [...s.sessions, result.session!],
                workouts: [...s.workouts, ...result.workouts],
                trainingProgress: rest,
              };
            });
            toast("Session added to your history.");
          }}
        >
          Finish and log now
        </Button>
      </div>
      {story && (
        <StoryComposer initialText={story} onClose={() => setStory("")} />
      )}
    </section>
  );
}

export default function TrainingPlanner() {
  const { state, update } = useDemo();
  const [editing, setEditing] = useState<Weekday | null>(null);
  const date = today();
  // Log finished days while the page stays open past midnight.
  useEffect(() => {
    let current = today();
    const timer = setInterval(() => {
      if (today() === current) return;
      current = today();
      update((s) => ({ ...s, ...autoLog(s, current, uid) }));
    }, 60000);
    return () => clearInterval(timer);
  }, [update]);
  const monday = addDays(date, -weekdays.indexOf(weekdayOf(date)));
  const recent = [...state.sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  return (
    <>
      <SectionTitle
        title="Your week"
        subtitle={
          trainingStreak(state.sessions) > 0
            ? `🔥 ${trainingStreak(state.sessions)} sessions in a row · Tap a day to plan it.`
            : "Tap a day to plan or change it."
        }
      />
      <HScroll className="week-strip">
        {weekdays.map((day, index) => {
          const dayDate = addDays(monday, index);
          const plan = state.trainingWeek[day];
          const active = planFor(state.trainingWeek, dayDate);
          return (
            <button
              type="button"
              key={day}
              className={`day-tile ${dayDate === date ? "today" : ""} ${active ? "training" : "rest"}`}
              aria-label={`${day}: ${active ? `${plan!.name}, ${plan!.exercises.length} ${plan!.exercises.length === 1 ? "exercise" : "exercises"}` : "rest day"}`}
              onClick={() => setEditing(day)}
            >
              <span className="day-tile-day">{day.slice(0, 3)}</span>
              <span className="day-tile-date">{Number(dayDate.slice(8))}</span>
              <strong>{active ? plan!.name : "Rest"}</strong>
              <small>
                {active ? (
                  <>
                    {plan!.exercises.length}{" "}
                    {plan!.exercises.length === 1 ? "exercise" : "exercises"}
                    {plan!.repeat && (
                      <Repeat size={12} aria-label="repeats weekly" />
                    )}
                  </>
                ) : (
                  <Plus size={14} aria-hidden="true" />
                )}
              </small>
            </button>
          );
        })}
      </HScroll>
      <TodayCard onPlan={setEditing} />
      {recent.length > 0 && (
        <div className="session-list">
          <h3>Recent sessions</h3>
          {recent.map((s) => (
            <div className="session-row" key={s.id}>
              <Dumbbell size={16} aria-hidden="true" />
              <span>
                {dateLabel(s.date)} · {s.name}
              </span>
              <span className={`status-pill ${s.status}`}>
                {s.status === "done" ? "Done" : "Skipped"}
              </span>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <DayEditor
          key={editing}
          day={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
