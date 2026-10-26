import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PersonStanding,
  Salad,
  StretchHorizontal,
  TrendingUp,
} from "lucide-react";
import { useDemo } from "../lib/store";
import TrainingPlanner from "../components/Training";
import { uid, today, dateLabel } from "../lib/domain";
import type { Workout } from "../lib/types";
import { fromKg, toKg, weightLabel } from "../lib/units";
import { Button, Field, Modal, SectionTitle } from "../components/ui";
export default function Gym() {
  const { state, update, toast } = useDemo();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const unit = state.settings.weightUnit;
  const exercises = [...new Set(state.workouts.map((w) => w.exercise))];
  return (
    <>
      <nav className="gym-links" aria-label="Related categories">
        <Link to="/topics/nutrition">
          <Salad size={18} aria-hidden="true" /> Nutrition, weight and calories
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link to="/topics/presence">
          <PersonStanding size={18} aria-hidden="true" /> Posture and mobility
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </nav>
      <TrainingPlanner />
      <SectionTitle
        title="Your training story"
        subtitle="Every finished session lands here by itself."
      />
      <div className="lift-grid">
        {exercises.map((ex) => {
          const ws = state.workouts
            .filter((w) => w.exercise === ex)
            .sort((a, b) => a.date.localeCompare(b.date));
          const first = ws[0],
            last = ws[ws.length - 1];
          const change = fromKg(last.weight - first.weight, unit);
          const top = Math.max(...ws.map((w) => w.weight));
          const low = Math.min(...ws.map((w) => w.weight));
          const x = (i: number) =>
            ws.length > 1 ? (i / (ws.length - 1)) * 100 : 50;
          const y = (kg: number) =>
            top === low ? 20 : 36 - ((kg - low) / (top - low)) * 32;
          return (
            <article className="lift-card" key={ex}>
              <header>
                <span>{ex}</span>
                <TrendingUp size={16} aria-hidden="true" />
              </header>
              <strong>
                {fromKg(last.weight, unit)}
                <small> {unit}</small>
              </strong>
              <p className={change >= 0 ? "up" : "down"}>
                {change >= 0 ? "+" : "−"}
                {Math.abs(change)} {unit} since{" "}
                {new Date(`${first.date}T12:00:00`).toLocaleDateString("en", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <svg
                className="lift-line"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${ex}: ${ws.map((w) => weightLabel(w.weight, unit)).join(", ")}`}
              >
                <polyline
                  points={ws.map((w, i) => `${x(i)},${y(w.weight)}`).join(" ")}
                />
                {ws.map((w, i) => (
                  <line
                    key={w.id}
                    x1={x(i)}
                    y1={y(w.weight)}
                    x2={x(i)}
                    y2={y(w.weight)}
                  />
                ))}
              </svg>
              <small className="lift-meta">
                {ws.length} sessions · best {weightLabel(top, unit)}
              </small>
            </article>
          );
        })}
      </div>
      <details className="details">
        <summary>
          View all workout history ({state.workouts.length} entries)
        </summary>
        {[...state.workouts]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((w) => (
            <div className="history-row" key={w.id}>
              <span>
                {dateLabel(w.date)} · {w.exercise}
              </span>
              <span>
                {w.sets} × {w.reps} · {weightLabel(w.weight, unit)}
              </span>
              <button
                className="text-button"
                aria-label={`Edit ${w.exercise}, ${dateLabel(w.date)}`}
                onClick={() => setWorkout(w)}
              >
                Edit
              </button>
            </div>
          ))}
      </details>
      <details className="details">
        <summary>Exercise explanations & safer technique</summary>
        <p>
          <strong>Goblet squat:</strong> Hold a comfortable load close to the
          chest, move through a comfortable range, and keep balance through your
          feet. Exhale on the way up.
        </p>
        <p>
          <strong>Supported row:</strong> Support your torso, draw the elbow
          back without jerking, and lower with control.
        </p>
        <p>
          <strong>Hinge:</strong> Move the hips back with a comfortable neutral
          trunk. Start light and seek qualified instruction if unfamiliar.
        </p>
        <p>
          These are general examples. Adapt to your experience and restrictions.
          Stop for pain or dizziness.
        </p>
      </details>
      {workout && (
        <Modal title="Edit history entry" onClose={() => setWorkout(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                workouts: s.workouts.some((w) => w.id === workout.id)
                  ? s.workouts.map((w) => (w.id === workout.id ? workout : w))
                  : [...s.workouts, workout],
              }));
              setWorkout(null);
              toast("History updated.");
            }}
          >
            <Field
              label="Exercise"
              required
              value={workout.exercise}
              onChange={(e) =>
                setWorkout({ ...workout, exercise: e.target.value })
              }
            />
            <Field
              label="Workout date"
              type="date"
              required
              max={today()}
              value={workout.date}
              onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
            />
            <div className="form-grid">
              <Field
                label="Sets"
                type="number"
                inputMode="decimal"
                min="1"
                max="100"
                required
                value={workout.sets}
                onChange={(e) =>
                  setWorkout({ ...workout, sets: Number(e.target.value) })
                }
              />
              <Field
                label="Repetitions per set"
                type="number"
                inputMode="decimal"
                min="1"
                max="500"
                required
                value={workout.reps}
                onChange={(e) =>
                  setWorkout({ ...workout, reps: Number(e.target.value) })
                }
              />
              <Field
                label={`Weight (${unit})`}
                type="number"
                inputMode="decimal"
                min="0"
                max="2000"
                step="0.5"
                required
                value={fromKg(workout.weight, unit)}
                onChange={(e) =>
                  setWorkout({
                    ...workout,
                    weight: toKg(Number(e.target.value), unit),
                  })
                }
              />
            </div>
            <div className="modal-actions">
              <Button type="submit">Save changes</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  update((s) => ({
                    ...s,
                    workouts: s.workouts.filter((w) => w.id !== workout.id),
                  }));
                  setWorkout(null);
                }}
              >
                Delete entry
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

/** Posture and mobility, shown on the Posture & presence page. */
export function PostureCard() {
  const { update, toast } = useDemo();
  return (
    <div className="mobility-card">
      <StretchHorizontal size={32} strokeWidth={1.5} aria-hidden="true" />
      <h2>A pause for your posture.</h2>
      <p>
        No single posture is perfect. Changing position often matters more than
        holding one.
      </p>
      <ol className="plain-list">
        <li>Stand up and walk for two minutes every hour.</li>
        <li>Roll the shoulders back and down ten times.</li>
        <li>Open the chest in a doorway for 30 seconds.</li>
      </ol>
      <Button
        onClick={() => {
          update((s) => ({
            ...s,
            goals: [
              ...s.goals,
              {
                id: uid(),
                text: "Take a comfortable movement break",
                cadence: "Daily",
                done: false,
              },
            ],
          }));
          toast("Movement break added to your plan.");
        }}
      >
        Add a movement break to my plan
      </Button>
      <p className="small-text">
        Persistent pain, numbness or an injury needs a physiotherapist or
        doctor.
      </p>
    </div>
  );
}
