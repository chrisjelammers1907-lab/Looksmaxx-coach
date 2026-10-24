import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Ellipsis,
  FilePen,
  Film,
  Flag,
  Grid3x3,
  Heart,
  Images,
  LockKeyhole,
  Pencil,
  Repeat2,
  RotateCcw,
  Settings,
  Share,
  UserX,
  VolumeX,
} from "lucide-react";
import { useDemo, toggle } from "../lib/store";
import { creators } from "../lib/data";
import { asset, mayViewPost } from "../lib/domain";
import { FollowButton } from "../components/Social";
import type { Post } from "../lib/types";
import {
  Area,
  Button,
  Empty,
  Field,
  ImageInput,
  Modal,
  Notice,
  Select,
} from "../components/ui";

const compact = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(n);
const isReel = (p: Post) => p.format === "reel" || p.media?.kind === "video";

function ProfileGrid({
  posts,
  empty,
}: {
  posts: Post[];
  empty: React.ReactNode;
}) {
  if (!posts.length) return <div className="profile-empty">{empty}</div>;
  return (
    <div className="profile-grid">
      {posts.map((p) => {
        const image =
          p.media?.kind === "image"
            ? p.media.src
            : p.media?.poster
              ? asset(p.media.poster)
              : p.media?.kind === "video" && p.media.origin === "private-upload"
                ? ""
                : asset(p.image);
        return (
          <Link
            to={`/post/${p.id}`}
            className="profile-tile"
            key={p.id}
            aria-label={`${p.title}${p.draft ? " · draft" : ""}`}
          >
            {image ? <img src={image} alt="" loading="lazy" /> : <Film />}
            <span className="profile-tile-badges" aria-hidden="true">
              {p.draft && <span className="tile-label">Draft</span>}
              {p.audience === "private" && <LockKeyhole size={15} />}
              {isReel(p) ? (
                <Film size={16} />
              ) : (p.slides?.length || 0) > 1 ? (
                <Images size={16} />
              ) : null}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

async function shareProfile(handle: string, toast: (text: string) => void) {
  const url = location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: `@${handle} on CHARETT`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Profile link copied.");
  } catch {
    toast(`Share this profile: @${handle}`);
  }
}

function ProfileContent() {
  const { id } = useParams();
  const { state, update, toast, reset } = useDemo();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.profile);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.has("saved") ? "saved" : "posts");
  const [settings, setSettings] = useState(params.has("settings"));
  const [more, setMore] = useState(false);
  const [people, setPeople] = useState<"followers" | "following" | null>(null);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("Spam or fake account");
  const [publicPreview, setPublicPreview] = useState(false);
  const [confirm, setConfirm] = useState("");
  const creator = creators.find((c) => c.id === id);
  const own = !id;
  if (!own && !creator)
    return (
      <Empty title="Profile unavailable.">
        This fictional profile could not be found.
      </Empty>
    );
  if (creator && state.blocked.includes(creator.id))
    return (
      <div className="profile-blocked">
        <h1>This creator is blocked.</h1>
        <p>You won’t see their posts, stories or messages.</p>
        <Button
          onClick={() =>
            update((s) => ({
              ...s,
              blocked: s.blocked.filter((v) => v !== creator.id),
            }))
          }
        >
          Unblock {creator.name}
        </Button>
      </div>
    );
  const author = own ? "you" : id!;
  const mine = state.posts.filter((p) => p.author === author);
  const published = mine.filter(
    (p) =>
      !p.draft && (own ? p.audience !== "private" : p.audience === "public"),
  );
  const visible = (list: Post[]) =>
    list.filter(
      (p) =>
        !state.blocked.includes(p.author) &&
        mayViewPost(p, "you", state.blocked),
    );
  const handle = own ? state.profile.handle : creator!.handle;
  const name = own ? state.profile.name : creator!.name;
  const stats = own
    ? {
        posts: published.length,
        followers: state.approvedFollowers.length,
        following: state.following.length,
        likes: published.filter((p) => state.likes.includes(p.id)).length,
      }
    : {
        posts: published.length,
        followers:
          creator!.followers + (state.following.includes(creator!.id) ? 1 : 0),
        following: creator!.following,
        likes: creator!.likes,
      };
  const tabs = own
    ? [
        { id: "posts", label: "Posts", icon: Grid3x3 },
        { id: "reels", label: "Reels", icon: Film },
        { id: "drafts", label: "Drafts", icon: FilePen },
        { id: "private", label: "Private", icon: LockKeyhole },
        { id: "reposts", label: "Reposts", icon: Repeat2 },
        { id: "likes", label: "Likes", icon: Heart },
        { id: "saved", label: "Saved", icon: Bookmark },
      ]
    : [
        { id: "posts", label: "Posts", icon: Grid3x3 },
        { id: "reels", label: "Reels", icon: Film },
      ];
  const notify = creator ? state.notifications[creator.id] || "all" : "all";
  const muted = creator ? state.muted.includes(creator.id) : false;
  return (
    <div className="profile-page">
      <header className="profile-head">
        <div className="profile-avatar">
          {own && state.profile.photo ? (
            <img src={state.profile.photo} alt="Your private session profile" />
          ) : own ? (
            state.profile.name.slice(0, 1)
          ) : (
            creator!.initials
          )}
        </div>
        <ul className="profile-stats" aria-label="Profile stats">
          <li>
            <strong>{compact(stats.posts)}</strong>
            <span>posts</span>
          </li>
          <li>
            <button type="button" onClick={() => setPeople("followers")}>
              <strong>{compact(stats.followers)}</strong>
              <span>followers</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={() => setPeople("following")}>
              <strong>{compact(stats.following)}</strong>
              <span>following</span>
            </button>
          </li>
          <li>
            <strong>{compact(stats.likes)}</strong>
            <span>likes</span>
          </li>
        </ul>
        <div className="profile-id">
          <h1>{name}</h1>
          <span className="profile-handle">
            @{handle}
            {own && (
              <span className="profile-privacy">
                <LockKeyhole size={12} aria-hidden="true" />
                {state.profile.visibility === "private" ? "Private" : "Public"}
              </span>
            )}
          </span>
          {(own ? state.profile.bio : creator!.bio) && (
            <p>{own ? state.profile.bio : creator!.bio}</p>
          )}
        </div>
        <div className="profile-buttons">
          {own ? (
            <>
              <Button
                variant="secondary small"
                onClick={() => {
                  setDraft(state.profile);
                  setEditing(true);
                }}
              >
                <Pencil size={14} />
                Edit profile
              </Button>
              <Button
                variant="secondary small"
                onClick={() => void shareProfile(handle, toast)}
              >
                <Share size={14} />
                Share profile
              </Button>
              <button
                type="button"
                className="icon-button bordered"
                aria-label="Settings"
                onClick={() => setSettings(true)}
              >
                <Settings size={18} strokeWidth={1.7} />
              </button>
            </>
          ) : (
            <>
              <FollowButton creator={id!} />
              <Link
                className="button secondary small"
                to={`/messages?to=${id}`}
              >
                Message
              </Link>
              <button
                type="button"
                className="icon-button bordered"
                aria-label={`More options for @${handle}`}
                onClick={() => setMore(true)}
              >
                <Ellipsis size={18} />
              </button>
            </>
          )}
        </div>
      </header>
      <div className="profile-tabs" role="tablist" aria-label="Profile content">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={tab === tabId}
            className={tab === tabId ? "active" : ""}
            onClick={() => setTab(tabId)}
          >
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
      {tab === "posts" && (
        <ProfileGrid
          posts={published}
          empty={
            own ? (
              <Empty
                title="Share your first post."
                action={
                  <Link to="/explore?compose=new" className="button">
                    Create a post
                  </Link>
                }
              >
                Your personal routines and photos are never posted for you.
              </Empty>
            ) : (
              <Empty title="No posts yet." />
            )
          }
        />
      )}
      {tab === "reels" && (
        <ProfileGrid
          posts={published.filter(isReel)}
          empty={<Empty title="No reels yet." />}
        />
      )}
      {own && tab === "drafts" && (
        <ProfileGrid
          posts={mine.filter((p) => p.draft)}
          empty={
            <Empty title="No drafts.">
              Choose “Save as draft” when you create a post. Only you can see
              drafts.
            </Empty>
          }
        />
      )}
      {own && tab === "private" && (
        <ProfileGrid
          posts={mine.filter((p) => !p.draft && p.audience === "private")}
          empty={
            <Empty title="No private posts.">
              Posts with the audience “Only me” appear here.
            </Empty>
          }
        />
      )}
      {own && tab === "reposts" && (
        <ProfileGrid
          posts={visible(
            state.posts.filter((p) => state.reposts.includes(p.id)),
          )}
          empty={
            <Empty title="No reposts yet.">
              Use the repost button under a post to add it here.
            </Empty>
          }
        />
      )}
      {own && tab === "likes" && (
        <ProfileGrid
          posts={visible(state.posts.filter((p) => state.likes.includes(p.id)))}
          empty={<Empty title="No liked posts yet." />}
        />
      )}
      {own && tab === "saved" && (
        <ProfileGrid
          posts={visible(state.posts.filter((p) => state.saved.includes(p.id)))}
          empty={
            <Empty title="Nothing saved yet.">
              Use the bookmark under a post. Saves are private.
            </Empty>
          }
        />
      )}
      {people && (
        <Modal
          title={people === "followers" ? "Followers" : "Following"}
          onClose={() => setPeople(null)}
        >
          <div className="people-list">
            {(own
              ? people === "following"
                ? creators.filter((c) => state.following.includes(c.id))
                : creators.filter((c) => state.approvedFollowers.includes(c.id))
              : creators.filter((c) => c.id !== creator!.id)
            ).map((c) => (
              <div className="people-row" key={c.id}>
                <span className="avatar">{c.initials}</span>
                <Link to={`/profile/${c.id}`} onClick={() => setPeople(null)}>
                  <strong>{c.handle}</strong>
                  <small>{c.name}</small>
                </Link>
                <FollowButton creator={c.id} />
              </div>
            ))}
            {own &&
              (people === "following"
                ? !state.following.length
                : !state.approvedFollowers.length) && (
                <p className="small-text">
                  {people === "following"
                    ? "You don’t follow anyone yet."
                    : "No approved followers yet. Requests appear in Settings."}
                </p>
              )}
          </div>
        </Modal>
      )}
      {more && creator && (
        <Modal title={`@${creator.handle}`} onClose={() => setMore(false)}>
          <div className="sheet-list">
            <button
              type="button"
              onClick={() => {
                setMore(false);
                void shareProfile(creator.handle, toast);
              }}
            >
              <Share size={18} /> Share profile
            </button>
            <fieldset className="sheet-group">
              <legend>
                <Bell size={18} /> Notifications
              </legend>
              {(
                [
                  ["all", "All posts and stories"],
                  ["stories", "Stories only"],
                  ["off", "Off"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="radio-line">
                  <input
                    type="radio"
                    name="notifications"
                    checked={notify === value}
                    onChange={() =>
                      update((s) => ({
                        ...s,
                        notifications: {
                          ...s.notifications,
                          [creator.id]: value,
                        },
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <button
              type="button"
              aria-pressed={muted}
              onClick={() => {
                update((s) => ({ ...s, muted: toggle(s.muted, creator.id) }));
                toast(muted ? "Unmuted." : "Muted. Their posts stay hidden.");
              }}
            >
              <VolumeX size={18} /> {muted ? "Unmute" : "Mute"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMore(false);
                setReporting(true);
              }}
            >
              <Flag size={18} /> Report
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => {
                update((s) => ({
                  ...s,
                  blocked: [...s.blocked, creator.id],
                  following: s.following.filter((v) => v !== creator.id),
                }));
                setMore(false);
                toast("Creator blocked locally.");
              }}
            >
              <UserX size={18} /> Block
            </button>
          </div>
          <p className="small-text muted">
            Demo controls · nothing is sent to a real service.
          </p>
        </Modal>
      )}
      {reporting && creator && (
        <Modal
          title={`Report @${creator.handle}`}
          onClose={() => setReporting(false)}
        >
          <Select
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {[
              "Spam or fake account",
              "Harassment",
              "Misleading or unsafe advice",
              "Privacy concern",
              "Something else",
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
          <Button
            onClick={() => {
              setReporting(false);
              toast(
                "Report recorded locally. No moderation team is contacted.",
              );
            }}
          >
            Submit report
          </Button>
        </Modal>
      )}
      {own && settings && (
        <Modal
          title="Settings & privacy"
          onClose={() => setSettings(false)}
          wide
        >
          <section className="settings-section" aria-label="Account privacy">
            <h3>Account privacy</h3>
            <Select
              label="Account visibility"
              value={state.profile.visibility}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    visibility: e.target.value as "public" | "private",
                  },
                }))
              }
            >
              <option value="private">Private · approved followers</option>
              <option value="public">Public · everyone in the demo</option>
            </Select>
            <Button
              variant="secondary small"
              onClick={() => setPublicPreview(true)}
            >
              Preview as a visitor
            </Button>
            {state.profile.visibility === "private" && (
              <div className="follow-request-panel">
                <h4>Follower requests</h4>
                {state.incomingRequests.length ? (
                  state.incomingRequests.map((rid) => (
                    <div className="people-row" key={rid}>
                      <span className="avatar">
                        {creators.find((c) => c.id === rid)?.initials}
                      </span>
                      <span>
                        <strong>
                          {creators.find((c) => c.id === rid)?.handle}
                        </strong>
                      </span>
                      <Button
                        variant="small"
                        onClick={() =>
                          update((s) => ({
                            ...s,
                            approvedFollowers: [
                              ...new Set([...s.approvedFollowers, rid]),
                            ],
                            incomingRequests: s.incomingRequests.filter(
                              (v) => v !== rid,
                            ),
                          }))
                        }
                      >
                        Accept request
                      </Button>
                      <Button
                        variant="ghost small"
                        onClick={() =>
                          update((s) => ({
                            ...s,
                            incomingRequests: s.incomingRequests.filter(
                              (v) => v !== rid,
                            ),
                          }))
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="small-text">No pending requests.</p>
                )}
              </div>
            )}
          </section>
          <section className="settings-section" aria-label="Messages">
            <h3>Messages</h3>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={state.profile.messageRequests}
                onChange={(e) =>
                  update((s) => ({
                    ...s,
                    profile: {
                      ...s.profile,
                      messageRequests: e.target.checked,
                    },
                  }))
                }
              />
              Allow message requests
            </label>
          </section>
          <section className="settings-section" aria-label="Your details">
            <h3>Your private details</h3>
            <dl className="settings-details">
              <div>
                <dt>Goals</dt>
                <dd>{state.profile.goals || "Not provided"}</dd>
              </div>
              <div>
                <dt>Preferences</dt>
                <dd>{state.profile.preferences || "Not provided"}</dd>
              </div>
              <div>
                <dt>Restrictions</dt>
                <dd>{state.profile.restrictions || "None entered"}</dd>
              </div>
              <div>
                <dt>Country · budget</dt>
                <dd>
                  {state.profile.country || "—"} · {state.profile.currency}{" "}
                  {state.profile.budget}
                </dd>
              </div>
            </dl>
            <Button
              variant="secondary small"
              onClick={() => {
                setSettings(false);
                setDraft(state.profile);
                setEditing(true);
              }}
            >
              Edit details
            </Button>
          </section>
          {state.blocked.length > 0 && (
            <section className="settings-section" aria-label="Blocked">
              <h3>Blocked accounts</h3>
              {creators
                .filter((c) => state.blocked.includes(c.id))
                .map((c) => (
                  <div className="people-row" key={c.id}>
                    <span className="avatar">{c.initials}</span>
                    <span>
                      <strong>{c.handle}</strong>
                    </span>
                    <Button
                      variant="secondary small"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          blocked: s.blocked.filter((v) => v !== c.id),
                        }))
                      }
                    >
                      Unblock
                    </Button>
                  </div>
                ))}
            </section>
          )}
          <section className="settings-section" aria-label="Your data">
            <h3>Your data</h3>
            <Notice icon="private">
              Profile details, photos, routines and logs stay in this browser
              session. This demo has no real accounts.
            </Notice>
            <div className="button-row">
              <Button variant="ghost" onClick={() => setConfirm("details")}>
                Remove my details
              </Button>
              <Button variant="secondary" onClick={() => setConfirm("reset")}>
                <RotateCcw size={14} />
                Reset demo
              </Button>
            </div>
          </section>
        </Modal>
      )}
      {publicPreview && (
        <Modal
          title="Visitor preview · simulated"
          onClose={() => setPublicPreview(false)}
        >
          <p className="eyebrow">@{state.profile.handle}</p>
          {state.profile.visibility === "private" ? (
            <div className="empty">
              <LockKeyhole />
              <h3>This account is private.</h3>
              <p>
                Unapproved visitors cannot see posts. Personal uploads and
                journal originals remain private.
              </p>
            </div>
          ) : (
            <>
              <h3>{state.profile.name}</h3>
              <p>{state.profile.bio}</p>
              {published
                .filter((p) =>
                  mayViewPost(
                    p,
                    "visitor",
                    state.blocked,
                    state.profile.visibility,
                    state.approvedFollowers,
                  ),
                )
                .map((p) => (
                  <div className="visitor-post" key={p.id}>
                    <strong>{p.title}</strong>
                    <p>{p.body}</p>
                  </div>
                ))}
            </>
          )}
        </Modal>
      )}
      {editing && (
        <Modal
          title="Make your profile yours"
          onClose={() => setEditing(false)}
          wide
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update((s) => ({ ...s, profile: draft }));
              setEditing(false);
              toast("Private profile updated for this session.");
            }}
          >
            <Notice icon="private">
              Your details are not public. A private profile picture never
              becomes a community avatar in this demo.
            </Notice>
            <div className="form-grid">
              <Field
                label="Display name"
                required
                maxLength={50}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <Field
                label="Handle"
                required
                pattern="[A-Za-z0-9._]{2,30}"
                value={draft.handle}
                onChange={(e) => setDraft({ ...draft, handle: e.target.value })}
                hint="2–30 letters, digits, dots or underscores"
              />
            </div>
            <Area
              label="Bio"
              maxLength={300}
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
            <Area
              label="Goals"
              maxLength={1000}
              value={draft.goals}
              onChange={(e) => setDraft({ ...draft, goals: e.target.value })}
            />
            <Area
              label="Preferences"
              value={draft.preferences}
              onChange={(e) =>
                setDraft({ ...draft, preferences: e.target.value })
              }
            />
            <Area
              label="Restrictions (optional)"
              value={draft.restrictions}
              onChange={(e) =>
                setDraft({ ...draft, restrictions: e.target.value })
              }
            />
            <div className="form-grid">
              <Field
                label="Country"
                value={draft.country}
                onChange={(e) =>
                  setDraft({ ...draft, country: e.target.value })
                }
              />
              <Select
                label="Currency"
                value={draft.currency}
                onChange={(e) =>
                  setDraft({ ...draft, currency: e.target.value })
                }
              >
                {["EUR", "USD", "GBP"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
              <Field
                label="Shopping budget"
                type="number"
                min="0"
                max="100000"
                value={draft.budget}
                onChange={(e) =>
                  setDraft({ ...draft, budget: Number(e.target.value) })
                }
              />
              <Select
                label="Coaching style"
                value={draft.coachStyle}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    coachStyle: e.target.value as "supportive" | "direct",
                  })
                }
              >
                <option value="supportive">Calm & supportive</option>
                <option value="direct">Direct & constructive</option>
              </Select>
            </div>
            <ImageInput
              label="Choose a private profile photo"
              onImage={(photo) => setDraft({ ...draft, photo })}
            />
            {draft.photo && (
              <div className="upload-preview">
                <img src={draft.photo} alt="Private profile preview" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDraft({ ...draft, photo: undefined })}
                >
                  Remove profile photo
                </Button>
              </div>
            )}
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save profile</Button>
            </div>
          </form>
        </Modal>
      )}
      {confirm && (
        <Modal
          title={
            confirm === "reset"
              ? "Reset this demo?"
              : "Remove private information?"
          }
          onClose={() => setConfirm("")}
        >
          <p>
            {confirm === "reset"
              ? "This removes your session content and resets locally saved fictional interactions and clothing themes."
              : "This removes profile details, routines, private photos, your posts, collection edits, notes, logs, coach conversations and messages from this session. Fictional public content remains."}
          </p>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm === "reset") reset();
              else {
                update((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    name: "Private guest",
                    handle: "private.guest",
                    bio: "",
                    goals: "",
                    preferences: "",
                    restrictions: "",
                    photo: undefined,
                    country: "",
                    budget: 0,
                  },
                  photos: [],
                  routines: [],
                  items: [],
                  outfits: [],
                  workouts: [],
                  food: [],
                  notes: {},
                  chat: [],
                  messages: {},
                  goals: [],
                }));
                toast("Private session information removed.");
              }
              setConfirm("");
            }}
          >
            Confirm {confirm === "reset" ? "reset" : "removal"}
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  return <ProfileContent key={(id || "you") + params.toString()} />;
}
