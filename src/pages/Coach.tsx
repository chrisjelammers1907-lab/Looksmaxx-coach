import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Send,
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
import {
  Area,
  Button,
  ImageInput,
  Modal,
  Notice,
  PageHeader,
} from "../components/ui";
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
      <PageHeader
        eyebrow="A LITTLE GUIDANCE. YOUR OWN DIRECTION."
        title="Your AI Coach."
        description="Ask in your own words. Your question sets the direction."
        action={
          <Link to="/plan" className="button secondary">
            <ListChecks size={16} />
            My plan
          </Link>
        }
      />
      <Notice>
        SIMULATED AI · Sample replies use your message and session context. No
        live model or photo analysis. You review every proposed plan change.
      </Notice>
      <div className="coach-layout">
        <section
          className="coach-conversation"
          aria-label="Demo coach conversation"
        >
          <div className="chat-messages" aria-live="polite">
            {!state.chat.length && (
              <div className="coach-welcome">
                <span className="coach-orb">
                  <Sparkles size={28} />
                </span>
                <div className="eyebrow">LET’S START WITH YOU</div>
                <h2>
                  Good changes start
                  <br />
                  with a <em>conversation.</em>
                </h2>
                <p>
                  Ask about a ritual, an outfit, or a small next step. Your
                  goals and owned items shape the example response.
                </p>
                <div className="prompt-chips">
                  {[
                    "Help me simplify my routine",
                    "Build from what I already own",
                    "Review my weekly plan",
                  ].map((q) => (
                    <button key={q} onClick={() => send(q)}>
                      {q}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {state.chat.map((m) => (
              <div className={`chat-message ${m.author}`} key={m.id}>
                <span className="chat-author">
                  {m.author === "you"
                    ? "You · private session"
                    : "CHARETT · Simulated coach"}
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
                    Read the beginner’s guide · References included{" "}
                    <ArrowUpRight size={14} />
                  </Link>
                )}
                {m.proposal && (
                  <div className="proposal-card">
                    <span className="eyebrow">PROPOSED · NOT APPLIED</span>
                    <p>{m.proposal}</p>
                    <Button
                      variant="secondary"
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
            ))}
            {busy && (
              <div className="chat-loading" role="status">
                <Sparkles size={16} />
                Preparing a sample response…
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
                <span>Session only · Not analyzed</span>
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
            <Area
              label="Ask your demo coach"
              placeholder="A question, a goal, a little uncertainty…"
              value={text}
              maxLength={2000}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="composer-actions">
              <ImageInput label="Attach a private photo" onImage={setPhoto} />
              <Button type="submit" disabled={busy || (!text.trim() && !photo)}>
                <Send size={16} />
                {busy ? "Thinking…" : "Send"}
              </Button>
            </div>
            <small>
              Photos stay in this tab. Never analyzed or posted to Explore.
            </small>
          </form>
        </section>
        <aside className="coach-context">
          <ShieldCheck size={23} />
          <h3>Your shared context</h3>
          <span className="eyebrow">YOUR EDITABLE PROFILE</span>
          <p>
            <strong>Goal</strong>
            {state.profile.goals || "Not entered yet"}
          </p>
          <p>
            <strong>Preferences</strong>
            {state.profile.preferences || "Not entered yet"}
          </p>
          <p>
            <strong>Budget</strong>
            {state.profile.currency} {state.profile.budget}
          </p>
          <p>
            <strong>In your space</strong>
            {state.items.length} items · {state.routines.length} routines ·{" "}
            {state.goals.length} plan goals
          </p>
          <Link to="/profile" className="text-link">
            Edit your information <ArrowUpRight size={14} />
          </Link>
          <hr />
          <small>
            Advice is proposed. Estimates and uncertain observations are
            labelled. No routine changes silently.
          </small>
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
