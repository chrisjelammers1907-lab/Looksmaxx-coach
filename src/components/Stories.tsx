import HScroll from "./HScroll";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemo } from "../lib/store";
import { ads, STORY_AD_EVERY, type Ad } from "../lib/ads";
import { limitsOf } from "../lib/plans";
import { creators, seedStories } from "../lib/data";
import { asset, uid } from "../lib/domain";
import type { Story } from "../lib/types";
import { Area, Button, Modal } from "./ui";

const STORY_MS = 5000;

interface StoryGroup {
  author: string;
  stories: Story[];
  ad?: Ad;
}

const adGroup = (n: number): StoryGroup => {
  const ad = ads[n % ads.length];
  return {
    author: `ad:${ad.id}:${n}`,
    ad,
    stories: [
      {
        id: `${ad.id}-${n}`,
        author: ad.id,
        time: "",
        image: ad.image,
      },
    ],
  };
};

export function StoryCard({ story }: { story: Story }) {
  return (
    <div
      className={`story-card ${story.image ? "has-image" : `bg-${story.background || "forest"}`}`}
    >
      {story.image && <img src={asset(story.image)} alt="" />}
      {story.text && <p className="story-text">{story.text}</p>}
    </div>
  );
}

function StoryViewer({
  groups,
  start,
  onClose,
}: {
  groups: StoryGroup[];
  start: number;
  onClose: () => void;
}) {
  const { state, update } = useDemo();
  const [group, setGroup] = useState(start);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = groups[group];
  const story = current?.stories[index];
  const creator = creators.find((c) => c.id === current?.author);
  const own = current?.author === "you";
  const ad = current?.ad;

  const next = () => {
    if (index < current.stories.length - 1) setIndex(index + 1);
    else if (group < groups.length - 1) {
      setGroup(group + 1);
      setIndex(0);
    } else onClose();
  };
  const previous = () => {
    if (index > 0) setIndex(index - 1);
    else if (group > 0) {
      setGroup(group - 1);
      setIndex(groups[group - 1].stories.length - 1);
    }
  };

  // Time left on the visible story, so a hold resumes where the bar paused.
  const left = useRef(STORY_MS);
  useEffect(() => {
    left.current = STORY_MS;
  }, [story?.id]);
  useEffect(() => {
    if (!story) return;
    if (!state.seenStories.includes(story.id))
      update((s) => ({ ...s, seenStories: [...s.seenStories, story.id] }));
    if (paused) return;
    const started = performance.now();
    const timer = setTimeout(next, left.current);
    return () => {
      clearTimeout(timer);
      left.current = Math.max(0, left.current - (performance.now() - started));
    };
    // Advancing restarts whenever the visible story changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, paused]);

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    document.addEventListener("keydown", keys);
    return () => document.removeEventListener("keydown", keys);
  });

  if (!story) return null;
  return (
    <Modal title="Story" onClose={onClose} bare>
      <div
        className="story-viewer"
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        <div className="story-progress" aria-hidden="true">
          {current.stories.map((s, i) => (
            <span key={s.id} className={i < index ? "done" : ""}>
              {i === index && (
                <i
                  key={story.id}
                  style={{
                    animationDuration: `${STORY_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </span>
          ))}
        </div>
        <header className="story-header">
          <span className="avatar">
            {ad
              ? ad.initials
              : own
                ? state.profile.name.slice(0, 1)
                : creator?.initials}
          </span>
          <strong>
            {ad ? ad.brand : own ? "Your story" : creator?.handle}
          </strong>
          <small>{ad ? "Sponsored" : story.time}</small>
          <button
            type="button"
            className="icon-button"
            aria-label="Close story"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>
        <StoryCard story={story} />
        {ad && (
          <div className="story-ad">
            <p>{ad.headline}</p>
            <Link to="/plans" onClick={onClose}>
              Remove ads with Plus
            </Link>
          </div>
        )}
        <span className="visually-hidden" role="status">
          Story {index + 1} of {current.stories.length}
          {story.text ? `: ${story.text}` : ""}
        </span>
        <button
          type="button"
          className="story-nav prev"
          aria-label="Previous story"
          onClick={previous}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="story-nav next"
          aria-label="Next story"
          onClick={next}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </Modal>
  );
}

export function StoryComposer({
  onClose,
  initialText = "",
}: {
  onClose: () => void;
  initialText?: string;
}) {
  const { update, toast } = useDemo();
  const [text, setText] = useState(initialText);
  const [look, setLook] = useState("forest");
  const backgrounds = [
    { id: "forest", label: "Forest" },
    { id: "ivory", label: "Ivory" },
    { id: "champagne", label: "Champagne" },
    { id: "photo-feed-linen", label: "Outfit photo" },
    { id: "photo-feed-ritual", label: "Skincare photo" },
  ];
  const isPhoto = !["forest", "ivory", "champagne"].includes(look);
  const draft: Story = {
    id: "draft",
    author: "you",
    time: "now",
    text: text.trim() || undefined,
    ...(isPhoto
      ? { image: look }
      : { background: look as Story["background"] }),
  };
  return (
    <Modal title="Add to your story" onClose={onClose}>
      <form
        className="story-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() && !isPhoto) return;
          update((s) => ({
            ...s,
            stories: [...s.stories, { ...draft, id: uid() }],
          }));
          toast("Added to your story. It stays in this session.");
          onClose();
        }}
      >
        <div className="story-composer-preview">
          <StoryCard story={draft} />
        </div>
        <div>
          <Area
            label="Text"
            value={text}
            maxLength={120}
            placeholder="Say something…"
            onChange={(e) => setText(e.target.value)}
          />
          <HScroll className="chip-row" aria-label="Background">
            {backgrounds.map((b) => (
              <button
                key={b.id}
                type="button"
                className="chip"
                aria-pressed={look === b.id}
                onClick={() => setLook(b.id)}
              >
                {b.label}
              </button>
            ))}
          </HScroll>
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!text.trim() && !isPhoto}>
              Share to story
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function StoriesRow() {
  const { state } = useDemo();
  const [viewing, setViewing] = useState<number | null>(null);
  const [composing, setComposing] = useState(false);
  const groups: StoryGroup[] = [
    ...(state.stories.length
      ? [{ author: "you", stories: state.stories }]
      : []),
    ...creators
      .filter((c) => !state.blocked.includes(c.id))
      .map((c) => ({
        author: c.id,
        stories: seedStories.filter((s) => s.author === c.id),
      }))
      .filter((g) => g.stories.length),
  ].flatMap((g, i, all) =>
    // Free members see a sponsored story after every few people.
    limitsOf(state).ads &&
    i > 0 &&
    i < all.length - 1 &&
    (i + 1) % STORY_AD_EVERY === 0
      ? [g, adGroup((i + 1) / STORY_AD_EVERY - 1)]
      : [g],
  );
  const unseen = (stories: Story[]) =>
    stories.some((s) => !state.seenStories.includes(s.id));
  return (
    <section className="stories" aria-label="Stories">
      <HScroll className="stories-row">
        <div className="story-bubble own">
          <button
            type="button"
            className={`story-ring ${state.stories.length ? (unseen(state.stories) ? "unseen" : "seen") : "no-story"}`}
            aria-label={
              state.stories.length ? "View your story" : "Add to your story"
            }
            onClick={() =>
              state.stories.length ? setViewing(0) : setComposing(true)
            }
          >
            <span className="avatar">{state.profile.name.slice(0, 1)}</span>
          </button>
          {state.stories.length ? (
            <button
              type="button"
              className="story-add"
              aria-label="Add to your story"
              onClick={() => setComposing(true)}
            >
              <Plus size={14} strokeWidth={2.4} />
            </button>
          ) : (
            <span className="story-add" aria-hidden="true">
              <Plus size={14} strokeWidth={2.4} />
            </span>
          )}
          <span className="story-name">Your story</span>
        </div>
        {groups
          .map((g, index) => ({ ...g, index }))
          .filter((g) => g.author !== "you" && !g.ad)
          .map((g) => {
            const creator = creators.find((c) => c.id === g.author)!;
            return (
              <div className="story-bubble" key={g.author}>
                <button
                  type="button"
                  className={`story-ring ${unseen(g.stories) ? "unseen" : "seen"}`}
                  aria-label={`View story from ${creator.handle}`}
                  onClick={() => setViewing(g.index)}
                >
                  <span className="avatar">{creator.initials}</span>
                </button>
                <span className="story-name">{creator.handle}</span>
              </div>
            );
          })}
      </HScroll>
      {viewing !== null && (
        <StoryViewer
          groups={groups}
          start={viewing}
          onClose={() => setViewing(null)}
        />
      )}
      {composing && <StoryComposer onClose={() => setComposing(false)} />}
    </section>
  );
}
