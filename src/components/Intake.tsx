import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useDemo } from "../lib/store";
import { Modal, Field, Select, Button, Area, Notice } from "./ui";
export default function Intake() {
  const { state, update } = useDemo();
  const [intake, setIntake] = useState(!state.intake);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(state.profile);
  const [adult, setAdult] = useState(state.adult === true);
  const finish = (save: boolean) => {
    update((s) => ({
      ...s,
      intake: true,
      ...(save ? { profile: draft, adult: true } : {}),
    }));
    setIntake(false);
  };
  return (
    <>
      {intake && (
        <Modal
          title={step === 1 ? "Welcome to CHARETT" : "Make it your own."}
          onClose={() => finish(false)}
        >
          <div className="eyebrow">Step {step} of 2</div>
          <p>
            Discover style and self-care inspiration, organise your routines and
            track progress with a personal AI coach. This short profile is
            optional; you can change or remove every detail later.
          </p>
          <Notice icon="private">
            This is a local demo. Personal details and photos stay in this
            browser session. No account is created.
          </Notice>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) {
                // The age confirmation counts as soon as step 1 is done.
                update((s) => ({ ...s, adult: true }));
                setStep(2);
              } else finish(true);
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
                <label className="age-check">
                  <input
                    type="checkbox"
                    checked={adult}
                    onChange={(e) => setAdult(e.target.checked)}
                  />
                  <span>I&rsquo;m 18 or older</span>
                </label>
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
              <Button type="submit" disabled={step === 1 && !adult}>
                {step === 1 ? "Continue" : "Find my starting point"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
