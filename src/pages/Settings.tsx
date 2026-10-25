import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  CreditCard,
  Database,
  HelpCircle,
  LockKeyhole,
  Palette,
  Ruler,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { planOf } from "../lib/plans";
import { useDemo } from "../lib/store";
import { creators } from "../lib/data";
import { dateLabel, mayViewPost } from "../lib/domain";
import type { AppSettings } from "../lib/types";
import { Button, Field, Modal, Notice, Select } from "../components/ui";

const sections = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy & safety", icon: ShieldCheck },
  { id: "units", label: "Units", icon: Ruler },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "data", label: "Your data", icon: Database },
  { id: "help", label: "Help & about", icon: HelpCircle },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="settings-block"
      id={`settings-${id}`}
      aria-label={title}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function SettingsPage() {
  const { state, update, toast, reset } = useDemo();
  const [confirm, setConfirm] = useState("");
  const [visitor, setVisitor] = useState(false);
  const settings = state.settings;
  const set = (patch: Partial<AppSettings>) =>
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const notify = (key: keyof AppSettings["notifications"], value: boolean) =>
    set({ notifications: { ...settings.notifications, [key]: value } });
  const published = state.posts.filter(
    (p) => p.author === "you" && !p.draft && p.audience !== "private",
  );
  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account, privacy and how CHARETT looks.</p>
      </header>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#settings-${id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(`settings-${id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
              {label}
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="settings-content">
          <Section id="account" title="Account">
            <div className="settings-profile">
              <span className="avatar">{state.profile.name.slice(0, 1)}</span>
              <span>
                <strong>{state.profile.name}</strong>
                <small>@{state.profile.handle}</small>
              </span>
              <Link className="button secondary small" to="/profile?edit=1">
                Edit profile
              </Link>
            </div>
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
            <Button variant="secondary small" onClick={() => setVisitor(true)}>
              Preview as a visitor
            </Button>
            {state.profile.visibility === "private" && (
              <div className="follow-request-panel">
                <h3>Follower requests</h3>
                {state.incomingRequests.length ? (
                  state.incomingRequests.map((rid) => {
                    const person = creators.find((c) => c.id === rid);
                    return (
                      <div className="people-row" key={rid}>
                        <span className="avatar">{person?.initials}</span>
                        <span>
                          <strong>{person?.handle}</strong>
                        </span>
                        <Button
                          aria-label={`Accept request from ${person?.handle}`}
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
                          Accept
                        </Button>
                        <Button
                          aria-label={`Decline request from ${person?.handle}`}
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
                    );
                  })
                ) : (
                  <p className="small-text">No pending requests.</p>
                )}
              </div>
            )}
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
          </Section>

          <Section id="notifications" title="Notifications">
            <Toggle
              label="Likes"
              checked={settings.notifications.likes}
              onChange={(v) => notify("likes", v)}
            />
            <Toggle
              label="Comments"
              checked={settings.notifications.comments}
              onChange={(v) => notify("comments", v)}
            />
            <Toggle
              label="Messages"
              checked={settings.notifications.messages}
              onChange={(v) => notify("messages", v)}
            />
            <Toggle
              label="Stories from people you follow"
              checked={settings.notifications.stories}
              onChange={(v) => notify("stories", v)}
            />
            <Toggle
              label="Streak reminders"
              hint="A nudge in the evening before a streak would end."
              checked={settings.notifications.streaks}
              onChange={(v) => notify("streaks", v)}
            />
            <Toggle
              label="Training reminders"
              hint="On days with a planned session."
              checked={settings.notifications.training}
              onChange={(v) => notify("training", v)}
            />
            <Toggle
              label="Quiet hours"
              hint="No notifications between 22:00 and 08:00."
              checked={settings.notifications.quietHours}
              onChange={(v) => notify("quietHours", v)}
            />
            <p className="small-text muted">
              Saved on this device. Notifications start once the app is live.
            </p>
          </Section>

          <Section id="appearance" title="Appearance">
            <fieldset className="choice-group">
              <legend>Theme</legend>
              {(
                [
                  ["light", "Light"],
                  ["dark", "Dark"],
                  ["system", "Match my device"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={`choice theme-${value}`}>
                  <input
                    type="radio"
                    name="theme"
                    checked={settings.theme === value}
                    onChange={() => set({ theme: value })}
                  />
                  <span className="choice-preview" aria-hidden="true" />
                  {label}
                </label>
              ))}
            </fieldset>
            <fieldset className="choice-group compact">
              <legend>Text size</legend>
              {(
                [
                  ["default", "Default"],
                  ["large", "Large"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className={`choice size-${value}`}>
                  <input
                    type="radio"
                    name="text-size"
                    checked={settings.textSize === value}
                    onChange={() => set({ textSize: value })}
                  />
                  <span className="choice-preview" aria-hidden="true">
                    Aa
                  </span>
                  {label}
                </label>
              ))}
            </fieldset>
          </Section>

          <Section id="privacy" title="Privacy & safety">
            <Toggle
              label="Allow message requests"
              hint="People you don't follow can ask to message you."
              checked={state.profile.messageRequests}
              onChange={(v) =>
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, messageRequests: v },
                }))
              }
            />
            <Select
              label="Who can message you"
              value={settings.whoCanMessage}
              onChange={(e) =>
                set({
                  whoCanMessage: e.target.value as AppSettings["whoCanMessage"],
                })
              }
            >
              <option value="everyone">Everyone</option>
              <option value="followers">People you follow</option>
              <option value="nobody">Nobody</option>
            </Select>
            <Field
              label="Hidden words"
              hint="Comments and messages with these words are hidden. Separate with commas."
              value={settings.hiddenWords}
              onChange={(e) => set({ hiddenWords: e.target.value })}
            />
            <h3>Blocked accounts</h3>
            {state.blocked.length ? (
              creators
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
                ))
            ) : (
              <p className="small-text muted">You haven’t blocked anyone.</p>
            )}
            <h3>Muted accounts</h3>
            {state.muted.length ? (
              creators
                .filter((c) => state.muted.includes(c.id))
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
                          muted: s.muted.filter((v) => v !== c.id),
                        }))
                      }
                    >
                      Unmute
                    </Button>
                  </div>
                ))
            ) : (
              <p className="small-text muted">You haven’t muted anyone.</p>
            )}
          </Section>

          <Section id="units" title="Units">
            <div className="form-grid">
              <Select
                label="Weight"
                value={settings.weightUnit}
                onChange={(e) =>
                  set({
                    weightUnit: e.target.value as AppSettings["weightUnit"],
                  })
                }
              >
                <option value="kg">Kilograms</option>
                <option value="lb">Pounds</option>
              </Select>
              <Select
                label="Height"
                value={settings.heightUnit}
                onChange={(e) =>
                  set({
                    heightUnit: e.target.value as AppSettings["heightUnit"],
                  })
                }
              >
                <option value="cm">Centimetres</option>
                <option value="ft">Feet & inches</option>
              </Select>
            </div>
          </Section>

          <Section id="subscription" title="Subscription">
            <div className="settings-plan">
              <span>
                <strong>{planOf(state).name} plan</strong>
                <small>
                  {state.subscription.plan === "free"
                    ? "Feed, reels, stories and chats are always free."
                    : `${state.subscription.billing === "yearly" ? "Billed yearly" : "Billed monthly"}${state.subscription.since ? ` · since ${dateLabel(state.subscription.since)}` : ""} · simulated`}
                </small>
              </span>
              <Link className="button small" to="/plans">
                {state.subscription.plan === "free"
                  ? "See plans"
                  : "Manage plan"}
              </Link>
            </div>
          </Section>

          <Section id="data" title="Your data">
            <Notice icon="private">
              Profile details, photos, routines and messages stay in this
              browser session. Preferences, streaks and your training plan are
              saved in this browser. This demo has no real accounts.
            </Notice>
            <div className="button-row">
              <Button variant="secondary" onClick={() => setConfirm("details")}>
                Remove my details
              </Button>
              <Button variant="secondary" onClick={() => setConfirm("reset")}>
                Reset demo
              </Button>
            </div>
          </Section>

          <Section id="help" title="Help & about">
            <Link className="settings-link" to="/about">
              About CHARETT & privacy <ArrowUpRight size={15} />
            </Link>
            <Link className="settings-link" to="/coach">
              Ask the AI coach <ArrowUpRight size={15} />
            </Link>
            <p className="small-text muted">
              <LockKeyhole size={13} aria-hidden="true" /> CHARETT demo ·
              version 0.3
            </p>
          </Section>
        </div>
      </div>
      {visitor && (
        <Modal
          title="Visitor preview · simulated"
          onClose={() => setVisitor(false)}
        >
          <p className="eyebrow">@{state.profile.handle}</p>
          {state.profile.visibility === "private" ? (
            <div className="empty">
              <LockKeyhole />
              <h3>This account is private.</h3>
              <p>Unapproved visitors cannot see posts.</p>
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
              ? "This removes your session content and resets locally saved preferences, streaks, training and clothing themes."
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
                  trainingWeek: {},
                  trainingProgress: {},
                  sessions: [],
                  food: [],
                  weights: [],
                  nutritionTargets: null,
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
