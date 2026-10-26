import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { useDemo } from "../lib/store";
import { euro, planOf, plans, yearlySaving, type Plan } from "../lib/plans";
import { today } from "../lib/domain";
import { Button, Modal, PageHeader } from "../components/ui";
import Monogram from "../components/Monogram";

type Billing = "monthly" | "yearly";

const renewal = (billing: Billing) => {
  const next = new Date(`${today()}T12:00:00`);
  if (billing === "yearly") next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function PlansPage() {
  const { state, update, toast } = useDemo();
  const current = planOf(state);
  const [billing, setBilling] = useState<Billing>(state.subscription.billing);
  const [checkout, setCheckout] = useState<Plan | null>(null);
  const price = (plan: Plan) =>
    billing === "yearly" ? plan.yearly : plan.monthly;
  const choose = (plan: Plan, chosen: Billing) => {
    update((s) => ({
      ...s,
      subscription:
        plan.id === "free"
          ? { plan: "free", billing: s.subscription.billing }
          : { plan: plan.id, billing: chosen, since: today() },
    }));
    setCheckout(null);
    toast(
      plan.id === "free"
        ? "You’re on Free now."
        : `Welcome to ${plan.name}. Enjoy CHARETT without limits.`,
    );
  };
  return (
    <div className="plans-page">
      <PageHeader
        title="Choose your plan."
        description="Start free. Upgrade when you want more — cancel any time."
      />
      <div className="billing-toggle" role="radiogroup" aria-label="Billing">
        {(
          [
            ["monthly", "Monthly"],
            ["yearly", `Yearly · save ${yearlySaving(plans[1])}%`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={billing === id}
            onClick={() => setBilling(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="plan-cards">
        {plans.map((plan) => {
          const isCurrent = plan.id === current.id;
          return (
            <section
              key={plan.id}
              className={`plan-card plan-${plan.id} ${isCurrent ? "current" : ""}`}
              aria-labelledby={`plan-${plan.id}`}
            >
              {plan.id === "plus" && (
                <span className="plan-flag">Most popular</span>
              )}
              <header>
                <h2 id={`plan-${plan.id}`}>
                  {plan.id === "signature" && (
                    <Crown size={18} aria-hidden="true" />
                  )}
                  {plan.name}
                </h2>
                <p>{plan.tagline}</p>
              </header>
              <div className="plan-price">
                <strong>{plan.monthly ? euro(price(plan)) : "€0"}</strong>
                <span>
                  {plan.monthly
                    ? billing === "yearly"
                      ? `a year · ${euro(plan.yearly / 12)} a month`
                      : "a month"
                    : "always"}
                </span>
              </div>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={16} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button disabled variant="secondary">
                  Current plan
                </Button>
              ) : (
                <Button
                  variant={plan.id === "free" ? "secondary" : ""}
                  onClick={() => setCheckout(plan)}
                >
                  {plan.id === "free"
                    ? "Switch to Free"
                    : `Choose ${plan.name}`}
                </Button>
              )}
            </section>
          );
        })}
      </div>
      <section className="plans-faq" aria-label="Questions">
        <details>
          <summary>Can I cancel any time?</summary>
          <p>
            Yes. You keep your plan until the end of the period you paid for,
            then move to Free. Your routines, logs and chats stay.
          </p>
        </details>
        <details>
          <summary>What happens to my streaks?</summary>
          <p>
            Streaks and unlocked rewards are yours on every plan. Signature adds
            streak protection, so one missed day doesn’t reset a streak.
          </p>
        </details>
        <details>
          <summary>Is my data used for ads?</summary>
          <p>
            No. Sponsored posts on Free aren’t based on your photos, chats or
            logs.
          </p>
        </details>
      </section>
      {checkout && (
        <Modal
          title={checkout.id === "free" ? "Switch to Free?" : "Checkout"}
          onClose={() => setCheckout(null)}
        >
          {checkout.id === "free" ? (
            <>
              <p>
                You’ll keep everything you made. Coach messages go back to 10 a
                day and ads return. The barcode scan, extra training days and
                making stickers pause.
              </p>
              <div className="modal-actions">
                <Button variant="ghost" onClick={() => setCheckout(null)}>
                  Keep {current.name}
                </Button>
                <Button onClick={() => choose(checkout, billing)}>
                  Switch to Free
                </Button>
              </div>
            </>
          ) : (
            <div className="checkout">
              <dl>
                <div>
                  <dt>Plan</dt>
                  <dd>
                    {checkout.id === "signature" ? (
                      <Crown size={15} aria-hidden="true" />
                    ) : (
                      <Monogram size={16} />
                    )}{" "}
                    CHARETT {checkout.name}
                  </dd>
                </div>
                <div>
                  <dt>Billing</dt>
                  <dd>{billing === "yearly" ? "Yearly" : "Monthly"}</dd>
                </div>
                <div>
                  <dt>Renews</dt>
                  <dd>{renewal(billing)}</dd>
                </div>
                <div className="checkout-total">
                  <dt>Due today</dt>
                  <dd>{euro(price(checkout))}</dd>
                </div>
              </dl>
              <p className="small-text muted">
                Demo checkout: no payment details are asked and nothing is
                charged.
              </p>
              <Button onClick={() => choose(checkout, billing)}>
                Start {checkout.name}
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
