import { useState } from "react";
import { Check, Pencil, Plus, Trash2, WandSparkles } from "lucide-react";
import { useDemo } from "../lib/store";
import type { Routine, TopicId } from "../lib/types";
import { today, topicName, uid } from "../lib/domain";
import { alive, bump, unlocked } from "../lib/streaks";
import { topics } from "../lib/data";
import {
  Area,
  Button,
  Empty,
  Field,
  Modal,
  Notice,
  SectionTitle,
  Select,
} from "./ui";
export default function Routines({ topic }: { topic?: TopicId }) {
  const { state, update, toast } = useDemo();
  const [editing, setEditing] = useState<Routine | null>(null);
  const [builder, setBuilder] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const routines = state.routines.filter((r) => !topic || r.topic === topic);
  // Finishing every step of a routine keeps the daily routine streak alive.
  const completeRoutine = (id: string) => {
    const date = today();
    if (state.routineLog[date]?.includes(id)) return;
    const before = alive(state.routineStreak, date);
    const next = bump(state.routineStreak, date);
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
        ? `🔥 ${next.count}-day routine streak! Unlocked: ${reward.label}.`
        : `Routine done · 🔥 ${next.count}-day streak`,
    );
  };
  const blank = (): Routine => ({
    id: uid(),
    topic: topic || "skincare",
    title: "",
    time: !topic || topic === "skincare" ? "AM" : "Anytime",
    schedule: "Daily",
    steps: [],
  });
  return (
    <>
      <SectionTitle title="Routines">
        <div className="button-row">
          {topic === "skincare" && (
            <Button variant="ghost" onClick={() => setBuilder(true)}>
              <WandSparkles size={16} />
              Build a routine
            </Button>
          )}
          <Button variant="secondary" onClick={() => setEditing(blank())}>
            <Plus size={16} />
            New routine
          </Button>
        </div>
      </SectionTitle>
      <div className="routine-grid">
        {routines.map((r) => (
          <article className="routine-card" key={r.id}>
            <div className="routine-top">
              <span className="pill">{r.time}</span>
              <span className="muted small-text">
                {!topic && `${topicName[r.topic]} · `}
                {r.schedule}
              </span>
            </div>
            <h3>{r.title}</h3>
            <ol className="routine-steps">
              {r.steps.map((step, index) => (
                <li key={index}>
                  <button
                    aria-label={`Complete ${step}`}
                    aria-pressed={done.includes(`${r.id}-${index}`)}
                    className={`step-number ${done.includes(`${r.id}-${index}`) ? "checked" : ""}`}
                    onClick={() => {
                      const key = `${r.id}-${index}`;
                      const next = done.includes(key)
                        ? done.filter((x) => x !== key)
                        : [...done, key];
                      setDone(next);
                      if (
                        r.steps.every((_, i) => next.includes(`${r.id}-${i}`))
                      )
                        completeRoutine(r.id);
                    }}
                  >
                    {done.includes(`${r.id}-${index}`) ? (
                      <Check size={13} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </button>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="card-controls">
              <button className="text-button" onClick={() => setEditing(r)}>
                <Pencil size={13} />
                Edit routine
              </button>
              <button
                className="icon-button compact"
                aria-label={`Delete ${r.title}`}
                onClick={() => {
                  update((s) => ({
                    ...s,
                    routines: s.routines.filter((x) => x.id !== r.id),
                  }));
                  toast("Private routine deleted.");
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!routines.length && (
        <Empty
          title="Begin a new ritual."
          action={
            <Button onClick={() => setEditing(blank())}>
              Create a routine
            </Button>
          }
        >
          Add the steps that work for your everyday.
        </Empty>
      )}
      {editing && (
        <Modal title="Your private routine" onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing.title.trim() || !editing.steps.length) return;
              update((s) => ({
                ...s,
                routines: s.routines.some((r) => r.id === editing.id)
                  ? s.routines.map((r) => (r.id === editing.id ? editing : r))
                  : [...s.routines, editing],
              }));
              setEditing(null);
              toast("Routine saved. Your existing plan was not changed.");
            }}
          >
            {!topic && (
              <Select
                label="Category"
                value={editing.topic}
                onChange={(e) =>
                  setEditing({ ...editing, topic: e.target.value as TopicId })
                }
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </Select>
            )}
            <Field
              label="Routine name"
              required
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
            <div className="form-grid">
              <Select
                label="Time"
                value={editing.time}
                onChange={(e) =>
                  setEditing({ ...editing, time: e.target.value })
                }
              >
                {["AM", "PM", "AM & PM", "Anytime"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
              <Field
                label="Weekly schedule"
                required
                value={editing.schedule}
                onChange={(e) =>
                  setEditing({ ...editing, schedule: e.target.value })
                }
                hint="For example: Daily, or Mon, Wed, Fri"
              />
            </div>
            <Area
              label="Steps (one per line, in order)"
              required
              value={editing.steps.join("\n")}
              onChange={(e) =>
                setEditing({ ...editing, steps: e.target.value.split("\n") })
              }
            />
            <Notice icon="private">
              Your personal routine stays in this session. Sharing requires a
              separate post and explicit audience preview.
            </Notice>
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save routine</Button>
            </div>
          </form>
        </Modal>
      )}
      {builder && (
        <Modal
          title="A simple starting point"
          onClose={() => setBuilder(false)}
        >
          <div className="eyebrow">SIMULATED ROUTINE BUILDER</div>
          <p>
            Using your current demo profile preferences:{" "}
            {state.profile.preferences || "none entered yet"}. Budget:{" "}
            {state.profile.currency} {state.profile.budget}. Owned products:{" "}
            {state.items
              .filter((i) => i.topic === "skincare")
              .map((i) => i.name)
              .join(", ") || "none yet"}
            .
          </p>
          <Notice>
            This example favors simplicity. It does not establish suitability or
            ingredient compatibility. Stop a product that irritates and seek
            professional advice for persistent concerns.
          </Notice>
          <ol className="plain-list">
            <li>Gentle cleanse if needed.</li>
            <li>Use a moisturizer you tolerate.</li>
            <li>Apply broad-spectrum sunscreen following its label.</li>
          </ol>
          <p className="small-text">
            No medication or treatment changes are suggested. Review the
            editable copy before saving.
          </p>
          <Button
            onClick={() => {
              setBuilder(false);
              setEditing({
                ...blank(),
                title: "My simple morning",
                steps: [
                  "Gentle cleanse if needed",
                  "Moisturize",
                  "Apply sunscreen according to its label",
                ],
              });
            }}
          >
            Review editable copy
          </Button>
        </Modal>
      )}
    </>
  );
}
