import HScroll from "../components/HScroll";
import { Fragment, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Images,
  Film,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { clothingStyles, seedItems, seedPosts, topics } from "../lib/data";
import type { Audience, Post, TopicId } from "../lib/types";
import { totalPrice, uid, today, mayViewPost } from "../lib/domain";
import {
  Area,
  Button,
  Empty,
  Field,
  Modal,
  Notice,
  Select,
  Tabs,
} from "../components/ui";
import { ItemBreakdown } from "../components/Items";
import { PostCard } from "../components/Social";
import { MediaPicker, PostMedia, mediaLabel } from "../components/FeedMedia";
import { SoundPicker } from "../components/Sounds";
import StoriesRow from "../components/Stories";
import { topicPhoto } from "../lib/editorial";
import { SponsoredPost } from "../components/Ads";
import { AD_EVERY, ads } from "../lib/ads";
import { limitsOf } from "../lib/plans";
/** Short chip names for the feed filters, in category order. */
const chipLabel: Partial<Record<TopicId, string>> = {
  skincare: "Skincare",
  makeup: "Makeup",
  face: "Face",
  colouring: "Colouring",
  brows: "Brows",
  smile: "Smile",
  hair: "Hair",
  grooming: "Beard",
  gym: "Training",
  nutrition: "Nutrition",
  body: "Body",
  sleep: "Sleep",
  presence: "Presence",
  clothing: "Outfits",
  fragrance: "Fragrance",
};
/** Editorial photos a post can use; personal uploads stay private. */
const editorialChoices: Record<string, string> = {
  "photo-feed-sunday": "Sunday in white",
  "photo-home-hero": "Neutral tones, two people",
  "photo-feed-linen": "Linen set",
  "photo-feed-lounge": "Lounge in linen",
  "photo-feed-cuff": "Cuff and watch",
  "photo-feed-night": "Leather after dark",
  motion: "Motion study · video",
  "photo-skincare": "Skincare",
  "photo-hair": "Hair",
  "photo-gym": "Training",
  "photo-grooming": "Shaving",
  "photo-smile": "Smile",
  "photo-fragrance": "Fragrance",
};
function CommunityContent() {
  const { state, update, toast } = useDemo();
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const outfit = state.outfits.find((o) => o.id === params.get("compose"));
  const makePost = (): Post => ({
    id: uid(),
    author: "you",
    topic: outfit
      ? "clothing"
      : topics.find((t) => t.id === params.get("topic"))?.id || "",
    title: outfit?.title || "",
    body: "",
    image: "photo-feed-sunday",
    items: outfit
      ? state.items
          .filter((i) => outfit.itemIds.includes(i.id))
          .map((i) => ({
            ...i,
            image: i.image.startsWith("data:") ? "shirt" : i.image,
            notes: "",
          }))
      : [],
    steps: [],
    audience: "private",
    style: outfit?.style || "",
    occasion: outfit?.occasion || "",
    season: outfit?.season || "",
    tags: "",
    date: today(),
  });
  const [composer, setComposer] = useState(params.has("compose"));
  const [draft, setDraft] = useState<Post>(makePost);
  const [preview, setPreview] = useState(false);
  const [feed, setFeed] = useState(params.get("feed") || "for-you");
  const [format, setFormat] = useState(
    params.get("format") === "reels" ? "reels" : "photos",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(params.get("topic") || "all");
  const [style, setStyle] = useState(params.get("style") || "all");
  const [occasion, setOccasion] = useState("all");
  const [season, setSeason] = useState("all");
  const [budget, setBudget] = useState("");
  const [sort, setSort] = useState("newest");
  const [tag, setTag] = useState("");
  const [deletePost, setDeletePost] = useState(false);
  const current = state.posts.find((p) => p.id === id);
  const close = () => {
    setComposer(false);
    setPreview(false);
    if (params.has("compose")) {
      params.delete("compose");
      setParams(params);
    }
  };
  const save = (asDraft: boolean) => {
    const saved = { ...draft, draft: asDraft || undefined };
    update((s) => ({
      ...s,
      posts: s.posts.some((p) => p.id === saved.id)
        ? s.posts.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...s.posts],
    }));
    close();
    toast(
      asDraft
        ? "Draft saved. Only you can see it."
        : saved.audience === "private"
          ? "Private session post saved."
          : "Fictional post published locally. No real network activity.",
    );
    navigate(`/post/${saved.id}`);
  };
  const showAds = limitsOf(state).ads;
  const visible = state.posts
    .filter((p) =>
      format === "reels"
        ? p.media?.kind === "video" || p.format === "reel"
        : p.media?.kind !== "video" && p.format !== "reel",
    )
    .filter(
      (p) =>
        p.audience !== "private" &&
        !p.draft &&
        !state.muted.includes(p.author) &&
        mayViewPost(p, "you", state.blocked),
    )
    .filter(
      (p) =>
        (feed !== "following" || state.following.includes(p.author)) &&
        (feed !== "saved" || state.saved.includes(p.id)),
    )
    .filter(
      (p) =>
        (topic === "all" || p.topic === topic) &&
        (style === "all" || p.style === style) &&
        (occasion === "all" || p.occasion === occasion) &&
        (season === "all" || p.season === season) &&
        (!tag || p.tags.toLowerCase().includes(tag.toLowerCase())) &&
        `${p.title} ${p.body} ${p.tags}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (!budget ||
          (p.items.length > 0 &&
            p.items.every(
              (i) => i.price !== null && i.currency === state.profile.currency,
            ) &&
            p.items.reduce((a, i) => a + (i.price || 0), 0) <= Number(budget))),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? a.date.localeCompare(b.date)
        : sort === "budget"
          ? a.items.reduce((s, i) => s + (i.price || 0), 0) -
            b.items.reduce((s, i) => s + (i.price || 0), 0)
          : sort === "popular"
            ? (state.likes.includes(b.id) ? 1 : 0) -
              (state.likes.includes(a.id) ? 1 : 0)
            : b.date.localeCompare(a.date),
    );
  const composerModal = composer && (
    <Modal
      title={
        preview
          ? "A clear look before you share."
          : "A little inspiration to share."
      }
      onClose={close}
      wide
    >
      {!preview ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !draft.body.trim() ||
              (draft.media?.origin === "private-upload" &&
                draft.audience !== "private")
            )
              return;
            setDraft({
              ...draft,
              title: draft.title.trim() || draft.body.trim().slice(0, 70),
            });
            setPreview(true);
          }}
        >
          <Notice icon="private">
            Your private photos, routines, logs and notes are never posted. Only
            what you add here is shared.
          </Notice>
          <Field
            label="Post title (optional)"
            maxLength={100}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Area
            label="Caption"
            required
            maxLength={1500}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
          <MediaPicker
            value={
              draft.media?.origin === "private-upload" ? draft.media : undefined
            }
            onChange={(media) =>
              setDraft({ ...draft, media, slides: undefined })
            }
          />
          <div className="form-grid">
            <Select
              label="Editorial reference image"
              value={
                draft.media?.kind === "video" &&
                draft.media.origin === "editorial"
                  ? "motion"
                  : draft.image
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  slides:
                    draft.format === "reel" && e.target.value !== "motion"
                      ? [
                          e.target.value,
                          e.target.value === "photo-feed-linen"
                            ? "photo-feed-lounge"
                            : "photo-feed-linen",
                        ]
                      : undefined,
                  image:
                    e.target.value === "motion"
                      ? "photo-feed-motion"
                      : e.target.value,
                  media:
                    e.target.value === "motion"
                      ? {
                          kind: "video",
                          src: "motion",
                          poster: "photo-feed-motion",
                          width: 1080,
                          height: 1350,
                          origin: "editorial",
                          label: "Motion study",
                        }
                      : undefined,
                })
              }
            >
              {Object.entries(editorialChoices).map(([v, label]) => (
                <option value={v} key={v}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              label="Audience"
              value={draft.audience}
              onChange={(e) =>
                setDraft({ ...draft, audience: e.target.value as Audience })
              }
            >
              <option value="private">Only me · private</option>
              <option value="followers">Followers only</option>
              <option value="public">Public · everyone</option>
            </Select>
          </div>
          {draft.media?.kind !== "video" && (
            <div className="form-grid">
              <Select
                label="Post format"
                value={draft.format || "photo"}
                onChange={(event) => {
                  const next = event.target.value as "photo" | "reel";
                  setDraft({
                    ...draft,
                    format: next,
                    slides:
                      next === "reel" &&
                      draft.media?.origin !== "private-upload"
                        ? [
                            draft.image,
                            draft.image === "photo-feed-linen"
                              ? "photo-feed-lounge"
                              : "photo-feed-linen",
                          ]
                        : undefined,
                  });
                }}
              >
                <option value="photo">Photos · still image</option>
                <option value="reel">Reels · photo story</option>
              </Select>
              {draft.format === "reel" &&
                draft.media?.origin !== "private-upload" && (
                  <Select
                    label="Second slideshow photo"
                    value={draft.slides?.[1] || ""}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        slides: [draft.image, event.target.value],
                      })
                    }
                  >
                    <option value="">Choose an editorial photo</option>
                    <option value="photo-feed-linen">Linen set</option>
                    <option value="photo-feed-lounge">Lounge in linen</option>
                    <option value="photo-feed-cuff">Cuff and watch</option>
                  </Select>
                )}
            </div>
          )}
          {draft.audience !== "private" &&
            state.profile.visibility === "private" && (
              <Notice icon="private">
                Your account is private. Only approved followers can access this
                post; a public audience selection does not override account
                privacy.
              </Notice>
            )}
          {draft.media?.origin === "private-upload" &&
            draft.audience !== "private" && (
              <p className="error" role="alert">
                Personal uploads stay private. Choose Only me, or pick an
                editorial image to post publicly.
              </p>
            )}
          <SoundPicker
            value={draft.sound}
            video={draft.media?.kind === "video"}
            onChange={(sound) => setDraft({ ...draft, sound })}
          />
          <details className="composer-details">
            <summary>Topic & additional details (optional)</summary>
            <div className="form-grid">
              <Select
                label="Post topic"
                value={draft.topic}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    topic: e.target.value as TopicId,
                    image: e.target.value
                      ? topicPhoto(e.target.value as TopicId)
                      : "photo-feed-sunday",
                    style: e.target.value === "clothing" ? state.style : "",
                  })
                }
              >
                <option value="">No topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </Select>
              <Select
                label="Attach structured example content"
                value=""
                onChange={(e) => {
                  const source = seedPosts.find((p) => p.id === e.target.value);
                  if (source)
                    setDraft({
                      ...draft,
                      topic: source.topic,
                      items: structuredClone(source.items),
                      steps: [...source.steps],
                      image: source.image,
                      style: source.style,
                    });
                }}
              >
                <option value="">Choose an editorial image</option>
                {seedPosts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="form-grid">
              <Select
                label="Style tag"
                value={draft.style}
                onChange={(e) => setDraft({ ...draft, style: e.target.value })}
              >
                <option value="">Not applicable</option>
                {clothingStyles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Occasion"
                value={draft.occasion}
                onChange={(e) =>
                  setDraft({ ...draft, occasion: e.target.value })
                }
              >
                {["Everyday", "Weekend", "Work", "Evening", "Travel"].map(
                  (v) => (
                    <option key={v}>{v}</option>
                  ),
                )}
              </Select>
              <Select
                label="Season"
                value={draft.season}
                onChange={(e) => setDraft({ ...draft, season: e.target.value })}
              >
                {["All seasons", "Spring", "Summer", "Autumn", "Winter"].map(
                  (v) => (
                    <option key={v}>{v}</option>
                  ),
                )}
              </Select>
              <Field
                label="Tags (comma-separated)"
                value={draft.tags}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              />
            </div>
            <Area
              label="Example routine steps (one per line)"
              value={draft.steps.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  steps: e.target.value.split("\n").filter(Boolean),
                })
              }
            />
            <p className="small-text">
              Structured items:{" "}
              {draft.items.map((i) => i.name).join(", ") || "None"}. Prices,
              brands, stores and links will be visible in the preview.
            </p>
            <div className="button-row">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDraft({ ...draft, items: [] })}
              >
                Remove attached items
              </Button>
              {draft.topic === "clothing" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      items: structuredClone(seedItems.slice(0, 3)),
                    })
                  }
                >
                  Attach example outfit
                </Button>
              )}
            </div>
          </details>
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                draft.media?.origin === "private-upload" &&
                draft.audience !== "private"
              }
            >
              <Eye size={16} />
              Preview audience & content
            </Button>
          </div>
        </form>
      ) : (
        <>
          <Notice icon={draft.audience === "private" ? "private" : "info"}>
            {draft.audience === "public"
              ? "Everyone can see the title, caption, media, tags, items and steps below."
              : draft.audience === "followers"
                ? "Only your followers can see this post. It can’t be sent in chats."
                : "Only you can see this post."}{" "}
            Your intake and private routines are never included.
          </Notice>
          <PostMedia post={draft} />
          <h3>{draft.title}</h3>
          <p className="small-text">
            Posting as {state.profile.name}
            {mediaLabel(draft) && ` · ${mediaLabel(draft)}`}. Your private
            profile photo is excluded.
          </p>
          <p className="preserve-text">{draft.body}</p>
          <div className="tag-row">
            <span className="pill">
              Audience:{" "}
              {draft.audience === "public" &&
              state.profile.visibility === "private"
                ? "Approved followers · private account"
                : draft.audience}
            </span>
            <span className="tag">
              {draft.style} · {draft.occasion} · {draft.season}
            </span>
            <span>{draft.tags}</span>
          </div>
          <ItemBreakdown items={draft.items} />
          {!!draft.items.length && <p>{totalPrice(draft.items)}</p>}
          {!!draft.steps.length && (
            <ol className="plain-list">
              {draft.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setPreview(false)}>
              Back to edit
            </Button>
            <Button variant="ghost" onClick={() => save(true)}>
              Save as draft
            </Button>
            <Button onClick={() => save(false)}>
              {draft.audience === "private"
                ? "Save private post"
                : "Publish demo post"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
  if (id)
    return (
      <div className="community-detail">
        <Link to="/" className="text-link back-link">
          <ArrowLeft size={15} />
          Back to feed
        </Link>
        <h1 className="visually-hidden">Post details</h1>
        {mayViewPost(current, "you", state.blocked) && current ? (
          <>
            {current.author === "you" && (
              <div className="button-row own-post-actions">
                {current.draft && (
                  <Button
                    onClick={() => {
                      update((s) => ({
                        ...s,
                        posts: s.posts.map((p) =>
                          p.id === current.id ? { ...p, draft: undefined } : p,
                        ),
                      }));
                      toast("Draft published.");
                    }}
                  >
                    Publish draft
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDraft(current);
                    setPreview(false);
                    setComposer(true);
                  }}
                >
                  <Pencil size={15} />
                  Edit post
                </Button>
                <Button
                  variant="ghost danger"
                  onClick={() => setDeletePost(true)}
                >
                  <Trash2 size={15} />
                  Delete post
                </Button>
              </div>
            )}
            <PostCard key={current.id} post={current} expanded />
          </>
        ) : (
          <Empty title="This content is unavailable.">
            It may be removed, private, restricted or from a blocked creator.
            Shared links do not bypass access controls.
          </Empty>
        )}
        {composerModal}
        {deletePost && (
          <Modal
            title="Remove this demo post?"
            onClose={() => setDeletePost(false)}
          >
            <p>
              It will disappear from the feed. Existing message cards will show
              “Content unavailable”.
            </p>
            <Button
              variant="danger"
              onClick={() => {
                update((s) => ({
                  ...s,
                  posts: s.posts.filter((p) => p.id !== id),
                  saved: s.saved.filter((v) => v !== id),
                  likes: s.likes.filter((v) => v !== id),
                }));
                navigate("/");
              }}
            >
              Delete post
            </Button>
          </Modal>
        )}
      </div>
    );
  const chips = [
    ...clothingStyles.map((s) => ({ kind: "style", id: s.id, label: s.label })),
    ...topics
      .filter((t) => t.id !== "photos")
      .map((t) => ({ kind: "topic", id: t.id, label: chipLabel[t.id] })),
  ];
  return (
    <div
      className={`explore-page ${format === "reels" && visible.length ? "reels-mode" : ""}`}
    >
      <h1 className="visually-hidden">Your daily edit.</h1>
      <StoriesRow />
      <div className="feed-header">
        <span className="feed-header-spacer" aria-hidden="true" />
        <div className="feed-tabs">
          <Tabs
            value={feed}
            onChange={setFeed}
            tabs={[
              { id: "for-you", label: "For You" },
              { id: "following", label: "Following" },
            ]}
          />
        </div>
        <div className="feed-header-actions">
          <button
            type="button"
            className={`icon-button ${showFilters ? "active" : ""}`}
            aria-expanded={showFilters}
            aria-label="Search and filter posts"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Search size={20} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            className="icon-button create-button"
            aria-label="Create a post"
            onClick={() => {
              setDraft(makePost());
              setComposer(true);
              setPreview(false);
            }}
          >
            <Plus size={20} strokeWidth={1.7} />
            <span className="create-label" aria-hidden="true">
              New post
            </span>
          </button>
        </div>
      </div>
      <div className="feed-format-row">
        <div
          className="feed-format-tabs"
          role="tablist"
          aria-label="Post format"
        >
          {[
            { id: "photos", label: "Photos", icon: Images },
            { id: "reels", label: "Reels", icon: Film },
          ].map(({ id: formatId, label, icon: Icon }) => (
            <button
              key={formatId}
              type="button"
              role="tab"
              aria-selected={format === formatId}
              tabIndex={format === formatId ? 0 : -1}
              className={format === formatId ? "active" : ""}
              onClick={() => setFormat(formatId)}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? "photos"
                      : event.key === "End"
                        ? "reels"
                        : format === "photos"
                          ? "reels"
                          : "photos";
                  setFormat(next);
                  const sibling =
                    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                      "button",
                    );
                  sibling?.[next === "photos" ? 0 : 1].focus();
                }
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>
      <div className="feed-chips">
        <HScroll
          className="chip-scroller"
          aria-label="Filter by style or topic"
        >
          <button
            type="button"
            className="chip"
            aria-pressed={topic === "all" && style === "all"}
            onClick={() => {
              setTopic("all");
              setStyle("all");
            }}
          >
            All
          </button>
          {chips.map((chip) => {
            const active =
              chip.kind === "style" ? style === chip.id : topic === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                className="chip"
                aria-pressed={active}
                onClick={() =>
                  chip.kind === "style"
                    ? setStyle(active ? "all" : chip.id)
                    : setTopic(active ? "all" : chip.id)
                }
              >
                {chip.label}
              </button>
            );
          })}
        </HScroll>
      </div>
      {showFilters && (
        <section
          className="feed-filter-panel"
          aria-label="Feed search and filters"
        >
          <div className="explore-toolbar">
            <div className="search-field">
              <Search size={17} />
              <Field
                label="Search posts"
                placeholder="Search captions and titles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="all">All topics, including untagged posts</option>
              {topics.map((t) => (
                <option value={t.id} key={t.id}>
                  {t.title}
                </option>
              ))}
            </Select>
            <Select
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Liked first</option>
              <option value="budget">Example price: low first</option>
            </Select>
          </div>
          <details className="filter-details">
            <summary>Outfit details & tags</summary>
            <div className="filter-grid">
              <Select
                label="Style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="all">All styles</option>
                {clothingStyles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="all">All occasions</option>
                {["Everyday", "Weekend", "Work", "Evening", "Travel"].map(
                  (v) => (
                    <option key={v}>{v}</option>
                  ),
                )}
              </Select>
              <Select
                label="Season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option value="all">All seasons</option>
                {["Autumn", "Winter", "Spring", "Summer"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
              <Field
                label="Contains tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <Field
                label={`Max total (${state.profile.currency})`}
                type="number"
                inputMode="decimal"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                hint="Excludes unknown and mixed-currency totals"
              />
            </div>
          </details>
        </section>
      )}
      {showFilters && (
        <div className="feed-count">
          {visible.length} demo {visible.length === 1 ? "post" : "posts"}
        </div>
      )}
      <h2 className="visually-hidden">
        {format === "reels" ? "Reels" : "Photos"}
      </h2>
      {visible.length ? (
        <div
          className={`community-grid feed-grid ${format}-feed`}
          data-format={format}
        >
          {visible.map((p, i) => (
            <Fragment key={p.id}>
              <PostCard post={p} />
              {showAds && format === "photos" && (i + 1) % AD_EVERY === 0 && (
                <SponsoredPost
                  ad={ads[((i + 1) / AD_EVERY - 1) % ads.length]}
                />
              )}
            </Fragment>
          ))}
        </div>
      ) : (
        <Empty
          title={
            feed === "following"
              ? "Your circle starts with a follow."
              : "A little space to explore."
          }
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setFeed("for-you");
                setTopic("all");
                setStyle("all");
                setOccasion("all");
                setSeason("all");
                setQuery("");
                setTag("");
                setBudget("");
              }}
            >
              Reset filters & discover
            </Button>
          }
        >
          {feed === "saved"
            ? "Save posts with the bookmark to see them here."
            : "Try another topic or follow someone new."}
        </Empty>
      )}
      {composerModal}
    </div>
  );
}

export default function CommunityPage() {
  const location = useLocation();
  return <CommunityContent key={location.pathname + location.search} />;
}
