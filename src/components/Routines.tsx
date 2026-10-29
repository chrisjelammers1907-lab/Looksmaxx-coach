import { useState } from "react";
import { Check, Pencil, Plus, Trash2, WandSparkles } from "lucide-react";
import { useDemo } from "../lib/store";
import { useCompleteRoutine } from "../lib/useCompleteRoutine";
import type { Routine, TopicId } from "../lib/types";
import { asset, topicName, uid } from "../lib/domain";
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
  // A routine is deleted on a second, explicit tap.
  const [confirming, setConfirming] = useState<string | null>(null);
  const [editing, setEditing] = useState<Routine | null>(null);
  const [builder, setBuilder] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const routines = state.routines.filter((r) => !topic || r.topic === topic);
  // Finishing every step of a routine keeps the daily routine streak alive.
  const completeRoutine = useCompleteRoutine();
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
                  <span>
                    {step}
                    {r.stepProducts?.[index] && (
                      <small className="step-product">
                        {
                          state.items.find(
                            (i) => i.id === r.stepProducts![index],
                          )?.name
                        }
                      </small>
                    )}
                  </span>
                </li>
              ))}
            </ol>
            {!!r.productIds?.length && (
              <div className="routine-products" aria-label="Products used">
                {state.items
                  .filter((i) => r.productIds!.includes(i.id))
                  .map((i) => (
                    <span className="routine-product" key={i.id}>
                      <img
                        src={
                          i.image.startsWith("data:") ? i.image : asset(i.image)
                        }
                        alt=""
                      />
                      <span>
                        <small>{i.brand}</small>
                        {i.name}
                      </span>
                    </span>
                  ))}
              </div>
            )}
            <div className="card-controls">
              <button className="text-button" onClick={() => setEditing(r)}>
                <Pencil size={13} />
                Edit routine
              </button>
              {confirming === r.id ? (
                <button
                  className="text-button danger-text"
                  aria-label={`Confirm: delete ${r.title}`}
                  onBlur={() => setConfirming(null)}
                  autoFocus
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      routines: s.routines.filter((x) => x.id !== r.id),
                    }));
                    setConfirming(null);
                    toast("Private routine deleted.");
                  }}
                >
                  <Trash2 size={13} />
                  Delete for good
                </button>
              ) : (
                <button
                  className="icon-button compact"
                  aria-label={`Delete ${r.title}`}
                  onClick={() => setConfirming(r.id)}
                >
                  <Trash2 size={15} />
                </button>
              )}
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
            {(() => {
              const owned = state.items.filter(
                (i) => i.topic === editing.topic,
              );
              const chosen = editing.productIds || [];
              return owned.length ? (
                <fieldset className="product-picker">
                  <legend>Products used (optional)</legend>
                  {owned.map((i) => (
                    <label key={i.id} className="chip-check">
                      <input
                        type="checkbox"
                        checked={chosen.includes(i.id)}
                        onChange={() =>
                          setEditing({
                            ...editing,
                            productIds: chosen.includes(i.id)
                              ? chosen.filter((x) => x !== i.id)
                              : [...chosen, i.id],
                          })
                        }
                      />
                      {i.name}
                    </label>
                  ))}
                </fieldset>
              ) : (
                <p className="small-text muted">
                  Add products to your shelf in this category to link them here.
                </p>
              );
            })()}
            <Area
              label="Steps (one per line, in order)"
              required
              value={editing.steps.join("\n")}
              onChange={(e) =>
                setEditing({ ...editing, steps: e.target.value.split("\n") })
              }
            />
            {!!editing.productIds?.length &&
              editing.steps.filter((st) => st.trim()).length > 0 && (
                <div className="step-product-list">
                  {editing.steps
                    .map((st, index) => ({ st, index }))
                    .filter(({ st }) => st.trim())
                    .map(({ st, index }) => (
                      <Select
                        key={index}
                        label={`Product for “${st.trim()}”`}
                        value={editing.stepProducts?.[index] || ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            stepProducts: {
                              ...editing.stepProducts,
                              [index]: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">No product</option>
                        {state.items
                          .filter((i) => editing.productIds!.includes(i.id))
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                      </Select>
                    ))}
                </div>
              )}
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
          <p>
            Based on your preferences:{" "}
            {state.profile.preferences || "none entered yet"}. Budget:{" "}
            {state.profile.currency} {state.profile.budget}. Owned products:{" "}
            {state.items
              .filter((i) => i.topic === "skincare")
              .map((i) => i.name)
              .join(", ") || "none yet"}
            .
          </p>
          <ol className="plain-list">
            <li>Gentle cleanse.</li>
            <li>A moisturiser that suits your skin.</li>
            <li>Sunscreen, SPF 30 or higher.</li>
          </ol>
          <p className="small-text">
            You can change every step before you save it.
          </p>
          <Button
            onClick={() => {
              setBuilder(false);
              setEditing({
                ...blank(),
                title: "My simple morning",
                steps: [
                  "Gentle cleanse",
                  "Moisturise",
                  "Sunscreen, SPF 30 or higher",
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
