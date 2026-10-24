import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUp,
  ArrowUpRight,
  Sparkles,
  X,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { topics } from "../lib/data";
import { uid } from "../lib/domain";
import { demoCoach } from "../lib/services";
import type { ChatMessage } from "../lib/types";
import { Button, ImageInput, Modal, Notice } from "../components/ui";
export default function CoachPage() {
  const { state, update, toast } = useDemo();
  const [params] = useSearchParams();
  const topic = topics.find((t) => t.id === params.get("topic"))?.id;
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [proposal, setProposal] = useState<ChatMessage | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.chat.length)
      end.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [state.chat.length]);
  const send = async (value = text) => {
    if (busy || (!value.trim() && !photo)) return;
    setError("");
    setBusy(true);
    const request = value.trim() || "I have a question about this photo.";
    update((s) => ({
      ...s,
      chat: [
        ...s.chat,
        { id: uid(), author: "you", text: request, photo: photo || undefined },
      ],
    }));
    setText("");
    setPhoto("");
    try {
      const response = await demoCoach.reply({
        text: request,
        topic,
        hasPhoto: !!photo,
        state,
      });
      update((s) => ({
        ...s,
        chat: [...s.chat, { id: uid(), author: "coach", ...response }],
      }));
    } catch {
      setError(
        "The demo response could not load. Your plan has not changed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="coach-page">
      <div className="coach-layout">
        <section
          className="coach-conversation"
          aria-label="Demo coach conversation"
        >
          <header className="coach-header">
            <span className="coach-orb small" aria-hidden="true">
              <Sparkles size={18} />
            </span>
            <div>
              <h1>CHARETT Coach</h1>
              <small>AI coach · demo replies</small>
            </div>
            <Link to="/plan" className="button secondary small">
              <ListChecks size={15} />
              My plan
            </Link>
          </header>
          <div className="chat-messages" aria-live="polite">
            {!state.chat.length && (
              <div className="coach-welcome">
                <span className="coach-orb">
                  <Sparkles size={26} />
                </span>
                <h2>
                  What would you like to <em>work on?</em>
                </h2>
                <p>
                  Ask about skin, hair, outfits or training. Your goals and the
                  things you own shape each reply.
                </p>
                <div className="prompt-chips">
                  {[
                    "Help me simplify my routine",
                    "Build from what I already own",
                    "Review my weekly plan",
                  ].map((q) => (
                    <button key={q} onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {state.chat.map((m) => (
              <div className={`chat-message ${m.author}`} key={m.id}>
                {m.author === "coach" && (
                  <span className="coach-orb tiny" aria-hidden="true">
                    <Sparkles size={12} />
                  </span>
                )}
                <div className="chat-bubble">
                  <span className="visually-hidden">
                    {m.author === "you" ? "You:" : "Coach:"}
                  </span>
                  {m.photo && (
                    <img
                      className="chat-photo"
                      src={m.photo}
                      alt="Your private attached photo — not analyzed"
                    />
                  )}
                  <p className="preserve-text">{m.text}</p>
                  {m.guide && (
                    <Link
                      className="coach-source-link"
                      to={`/topics/${m.guide}/guide`}
                    >
                      Read the beginner’s guide <ArrowUpRight size={14} />
                    </Link>
                  )}
                  {m.proposal && (
                    <div className="proposal-card">
                      <span className="eyebrow">Suggested for your plan</span>
                      <p>{m.proposal}</p>
                      <Button
                        variant="secondary small"
                        disabled={m.applied}
                        onClick={() => setProposal(m)}
                      >
                        {m.applied
                          ? "Applied to your plan"
                          : "Inspect proposed change"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="chat-message coach typing" role="status">
                <span className="coach-orb tiny" aria-hidden="true">
                  <Sparkles size={12} />
                </span>
                <div className="chat-bubble">
                  <span className="typing-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="visually-hidden">
                    Preparing a sample response…
                  </span>
                </div>
              </div>
            )}
            <div ref={end} />
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <form
            className="coach-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            {photo && (
              <div className="attachment-preview">
                <img src={photo} alt="Private attachment preview" />
                <span>Stays in this tab · not analyzed</span>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Remove attachment"
                  onClick={() => setPhoto("")}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="composer-pill">
              <ImageInput
                label="Attach a private photo"
                onImage={setPhoto}
                iconOnly
              />
              <textarea
                aria-label="Ask your demo coach"
                placeholder="Message your coach…"
                rows={1}
                value={text}
                maxLength={2000}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
              />
              <button
                type="submit"
                className="send-button"
                aria-label="Send"
                disabled={busy || (!text.trim() && !photo)}
              >
                <ArrowUp size={19} strokeWidth={2} />
              </button>
            </div>
          </form>
        </section>
        <aside className="coach-context">
          <h2>What your coach knows</h2>
          <dl>
            <div>
              <dt>Goal</dt>
              <dd>{state.profile.goals || "Not entered yet"}</dd>
            </div>
            <div>
              <dt>Preferences</dt>
              <dd>{state.profile.preferences || "Not entered yet"}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>
                {state.profile.currency} {state.profile.budget}
              </dd>
            </div>
            <div>
              <dt>In your space</dt>
              <dd>
                {state.items.length} items · {state.routines.length} routines ·{" "}
                {state.goals.length} plan goals
              </dd>
            </div>
          </dl>
          <Link to="/profile" className="text-link">
            Edit your information <ArrowUpRight size={14} />
          </Link>
          <p className="coach-context-note">
            <ShieldCheck size={15} aria-hidden="true" />
            Suggestions are never applied without your review.
          </p>
        </aside>
      </div>
      {proposal && (
        <Modal
          title="A small change, for your review."
          onClose={() => setProposal(null)}
        >
          <div className="eyebrow">PROPOSED PLAN ADDITION</div>
          <h3>{proposal.proposal}</h3>
          <p>
            Cadence: Weekly. This adds a new editable checklist item. Your
            existing routines, products and goals are preserved.
          </p>
          <Notice>
            Example advice, not a confirmed fact or a treatment recommendation.
            Choose whether it belongs in your plan.
          </Notice>
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setProposal(null)}>
              Keep my plan as it is
            </Button>
            <Button
              onClick={() => {
                update((s) => ({
                  ...s,
                  goals: [
                    ...s.goals,
                    {
                      id: uid(),
                      text: proposal.proposal!,
                      cadence: "Weekly",
                      done: false,
                    },
                  ],
                  chat: s.chat.map((m) =>
                    m.id === proposal.id ? { ...m, applied: true } : m,
                  ),
                }));
                setProposal(null);
                toast("Reviewed goal added. No routine was overwritten.");
              }}
            >
              Apply to my plan
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
