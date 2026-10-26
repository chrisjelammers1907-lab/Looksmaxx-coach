import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  ArrowLeftRight,
  Lightbulb,
} from "lucide-react";
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
import Gym, { PostureCard } from "./Gym";
import Photos from "./Photos";
import { topicPhoto } from "../lib/editorial";
import Nutrition from "../components/Nutrition";
import { DEMO } from "../lib/demo";
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
    grooming: "A clean shave or a sharp beard line — without the irritation.",
    smile: "Good everyday habits, with room for your own observations.",
    fragrance:
      "A personal collection of notes, memories and quiet impressions.",
    photos: "Your private record. Honest observations, at your own pace.",
    makeup:
      "A little goes a long way. Even skin, defined brows and a touch of colour.",
    face: "What actually changes the eye area, midface, cheekbones, jaw and chin — and what doesn’t.",
    colouring:
      "Find your undertone and contrast, then let colour work for you.",
    brows: "The frame of your face. Shape a little, set them well.",
    nutrition: "Your targets, your food and your weight — in one calm place.",
    body: "Skin from the neck down, hands, feet and nails.",
    sleep: "Better sleep shows up in your skin, your training and your mood.",
    presence:
      "Posture, eye contact and voice: how you show up before you say a word.",
  };
  const references = [
    {
      id: "Soft texture",
      image: "photo-feed-hair",
      text: "Soft waves · styling reference",
    },
    {
      id: "Clean crop",
      image: "photo-hair",
      text: "Short sides, curls on top",
    },
  ];
  return (
    <div className={`topic-page atmosphere-${topic.id}`} key={topic.id}>
      <PageHeader title={topic.title} description={intro[topic.id]} />
      {topic.id !== "photos" && (
        <figure className="topic-photo-strip">
          <img src={asset(topicPhoto(topic.id))} alt="" />
        </figure>
      )}
      <TopicLinks topic={topic.id} />
      {topic.id === "gym" ? (
        <Gym />
      ) : topic.id === "nutrition" ? (
        <Nutrition />
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
              {topic.id === "presence" && <PostureCard />}
              <div className="editorial-note">
                <Lightbulb size={20} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h3>
                    {note[topic.id]?.title || "Make the details your own."}
                  </h3>
                  <p>
                    {note[topic.id]?.text ||
                      "Start from what you like. There is no single look that works for everyone."}
                  </p>
                </div>
              </div>
              {topic.id === "skincare" && (
                <>
                  <p className="routine-rhythm">
                    {state.routines
                      .filter((r) => r.topic === "skincare")
                      .map(
                        (r) =>
                          `${r.title} runs ${r.schedule === "Daily" ? "daily" : `on ${r.schedule}`}`,
                      )
                      .join(" · ") || "No routines scheduled yet"}
                    . Change the days in a routine.
                  </p>
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
                  {DEMO &&
                    " Shopping is simulated; no live availability or purchase is provided."}
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
                      <img
                        loading="lazy"
                        decoding="async"
                        src={asset(ref.image)}
                        alt={ref.text}
                      />
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
                    Try the preview <ArrowRight size={16} />
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
        <Modal title="Try a colour direction" onClose={() => setVisual(false)}>
          <Notice>
            A preview of the colour direction on a reference photo — your own
            result will look different.
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
                src={asset("photo-feed-hair")}
                alt="Reference portrait for the colour preview"
              />
              <span className="image-tag">
                {DEMO
                  ? "Simulated illustration · Not your result"
                  : "Colour preview · Not your result"}
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
            {visualLoading ? "Loading…" : "Show example preview"}
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

/** One practical tip per category, under the routines. */
const note: Partial<Record<TopicId, { title: string; text: string }>> = {
  skincare: {
    title: "One new product at a time.",
    text: "Patch-test it on your jaw for a few days and give it two weeks before you judge. Stop if it stings, burns or turns red.",
  },
  hair: {
    title: "Bring two photos to your barber.",
    text: "A front and a side view say more than any description. Ask how much styling the cut needs each morning.",
  },
  grooming: {
    title: "Set the neckline once.",
    text: "One finger above the Adam’s apple, curving up behind the ears. Get it right once and the beard looks sharp for weeks.",
  },
  smile: {
    title: "When to see a dentist.",
    text: "Pain, bleeding gums, swelling or a tooth that changes colour needs a check-up — your routine can’t fix that on its own.",
  },
  makeup: {
    title: "Blend into the jaw and neck.",
    text: "Base that stops at the jawline is what gives makeup away. Use less than you think and blend outwards in daylight.",
  },
  face: {
    title: "Start with what you control.",
    text: "Body fat, sleep, posture and a good haircut change how your face reads more than any gadget. Give each change a month.",
  },
  colouring: {
    title: "Judge colours in daylight.",
    text: "Hold a shade under your chin by a window. If your skin looks brighter and shadows softer, the colour suits you.",
  },
  brows: {
    title: "Less is more with brows.",
    text: "Trim and tweeze a little, then step back from the mirror. Over-plucked brows take months to grow back.",
  },
  body: {
    title: "Moisturise on damp skin.",
    text: "Lotion holds water best right after the shower. Pat dry, then apply within a few minutes.",
  },
  sleep: {
    title: "Keep the same wake-up time.",
    text: "A steady wake-up time, also at the weekend, sets your body clock faster than any supplement.",
  },
  presence: {
    title: "Slow down by a beat.",
    text: "Speaking a little slower and holding eye contact a moment longer reads as calm and confident.",
  },
  fragrance: {
    title: "Test on skin, not paper.",
    text: "Wear a sample for a full day before you buy. The first minutes smell different from the rest of the day.",
  },
};
/** Banner copy per category: a short eyebrow and a two-line headline. */
export default function TopicPage() {
  const { topic } = useParams();
  return <TopicContent key={topic} />;
}
