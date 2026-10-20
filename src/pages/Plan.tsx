import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Check,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { useDemo } from "../lib/store";
import type { Goal, TopicId } from "../lib/types";
import { topics } from "../lib/data";
import Routines from "../components/Routines";
import { dateLabel, today, uid } from "../lib/domain";
import {
  Button,
  Empty,
  Field,
  Modal,
  Notice,
  PageHeader,
  SectionTitle,
  Select,
} from "../components/ui";
export default function PlanPage() {
  const { state, update, toast } = useDemo();
  const [editing, setEditing] = useState<Goal | null>(null);
  const [params] = useSearchParams();
  const [routineTopic, setRoutineTopic] = useState<TopicId>(
    topics.find((t) => t.id === params.get("routine"))?.id || "skincare",
  );
  const completed = state.goals.filter((g) => g.done).length;
  return (
    <div className="plan-page">
      <PageHeader
        eyebrow="PROGRESS, NOT PERFECTION"
        title="One thoughtful step."
        description="A living plan. Small commitments. Room to change your mind."
        action={
          <Button
            onClick={() =>
              setEditing({ id: uid(), text: "", cadence: "Daily", done: false })
            }
          >
            <Plus size={16} />
            Add a goal
          </Button>
        }
      />
      <div className="plan-overview">
        <div>
          <span className="eyebrow">YOUR OWN PACE</span>
          <h2>
            {completed}
            <em> / {state.goals.length}</em>
          </h2>
          <p>little intentions completed</p>
        </div>
        <div>
          <CalendarDays size={30} />
          <h3>Your next check-in</h3>
          <Field
            label="Scheduled check-in date"
            type="date"
            min={today()}
            value={state.checkIn}
            onChange={(e) => update((s) => ({ ...s, checkIn: e.target.value }))}
          />
          <p>
            {state.checkIn
              ? dateLabel(state.checkIn)
              : "Choose when to reflect."}
          </p>
        </div>
      </div>
      <Notice icon="private">
        Your editable plan is private and stays in this session. Coach proposals
        always need your review before being applied.
      </Notice>
      {["Daily", "Weekly"].map((cadence) => (
        <section key={cadence}>
          <SectionTitle title={`${cadence} intentions`} />
          <div className="goal-list">
            {state.goals
              .filter((g) => g.cadence === cadence)
              .map((g) => (
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
        </section>
      ))}
      {!state.goals.length && (
        <Empty title="A little space for a new intention.">
          Add a goal or ask your demo coach for a proposal.
        </Empty>
      )}
      <div className="editorial-note">
        <CalendarDays size={25} />
        <div>
          <h3>A moment to reflect.</h3>
          <p>
            At your check-in, consider what felt manageable, what did not, and
            what you would like to change. The demo does not send notifications.
          </p>
          <Link to="/coach">
            Review my plan with the demo coach <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <SectionTitle
        title="Your private ritual library"
        subtitle="Originals and community copies stay editable. Review every copied routine before using it."
      />
      <Select
        label="Routine topic"
        value={routineTopic}
        onChange={(e) => setRoutineTopic(e.target.value as TopicId)}
      >
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.title}
          </option>
        ))}
      </Select>
      <Routines key={routineTopic} topic={routineTopic} />
      {editing && (
        <Modal title="Your intention" onClose={() => setEditing(null)}>
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
              label="Goal"
              required
              value={editing.text}
              maxLength={150}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            />
            <Select
              label="Cadence"
              value={editing.cadence}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  cadence: e.target.value as "Daily" | "Weekly",
                })
              }
            >
              <option>Daily</option>
              <option>Weekly</option>
            </Select>
            <Button type="submit">Save goal</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
