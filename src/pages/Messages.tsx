import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  Camera,
  Flag,
  Image,
  Link2,
  Mic,
  Palette,
  Plus,
  Send,
  Square,
  SquarePen,
  Sticker as StickerIcon,
  UserX,
  X,
} from "lucide-react";
import {
  CameraCapture,
  Sticker,
  StickerMaker,
  VoiceNote,
  stickers,
  streakStickers,
  useVoiceRecorder,
} from "../components/ChatMedia";
import { useDemo } from "../lib/store";
import { creators } from "../lib/data";
import { uid, maySharePost, today } from "../lib/domain";
import { alive, bump, hasReward, unlocked } from "../lib/streaks";
import { isPaid, isSignature, limitsOf, streakGrace } from "../lib/plans";
import { UpgradeCard } from "../components/Upgrade";
import type { CardRef, Message } from "../lib/types";
import { LinkedCard } from "../components/Social";
import { Button, Modal, Notice, Select } from "../components/ui";
import StreakFlame from "../components/StreakFlame";
import { DEMO } from "../lib/demo";
export default function MessagesPage() {
  const { state, update, toast } = useDemo();
  const [params, setParams] = useSearchParams();
  const selected = params.get("to") || "";
  const creator = creators.find((c) => c.id === selected);
  const [text, setText] = useState("");
  const [card, setCard] = useState<CardRef | undefined>();
  const [newMessage, setNewMessage] = useState(false);
  const [recipient, setRecipient] = useState("mira");
  const [attach, setAttach] = useState(false);
  const [request, setRequest] = useState("pending");
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("Unwanted contact");
  const [menu, setMenu] = useState(false);
  const [stickerPicker, setStickerPicker] = useState(false);
  const [photo, setPhoto] = useState("");
  const [voice, setVoice] = useState<{ src: string; seconds: number }>();
  const [camera, setCamera] = useState(false);
  const [maker, setMaker] = useState(false);
  const [themePicker, setThemePicker] = useState(false);
  const closeCamera = useCallback(() => setCamera(false), []);
  const recorder = useVoiceRecorder(setVoice, toast);
  const threadEnd = useRef<HTMLDivElement>(null);
  const threadLength = (state.messages[selected] || []).length;
  useEffect(() => {
    threadEnd.current?.scrollIntoView({ block: "end" });
  }, [selected, threadLength]);
  const choose = (id: string) => {
    setParams({ to: id });
    setText("");
    setCard(undefined);
  };
  const blocked = state.blocked.includes(selected);
  const thread = state.messages[selected] || [];
  const attachable = state.posts.filter((p) =>
    maySharePost(
      p,
      state.blocked,
      state.profile.visibility,
      selected,
      state.approvedFollowers,
    ),
  );
  const date = today();
  const grace = streakGrace(state);
  const streakOf = (id: string) => alive(state.chatStreaks[id], date, grace);
  const best = Math.max(0, ...creators.map((c) => streakOf(c.id)));
  // Signature members own every streak reward from day one.
  const owns = (id: Parameters<typeof hasReward>[1]) =>
    isSignature(state) || hasReward(best, id);
  const post = (message: Partial<Message>) => {
    const before = streakOf(selected);
    const next = bump(state.chatStreaks[selected], date, grace);
    update((s) => ({
      ...s,
      chatStreaks: { ...s.chatStreaks, [selected]: next },
      messages: {
        ...s.messages,
        [selected]: [
          ...(s.messages[selected] || []),
          {
            id: uid(),
            author: "you",
            text: "",
            time: "Just now",
            date,
            ...message,
          },
        ],
      },
    }));
    const reward = unlocked(before, next.count);
    if (reward) toast(`${reward.days}-day streak · Unlocked: ${reward.label}.`);
  };
  const send = () => {
    if ((!text.trim() && !card && !photo && !voice) || blocked || !creator)
      return;
    if (
      card &&
      !maySharePost(
        state.posts.find((p) => p.id === card.id),
        state.blocked,
        state.profile.visibility,
        selected,
        state.approvedFollowers,
      )
    ) {
      toast("That card is no longer accessible. Nothing was sent.");
      return;
    }
    post({
      text: text.trim(),
      card,
      photo: photo || undefined,
      audio: voice,
    });
    setText("");
    setCard(undefined);
    setPhoto("");
    setVoice(undefined);
  };
  const hasContent = !!(text.trim() || card || photo || voice);
  const conversations = creators.filter(
    (c) =>
      !state.blocked.includes(c.id) &&
      (state.messages[c.id] || c.id === selected),
  );
  return (
    <div className="messages-page">
      <h1 className="visually-hidden">Messages</h1>
      <div className={`inbox-layout ${selected ? "has-selection" : ""}`}>
        <aside className="inbox-list">
          <header className="inbox-header">
            <span className="inbox-title" aria-hidden="true">
              Messages
            </span>
            <button
              type="button"
              className="icon-button"
              aria-label={DEMO ? "New demo message" : "New message"}
              onClick={() => setNewMessage(true)}
            >
              <SquarePen size={21} strokeWidth={1.7} />
            </button>
          </header>
          {state.profile.messageRequests && request === "pending" && (
            <div className="message-request">
              <span className="avatar">JE</span>
              <div>
                <strong>james.everyday</strong>
                <small>Wants to send you a message</small>
              </div>
              <div className="message-request-actions">
                <Button
                  variant="small"
                  onClick={() => {
                    setRequest("accepted");
                    update((s) => ({
                      ...s,
                      messages: {
                        ...s.messages,
                        james: [
                          {
                            id: uid(),
                            author: "james",
                            text: DEMO
                              ? "Thanks for accepting this simulated request. What are you working on?"
                              : "Thanks for accepting. What are you working on?",
                            time: "Just now",
                          },
                        ],
                      },
                    }));
                    choose("james");
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="ghost small"
                  onClick={() => {
                    setRequest("declined");
                    toast(
                      DEMO ? "Demo request declined." : "Request declined.",
                    );
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
          <div className="conversation-list">
            {conversations.map((c) => {
              const last = state.messages[c.id]?.at(-1);
              return (
                <button
                  className={`conversation-preview ${selected === c.id ? "selected" : ""}`}
                  key={c.id}
                  aria-current={selected === c.id ? "true" : undefined}
                  onClick={() => choose(c.id)}
                >
                  <span className="avatar">{c.initials}</span>
                  <span className="conversation-text">
                    <strong>
                      {c.name}
                      {streakOf(c.id) > 0 && (
                        <StreakFlame count={streakOf(c.id)} />
                      )}
                    </strong>
                    <small>
                      <span className="conversation-snippet">
                        {last
                          ? `${last.author === "you" ? "You: " : ""}${
                              last.text ||
                              (last.photo
                                ? "Sent a photo"
                                : last.sticker
                                  ? "Sent a sticker"
                                  : last.audio
                                    ? "Sent a voice message"
                                    : "Shared a post")
                            }`
                          : "Start a conversation"}
                      </span>
                      {last?.time && <span> · {last.time}</span>}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
          <Link className="inbox-settings" to="/profile">
            Message settings
          </Link>
        </aside>
        <section className="conversation" aria-label="Selected conversation">
          {creator && !blocked ? (
            <>
              <header className="conversation-header">
                <button
                  className="icon-button mobile-only"
                  aria-label="Back to inbox"
                  onClick={() => setParams({})}
                >
                  <ArrowLeft size={20} />
                </button>
                <Link
                  to={`/profile/${creator.id}`}
                  className="conversation-person"
                >
                  <span className="avatar">{creator.initials}</span>
                  <span>
                    <strong>
                      {creator.name}
                      {streakOf(creator.id) > 0 && (
                        <StreakFlame count={streakOf(creator.id)} />
                      )}
                    </strong>
                    <small>{creator.handle}</small>
                  </span>
                </Link>
                {owns("themes") && (
                  <button
                    className="icon-button"
                    aria-label="Chat theme"
                    onClick={() => setThemePicker(true)}
                  >
                    <Palette size={18} strokeWidth={1.7} />
                  </button>
                )}
                <button
                  className="icon-button"
                  aria-label="Report conversation"
                  onClick={() => setReport(true)}
                >
                  <Flag size={18} strokeWidth={1.7} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Block recipient"
                  onClick={() => {
                    update((s) => ({
                      ...s,
                      blocked: [...s.blocked, selected],
                      following: s.following.filter((id) => id !== selected),
                    }));
                    toast(
                      "Recipient blocked locally. Their content is hidden.",
                    );
                  }}
                >
                  <UserX size={19} strokeWidth={1.7} />
                </button>
              </header>
              <div
                className={`thread chat-theme-${state.chatThemes[selected] || "classic"}`}
                aria-live="polite"
              >
                <div className="thread-intro">
                  <span className="avatar large">{creator.initials}</span>
                  <strong>{creator.name}</strong>
                  <small>
                    {creator.handle} · {creator.followers} followers
                  </small>
                  <Link
                    to={`/profile/${creator.id}`}
                    className="button secondary small"
                  >
                    View profile
                  </Link>
                </div>
                {thread.map((m, index) => {
                  const next = thread[index + 1];
                  const lastInGroup = !next || next.author !== m.author;
                  return (
                    <div
                      className={`message-row ${m.author === "you" ? "outgoing-row" : "incoming-row"} ${lastInGroup ? "group-end" : ""}`}
                      key={m.id}
                    >
                      {m.author !== "you" && (
                        <span className="avatar tiny" aria-hidden="true">
                          {lastInGroup ? creator.initials : ""}
                        </span>
                      )}
                      <div
                        className={`message-bubble ${m.author === "you" ? "outgoing" : "incoming"} ${m.sticker ? "sticker-bubble" : ""}`}
                      >
                        {m.sticker && <Sticker id={m.sticker} />}
                        {m.photo && (
                          <img
                            loading="lazy"
                            decoding="async"
                            className="message-photo"
                            src={m.photo}
                            alt="Photo you sent · stays in this tab"
                          />
                        )}
                        {m.audio && (
                          <VoiceNote
                            src={m.audio.src}
                            seconds={m.audio.seconds}
                          />
                        )}
                        {m.text && <p>{m.text}</p>}
                        {m.card && (
                          <LinkedCard
                            card={m.card}
                            viewer={m.author === "you" ? selected : "you"}
                          />
                        )}
                        {lastInGroup && <small>{m.time}</small>}
                      </div>
                    </div>
                  );
                })}
                <div ref={threadEnd} />
              </div>
              <form
                className="message-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                {(card || photo || voice) && (
                  <div className="attachment-preview">
                    {card && <LinkedCard card={card} />}
                    {photo && (
                      <img
                        loading="lazy"
                        decoding="async"
                        className="attachment-photo"
                        src={photo}
                        alt="Photo ready to send"
                      />
                    )}
                    {voice && <VoiceNote {...voice} />}
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Remove attachment"
                      onClick={() => {
                        setCard(undefined);
                        setPhoto("");
                        setVoice(undefined);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {menu && (
                  <div className="composer-menu" role="menu">
                    <label className="composer-menu-item" role="menuitem">
                      <Image size={19} aria-hidden="true" />
                      Photo
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="visually-hidden"
                        aria-label="Send a photo"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          setMenu(false);
                          if (!file) return;
                          if (file.size > 8 * 1024 * 1024) {
                            toast("Choose a photo under 8 MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => setPhoto(String(reader.result));
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      role="menuitem"
                      className="composer-menu-item"
                      onClick={() => {
                        setMenu(false);
                        setStickerPicker(true);
                      }}
                    >
                      <StickerIcon size={19} aria-hidden="true" />
                      Sticker
                    </button>
                    {matchMedia("(pointer: coarse)").matches ? (
                      <label className="composer-menu-item" role="menuitem">
                        <Camera size={19} aria-hidden="true" />
                        Camera
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="visually-hidden"
                          aria-label="Take a photo"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            setMenu(false);
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () =>
                              setPhoto(String(reader.result));
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        className="composer-menu-item"
                        onClick={() => {
                          setMenu(false);
                          setCamera(true);
                        }}
                      >
                        <Camera size={19} aria-hidden="true" />
                        Camera
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      className="composer-menu-item"
                      onClick={() => {
                        setMenu(false);
                        setAttach(true);
                      }}
                    >
                      <Link2 size={19} aria-hidden="true" />
                      Share a post
                    </button>
                  </div>
                )}
                {recorder.recording ? (
                  <div className="composer-pill recording" role="status">
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Cancel recording"
                      onClick={recorder.cancel}
                    >
                      <X size={18} />
                    </button>
                    <span className="recording-dot" aria-hidden="true" />
                    <span className="recording-time">
                      Recording {recorder.elapsed}
                    </span>
                    <button
                      type="button"
                      className="send-button"
                      aria-label="Stop recording"
                      onClick={recorder.stop}
                    >
                      <Square size={14} fill="currentColor" />
                    </button>
                  </div>
                ) : (
                  <div className="composer-pill">
                    <button
                      type="button"
                      className={`icon-button add-button ${menu ? "open" : ""}`}
                      aria-label="Add attachment"
                      aria-expanded={menu}
                      onClick={() => setMenu(!menu)}
                    >
                      <Plus size={21} strokeWidth={1.8} />
                    </button>
                    <textarea
                      aria-label="Message"
                      placeholder="Message…"
                      enterKeyHint="send"
                      rows={1}
                      value={text}
                      maxLength={2000}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          send();
                        }
                      }}
                    />
                    {hasContent ? (
                      <button
                        type="submit"
                        className="send-button"
                        aria-label="Send message"
                      >
                        <ArrowUp size={19} strokeWidth={2} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="icon-button"
                        aria-label="Record voice message"
                        onClick={() => void recorder.start()}
                      >
                        <Mic size={20} strokeWidth={1.7} />
                      </button>
                    )}
                  </div>
                )}
              </form>
            </>
          ) : (
            <div className="conversation-empty">
              <span className="conversation-empty-icon">
                <Send size={30} strokeWidth={1.4} />
              </span>
              <h2>
                {blocked ? "This recipient is blocked." : "Your messages"}
              </h2>
              {blocked ? (
                <Link to="/profile">
                  Manage blocked creators in your profile.
                </Link>
              ) : (
                <>
                  <p>Send a private note or share a post with a friend.</p>
                  <Button onClick={() => setNewMessage(true)}>
                    Send message
                  </Button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
      {newMessage && (
        <Modal
          title={DEMO ? "Start a demo conversation" : "New conversation"}
          onClose={() => setNewMessage(false)}
        >
          <Select
            label={DEMO ? "Fictional recipient" : "Recipient"}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            {creators
              .filter((c) => !state.blocked.includes(c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </Select>
          <Button
            disabled={state.blocked.includes(recipient)}
            onClick={() => {
              choose(recipient);
              setNewMessage(false);
            }}
          >
            Open conversation
          </Button>
        </Modal>
      )}
      {stickerPicker && (
        <Modal title="Stickers" onClose={() => setStickerPicker(false)}>
          {state.customStickers.length < limitsOf(state).customStickers ? (
            <Button
              variant="secondary small"
              onClick={() => {
                setStickerPicker(false);
                setMaker(true);
              }}
            >
              <Plus size={15} /> Create a sticker
            </Button>
          ) : (
            <UpgradeCard
              title={
                isPaid(state)
                  ? `You’ve made ${limitsOf(state).customStickers} stickers`
                  : "Make your own stickers with Plus"
              }
            >
              {isPaid(state) && "Signature has no limit."}
            </UpgradeCard>
          )}
          {state.customStickers.length > 0 && (
            <>
              <h3 className="sticker-group">Yours</h3>
              <div className="sticker-grid">
                {state.customStickers.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    aria-label={`Send ${st.text || "photo"} sticker`}
                    onClick={() => {
                      post({ sticker: st.id });
                      setStickerPicker(false);
                    }}
                  >
                    <Sticker id={st.id} />
                  </button>
                ))}
              </div>
            </>
          )}
          <h3 className="sticker-group">CHARETT</h3>
          <div className="sticker-grid">
            {stickers.map((st) => (
              <button
                key={st.id}
                type="button"
                aria-label={`Send ${st.label} sticker`}
                onClick={() => {
                  post({ sticker: st.id });
                  setStickerPicker(false);
                }}
              >
                <Sticker id={st.id} />
              </button>
            ))}
          </div>
          <h3 className="sticker-group">
            Streak pack{" "}
            {!owns("stickers") && (
              <small className="muted">· unlocks at a 3-day streak</small>
            )}
          </h3>
          <div className="sticker-grid">
            {streakStickers.map((st) => (
              <button
                key={st.id}
                type="button"
                disabled={!owns("stickers")}
                aria-label={`Send ${st.label} sticker`}
                onClick={() => {
                  post({ sticker: st.id });
                  setStickerPicker(false);
                }}
              >
                <Sticker id={st.id} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {maker && (
        <StickerMaker
          onClose={() => setMaker(false)}
          onDone={(id) => {
            post({ sticker: id });
            setMaker(false);
          }}
        />
      )}
      {camera && (
        <CameraCapture
          onPhoto={setPhoto}
          onClose={closeCamera}
          onError={toast}
        />
      )}
      {themePicker && (
        <Modal title="Chat theme" onClose={() => setThemePicker(false)}>
          <div className="theme-grid">
            {[
              ["classic", "Classic"],
              ["champagne", "Champagne"],
              ["midnight", "Midnight"],
              ["ivory", "Ivory"],
              ...(owns("gold") ? [["gold", "Gold leaf"]] : []),
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`theme-swatch chat-theme-${id}`}
                aria-pressed={(state.chatThemes[selected] || "classic") === id}
                onClick={() => {
                  update((s) => ({
                    ...s,
                    chatThemes: { ...s.chatThemes, [selected]: id },
                  }));
                  setThemePicker(false);
                }}
              >
                <span className="swatch-bubbles" aria-hidden="true">
                  <i />
                  <i />
                </span>
                {label}
              </button>
            ))}
          </div>
          {!owns("gold") && (
            <p className="small-text muted">
              Gold leaf unlocks at a 100-day streak.
            </p>
          )}
        </Modal>
      )}
      {attach && (
        <Modal
          title="Share a rich linked card"
          onClose={() => setAttach(false)}
        >
          <Notice>
            Only posts this person can see are listed. Private posts, photos and
            routines are never shared.
          </Notice>
          <div className="attach-list">
            {attachable.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setCard({
                    kind:
                      p.topic === "clothing"
                        ? "outfit"
                        : p.steps.length
                          ? "routine"
                          : p.items.length
                            ? "product"
                            : "post",
                    id: p.id,
                  });
                  setAttach(false);
                }}
              >
                <strong>{p.title}</strong>
                <small>
                  {p.topic === "clothing"
                    ? "Outfit"
                    : p.steps.length
                      ? "Routine"
                      : p.items.length
                        ? "Product"
                        : "Post"}{" "}
                  · Public{DEMO ? " · Fictional reference" : ""}
                </small>
                <Link2 size={15} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {report && (
        <Modal
          title={
            DEMO ? "Report this demo conversation" : "Report this conversation"
          }
          onClose={() => setReport(false)}
        >
          {DEMO && (
            <Notice>
              Simulation only. No report is sent to a real moderation service.
            </Notice>
          )}
          <Select
            label="Report reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {["Unwanted contact", "Harassment", "Privacy concern", "Other"].map(
              (r) => (
                <option key={r}>{r}</option>
              ),
            )}
          </Select>
          <Button
            onClick={() => {
              setReport(false);
              toast(
                DEMO
                  ? "Conversation report simulated locally."
                  : "Thanks. Our team will review it.",
              );
            }}
          >
            {DEMO ? "Submit demo report" : "Send report"}
          </Button>
        </Modal>
      )}
    </div>
  );
}
