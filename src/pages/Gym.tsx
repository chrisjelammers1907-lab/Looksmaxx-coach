import { useState } from "react";
import {
  Activity,
  Plus,
  Trash2,
  Pencil,
  TrendingUp,
  Utensils,
  StretchHorizontal,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { uid, today, workoutVolume, dateLabel } from "../lib/domain";
import type { Workout, Food } from "../lib/types";
import {
  Area,
  Button,
  Empty,
  Field,
  Modal,
  Notice,
  SectionTitle,
  Tabs,
} from "../components/ui";
export default function Gym() {
  const { state, update, toast } = useDemo();
  const [tab, setTab] = useState("training");
  const [schedule, setSchedule] = useState<Record<string, string> | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [food, setFood] = useState<Food | null>(null);
  const [targets, setTargets] = useState(false);
  const [cal, setCal] = useState(state.profile.calories),
    [protein, setProtein] = useState(state.profile.protein);
  const [date, setDate] = useState(today());
  const logs = state.workouts.filter((w) => w.date === date);
  const meals = state.food.filter((f) => f.date === date);
  const foodCal = meals.reduce((a, f) => a + f.calories, 0),
    foodProtein = meals.reduce((a, f) => a + f.protein, 0);
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
          <SectionTitle
            title="Make room for movement"
            subtitle="An editable example week, not an assumed current training prescription."
          >
            <Button
              variant="secondary"
              onClick={() => setSchedule({ ...state.schedule })}
            >
              <Pencil size={15} />
              Edit schedule
            </Button>
          </SectionTitle>
          <div className="week-grid">
            {Object.entries(state.schedule).map(([day, text]) => (
              <div className="day-card" key={day}>
                <span className="eyebrow">{day.slice(0, 3)}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="section-title">
            <div>
              <h2>Keep showing up.</h2>
              <p>Log sets, repetitions and weights in kilograms.</p>
            </div>
            <Button
              onClick={() =>
                setWorkout({
                  id: uid(),
                  date,
                  exercise: "",
                  sets: 3,
                  reps: 8,
                  weight: 0,
                })
              }
            >
              <Plus size={16} />
              Log workout
            </Button>
          </div>
          <Field
            label="Workout date"
            type="date"
            max={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {logs.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets × reps</th>
                    <th>Load</th>
                    <th>Volume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((w) => (
                    <tr key={w.id}>
                      <td>{w.exercise}</td>
                      <td>
                        {w.sets} × {w.reps}
                      </td>
                      <td>{w.weight} kg</td>
                      <td>{workoutVolume(w.sets, w.reps, w.weight)} kg</td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={`Edit ${w.exercise}`}
                          onClick={() => setWorkout(w)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={`Delete ${w.exercise}`}
                          onClick={() =>
                            update((s) => ({
                              ...s,
                              workouts: s.workouts.filter((x) => x.id !== w.id),
                            }))
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="A fresh page in your training log.">
              Add your session when you are ready.
            </Empty>
          )}
          <SectionTitle
            title="Your training story"
            subtitle="Fictional starter history · Entries you add are private session data."
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
                    {first.weight} → {last.weight} <small>kg</small>
                  </strong>
                  <p>
                    {first.date} to {last.date} · {ws.length} logged entries
                  </p>
                  <p>
                    Volume:{" "}
                    {workoutVolume(first.sets, first.reps, first.weight)} →{" "}
                    {workoutVolume(last.sets, last.reps, last.weight)} kg
                  </p>
                  <div className="mini-chart">
                    {ws.map((w) => (
                      <div
                        key={w.id}
                        style={{
                          height: `${Math.max(10, (w.weight / Math.max(...ws.map((x) => x.weight), 1)) * 70)}px`,
                        }}
                        title={`${w.date}: ${w.weight} kg`}
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
                    {w.sets} × {w.reps} · {w.weight} kg
                  </span>
                  <button className="text-button" onClick={() => setWorkout(w)}>
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
      {tab === "nutrition" && (
        <>
          <SectionTitle
            title="Nourish your everyday"
            subtitle="User-entered estimates. Not a personalized dietary prescription."
          >
            <Button
              variant="secondary"
              onClick={() => {
                setCal(state.profile.calories);
                setProtein(state.profile.protein);
                setTargets(true);
              }}
            >
              Edit targets
            </Button>
          </SectionTitle>
          <Field
            label="Food log date"
            type="date"
            max={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="stats-grid">
            <div className="stat-card">
              <Utensils size={20} />
              <span>Calories</span>
              <strong>
                {foodCal}
                <small> / {state.profile.calories} kcal</small>
              </strong>
              <progress
                value={foodCal}
                max={Math.max(state.profile.calories, foodCal, 1)}
              />
            </div>
            <div className="stat-card">
              <Activity size={20} />
              <span>Protein</span>
              <strong>
                {foodProtein}
                <small> / {state.profile.protein} g</small>
              </strong>
              <progress
                value={foodProtein}
                max={Math.max(state.profile.protein, foodProtein, 1)}
              />
            </div>
          </div>
          <Notice>
            Targets begin as fictional examples. Nutrition values come from your
            manual entries and stated source, not a live food database.
          </Notice>
          <SectionTitle title="On the menu">
            <Button
              onClick={() =>
                setFood({
                  id: uid(),
                  date,
                  name: "",
                  calories: 0,
                  protein: 0,
                  source: "User-entered estimate",
                })
              }
            >
              <Plus size={16} />
              Log food
            </Button>
          </SectionTitle>
          {meals.length ? (
            <div className="list-card">
              {meals.map((f) => (
                <div className="list-row" key={f.id}>
                  <div>
                    <strong>{f.name}</strong>
                    <small>{f.source} · Estimate</small>
                  </div>
                  <span>
                    {f.calories} kcal · {f.protein} g protein
                  </span>
                  <button
                    className="icon-button"
                    aria-label={`Edit ${f.name}`}
                    onClick={() => setFood(f)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${f.name}`}
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        food: s.food.filter((x) => x.id !== f.id),
                      }))
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <Empty title="What nourished you today?">
              Log a meal and its estimated nutrition.
            </Empty>
          )}
          <details className="details">
            <summary>Food history ({state.food.length} entries)</summary>
            {state.food.map((f) => (
              <div key={f.id} className="history-row">
                <span>
                  {f.date} · {f.name}
                </span>
                <span>
                  {f.calories} kcal · {f.protein} g
                </span>
                <button className="text-button" onClick={() => setFood(f)}>
                  Edit
                </button>
              </div>
            ))}
          </details>
        </>
      )}
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
      {schedule && (
        <Modal title="Your training week" onClose={() => setSchedule(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({ ...s, schedule }));
              setSchedule(null);
              toast("Training schedule saved for this session.");
            }}
          >
            {Object.entries(schedule).map(([day, text]) => (
              <Area
                key={day}
                label={day}
                value={text}
                onChange={(e) =>
                  setSchedule({ ...schedule, [day]: e.target.value })
                }
              />
            ))}
            <Button type="submit">Save schedule</Button>
          </form>
        </Modal>
      )}
      {workout && (
        <Modal title="Log your workout" onClose={() => setWorkout(null)}>
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
              toast("Workout saved.");
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
                label="Weight (kg)"
                type="number"
                min="0"
                max="1000"
                step="0.5"
                required
                value={workout.weight}
                onChange={(e) =>
                  setWorkout({ ...workout, weight: Number(e.target.value) })
                }
              />
            </div>
            <Button type="submit">Save workout</Button>
          </form>
        </Modal>
      )}
      {food && (
        <Modal title="Log your food" onClose={() => setFood(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                food: s.food.some((f) => f.id === food.id)
                  ? s.food.map((f) => (f.id === food.id ? food : f))
                  : [...s.food, food],
              }));
              setFood(null);
              toast("Food estimate saved.");
            }}
          >
            <Field
              label="Food / meal name"
              required
              value={food.name}
              onChange={(e) => setFood({ ...food, name: e.target.value })}
            />
            <Field
              label="Food date"
              type="date"
              required
              max={today()}
              value={food.date}
              onChange={(e) => setFood({ ...food, date: e.target.value })}
            />
            <div className="form-grid">
              <Field
                label="Estimated calories (kcal)"
                required
                type="number"
                min="0"
                max="20000"
                value={food.calories}
                onChange={(e) =>
                  setFood({ ...food, calories: Number(e.target.value) })
                }
              />
              <Field
                label="Estimated protein (g)"
                required
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={food.protein}
                onChange={(e) =>
                  setFood({ ...food, protein: Number(e.target.value) })
                }
              />
            </div>
            <Field
              label="Nutrition data source"
              required
              value={food.source}
              onChange={(e) => setFood({ ...food, source: e.target.value })}
              hint="For example: package label, recipe estimate, user-entered estimate"
            />
            <Button type="submit">Save food entry</Button>
          </form>
        </Modal>
      )}
      {targets && (
        <Modal title="Your nutrition targets" onClose={() => setTargets(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                profile: { ...s.profile, calories: cal, protein },
              }));
              setTargets(false);
            }}
          >
            <Notice>
              Set targets appropriate for you. Starter figures are fictional
              examples, not calculated requirements.
            </Notice>
            <Field
              label="Daily calories (kcal)"
              type="number"
              min="1"
              max="15000"
              required
              value={cal}
              onChange={(e) => setCal(Number(e.target.value))}
            />
            <Field
              label="Daily protein (g)"
              type="number"
              min="1"
              max="1000"
              required
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
            />
            <Button type="submit">Save targets</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
