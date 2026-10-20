import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Check,
  Leaf,
  Sun,
  MoveRight,
} from "lucide-react";
import { useDemo } from "../lib/store";
import { topics } from "../lib/data";
import { asset } from "../lib/domain";
import { Modal, Field, Select, Button, Area, Notice } from "../components/ui";
export default function HomePage() {
  const { state, update } = useDemo();
  const [intake, setIntake] = useState(!state.intake);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(state.profile);
  const finish = (save: boolean) => {
    update((s) => ({
      ...s,
      intake: true,
      ...(save ? { profile: draft } : {}),
    }));
    setIntake(false);
  };
  return (
    <div className="home-page">
      <div className="welcome-row">
        <div className="eyebrow">
          <Sun size={14} /> YOUR SPACE TO GROW
        </div>
        <span>Small steps. Your own pace.</span>
      </div>
      <div className="welcome-title">
        <h1>
          Your everyday,
          <br className="mobile-only" /> <em>elevated.</em>
        </h1>
        <p>A little more intention. A little more you.</p>
      </div>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">PERSONAL, BY DESIGN</span>
          <h2>
            Becoming you.
            <br />
            <em>Beautifully.</em>
          </h2>
          <p>
            Your style, your rituals, your next chapter. <br />
            Thoughtful guidance for the way you want to feel.
          </p>
          <Link to="/coach" className="button light">
            Meet your personal coach <ArrowUpRight size={18} />
          </Link>
          <span className="hero-footnote">
            <Sparkles size={13} /> A personal coach experience · Simulated AI
          </span>
        </div>
        <div className="hero-image">
          <img
            src={asset("hero")}
            alt="Stock editorial reference of a tailored personal style"
          />
          <div className="hero-image-label">
            THE EVERYDAY EDIT <span>01 / 08</span>
          </div>
        </div>
        <span className="hero-decoration">C</span>
      </section>
      <div className="home-section-header">
        <div>
          <div className="eyebrow">A MORE CONSIDERED YOU</div>
          <h2>
            Explore your <em>possibilities.</em>
          </h2>
        </div>
        <span>
          Eight ways to make it personal <MoveRight size={19} />
        </span>
      </div>
      <section className="topic-grid" aria-label="Your eight topics">
        {topics.map((t) => (
          <Link
            key={t.id}
            className={`topic-card topic-${t.id}`}
            to={`/topics/${t.id}`}
          >
            <div className="topic-photo">
              <img
                src={asset(t.image)}
                alt={`${t.title} editorial reference`}
                loading="lazy"
              />
              <span className="topic-number">{t.number}</span>
              <span className="topic-card-arrow">
                <ArrowUpRight size={18} />
              </span>
            </div>
            <div className="topic-copy">
              <h3>{t.title}</h3>
              <p>{t.subtitle}</p>
            </div>
          </Link>
        ))}
      </section>
      <section className="home-bottom">
        <Link to="/plan" className="plan-promo">
          <span className="round-icon">
            <Check size={22} />
          </span>
          <div>
            <div className="eyebrow">PROGRESS, NOT PERFECTION</div>
            <h3>A plan that grows with you.</h3>
            <p>Your goals, a few good habits, one day at a time.</p>
          </div>
          <ArrowUpRight size={22} />
        </Link>
        <Link to="/explore" className="community-promo">
          <Leaf size={22} />
          <div>
            <h3>Good things, shared.</h3>
            <p>A little inspiration from the community.</p>
          </div>
          <ArrowRight size={22} />
        </Link>
      </section>
      <div className="home-signoff">
        Your own kind of remarkable.<span>CHARETT</span>
      </div>
      {intake && (
        <Modal
          title={step === 1 ? "A little introduction." : "Make it your own."}
          onClose={() => finish(false)}
        >
          <div className="eyebrow">WELCOME TO CHARETT · {step} OF 2</div>
          <p>
            One shared profile. Small, thoughtful steps. You can change or
            remove every detail later.
          </p>
          <Notice icon="private">
            This is a local demo. Personal details and photos stay in this
            browser session. No account is created.
          </Notice>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) setStep(2);
              else finish(true);
            }}
          >
            {step === 1 ? (
              <>
                <Field
                  label="What should we call you?"
                  value={draft.name}
                  maxLength={50}
                  required
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
                <Area
                  label="What would you like to work on?"
                  value={draft.goals}
                  maxLength={500}
                  onChange={(e) =>
                    setDraft({ ...draft, goals: e.target.value })
                  }
                />
              </>
            ) : (
              <>
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
                </div>
              </>
            )}
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => finish(false)}
              >
                Skip for now
              </Button>
              <Button type="submit">
                {step === 1 ? "Continue" : "Find my starting point"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
