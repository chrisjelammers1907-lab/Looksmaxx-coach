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
  Repeat,
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
  compactCount,
  engagement,
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
        Only people who can see this post can open it. Your private uploads are
        never shared.
      </Notice>
      {accessible ? (
        <>
          <div className="share-card-preview">
            <strong>{post?.title}</strong>
            <span>They can open this post</span>
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
                    {c.name}
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
                  {c.name}
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
        <span>{topicName[post.topic] || "Community"}</span>
        <strong>{post.title}</strong>
        <small>
          {post.items.length
            ? `${post.items.length} ${post.items.length === 1 ? "item" : "items"} · ${totalPrice(post.items)}`
            : post.steps.length
              ? `${post.steps.length} steps`
              : "View post"}
        </small>
      </div>
      <ArrowUpRight size={17} />
    </Link>
  );
}
function PostDetails({ post, onReport }: { post: Post; onReport: () => void }) {
  const { state, update, toast } = useDemo();
  const [comment, setComment] = useState("");
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
                  notes: "Copied from the community — make it yours.",
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
  return (
    <div className="post-expanded">
      {!!post.items.length && (
        <details className="shop-details" open>
          <summary className="shop-row">
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
          </summary>
          <ItemBreakdown items={post.items} />
          <p className="breakdown-note">
            Example prices · shopping links come later
          </p>
        </details>
      )}
      {!!post.steps.length && (
        <ol className="plain-list">
          {post.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
      {post.topic && (post.items.length > 0 || post.steps.length > 0) && (
        <Button variant="secondary small" onClick={copy}>
          <Copy size={15} />
          {post.topic === "clothing"
            ? "Copy outfit to my wardrobe"
            : "Copy routine / collection"}
        </Button>
      )}
      {!own && (
        <div className="moderation-actions">
          <button className="text-button" onClick={onReport}>
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
      <h4>
        Comments{" "}
        <span className="muted">{state.comments[post.id]?.length || 0}</span>
      </h4>
      <div className="comment-list">
        {(state.comments[post.id] || []).map((c) => {
          const person = creators.find((u) => u.id === c.author);
          return (
            <div className="comment" key={c.id}>
              <span className="avatar">
                {c.author === "you"
                  ? state.profile.name.slice(0, 1)
                  : person?.initials}
              </span>
              <div>
                <strong>
                  {c.author === "you" ? state.profile.handle : person?.handle}
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
            </div>
          );
        })}
        {!state.comments[post.id]?.length && (
          <p className="small-text muted">
            No comments yet. Start the conversation.
          </p>
        )}
      </div>
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
        }}
      >
        <span className="avatar" aria-hidden="true">
          {state.profile.name.slice(0, 1)}
        </span>
        <label className="comment-input">
          <span className="visually-hidden">Your comment</span>
          <input
            aria-label="Your comment"
            value={comment}
            maxLength={500}
            required
            onChange={(e) => setComment(e.target.value)}
            placeholder="What do you think?"
          />
        </label>
        <button
          type="submit"
          className="send-button"
          aria-label="Post demo comment"
          disabled={!comment.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
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
  const [sheet, setSheet] = useState(false);
  const [share, setShare] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("Misleading or unsafe advice");
  const [showProducts, setShowProducts] = useState(false);
  const [captionOpen, setCaptionOpen] = useState(false);
  const creator = creators.find((c) => c.id === post.author);
  const own = post.author === "you";
  const isReel = post.format === "reel" || post.media?.kind === "video";
  const handle = own ? state.profile.handle : creator?.handle;
  const liked = state.likes.includes(post.id);
  const saved = state.saved.includes(post.id);
  const commentCount = state.comments[post.id]?.length || 0;
  const base = engagement(post.id, own);
  const reposted = state.reposts.includes(post.id);
  const likeCount = base.likes + (liked ? 1 : 0);
  const counts = {
    reposts: base.reposts + (reposted ? 1 : 0),
    saves: base.saves + (saved ? 1 : 0),
    shares: base.shares,
  };
  // Captions show two lines first, then expand in place.
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
  const hashtags = tags.map((t) => `#${t.replaceAll(" ", "")}`).join(" ");
  const profileLink = own ? "/profile" : `/profile/${post.author}`;
  const avatar = (
    <span className="avatar">
      {own ? state.profile.name.slice(0, 1) : creator?.initials}
    </span>
  );
  const like = () => update((s) => ({ ...s, likes: toggle(s.likes, post.id) }));
  const save = () => {
    update((s) => ({ ...s, saved: toggle(s.saved, post.id) }));
    toast("Private saved collection updated.");
  };
  const repost = () => {
    update((s) => ({ ...s, reposts: toggle(s.reposts, post.id) }));
    toast(
      state.reposts.includes(post.id)
        ? "Removed from your reposts."
        : "Reposted to your profile.",
    );
  };
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
            onClick={() => setSheet(true)}
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
  const reelOverlay = (
    <div className="reel-overlay">
      <div className="reel-meta">
        <div className="reel-author">
          <Link to={profileLink} className="author-link">
            {avatar}
            <strong>{handle}</strong>
          </Link>
          <FollowButton creator={post.author} />
        </div>
        {topicLine && <div className="post-topic">{topicLine}</div>}
        <Link to={`/post/${post.id}`}>
          <h3>{post.title}</h3>
        </Link>
        <p className="reel-caption">{post.body}</p>
        <button
          type="button"
          className="caption-more"
          aria-label={`Read more of ${post.title}`}
          onClick={() => setSheet(true)}
        >
          more
        </button>
      </div>
      <div className="reel-actions">
        <button
          aria-label={`Like ${post.title}`}
          aria-pressed={liked}
          className={liked ? "liked" : ""}
          onClick={like}
        >
          <Heart
            size={30}
            strokeWidth={1.6}
            fill={liked ? "currentColor" : "none"}
          />
          <span>{compactCount(likeCount)}</span>
        </button>
        <button
          aria-label={`Comment on ${post.title}`}
          onClick={() => setSheet(true)}
        >
          <MessageCircle size={30} strokeWidth={1.6} />
          <span>{compactCount(commentCount)}</span>
        </button>
        {!own && !post.draft && (
          <button
            aria-label={`Repost ${post.title}`}
            aria-pressed={reposted}
            onClick={repost}
          >
            <Repeat size={30} strokeWidth={1.6} />
            <span>{compactCount(counts.reposts)}</span>
          </button>
        )}
        <button
          aria-label={`Save ${post.title} privately`}
          aria-pressed={saved}
          onClick={save}
        >
          <Bookmark
            size={30}
            strokeWidth={1.6}
            fill={saved ? "currentColor" : "none"}
          />
          <span>{compactCount(counts.saves)}</span>
        </button>
        <button
          aria-label={`Share ${post.title}`}
          onClick={() => setShare(true)}
        >
          <Send size={30} strokeWidth={1.6} />
          <span>{compactCount(counts.shares)}</span>
        </button>
      </div>
    </div>
  );
  const photoBody = (
    <>
      <div className="post-author">
        <Link to={profileLink} className="author-link">
          {avatar}
          <span>
            <strong>{handle}</strong>
            <small>{post.draft ? "Draft · only you" : mediaLabel(post)}</small>
          </span>
        </Link>
        <FollowButton creator={post.author} />
      </div>
      <PostMedia post={post}>{productTags}</PostMedia>
      <div className="post-body">
        <div className="post-actions">
          <button
            aria-label={`Like ${post.title}`}
            aria-pressed={liked}
            className={liked ? "liked" : ""}
            onClick={like}
          >
            <Heart
              size={24}
              strokeWidth={1.6}
              fill={liked ? "currentColor" : "none"}
            />
            <span className="action-count">{compactCount(likeCount)}</span>
          </button>
          <button
            aria-label={`Comment on ${post.title}`}
            onClick={() => setSheet(true)}
          >
            <MessageCircle size={24} strokeWidth={1.6} />
            <span className="action-count">{compactCount(commentCount)}</span>
          </button>
          {!own && !post.draft && (
            <button
              aria-label={`Repost ${post.title}`}
              aria-pressed={reposted}
              onClick={repost}
            >
              <Repeat size={24} strokeWidth={1.6} />
              <span className="action-count">
                {compactCount(counts.reposts)}
              </span>
            </button>
          )}
          <button
            aria-label={`Share ${post.title}`}
            onClick={() => setShare(true)}
          >
            <Send size={23} strokeWidth={1.6} />
            <span className="action-count">{compactCount(counts.shares)}</span>
          </button>
          <button
            className="save-action"
            aria-label={`Save ${post.title} privately`}
            aria-pressed={saved}
            onClick={save}
          >
            <Bookmark
              size={24}
              strokeWidth={1.6}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="post-caption">
          {topicLine && <div className="post-topic">{topicLine}</div>}
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>
            {expanded || captionOpen || !captionLong ? post.body : captionShort}
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
          {hashtags && <p className="caption-tags">{hashtags}</p>}
        </div>
        {post.items.length > 0 && !expanded && (
          <button
            type="button"
            className="shop-row"
            onClick={() => setSheet(true)}
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
            onClick={() => setSheet(true)}
          >
            {commentCount
              ? `View ${commentCount === 1 ? "1 comment" : `all ${commentCount} comments`}`
              : "Add a comment…"}
          </button>
        )}
        <time className="post-date" dateTime={post.date}>
          {dateLabel(post.date)}
        </time>
      </div>
    </>
  );
  return (
    <>
      <article
        className={`post-card ${expanded ? "expanded" : ""} ${isReel ? "reel-card" : "photo-card"}`}
      >
        {isReel ? (
          <PostMedia post={post} onOpen={() => setSheet(true)}>
            {reelOverlay}
          </PostMedia>
        ) : (
          photoBody
        )}
        {expanded && (
          <>
            {isReel && (
              <div className="post-body">
                <p className="preserve-text">{post.body}</p>
                {hashtags && <p className="caption-tags">{hashtags}</p>}
              </div>
            )}
            <PostDetails post={post} onReport={() => setReport(true)} />
          </>
        )}
      </article>
      {sheet && !expanded && (
        <Modal
          title={`Post by ${handle}`}
          onClose={() => setSheet(false)}
          sheet
        >
          <div className="sheet-author">
            <Link to={profileLink} className="author-link">
              {avatar}
              <strong>{handle}</strong>
            </Link>
            <FollowButton creator={post.author} />
          </div>
          <div className="sheet-caption">
            <h3>{post.title}</h3>
            <p className="preserve-text">{post.body}</p>
            {hashtags && <p className="caption-tags">{hashtags}</p>}
            <time dateTime={post.date}>{dateLabel(post.date)}</time>
            <div className="sheet-chips">
              {topicLine && <span className="pill">{topicLine}</span>}
              {post.occasion && <span className="pill">{post.occasion}</span>}
              {post.season && <span className="pill">{post.season}</span>}
            </div>
          </div>
          <PostDetails post={post} onReport={() => setReport(true)} />
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
