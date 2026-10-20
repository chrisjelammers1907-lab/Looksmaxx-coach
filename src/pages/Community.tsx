import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useDemo } from "../lib/store";
import { seedItems, seedPosts, topics } from "../lib/data";
import type { Audience, Post, TopicId } from "../lib/types";
import { asset, totalPrice, uid, today, mayViewPost } from "../lib/domain";
import {
  Area,
  Button,
  Empty,
  Field,
  Modal,
  Notice,
  PageHeader,
  Select,
  Tabs,
} from "../components/ui";
import { ItemBreakdown } from "../components/Items";
import { PostCard } from "../components/Social";
function CommunityContent() {
  const { state, update, toast } = useDemo();
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const outfit = state.outfits.find((o) => o.id === params.get("compose"));
  const makePost = (): Post => ({
    id: uid(),
    author: "you",
    topic: outfit ? "clothing" : (params.get("topic") as TopicId) || "clothing",
    title: outfit?.title || "",
    body: "",
    image: "hero",
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
    style: outfit?.style || state.style,
    occasion: outfit?.occasion || "Everyday",
    season: outfit?.season || "All seasons",
    tags: "",
    date: today(),
  });
  const [composer, setComposer] = useState(params.has("compose"));
  const [draft, setDraft] = useState<Post>(makePost);
  const [preview, setPreview] = useState(false);
  const [feed, setFeed] = useState("explore");
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
  const visible = state.posts
    .filter((p) => mayViewPost(p, "you", state.blocked))
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
            if (!draft.title.trim() || !draft.body.trim()) return;
            setPreview(true);
          }}
        >
          <Notice>
            LOCAL SOCIAL DEMO · Only fictional example content belongs here.
            Your real photos, personal routines, intake, logs and private notes
            stay out of public demo posts. Uploaded images cannot be attached.
          </Notice>
          <div className="form-grid">
            <Select
              label="Post topic"
              value={draft.topic}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  topic: e.target.value as TopicId,
                  image:
                    topics.find((t) => t.id === e.target.value)?.image ||
                    "hero",
                  style: e.target.value === "clothing" ? state.style : "",
                })
              }
            >
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
              <option value="">Choose a fictional example</option>
              {seedPosts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </div>
          <Field
            label="Post title"
            required
            maxLength={100}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Area
            label="Post text (fictional demo content only)"
            required
            maxLength={1500}
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
          <div className="form-grid">
            <Select
              label="Editorial reference image"
              value={draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            >
              {Object.entries({
                hero: "Tailored style",
                style: "Fashion inspiration",
                skin: "Skincare reference",
                hair: "Hair reference",
                gym: "Training space",
                grooming: "Grooming reference",
                smile: "Smile care",
                fragrance: "Fragrance reference",
              }).map(([v, label]) => (
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
              <option value="followers">
                Followers · simulated restricted audience
              </option>
              <option value="public">Public · fictional demo community</option>
            </Select>
            <Select
              label="Style tag"
              value={draft.style}
              onChange={(e) => setDraft({ ...draft, style: e.target.value })}
            >
              <option value="">Not applicable</option>
              <option value="old-money">Old money</option>
              <option value="dark-casual">Dark casual</option>
              <option value="minimalist">Minimalist</option>
            </Select>
            <Select
              label="Occasion"
              value={draft.occasion}
              onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
            >
              {["Everyday", "Weekend", "Work", "Evening", "Travel"].map((v) => (
                <option key={v}>{v}</option>
              ))}
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
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">
              <Eye size={16} />
              Preview audience & content
            </Button>
          </div>
        </form>
      ) : (
        <>
          <Notice icon={draft.audience === "private" ? "private" : "info"}>
            {draft.audience === "public"
              ? "Public: title, post text, editorial reference image, tags, structured item details and routine steps below will be visible in the local demo."
              : draft.audience === "followers"
                ? "Followers: simulated restricted audience. Rich-card sending is disabled because recipient access is not established."
                : "Only you: this post remains private and cannot be delivered through a shared card."}{" "}
            Your intake, original routines and uploaded photos are excluded.
          </Notice>
          <img
            className="post-preview-image"
            src={asset(draft.image)}
            alt="Editorial reference selected for this post"
          />
          <h3>{draft.title}</h3>
          <p className="small-text">
            Posting as {state.profile.name} · local demo profile. Your private
            profile photo is excluded.
          </p>
          <p className="preserve-text">{draft.body}</p>
          <div className="tag-row">
            <span className="pill">Audience: {draft.audience}</span>
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
            <Button
              onClick={() => {
                update((s) => ({
                  ...s,
                  posts: s.posts.some((p) => p.id === draft.id)
                    ? s.posts.map((p) => (p.id === draft.id ? draft : p))
                    : [draft, ...s.posts],
                }));
                close();
                toast(
                  draft.audience === "private"
                    ? "Private session post saved."
                    : "Fictional post published locally. No real network activity.",
                );
                navigate(`/post/${draft.id}`);
              }}
            >
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
        <Link to="/explore" className="text-link">
          <ArrowLeft size={15} />
          Back to Explore
        </Link>
        {mayViewPost(current, "you", state.blocked) && current ? (
          <>
            <PageHeader
              eyebrow="THE COMMUNITY EDIT"
              title="A shared point of view."
            />
            {current.author === "you" && (
              <div className="button-row own-post-actions">
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
                navigate("/explore");
              }}
            >
              Delete post
            </Button>
          </Modal>
        )}
      </div>
    );
  return (
    <div className="explore-page">
      <PageHeader
        eyebrow="GOOD THINGS, SHARED"
        title="A little inspiration."
        description="Different perspectives. Everyday rituals. Find something that feels like you."
        action={
          <Button
            onClick={() => {
              setDraft(makePost());
              setComposer(true);
              setPreview(false);
            }}
          >
            <Plus size={16} />
            Create a post
          </Button>
        }
      />
      <Notice>
        FICTIONAL COMMUNITY DEMO · Editorial reference images, fictional
        creators, local likes and follows. No real accounts or multi-user
        synchronization.
      </Notice>
      <Tabs
        value={feed}
        onChange={setFeed}
        tabs={[
          { id: "explore", label: "Discover" },
          { id: "following", label: "Following" },
          { id: "saved", label: "Privately saved" },
        ]}
      />
      <div className="explore-toolbar">
        <div className="search-field">
          <Search size={17} />
          <Field
            label="Search posts"
            placeholder="Search the edit…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="all">All topics</option>
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
        <summary>Refine by style, occasion, season, tags & budget</summary>
        <div className="filter-grid">
          <Select
            label="Style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="all">All styles</option>
            {["old-money", "dark-casual", "minimalist"].map((v) => (
              <option key={v} value={v}>
                {v.replace("-", " ")}
              </option>
            ))}
          </Select>
          <Select
            label="Occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option value="all">All occasions</option>
            {["Everyday", "Weekend", "Work", "Evening", "Travel"].map((v) => (
              <option key={v}>{v}</option>
            ))}
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
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            hint="Excludes unknown and mixed-currency totals"
          />
        </div>
      </details>
      <div className="feed-count">
        {visible.length} considered {visible.length === 1 ? "find" : "finds"}
      </div>
      {visible.length ? (
        <div className="community-grid">
          {visible.map((p) => (
            <PostCard key={p.id} post={p} />
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
                setFeed("explore");
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
            : "Try another topic or follow a fictional creator."}
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
