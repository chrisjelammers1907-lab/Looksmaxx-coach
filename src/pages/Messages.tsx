import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  Flag,
  Link2,
  Send,
  SquarePen,
  UserX,
  X,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { creators } from "../lib/data";
import { uid, maySharePost } from "../lib/domain";
import type { CardRef } from "../lib/types";
import { LinkedCard } from "../components/Social";
import { Button, Modal, Notice, Select } from "../components/ui";
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
              aria-label="New demo message"
              onClick={() => setNewMessage(true)}
            >
              <SquarePen size={21} strokeWidth={1.7} />
            </button>
          </header>
          <p className="inbox-note">
            Demo inbox · fictional people, nothing is sent
          </p>
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
                    <strong>{c.name}</strong>
                    <small>
                      <span className="conversation-snippet">
                        {last
                          ? `${last.author === "you" ? "You: " : ""}${last.text || "Shared a post"}`
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
                    <strong>{creator.name}</strong>
                    <small>{creator.handle}</small>
                  </span>
                </Link>
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
              <div className="thread" aria-live="polite">
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
                        className={`message-bubble ${m.author === "you" ? "outgoing" : "incoming"}`}
                      >
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
                <div className="composer-pill">
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Attach linked card"
                    onClick={() => setAttach(true)}
                  >
                    <Link2 size={20} strokeWidth={1.7} />
                  </button>
                  <textarea
                    aria-label="Message"
                    placeholder="Message…"
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
                  <button
                    type="submit"
                    className="send-button"
                    aria-label="Send message"
                    disabled={!text.trim() && !card}
                  >
                    <ArrowUp size={19} strokeWidth={2} />
                  </button>
                </div>
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
