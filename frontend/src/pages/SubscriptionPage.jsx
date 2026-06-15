import { useState } from "react";
import { ArrowRight, Check, ClockCountdown, Coins, X } from "@phosphor-icons/react";
import { subscriptionPlans } from "../data/billingData";

export function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("Pro");
  const [pendingPlan, setPendingPlan] = useState(null);

  return (
    <main className="content-page subscription-page">
      <div className="page-heading">
        <div>
          <h1>Subscription</h1>
        </div>
      </div>

      <section className="current-subscription">
        <div className="current-plan-main">
          <span className="current-plan-icon"><Coins size={22} /></span>
          <div>
            <small>Current plan</small>
            <h2>{currentPlan}</h2>
            <p>Renews Jun 30, 2026</p>
          </div>
        </div>
        <div className="renewal-stats">
          <span><small>Available</small><strong>6,800,000</strong></span>
          <span><small>Monthly grant</small><strong>{subscriptionPlans.find((plan) => plan.name === currentPlan)?.credits.toLocaleString() || "0"}</strong></span>
          <span><small>Expires</small><strong>Jun 30</strong></span>
        </div>
        <div className="expiry-note">
          <ClockCountdown size={17} />
          <span>Unused plan credits expire Jun 30.</span>
        </div>
      </section>

      <section className="plan-grid">
        {subscriptionPlans.map((plan) => (
          <article
            className={`plan-card ${plan.popular ? "featured" : ""} ${currentPlan === plan.name ? "selected" : ""}`}
            key={plan.name}
          >
            {plan.popular && <span className="popular-label">Most popular</span>}
            <h2>{plan.name}</h2>
            <div className="plan-price">
              <strong>${plan.price}</strong>
              <span>/ month</span>
            </div>
            <div className="plan-credit-grant">
              <Coins size={16} />
              <span>{plan.credits ? `${(plan.credits / 1_000_000).toLocaleString()}M recurring credits` : "No recurring credits"}</span>
            </div>
            <button
              className={plan.popular ? "primary-button" : "secondary-button"}
              onClick={() => currentPlan !== plan.name && setPendingPlan(plan)}
              disabled={currentPlan === plan.name}
            >
              {currentPlan === plan.name ? <><Check size={17} /> Current plan</> : <>Choose {plan.name} <ArrowRight size={15} /></>}
            </button>
            <ul>
              {plan.features.map((feature) => <li key={feature}><Check size={16} /> {feature}</li>)}
            </ul>
          </article>
        ))}
      </section>

      {pendingPlan && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal plan-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="plan-confirm-title">
            <button className="modal-close" onClick={() => setPendingPlan(null)} aria-label="Close plan confirmation"><X size={19} /></button>
            <span className="api-modal-icon"><Coins size={22} /></span>
            <h2 id="plan-confirm-title">Change to {pendingPlan.name}?</h2>
            <p>Change takes effect immediately.</p>
            <div className="checkout-review">
              <span><b>Monthly price</b>${pendingPlan.price}.00</span>
              <span><b>Monthly credits</b>{pendingPlan.credits.toLocaleString()}</span>
              <span><b>Next renewal</b>Jun 30, 2026</span>
            </div>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setPendingPlan(null)}>Cancel</button>
              <button className="primary-button compact" onClick={() => { setCurrentPlan(pendingPlan.name); setPendingPlan(null); }}>Confirm plan change</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
