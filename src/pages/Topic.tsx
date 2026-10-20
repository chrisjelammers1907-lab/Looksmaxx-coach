import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, Bookmark, ArrowLeftRight, Sparkles } from "lucide-react";
import { topics } from "../lib/data";
import { useDemo, toggle } from "../lib/store";
import { asset } from "../lib/domain";
import type { TopicId } from "../lib/types";
import {
  Area,
  Button,
  Empty,
  Modal,
  Notice,
  PageHeader,
  SectionTitle,
  Select,
  Tabs,
  TopicLinks,
} from "../components/ui";
import Items from "../components/Items";
import Routines from "../components/Routines";
import Gym from "./Gym";
import Photos from "./Photos";
function TopicContent() {
  const { topic: id } = useParams();
  const topic = topics.find((t) => t.id === id);
  const { state, update, toast } = useDemo();
  const [tab, setTab] = useState("overview");
  const [visual, setVisual] = useState(false);
  const [visualReady, setVisualReady] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);
  const [color, setColor] = useState("Natural brunette");
  const [compare, setCompare] = useState(false);
  const [left, setLeft] = useState("Soft texture");
  const [right, setRight] = useState("Clean crop");
  if (!topic)
    return (
      <Empty title="This topic is not here.">
        <Link to="/">Back to home</Link>
      </Empty>
    );
  const topicId = topic.id as TopicId;
  const intro: Record<string, string> = {
    skincare:
      "Fewer steps. More intention. Build a ritual that feels good to return to.",
    hair: "A shape, a texture, a little self-expression. Find a look that feels like you.",
    gym: "Strength for your everyday. A considered approach to movement and nourishment.",
    grooming: "The small details that make a familiar face feel cared for.",
    smile: "Good everyday habits, with room for your own observations.",
    fragrance:
      "A personal collection of notes, memories and quiet impressions.",
    photos: "Your private record. Honest observations, at your own pace.",
  };
  const references = [
    {
      id: "Soft texture",
      image: "hair",
      text: "Soft movement · styling reference",
    },
    {
      id: "Clean crop",
      image: "grooming",
      text: "Shorter shape · styling reference",
    },
  ];
  return (
    <div className={`topic-page atmosphere-${topic.id}`} key={topic.id}>
      <PageHeader
        eyebrow={`THE EDIT / ${topic.number}`}
        title={
          topic.id === "grooming"
            ? "Brows, Facial Hair & Grooming"
            : topic.title
        }
        description={intro[topic.id]}
      />
      {topic.id !== "photos" && (
        <div className="topic-banner">
          <div>
            <span className="eyebrow">YOUR OWN KIND OF REMARKABLE</span>
            <h2>
              {topic.id === "skincare" ? (
                <>
                  Care, made <em>personal.</em>
                </>
              ) : topic.id === "hair" ? (
                <>
                  A little change.
                  <br />
                  <em>A familiar you.</em>
                </>
              ) : topic.id === "gym" ? (
                <>
                  Feel good.
                  <br />
                  <em>Build from there.</em>
                </>
              ) : (
                <>
                  The beauty is
                  <br />
                  in the <em>details.</em>
                </>
              )}
            </h2>
            <Link className="text-link" to={`/coach?topic=${topic.id}`}>
              A little guidance from your coach <ArrowUpRight size={17} />
            </Link>
          </div>
          <img
            src={asset(topic.image)}
            alt={`${topic.title} stock editorial reference`}
          />
        </div>
      )}
      <TopicLinks topic={topic.id} />
      {topic.id === "gym" ? (
        <Gym />
      ) : topic.id === "photos" ? (
        <Photos />
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              {
                id: "overview",
                label:
                  topic.id === "fragrance" ? "My collection" : "My routines",
              },
              {
                id: "products",
                label:
                  topic.id === "fragrance"
                    ? "Shortlist & shopping"
                    : "Owned products",
              },
              {
                id: "inspiration",
                label:
                  topic.id === "hair"
                    ? "Inspiration & preview"
                    : "Notes & preferences",
              },
              { id: "progress", label: "Private progress" },
            ]}
          />
          {tab === "overview" && (
            <>
              {topic.id === "fragrance" ? (
                <>
                  <Items
                    topic="fragrance"
                    title="Your scent wardrobe"
                    shortlist
                  />
                  <SectionTitle title="Occasion & season preferences" />
                  <Area
                    label="Your fragrance notes"
                    placeholder="Notes you love, occasions, seasons, budget…"
                    value={state.notes.fragrance || ""}
                    onChange={(e) =>
                      update((s) => ({
                        ...s,
                        notes: { ...s.notes, fragrance: e.target.value },
                      }))
                    }
                  />
                </>
              ) : (
                <Routines topic={topicId} />
              )}
              <div className="editorial-note">
                <Sparkles size={22} />
                <div>
                  <h3>
                    {topic.id === "skincare"
                      ? "Keep it simple, keep it kind."
                      : "Make the details your own."}
                  </h3>
                  <p>
                    {topic.id === "skincare"
                      ? "Product compatibility depends on the full formulation and your own response. This demo cannot establish ingredient safety or diagnose irritation."
                      : topic.id === "smile"
                        ? "This is a personal care space, not a clinical assessment. We do not diagnose dental conditions or predict whitening results."
                        : "Start from your preferences. There is no single look, shape or scent that works for everyone."}
                  </p>
                  <Link to={`/coach?topic=${topic.id}`}>
                    Discuss with the demo coach <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
              {topic.id === "skincare" && (
                <>
                  <SectionTitle
                    title="Your weekly rhythm"
                    subtitle="Each routine keeps its own editable schedule."
                  />
                  <div className="week-grid">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div className="day-card" key={day}>
                          <span className="eyebrow">{day}</span>
                          {state.routines
                            .filter(
                              (r) =>
                                r.topic === "skincare" &&
                                (r.schedule === "Daily" ||
                                  r.schedule.includes(day)),
                            )
                            .map((r) => (
                              <p key={r.id}>
                                {r.time} · {r.title}
                              </p>
                            ))}
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {tab === "products" && (
            <>
              <Items
                topic={topicId}
                title={
                  topic.id === "fragrance"
                    ? "Collection & shortlist"
                    : "Your owned products"
                }
                shortlist={topic.id === "fragrance"}
              />
              {topic.id === "fragrance" && (
                <Notice>
                  Shortlist:{" "}
                  {state.items
                    .filter((i) => state.shortlist.includes(i.id))
                    .map((i) => i.name)
                    .join(", ") || "No scents shortlisted yet"}
                  . Budget: {state.profile.currency} {state.profile.budget}.
                  Shopping is simulated; no live availability or purchase is
                  provided.
                </Notice>
              )}
              {topic.id === "skincare" && (
                <div className="alternative-grid">
                  <div>
                    <h3>A considered alternative</h3>
                    <p>
                      Example categories: a gentle cleanser, a fragrance-free
                      moisturizer, or a sunscreen you tolerate. Compare labels,
                      costs and your own comfort.
                    </p>
                    <Link to="/coach?topic=skincare" className="text-link">
                      Discuss products & possible irritation{" "}
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                  <div>
                    <h3>Before adding more</h3>
                    <p>
                      Introducing one product at a time may make your own
                      observations clearer. Suitability is uncertain; persistent
                      irritation needs professional advice.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === "inspiration" &&
            (topic.id === "hair" ? (
              <>
                <SectionTitle
                  title="A new point of view"
                  subtitle="Stock inspiration, never a predicted result."
                >
                  <Button variant="secondary" onClick={() => setCompare(true)}>
                    <ArrowLeftRight size={16} />
                    Compare styles
                  </Button>
                </SectionTitle>
                <div className="inspiration-grid">
                  {references.map((ref) => (
                    <article className="inspiration-card" key={ref.id}>
                      <img src={asset(ref.image)} alt={ref.text} />
                      <div>
                        <h3>{ref.id}</h3>
                        <p>{ref.text}</p>
                        <Button
                          variant="secondary"
                          aria-pressed={state.hairSaved.includes(ref.id)}
                          onClick={() =>
                            update((s) => ({
                              ...s,
                              hairSaved: toggle(s.hairSaved, ref.id),
                            }))
                          }
                        >
                          <Bookmark size={15} />
                          {state.hairSaved.includes(ref.id)
                            ? "Saved inspiration"
                            : "Save inspiration"}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="visual-promo">
                  <div>
                    <div className="eyebrow">A LITTLE IMAGINATION</div>
                    <h2>Explore a different look.</h2>
                    <p>
                      Choose a hair color and see a labelled visual placeholder.
                      No image is analyzed or generated.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setVisual(true);
                      setVisualReady(false);
                    }}
                  >
                    Try the preview <Sparkles size={16} />
                  </Button>
                </div>
                <Area
                  label="Hair goals, preferences & reference notes"
                  value={state.notes.hair || ""}
                  placeholder="Length, texture, color preferences, products…"
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      notes: { ...s.notes, hair: e.target.value },
                    }))
                  }
                />
                <TopicLinks topic="hair" />
              </>
            ) : (
              <>
                <SectionTitle
                  title="A note to yourself"
                  subtitle="Progressively add preferences. These notes remain in this session."
                />
                <Area
                  label={`${topic.title} goals, preferences & notes`}
                  value={state.notes[topicId] || ""}
                  onChange={(e) =>
                    update((s) => ({
                      ...s,
                      notes: { ...s.notes, [topicId]: e.target.value },
                    }))
                  }
                />
                <Notice icon="private">
                  You can edit or remove these notes at any time. Delete the
                  text to remove it.
                </Notice>
                <Link to="/profile" className="text-link">
                  Edit shared budget, restrictions & preferences{" "}
                  <ArrowUpRight size={15} />
                </Link>
              </>
            ))}
          {tab === "progress" && <Photos topic={topicId} />}
        </>
      )}
      {visual && (
        <Modal title="Hair visualization demo" onClose={() => setVisual(false)}>
          <Notice>
            SIMULATED IMAGE GENERATION · A stock image and color swatch
            illustrate this interface. This is not a try-on or a predicted
            outcome.
          </Notice>
          <Select
            label="Hair color direction"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              setVisualReady(false);
            }}
          >
            {["Natural brunette", "Soft black", "Warm blonde", "Copper"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </Select>
          {visualReady && (
            <div className="visual-result">
              <img
                src={asset("hair")}
                alt="Stock portrait used as a visualization placeholder"
              />
              <span className="image-tag">
                Simulated illustration · Not your result
              </span>
              <span
                className="color-swatch"
                style={{
                  background:
                    color === "Copper"
                      ? "#a9502b"
                      : color === "Warm blonde"
                        ? "#c9a760"
                        : color === "Soft black"
                          ? "#292623"
                          : "#6b4634",
                }}
              />
              {color}
            </div>
          )}
          <Button
            disabled={visualLoading}
            onClick={() => {
              setVisualLoading(true);
              setTimeout(() => {
                setVisualLoading(false);
                setVisualReady(true);
                toast("Example visualization loaded. No image was generated.");
              }, 600);
            }}
          >
            {visualLoading ? "Loading demo…" : "Show example preview"}
          </Button>
        </Modal>
      )}
      {compare && (
        <Modal
          title="Compare hairstyle inspiration"
          onClose={() => setCompare(false)}
        >
          <div className="form-grid">
            {[0, 1].map((i) => (
              <div key={i}>
                <Select
                  label={i === 0 ? "First hairstyle" : "Second hairstyle"}
                  value={i === 0 ? left : right}
                  onChange={(e) =>
                    i === 0 ? setLeft(e.target.value) : setRight(e.target.value)
                  }
                >
                  {references.map((r) => (
                    <option key={r.id}>{r.id}</option>
                  ))}
                </Select>
                <img
                  className="compare-hair"
                  src={asset(
                    references.find((r) => r.id === (i === 0 ? left : right))
                      ?.image || "hair",
                  )}
                  alt={`${i === 0 ? left : right} stock inspiration`}
                />
              </div>
            ))}
          </div>
          <Notice>
            These are editorial references. Your texture, length and styling
            preferences may lead to a different result.
          </Notice>
        </Modal>
      )}
    </div>
  );
}

export default function TopicPage() {
  const { topic } = useParams();
  return <TopicContent key={topic} />;
}
