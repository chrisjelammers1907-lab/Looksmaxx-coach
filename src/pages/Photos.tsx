import { useState } from "react";
import { Trash2, LockKeyhole, ArrowLeftRight } from "lucide-react";
import { useDemo } from "../lib/store";
import type { Photo, TopicId } from "../lib/types";
import { topicName, uid, today, dateLabel } from "../lib/domain";
import {
  Area,
  Button,
  Empty,
  Field,
  ImageInput,
  Modal,
  Notice,
  SectionTitle,
  Select,
} from "../components/ui";
import { DEMO } from "../lib/demo";
export default function Photos({ topic = "photos" }: { topic?: TopicId }) {
  const { state, update, toast } = useDemo();
  const [draft, setDraft] = useState<Photo | null>(null);
  const [compare, setCompare] = useState(false);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [slider, setSlider] = useState(50);
  const [filter, setFilter] = useState<TopicId>(topic);
  const photos = state.photos.filter(
    (p) => filter === "photos" || p.topic === filter,
  );
  const comparable = photos.filter((p) => p.mediaKind === "real");
  const a = comparable.find((p) => p.id === left),
    b = comparable.find((p) => p.id === right);
  return (
    <>
      <Notice icon="private">
        Your photos stay on this device, are never posted and clear when you
        reload.
      </Notice>
      <SectionTitle
        title={
          topic === "photos"
            ? "Your private photo journal"
            : "Dated observations"
        }
        subtitle="Same light, same spot, every few weeks. No scores."
      >
        <div className="button-row">
          <Button
            variant="secondary"
            disabled={comparable.length < 2}
            onClick={() => {
              setLeft(comparable[0]?.id || "");
              setRight(comparable[1]?.id || "");
              setCompare(true);
            }}
          >
            <ArrowLeftRight size={16} />
            Compare photos
          </Button>
        </div>
      </SectionTitle>
      <div className="photo-toolbar">
        <ImageInput
          label="Add a private progress photo"
          onImage={(data) =>
            setDraft({
              id: uid(),
              data,
              mediaKind: "real",
              audience: "private",
              topic: topic === "photos" ? "skincare" : topic,
              date: today(),
              note: "",
              tag: "Real progress",
            })
          }
        />
        {topic === "photos" && (
          <Select
            label="Filter by topic"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as TopicId);
              setCompare(false);
            }}
          >
            <option value="photos">All topics</option>
            {Object.entries(topicName)
              .filter(([id]) => id !== "photos")
              .map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
          </Select>
        )}
      </div>
      {photos.length ? (
        <div className="photo-grid">
          {photos.map((p) => (
            <article className="photo-card" key={p.id}>
              <div className="private-photo">
                <img
                  src={p.data}
                  alt={`Private ${topicName[p.topic]} photo from ${p.date}`}
                />
                <span className="image-tag">
                  <LockKeyhole size={11} />
                  {p.mediaKind === "real"
                    ? "Real photo · Private"
                    : "Edited/generated inspiration · Private"}
                </span>
              </div>
              <div className="product-content">
                <small>
                  {dateLabel(p.date)} · {topicName[p.topic]}
                </small>
                <span className="journal-audience">
                  Sharing preference: {p.audience || "private"} · Original stays
                  private
                </span>
                <h3>{p.tag}</h3>
                <p>{p.note || "No observation added."}</p>
                <div className="card-controls">
                  <button className="text-button" onClick={() => setDraft(p)}>
                    Edit details
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Delete photo from ${p.date}`}
                    onClick={() => {
                      update((s) => ({
                        ...s,
                        photos: s.photos.filter((x) => x.id !== p.id),
                      }));
                      setCompare(false);
                      toast("Photo removed from this session.");
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty title="Every story starts somewhere.">
          Add your first photo with a short note. After a few weeks, compare two
          side by side.
        </Empty>
      )}
      {compare && (
        <section className="comparison">
          <SectionTitle
            title="A considered comparison"
            subtitle="Lighting, pose, lens, editing and timing can affect what you see."
          />
          <div className="form-grid">
            <Select
              label="Before photo"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
            >
              {comparable.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.date} · {topicName[p.topic]} · {p.tag}
                </option>
              ))}
            </Select>
            <Select
              label="After photo"
              value={right}
              onChange={(e) => setRight(e.target.value)}
            >
              {comparable.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.date} · {topicName[p.topic]} · {p.tag}
                </option>
              ))}
            </Select>
          </div>
          {a && b && a.id !== b.id && a.topic === b.topic ? (
            <>
              <div className="compare-stage">
                <img src={b.data} alt={`After: ${b.date}`} />
                <div
                  className="compare-before"
                  style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}
                >
                  <img src={a.data} alt={`Before: ${a.date}`} />
                </div>
                <div className="compare-line" style={{ left: `${slider}%` }} />
                <span className="compare-caption before">
                  {a.date} · {topicName[a.topic]}
                </span>
                <span className="compare-caption after">{b.date}</span>
              </div>
              <Field
                label="Comparison slider"
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
              />
            </>
          ) : (
            <Notice>
              Choose two different real photos from the same topic. Dates remain
              visible; these are your observations, not an assessment.
            </Notice>
          )}
        </section>
      )}
      {draft && (
        <Modal title="Private photo details" onClose={() => setDraft(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({
                ...s,
                photos: s.photos.some((p) => p.id === draft.id)
                  ? s.photos.map((p) => (p.id === draft.id ? draft : p))
                  : [...s.photos, draft],
              }));
              setDraft(null);
              toast("Private photo added to this session.");
            }}
          >
            <img
              className="modal-photo"
              src={draft.data}
              alt="Private photo preview"
            />
            <div className="form-grid">
              <Field
                label="Photo date"
                type="date"
                required
                max={today()}
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
              <Select
                label="Photo topic"
                value={draft.topic}
                onChange={(e) =>
                  setDraft({ ...draft, topic: e.target.value as TopicId })
                }
              >
                {Object.entries(topicName)
                  .filter(([id]) => id !== "photos")
                  .map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
              </Select>
            </div>
            <Select
              label="Image category"
              value={draft.mediaKind}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  mediaKind: e.target.value as "real" | "inspiration",
                })
              }
            >
              <option value="real">Real progress photo · User declared</option>
              <option value="inspiration">
                Edited / generated inspiration · Excluded from progress
                comparisons
              </option>
            </Select>
            <Select
              label="Journal audience"
              value={draft.audience || "private"}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  audience: e.target.value as
                    "private" | "followers" | "public",
                })
              }
            >
              <option value="private">Only me · private by default</option>
              <option value="followers">
                Approved followers · sharing preference
              </option>
              <option value="public">Public · sharing preference</option>
            </Select>
            {draft.audience && draft.audience !== "private" && (
              <Notice icon="private">
                {DEMO && "Sharing preferences are simulated. "}Your original
                uploaded photo stays private in this tab; this action does not
                publish it to the feed or send it to anyone. Account privacy
                still limits recipient access.
              </Notice>
            )}
            <Field
              label="Tag"
              value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
            />
            <Area
              label="Your observation (not a diagnosis)"
              value={draft.note}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            />
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraft(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save private photo</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
