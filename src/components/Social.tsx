import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Flag,
  UserX,
  Copy,
  ArrowUpRight,
  Send,
  ShoppingBag,
  ChevronRight,
  Repeat2,
} from "lucide-react";
import { useDemo, toggle } from "../lib/store";
import { creators } from "../lib/data";
import type { CardRef, Post } from "../lib/types";
import {
  asset,
  totalPrice,
  topicName,
  uid,
  maySharePost,
  mayViewPost,
  money,
  dateLabel,
} from "../lib/domain";
import { Button, Field, Modal, Notice, Select } from "./ui";
import { ItemBreakdown } from "./Items";
import { PostMedia, mediaLabel } from "./FeedMedia";
const tagPositions = [
  { left: "8%", top: "16%" },
  { left: "44%", top: "46%" },
  { left: "12%", top: "70%" },
  { left: "50%", top: "24%" },
];
export function FollowButton({ creator }: { creator: string }) {
  const { state, update } = useDemo();
  if (creator === "you") return null;
  return (
    <Button
      variant={`follow ${state.following.includes(creator) ? "following" : ""}`}
      disabled={state.blocked.includes(creator)}
      aria-pressed={state.following.includes(creator)}
      onClick={() =>
        update((s) => ({ ...s, following: toggle(s.following, creator) }))
      }
    >
      {state.following.includes(creator) ? "Following" : "Follow"}
    </Button>
  );
}
export function ShareDialog({
  card,
  onClose,
}: {
  card: CardRef;
  onClose: () => void;
}) {
  const { state, update, toast } = useDemo();
  const [recipient, setRecipient] = useState("mira");
  const [text, setText] = useState("Thought you might like this.");
  const navigate = useNavigate();
  const post = state.posts.find((p) => p.id === card.id);
  const accessible = maySharePost(
    post,
    state.blocked,
    state.profile.visibility,
    recipient,
    state.approvedFollowers,
  );
  return (
    <Modal title="Share a little inspiration" onClose={onClose}>
      <Notice>
        SIMULATED PRIVATE MESSAGING · No real recipient, delivery or secure
        communication. Recipient access is checked again when a linked card is
        opened. Personal uploaded originals stay private.
      </Notice>
      {accessible ? (
        <>
          <div className="share-card-preview">
            <strong>{post?.title}</strong>
            <span>Visible to this fictional recipient · Local demo only</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (state.blocked.includes(recipient)) return;
              update((s) => ({
                ...s,
                messages: {
                  ...s.messages,
                  [recipient]: [
                    ...(s.messages[recipient] || []),
                    { id: uid(), author: "you", text, card, time: "Just now" },
                  ],
                },
              }));
              toast("Linked card added to a local demo conversation.");
              onClose();
              navigate(`/messages?to=${recipient}`);
            }}
          >
            <Select
              label="Share with"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            >
              {creators
                .filter((c) => !state.blocked.includes(c.id))
                .map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name} · fictional
                  </option>
                ))}
            </Select>
            <Field
              label="Add a message"
              value={text}
              maxLength={500}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" disabled={state.blocked.includes(recipient)}>
              <Send size={15} />
              Simulate sharing
            </Button>
          </form>
        </>
      ) : (
        <>
          <Select
            label="Check recipient access"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            {creators
              .filter((c) => !state.blocked.includes(c.id))
              .map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name} · fictional
                </option>
              ))}
          </Select>
          <p>
            This {card.kind} is private, restricted, removed or unavailable to
            the selected recipient. A linked card would not give the recipient
            access.
          </p>
          <p>
            To share your own content, create a public post and review exactly
            which text and structured items will be visible. Personal uploaded
            images are excluded.
          </p>
          <Link
            className="button"
            to={`/explore?compose=${card.id}`}
            onClick={onClose}
          >
            Create an explicit post preview
            <ArrowUpRight size={15} />
          </Link>
        </>
      )}
    </Modal>
  );
}
export function LinkedCard({
  card,
  viewer = "you",
}: {
  card: CardRef;
  viewer?: string;
}) {
  const { state } = useDemo();
  const post = state.posts.find((p) => p.id === card.id);
  if (
    !post ||
    !mayViewPost(
      post,
      viewer,
      state.blocked,
      state.profile.visibility,
      state.approvedFollowers,
    )
  )
    return (
      <div className="linked-card unavailable">
        <strong>Content unavailable</strong>
        <small>It may be private, removed, blocked or inaccessible.</small>
      </div>
    );
  return (
    <Link className="linked-card" to={`/post/${post.id}`}>
      <img src={asset(post.image)} alt="" />
      <div>
        <span>
          {topicName[post.topic] || "Community"} · {post.audience}
        </span>
        <strong>{post.title}</strong>
        <small>
          {post.items.length ? "Outfit / product details" : "Routine / post"} ·
          Open linked card
        </small>
      </div>
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function PostCard({
  post,
  expanded = false,
}: {
  post: Post;
  expanded?: boolean;
}) {
  const { state, update, toast } = useDemo();
  const [detail, setDetail] = useState(false);
  const [share, setShare] = useState(false);
  const [comment, setComment] = useState("");
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("Misleading or unsafe advice");
  const [showProducts, setShowProducts] = useState(false);
  const [captionOpen, setCaptionOpen] = useState(false);
  const creator = creators.find((c) => c.id === post.author);
  const own = post.author === "you";
  const copy = () => {
    const copiedTopic = post.topic;
    if (!copiedTopic) return;
    update((s) => {
      const copied = post.items.map((i) => ({
        ...i,
        id: uid(),
        image: i.image.startsWith("data:") ? "shirt" : i.image,
      }));
      return {
        ...s,
        items: [...s.items, ...copied],
        ...(post.topic === "clothing"
          ? {
              outfits: [
                ...s.outfits,
                {
                  id: uid(),
                  title: `${post.title} — my copy`,
                  itemIds: copied.map((i) => i.id),
                  style:
                    post.style === "dark-casual"
                      ? "dark-casual"
                      : post.style === "minimalist"
                        ? "minimalist"
                        : "old-money",
                  occasion: post.occasion,
                  season: post.season,
                  notes:
                    "Editable copy from fictional community content. Review before using.",
                },
              ],
            }
          : {
              routines: [
                ...s.routines,
                {
                  id: uid(),
                  topic: copiedTopic,
                  title: `${post.title} — my copy`,
                  time: "Anytime",
                  schedule: "Review before use",
                  steps: post.steps.length
                    ? post.steps
                    : ["Review this collection and make it your own."],
                },
              ],
            }),
      };
    });
    toast(
      "Editable private copy created. This is not an automatic medical recommendation.",
    );
  };
  const isReel = post.format === "reel" || post.media?.kind === "video";
  const handle = own ? state.profile.handle : creator?.handle;
  const liked = state.likes.includes(post.id);
  const commentCount = state.comments[post.id]?.length || 0;
  const long = post.body.length > 125;
  const shortBody = long ? `${post.body.slice(0, 122).trimEnd()}…` : post.body;
  // Photo captions show two lines first, then expand in place.
  const captionLong = post.body.length > 80;
  const captionShort = post.body.slice(0, 80).replace(/\s+\S*$/, "");
  const topicLine = [
    topicName[post.topic],
    post.style && post.style.replace("-", " "),
  ]
    .filter(Boolean)
    .join(" · ");
  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const productTags = !isReel && post.items.length > 0 && (
    <>
      <button
        type="button"
        className="shop-toggle"
        aria-label={`${showProducts ? "Hide" : "Show"} products in ${post.title}`}
        aria-pressed={showProducts}
        onClick={() => setShowProducts(!showProducts)}
      >
        <ShoppingBag size={16} strokeWidth={1.8} />
      </button>
      {showProducts &&
        post.items.slice(0, 4).map((item, index) => (
          <button
            type="button"
            key={item.id}
            className="product-tag"
            style={tagPositions[index]}
            onClick={() => setDetail(true)}
          >
            <strong>{item.name}</strong>
            <span>
              {item.store || item.brand || "Store not provided"} ·{" "}
              {item.price === null
                ? "Price unknown"
                : money(item.price, item.currency)}
            </span>
          </button>
        ))}
    </>
  );
  const body = (
    <>
      <div className="post-author">
        <Link
          to={own ? "/profile" : `/profile/${post.author}`}
          className="author-link"
        >
          <span className="avatar">
            {own ? state.profile.name.slice(0, 1) : creator?.initials}
          </span>
          <span>
            <strong>{handle}</strong>
            <small>{post.draft ? "Draft · only you" : mediaLabel(post)}</small>
          </span>
        </Link>
        <FollowButton creator={post.author} />
      </div>
      <PostMedia post={post}>
        {isReel ? (
          <div className="post-caption">
            {topicLine && <div className="post-topic">{topicLine}</div>}
            <Link to={`/post/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>{shortBody}</p>
            {long && !expanded && (
              <button
                type="button"
                className="caption-more"
                onClick={() => setDetail(true)}
              >
                more
              </button>
            )}
          </div>
        ) : (
          productTags
        )}
      </PostMedia>
      <div className="post-body">
        <div className="post-actions">
          <button
            aria-label={`Like ${post.title}`}
            aria-pressed={liked}
            className={liked ? "liked" : ""}
            onClick={() =>
              update((s) => ({ ...s, likes: toggle(s.likes, post.id) }))
            }
          >
            <Heart
              size={24}
              strokeWidth={1.6}
              fill={liked ? "currentColor" : "none"}
            />
          </button>
          <button
            aria-label={`Comment on ${post.title}`}
            onClick={() => setDetail(true)}
          >
            <MessageCircle size={24} strokeWidth={1.6} />
          </button>
          <button
            aria-label={`Share ${post.title}`}
            onClick={() => setShare(true)}
          >
            <Send size={23} strokeWidth={1.6} />
          </button>
          {!own && !post.draft && (
            <button
              aria-label={`Repost ${post.title}`}
              aria-pressed={state.reposts.includes(post.id)}
              onClick={() => {
                update((s) => ({ ...s, reposts: toggle(s.reposts, post.id) }));
                toast(
                  state.reposts.includes(post.id)
                    ? "Removed from your reposts."
                    : "Reposted to your profile.",
                );
              }}
            >
              <Repeat2 size={24} strokeWidth={1.6} />
            </button>
          )}
          <button
            className="save-action"
            aria-label={`Save ${post.title} privately`}
            aria-pressed={state.saved.includes(post.id)}
            onClick={() => {
              update((s) => ({ ...s, saved: toggle(s.saved, post.id) }));
              toast("Private saved collection updated.");
            }}
          >
            <Bookmark
              size={24}
              strokeWidth={1.6}
              fill={state.saved.includes(post.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
        <p className="post-likes">{liked ? 25 : 24} likes</p>
        {!isReel && (
          <div className="post-caption">
            {topicLine && <div className="post-topic">{topicLine}</div>}
            <Link to={`/post/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>
              <Link
                className="caption-handle"
                to={own ? "/profile" : `/profile/${post.author}`}
              >
                {handle}
              </Link>{" "}
              {expanded || captionOpen || !captionLong
                ? post.body
                : captionShort}
              {captionLong && !expanded && !captionOpen && (
                <button
                  type="button"
                  className="caption-more"
                  aria-expanded={false}
                  aria-label={`Read more of ${post.title}`}
                  onClick={() => setCaptionOpen(true)}
                >
                  … more
                </button>
              )}
            </p>
            {tags.length > 0 && (
              <p className="caption-tags">
                {tags.map((t) => `#${t.replaceAll(" ", "")}`).join(" ")}
              </p>
            )}
          </div>
        )}
        {post.items.length > 0 && !expanded && (
          <button
            type="button"
            className="shop-row"
            onClick={() => setDetail(true)}
          >
            <span className="shop-thumbs" aria-hidden="true">
              {post.items.slice(0, 3).map((item) => (
                <img
                  key={item.id}
                  src={
                    item.image.startsWith("data:")
                      ? item.image
                      : asset(item.image || "shirt")
                  }
                  alt=""
                />
              ))}
            </span>
            <span className="shop-text">
              <strong>Shop the look</strong>
              <small>
                {post.items.length} {post.items.length === 1 ? "item" : "items"}{" "}
                · {totalPrice(post.items)}
              </small>
            </span>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        )}
        {!expanded && (
          <button
            type="button"
            className="comment-link"
            onClick={() => setDetail(true)}
          >
            {commentCount
              ? `View ${commentCount === 1 ? "1 comment" : `all ${commentCount} comments`}`
              : "Add a comment…"}
          </button>
        )}
        <time className="post-date" dateTime={post.date}>
          {dateLabel(post.date)}
        </time>
        {(expanded || detail) && (
          <div className="post-expanded">
            {isReel && long && <p className="preserve-text">{post.body}</p>}
            <div className="post-metadata">
              {post.occasion} · {post.season} · Audience: {post.audience}
            </div>
            {!!post.items.length && (
              <>
                <h4>Shop the look</h4>
                <ItemBreakdown items={post.items} />
                <p className="small-text">
                  {totalPrice(post.items)} · Example prices
                </p>
              </>
            )}
            {!!post.steps.length && (
              <ol className="plain-list">
                {post.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
            <Notice>
              Fictional community content. Make your own editable copy and
              review suitability. No treatment recommendation is implied.
            </Notice>
            {post.topic && (post.items.length > 0 || post.steps.length > 0) && (
              <Button variant="secondary" onClick={copy}>
                <Copy size={15} />
                {post.topic === "clothing"
                  ? "Copy outfit to my wardrobe"
                  : "Copy routine / collection"}
              </Button>
            )}
            <h4>Conversation</h4>
            {(state.comments[post.id] || []).map((c) => (
              <div className="comment" key={c.id}>
                <strong>
                  {c.author === "you"
                    ? state.profile.name
                    : creators.find((u) => u.id === c.author)?.name}
                </strong>
                <p>{c.text}</p>
                {c.author === "you" && (
                  <button
                    className="text-button"
                    onClick={() =>
                      update((s) => ({
                        ...s,
                        comments: {
                          ...s.comments,
                          [post.id]: s.comments[post.id].filter(
                            (x) => x.id !== c.id,
                          ),
                        },
                      }))
                    }
                  >
                    Delete comment
                  </button>
                )}
              </div>
            ))}
            <form
              className="comment-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                update((s) => ({
                  ...s,
                  comments: {
                    ...s.comments,
                    [post.id]: [
                      ...(s.comments[post.id] || []),
                      { id: uid(), author: "you", text: comment.trim() },
                    ],
                  },
                }));
                setComment("");
                toast("Demo comment added locally.");
              }}
            >
              <Field
                label="Your comment"
                value={comment}
                maxLength={500}
                required
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a thoughtful note…"
              />
              <Button type="submit" aria-label="Post demo comment">
                <Send size={16} />
              </Button>
            </form>
            {!own && (
              <div className="moderation-actions">
                <button className="text-button" onClick={() => setReport(true)}>
                  <Flag size={13} />
                  Report
                </button>
                <button
                  className="text-button danger"
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      blocked: [...s.blocked, post.author],
                      following: s.following.filter((id) => id !== post.author),
                    }));
                    toast(
                      "Creator blocked locally. Their posts and messages are hidden.",
                    );
                  }}
                >
                  <UserX size={13} />
                  Block creator
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
  return (
    <>
      <article
        className={`post-card ${expanded ? "expanded" : ""} ${post.format === "reel" || post.media?.kind === "video" ? "reel-card" : "photo-card"}`}
      >
        {body}
      </article>
      {detail && !expanded && (
        <Modal
          title="Post details & comments"
          onClose={() => setDetail(false)}
          wide
        >
          <PostCard post={post} expanded />
        </Modal>
      )}
      {share && (
        <ShareDialog
          card={{
            kind:
              post.topic === "clothing"
                ? "outfit"
                : post.steps.length
                  ? "routine"
                  : post.items.length
                    ? "product"
                    : "post",
            id: post.id,
          }}
          onClose={() => setShare(false)}
        />
      )}
      {report && (
        <Modal title="Report demo content" onClose={() => setReport(false)}>
          <Notice>
            Local simulation only. No moderation team is contacted.
          </Notice>
          <Select
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {[
              "Misleading or unsafe advice",
              "Harassment",
              "Privacy concern",
              "Spam",
              "Other concern",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Button
            onClick={() => {
              update((s) => ({ ...s, reports: toggle(s.reports, post.id) }));
              setReport(false);
              toast("Demo report recorded locally.");
            }}
          >
            Submit demo report
          </Button>
        </Modal>
      )}
    </>
  );
}
