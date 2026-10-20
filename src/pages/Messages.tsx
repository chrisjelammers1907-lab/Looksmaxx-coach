import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Flag,
  Link2,
  Plus,
  Send,
  ShieldCheck,
  UserX,
  X,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { creators } from "../lib/data";
import { uid, maySharePost } from "../lib/domain";
import type { CardRef } from "../lib/types";
import { LinkedCard } from "../components/Social";
import {
  Area,
  Button,
  Empty,
  Modal,
  Notice,
  PageHeader,
  Select,
} from "../components/ui";
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
  const send = () => {
    if ((!text.trim() && !card) || blocked || !creator) return;
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
    update((s) => ({
      ...s,
      messages: {
        ...s.messages,
        [selected]: [
          ...(s.messages[selected] || []),
          {
            id: uid(),
            author: "you",
            text: text.trim(),
            card,
            time: "Just now",
          },
        ],
      },
    }));
    setText("");
    setCard(undefined);
    toast("Simulated delivery. Message stays in this local session.");
  };
  return (
    <div className="messages-page">
      <PageHeader
        eyebrow="GOOD CONVERSATIONS START HERE"
        title="A little connection."
        description="An inbox for inspiration, thoughtful notes and shared ideas."
        action={
          <Button onClick={() => setNewMessage(true)}>
            <Plus size={16} />
            New demo message
          </Button>
        }
      />
      <Notice>
        SIMULATED MESSAGING · Fictional recipients, local session threads, no
        real delivery, authentication or secure private communication.
      </Notice>
      <div className={`inbox-layout ${selected ? "has-selection" : ""}`}>
        <aside className="inbox-list">
          <h2>Your conversations</h2>
          {creators
            .filter(
              (c) =>
                !state.blocked.includes(c.id) &&
                (state.messages[c.id] || c.id === selected),
            )
            .map((c) => (
              <button
                className={`conversation-preview ${selected === c.id ? "selected" : ""}`}
                key={c.id}
                onClick={() => choose(c.id)}
              >
                <span className="avatar">{c.initials}</span>
                <span>
                  <strong>{c.name}</strong>
                  <small>
                    {state.messages[c.id]?.at(-1)?.text ||
                      "Start a local conversation"}
                  </small>
                </span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          {state.profile.messageRequests && request === "pending" && (
            <div className="message-request">
              <span className="eyebrow">DEMO MESSAGE REQUEST</span>
              <h3>James Ellis</h3>
              <p>A fictional creator would like to connect.</p>
              <div className="button-row">
                <Button
                  variant="secondary small"
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
                            text: "Thanks for accepting this simulated request. What are you working on?",
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
                    toast("Demo request declined.");
                  }}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
          <Link className="text-link" to="/profile">
            Message request controls <ArrowUpRight size={13} />
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
                  <ArrowLeft size={18} />
                </button>
                <span className="avatar">{creator.initials}</span>
                <Link to={`/profile/${creator.id}`}>
                  <strong>{creator.name}</strong>
                  <small>Fictional recipient · Simulated thread</small>
                </Link>
                <button
                  className="icon-button"
                  aria-label="Report conversation"
                  onClick={() => setReport(true)}
                >
                  <Flag size={16} />
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
                  <UserX size={17} />
                </button>
              </header>
              <div className="thread" aria-live="polite">
                {!thread.length && (
                  <div className="conversation-empty">
                    <ShieldCheck size={25} />
                    <p>
                      Start a fictional conversation. Your private content is
                      never exposed by a shared link.
                    </p>
                  </div>
                )}
                {thread.map((m) => (
                  <div
                    className={`message-bubble ${m.author === "you" ? "outgoing" : "incoming"}`}
                    key={m.id}
                  >
                    {m.text && <p>{m.text}</p>}
                    {m.card && (
                      <LinkedCard
                        card={m.card}
                        viewer={m.author === "you" ? selected : "you"}
                      />
                    )}
                    <small>
                      {m.time} ·{" "}
                      {m.author === "you"
                        ? "Simulated delivery"
                        : "Fictional message"}
                    </small>
                  </div>
                ))}
              </div>
              <form
                className="message-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                {card && (
                  <div className="attachment-preview">
                    <LinkedCard card={card} />
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Remove linked card"
                      onClick={() => setCard(undefined)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <Area
                  label="Your demo message"
                  placeholder="Share a thought…"
                  value={text}
                  maxLength={2000}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="composer-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAttach(true)}
                  >
                    <Link2 size={16} />
                    Attach linked card
                  </Button>
                  <Button type="submit" disabled={!text.trim() && !card}>
                    <Send size={16} />
                    Simulate send
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <Empty
              title={
                blocked
                  ? "This recipient is blocked."
                  : "A little room for a conversation."
              }
            >
              {blocked ? (
                <Link to="/profile">
                  Manage blocked creators in your profile.
                </Link>
              ) : (
                "Choose a fictional conversation or compose a new demo message."
              )}
            </Empty>
          )}
        </section>
      </div>
      {newMessage && (
        <Modal
          title="Start a demo conversation"
          onClose={() => setNewMessage(false)}
        >
          <Select
            label="Fictional recipient"
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
      {attach && (
        <Modal
          title="Share a rich linked card"
          onClose={() => setAttach(false)}
        >
          <Notice>
            Only demo content accessible to this recipient is listed. Private
            originals, products, photos, routines and restricted posts remain
            private. Create a fictional public post with an audience preview to
            share a copy.
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
                  · Public · Fictional reference
                </small>
                <Link2 size={15} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {report && (
        <Modal
          title="Report this demo conversation"
          onClose={() => setReport(false)}
        >
          <Notice>
            Simulation only. No report is sent to a real moderation service.
          </Notice>
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
              toast("Conversation report simulated locally.");
            }}
          >
            Submit demo report
          </Button>
        </Modal>
      )}
    </div>
  );
}
