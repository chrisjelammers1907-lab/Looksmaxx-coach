import HScroll from "../components/HScroll";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Plus, Pencil, Trash2 } from "lucide-react";
import { useDemo } from "../lib/store";
import type { Goal, TopicId } from "../lib/types";
import { topics } from "../lib/data";
import Routines from "../components/Routines";
import { dateLabel, today, uid } from "../lib/domain";
import {
  groupLabels,
  groupOf,
  isDone,
  repeatOf,
  toggleDone,
} from "../lib/tasks";
import { weekdayOf } from "../lib/training";
import { alive } from "../lib/streaks";
import { streakGrace } from "../lib/plans";
import { Button, Field, Modal, PageHeader, Select } from "../components/ui";
import StreakFlame from "../components/StreakFlame";
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
  const date = today();
  const weekday = new Date().toLocaleDateString("en", { weekday: "short" });
  const routinesToday = state.routines.filter(
    (r) => r.schedule === "Daily" || r.schedule.includes(weekday),
  ).length;
  const streak = alive(state.routineStreak, date, streakGrace(state));
  const todayTasks = state.goals.filter((g) => groupOf(g, date) === "today");
  const completed = todayTasks.filter((g) => isDone(g, date)).length;
  const total = todayTasks.length;
  const ring = 2 * Math.PI * 26;
  const todayLabel = new Date().toLocaleDateString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <div className="plan-page">
      <PageHeader
        title="Your day."
        meta={todayLabel}
        action={
          <Button
            onClick={() =>
              setEditing({
                id: uid(),
                text: "",
                cadence: "Daily",
                done: false,
                due: today(),
                repeat: "none",
              })
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
            {completed} of {total} {total === 1 ? "task" : "tasks"} done
          </strong>
          <span>
            {routinesToday} {routinesToday === 1 ? "routine" : "routines"} on
            today’s plan
            {streak > 0 && (
              <>
                {" "}
                · <StreakFlame count={streak} /> routine streak
              </>
            )}
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
          {(["overdue", "today", "week", "later"] as const).map((group) => {
            const tasks = state.goals.filter((g) => groupOf(g, date) === group);
            if (!tasks.length && group !== "today") return null;
            return (
              <div className={`task-group task-group-${group}`} key={group}>
                <h2 className="task-group-title">
                  {groupLabels[group]}
                  <span>{tasks.length}</span>
                </h2>
                {tasks.length ? (
                  <div className="goal-list">
                    {tasks.map((g) => {
                      const done = isDone(g, date);
                      const repeat = repeatOf(g);
                      return (
                        <div
                          className={`goal-row ${done ? "done" : ""}`}
                          key={g.id}
                        >
                          <button
                            className="goal-check"
                            aria-label={`Complete ${g.text}`}
                            aria-pressed={done}
                            onClick={() =>
                              update((s) => ({
                                ...s,
                                goals: s.goals.map((x) =>
                                  x.id === g.id ? toggleDone(x, date) : x,
                                ),
                              }))
                            }
                          >
                            {done && <Check size={17} />}
                          </button>
                          <span className="goal-text">
                            <span>{g.text}</span>
                            {(g.due || repeat !== "none") && (
                              <small>
                                {repeat === "daily"
                                  ? "Every day"
                                  : repeat === "weekly"
                                    ? `Every week${g.due ? ` · ${weekdayOf(g.due)}` : ""}`
                                    : dateLabel(g.due!)}
                              </small>
                            )}
                          </span>
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
                      );
                    })}
                  </div>
                ) : (
                  <p className="small-text muted task-empty">
                    Nothing due today. Add a task or ask your coach.
                  </p>
                )}
              </div>
            );
          })}
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
            <div className="form-grid">
              <Field
                label="Date (optional)"
                type="date"
                value={editing.due || ""}
                onChange={(e) =>
                  setEditing({ ...editing, due: e.target.value || undefined })
                }
              />
              <Select
                label="Repeat"
                value={repeatOf(editing)}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    repeat: e.target.value as Goal["repeat"],
                  })
                }
              >
                <option value="none">Doesn’t repeat</option>
                <option value="daily">Every day</option>
                <option value="weekly">Every week</option>
              </Select>
            </div>
            <Button type="submit">Save task</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
