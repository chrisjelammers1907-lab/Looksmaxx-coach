import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useDemo } from "../lib/store";
import { Modal, Field, Select, Button, Area, Notice } from "./ui";
export default function Intake() {
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
    <>
      {intake && (
        <Modal
          title={step === 1 ? "Welcome to CHARETT" : "Make it your own."}
          onClose={() => finish(false)}
        >
          <div className="eyebrow">WELCOME TO CHARETT · {step} OF 2</div>
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
    </>
  );
}
