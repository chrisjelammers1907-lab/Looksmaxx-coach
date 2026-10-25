import HScroll from "../components/HScroll";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Plus, Pencil, Trash2 } from "lucide-react";
import { useDemo } from "../lib/store";
import type { Goal, TopicId } from "../lib/types";
import { topics } from "../lib/data";
import Routines from "../components/Routines";
import { today, uid } from "../lib/domain";
import { alive } from "../lib/streaks";
import {
  Button,
  Empty,
  Field,
  Modal,
  PageHeader,
  SectionTitle,
} from "../components/ui";
type PlanFilter = "all" | "routines" | "tasks";
export default function PlanPage() {
  const { state, update, toast } = useDemo();
  const [editing, setEditing] = useState<Goal | null>(null);
  const [params] = useSearchParams();
  const requested = topics.find((t) => t.id === params.get("routine"))?.id;
  const [filter, setFilter] = useState<PlanFilter>(
    requested ? "routines" : "all",
  );
  const routineTopics = topics.filter((t) =>
    state.routines.some((r) => r.topic === t.id),
  );
  const [routineTopic, setRoutineTopic] = useState<TopicId | "all">(
    requested || "all",
  );
  const completed = state.goals.filter((g) => g.done).length;
  const total = state.goals.length;
  const ring = 2 * Math.PI * 26;
  const todayLabel = new Date().toLocaleDateString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <div className="plan-page">
      <PageHeader
        eyebrow={todayLabel}
        title="Your day."
        action={
          <Button
            onClick={() =>
              setEditing({ id: uid(), text: "", cadence: "Daily", done: false })
            }
          >
            <Plus size={16} />
            Add a task
          </Button>
        }
      />
      <div className="plan-progress">
        <svg viewBox="0 0 60 60" aria-hidden="true">
          <circle cx="30" cy="30" r="26" className="track" />
          <circle
            cx="30"
            cy="30"
            r="26"
            className="value"
            strokeDasharray={ring}
            strokeDashoffset={total ? ring * (1 - completed / total) : ring}
          />
        </svg>
        <div>
          <strong>
            {completed} of {total} tasks done
          </strong>
          <span>
            {state.routines.length} routines for today
            {alive(state.routineStreak, today()) > 0 &&
              ` · 🔥 ${alive(state.routineStreak, today())}-day routine streak`}
          </span>
        </div>
      </div>
      <HScroll className="plan-filters chip-scroller" aria-label="Show in plan">
        {(
          [
            ["all", "All"],
            ["routines", "Routines"],
            ["tasks", "Tasks"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="chip"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </HScroll>
      {filter !== "routines" && (
        <section className="plan-section">
          <SectionTitle title="Tasks" />
          <div className="goal-list">
            {state.goals.map((g) => (
              <div className={`goal-row ${g.done ? "done" : ""}`} key={g.id}>
                <button
                  className="goal-check"
                  aria-label={`Complete ${g.text}`}
                  aria-pressed={g.done}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      goals: s.goals.map((x) =>
                        x.id === g.id ? { ...x, done: !x.done } : x,
                      ),
                    }))
                  }
                >
                  {g.done && <Check size={17} />}
                </button>
                <span>{g.text}</span>
                <button
                  className="icon-button"
                  aria-label={`Edit ${g.text}`}
                  onClick={() => setEditing(g)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${g.text}`}
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      goals: s.goals.filter((x) => x.id !== g.id),
                    }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          {!state.goals.length && (
            <Empty title="No tasks for today.">
              Add a task or ask your coach for a suggestion.
            </Empty>
          )}
        </section>
      )}
      {filter !== "tasks" && (
        <section className="plan-section">
          {routineTopics.length > 1 && (
            <HScroll
              className="plan-topic-chips chip-scroller"
              aria-label="Routine category"
            >
              <button
                type="button"
                className="chip"
                aria-pressed={routineTopic === "all"}
                onClick={() => setRoutineTopic("all")}
              >
                All categories
              </button>
              {routineTopics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="chip"
                  aria-pressed={routineTopic === t.id}
                  onClick={() => setRoutineTopic(t.id)}
                >
                  {t.title}
                </button>
              ))}
            </HScroll>
          )}
          <Routines
            key={routineTopic}
            topic={routineTopic === "all" ? undefined : routineTopic}
          />
        </section>
      )}
      {editing && (
        <Modal title="Your task" onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                goals: s.goals.some((g) => g.id === editing.id)
                  ? s.goals.map((g) => (g.id === editing.id ? editing : g))
                  : [...s.goals, editing],
              }));
              setEditing(null);
              toast("Plan updated.");
            }}
          >
            <Field
              label="Task"
              required
              value={editing.text}
              maxLength={150}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            />
            <Button type="submit">Save task</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
