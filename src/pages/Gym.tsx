import { useState } from "react";
import { TrendingUp, StretchHorizontal } from "lucide-react";
import { useDemo } from "../lib/store";
import TrainingPlanner from "../components/Training";
import { uid, today, workoutVolume, dateLabel } from "../lib/domain";
import type { Workout } from "../lib/types";
import Nutrition from "../components/Nutrition";
import { fromKg, toKg, weightLabel } from "../lib/units";
import { Button, Field, Modal, SectionTitle, Tabs } from "../components/ui";
export default function Gym() {
  const { state, update, toast } = useDemo();
  const [tab, setTab] = useState("training");
  const [workout, setWorkout] = useState<Workout | null>(null);
  const unit = state.settings.weightUnit;
  const exercises = [...new Set(state.workouts.map((w) => w.exercise))];
  return (
    <>
      <Tabs
        tabs={[
          { id: "training", label: "Training & history" },
          { id: "nutrition", label: "Nutrition" },
          { id: "mobility", label: "Posture & mobility" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "training" && (
        <>
          <TrainingPlanner />
          <SectionTitle
            title="Your training story"
            subtitle="Every finished session lands here by itself."
          />
          <div className="stats-grid">
            {exercises.map((ex) => {
              const ws = state.workouts
                .filter((w) => w.exercise === ex)
                .sort((a, b) => a.date.localeCompare(b.date));
              const first = ws[0],
                last = ws[ws.length - 1];
              return (
                <article className="stat-card" key={ex}>
                  <TrendingUp size={18} />
                  <span>{ex}</span>
                  <strong>
                    {fromKg(first.weight, unit)} → {fromKg(last.weight, unit)}{" "}
                    <small>{unit}</small>
                  </strong>
                  <p>
                    {first.date} to {last.date} · {ws.length} logged entries
                  </p>
                  <p>
                    Volume:{" "}
                    {fromKg(
                      workoutVolume(first.sets, first.reps, first.weight),
                      unit,
                    )}{" "}
                    →{" "}
                    {fromKg(
                      workoutVolume(last.sets, last.reps, last.weight),
                      unit,
                    )}{" "}
                    {unit}
                  </p>
                  <div className="mini-chart">
                    {ws.map((w) => (
                      <div
                        key={w.id}
                        style={{
                          height: `${Math.max(10, (w.weight / Math.max(...ws.map((x) => x.weight), 1)) * 70)}px`,
                        }}
                        title={`${w.date}: ${weightLabel(w.weight, unit)}`}
                      />
                    ))}
                  </div>
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
              <strong>Goblet squat:</strong> Hold a comfortable load close to
              the chest, move through a comfortable range, and keep balance
              through your feet. Exhale on the way up.
            </p>
            <p>
              <strong>Supported row:</strong> Support your torso, draw the elbow
              back without jerking, and lower with control.
            </p>
            <p>
              <strong>Hinge:</strong> Move the hips back with a comfortable
              neutral trunk. Start light and seek qualified instruction if
              unfamiliar.
            </p>
            <p>
              These are general examples. Adapt to your experience and
              restrictions. Stop for pain or dizziness.
            </p>
          </details>
        </>
      )}
      {tab === "nutrition" && <Nutrition />}
      {tab === "mobility" && (
        <>
          <div className="mobility-card">
            <StretchHorizontal size={36} />
            <div className="eyebrow">MOVE WITH EASE</div>
            <h2>A pause for your posture.</h2>
            <p>
              There is no single perfect posture. Change positions regularly and
              keep movement comfortable.
            </p>
            <ol className="plain-list">
              <li>Take a short movement break from sitting.</li>
              <li>Try gentle shoulder rolls within a comfortable range.</li>
              <li>Walk or stretch lightly if that feels good.</li>
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
                toast("Movement break added to your editable plan.");
              }}
            >
              Add a movement break to my plan
            </Button>
            <p className="small-text">
              General wellbeing guidance. Persistent pain, numbness or injury
              needs a qualified professional.
            </p>
          </div>
        </>
      )}
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
