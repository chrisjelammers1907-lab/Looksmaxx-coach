import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  LockKeyhole,
  MessageCircle,
  Pencil,
  RotateCcw,
  UserX,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { creators } from "../lib/data";
import { topicName, mayViewPost } from "../lib/domain";
import { FollowButton, PostCard } from "../components/Social";
import {
  Area,
  Button,
  Empty,
  Field,
  ImageInput,
  Modal,
  Notice,
  PageHeader,
  SectionTitle,
  Select,
  Tabs,
} from "../components/ui";
function ProfileContent() {
  const { id } = useParams();
  const { state, update, toast, reset } = useDemo();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.profile);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.has("saved") ? "saved" : "posts");
  const [publicPreview, setPublicPreview] = useState(false);
  const [confirm, setConfirm] = useState("");
  const creator = creators.find((c) => c.id === id);
  const own = !id;
  const posts = state.posts.filter(
    (p) => p.author === (own ? "you" : id) && (own || p.audience === "public"),
  );
  if (!own && !creator)
    return (
      <Empty title="Profile unavailable.">
        This fictional profile could not be found.
      </Empty>
    );
  if (creator && state.blocked.includes(creator.id))
    return (
      <>
        <PageHeader
          eyebrow="LOCAL DEMO CONTROL"
          title="This creator is blocked."
        />
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
      </>
    );
  return (
    <div className="profile-page">
      <PageHeader
        eyebrow={own ? "YOUR PRIVATE SPACE" : "A FICTIONAL POINT OF VIEW"}
        title={own ? "A little more you." : creator!.name}
        description={
          own
            ? "One profile. Thoughtful preferences. Always yours to change."
            : "Fictional creator profile · Stock post images are references, not photographs of this person."
        }
      />
      <div className="profile-hero">
        <div className="profile-avatar">
          {own && state.profile.photo ? (
            <img src={state.profile.photo} alt="Your private session profile" />
          ) : own ? (
            state.profile.name.slice(0, 1)
          ) : (
            creator!.initials
          )}
        </div>
        <div>
          <h2>{own ? state.profile.name : creator!.name}</h2>
          <p>@{own ? state.profile.handle : creator!.handle}</p>
          <p>{own ? state.profile.bio : creator!.bio}</p>
          <div className="profile-stats">
            <span>
              {posts.filter((p) => p.audience === "public").length} public posts
            </span>
            <span>
              {own
                ? state.following.length
                : `${creator!.followers + (state.following.includes(creator!.id) ? 1 : 0)} fictional`}{" "}
              {own ? "following" : "followers"}
            </span>
            {own && (
              <span>
                <LockKeyhole size={12} />
                {state.profile.visibility === "private"
                  ? "Private account"
                  : "Public account"}{" "}
                · demo
              </span>
            )}
          </div>
        </div>
        <div className="profile-actions">
          {own ? (
            <Button
              variant="secondary"
              onClick={() => {
                setDraft(state.profile);
                setEditing(true);
              }}
            >
              <Pencil size={14} />
              Edit profile
            </Button>
          ) : (
            <>
              <FollowButton creator={id!} />
              <Link className="button secondary" to={`/messages?to=${id}`}>
                <MessageCircle size={15} />
                Demo message
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  update((s) => ({
                    ...s,
                    blocked: [...s.blocked, id!],
                    following: s.following.filter((v) => v !== id),
                  }));
                  toast("Creator blocked locally.");
                }}
              >
                <UserX size={14} />
                Block
              </Button>
            </>
          )}
        </div>
      </div>
      {own && (
        <Notice icon="private">
          Profile details, your photo, routines and logs are private and
          session-only. This demo has no authentication or secure account
          isolation. Reload clears personal edits; theme and fictional social
          preferences may persist locally.
        </Notice>
      )}
      {own && (
        <section className="privacy-panel" aria-label="Account privacy">
          <div>
            <span className="eyebrow">YOUR AUDIENCE, YOUR CHOICE</span>
            <h2>Account privacy</h2>
            <p>
              Account visibility and journal visibility are separate. Your
              journal, original uploads, routines and intake stay private until
              a separate, explicit action.
            </p>
          </div>
          <div>
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
              <option value="public">
                Public · explicitly shared demo posts
              </option>
            </Select>
            <Button variant="secondary" onClick={() => setPublicPreview(true)}>
              Preview as a visitor
            </Button>
            <p className="small-text">
              Local privacy simulation, not secure authentication. No real
              follow requests or uploads are sent.
            </p>
          </div>
          {state.profile.visibility === "private" && (
            <div className="follow-request-panel">
              <h3>Follower requests · demo</h3>
              {state.incomingRequests.length ? (
                state.incomingRequests.map((id) => (
                  <div className="list-row" key={id}>
                    <span>
                      {creators.find((c) => c.id === id)?.name} · fictional
                    </span>
                    <Button
                      variant="secondary small"
                      onClick={() =>
                        update((s) => ({
                          ...s,
                          approvedFollowers: [
                            ...new Set([...s.approvedFollowers, id]),
                          ],
                          incomingRequests: s.incomingRequests.filter(
                            (v) => v !== id,
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
                            (v) => v !== id,
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
              <p className="small-text">
                {state.approvedFollowers.length} approved fictional follower(s).
                Only approved recipients can open restricted shared cards.
              </p>
            </div>
          )}
        </section>
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
              <p>
                Only explicitly public fictional posts appear below. Personal
                goals, intake, routines, saves and original uploads are
                excluded.
              </p>
              {posts
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
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={
          own
            ? [
                { id: "posts", label: "My demo posts" },
                { id: "saved", label: "Private saves" },
                { id: "private", label: "Private routines & details" },
                { id: "following", label: "Following & controls" },
              ]
            : [{ id: "posts", label: "Public demo posts" }]
        }
      />
      {tab === "posts" &&
        (posts.length ? (
          <div className="community-grid">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <Empty
            title="Your point of view, when you are ready."
            action={
              <Link to="/explore?compose=new" className="button">
                Create a fictional demo post
              </Link>
            }
          >
            Your personal routines and photos are never seeded into public
            content.
          </Empty>
        ))}
      {own &&
        tab === "saved" &&
        (state.saved.length ? (
          <div className="community-grid">
            {state.posts
              .filter(
                (p) =>
                  state.saved.includes(p.id) &&
                  !state.blocked.includes(p.author),
              )
              .map((p) => (
                <PostCard post={p} key={p.id} />
              ))}
          </div>
        ) : (
          <Empty title="A private collection of good ideas.">
            Use bookmarks in Explore to collect posts.
          </Empty>
        ))}
      {own && tab === "private" && (
        <>
          <SectionTitle title="Your editable private preferences" />
          <div className="profile-details">
            <div>
              <small>GOALS</small>
              <p>{state.profile.goals || "Not provided"}</p>
            </div>
            <div>
              <small>PREFERENCES</small>
              <p>{state.profile.preferences || "Not provided"}</p>
            </div>
            <div>
              <small>RESTRICTIONS</small>
              <p>
                {state.profile.restrictions ||
                  "Not provided. No restrictions are assumed."}
              </p>
            </div>
            <div>
              <small>COUNTRY · CURRENCY · BUDGET</small>
              <p>
                {state.profile.country} · {state.profile.currency}{" "}
                {state.profile.budget}
              </p>
            </div>
          </div>
          <SectionTitle title="Your private rituals" />
          <div className="list-card">
            {state.routines.map((r) => (
              <Link
                to={`/plan?routine=${r.topic}`}
                className="list-row"
                key={r.id}
              >
                <div>
                  <strong>{r.title}</strong>
                  <small>
                    {topicName[r.topic]} · {r.time} · {r.schedule}
                  </small>
                </div>
                <span>{r.steps.length} editable steps</span>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </div>
          <Link className="button secondary" to="/topics/photos">
            Manage private photo journal
          </Link>
        </>
      )}
      {own && tab === "following" && (
        <>
          <SectionTitle title="Your circle" />
          {creators.map((c) => (
            <div className="list-row" key={c.id}>
              <span className="avatar">{c.initials}</span>
              <Link to={`/profile/${c.id}`}>
                <strong>{c.name}</strong>
                <small>@{c.handle} · fictional</small>
              </Link>
              {state.blocked.includes(c.id) ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      blocked: s.blocked.filter((v) => v !== c.id),
                    }))
                  }
                >
                  Unblock
                </Button>
              ) : (
                <FollowButton creator={c.id} />
              )}
            </div>
          ))}
          <SectionTitle title="A few useful controls" />
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={state.profile.messageRequests}
              onChange={(e) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, messageRequests: e.target.checked },
                }))
              }
            />
            Allow simulated message requests
          </label>
          <p className="muted">
            {state.reports.length} local reports recorded. No real moderation
            team has been contacted.
          </p>
        </>
      )}{" "}
      {own && (
        <div className="privacy-controls">
          <div>
            <h3>A fresh start is always an option.</h3>
            <p>Remove private details, or reset the entire fictional demo.</p>
          </div>
          <div className="button-row">
            <Button variant="ghost" onClick={() => setConfirm("details")}>
              Remove my details
            </Button>
            <Button variant="secondary" onClick={() => setConfirm("reset")}>
              <RotateCcw size={14} />
              Reset demo
            </Button>
          </div>
        </div>
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
