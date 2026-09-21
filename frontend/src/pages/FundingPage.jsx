import { useState } from "react";
import {
  ArrowRight,
  CalendarBlank,
  Check,
  Coins,
  Copy,
  CreditCard,
  CurrencyCircleDollar,
  DownloadSimple,
  ShieldCheck,
  Wallet,
  X,
} from "@phosphor-icons/react";
import {
  billingScenarioOptions,
  createBillingScenario,
  creditsPerUsd,
  getBillingTotals,
  getSubscriptionWindows,
  paymentMethods,
  preferredPaymentMethod,
  starterFundingTransactions,
  subscriptionInvoices,
  subscriptionPlans,
} from "../data/billingData";

export function FundingPage({ billing, setBilling }) {
  const [billingView, setBillingView] = useState("subscription");
  const [amount, setAmount] = useState(25);
  const [methodId, setMethodId] = useState("crypto");
  const [saveCard, setSaveCard] = useState(true);
  const [fundingMode, setFundingMode] = useState("checkout");
  const [depositCopied, setDepositCopied] = useState(false);
  const [transactions, setTransactions] = useState(starterFundingTransactions);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptTarget, setReceiptTarget] = useState(null);
  const [invoiceTarget, setInvoiceTarget] = useState(null);
  const [subscriptionCheckout, setSubscriptionCheckout] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [preferredCard, setPreferredCard] = useState(preferredPaymentMethod);
  const [cardManagerOpen, setCardManagerOpen] = useState(false);

  const method = paymentMethods.find((item) => item.id === methodId);
  const updateAmount = (value) => {
    const nextAmount = Number(value);
    setAmount(Number.isFinite(nextAmount) ? Math.max(nextAmount, 0) : 0);
  };
  const paymentFee = amount * method.feeRate + method.fixedFee;
  const networkFee = method.networkFee || 0;
  const receivedAmount = Math.max(amount - paymentFee - networkFee, 0);
  const credits = receivedAmount * creditsPerUsd;
  const totals = getBillingTotals(billing);
  const subscription = billing.subscription;
  const subscriptionWindows = getSubscriptionWindows(subscription);

  const paymentAmount = `$${amount.toFixed(2)}`;

  const completeMockPayment = () => {
    if (method.id === "card" && saveCard) setPreferredCard(preferredPaymentMethod);
    setTransactions((current) => [
      {
        id: `fund-${Date.now()}`,
        date: "Just now",
        method: method.name,
        paid: paymentAmount,
        fees: `$${(paymentFee + networkFee).toFixed(2)}`,
        credits: credits.toLocaleString(),
        status: "Completed",
        receipt: `RCPT-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      ...current,
    ]);
    setBilling((current) => ({
      ...current,
      scenario: current.scenario === "insufficient"
        ? current.subscription ? "exhausted" : "payg"
        : current.scenario,
      balances: {
        ...current.balances,
        paid: current.balances.paid + credits,
      },
    }));
    setCheckoutOpen(false);
  };

  const activateSubscription = (plan) => {
    setBilling((current) => ({
      ...current,
      scenario: "active",
      subscription: {
        ...plan,
        status: "active",
        used: 0,
        windowUsage: { fiveHour: 0, weekly: 0 },
        renewsAt: "Oct 12, 2026",
        cancelAtPeriodEnd: false,
      },
    }));
    setSubscriptionCheckout(null);
    setShowPlans(false);
  };

  const confirmSubscriptionPlan = (plan) => {
    if (!preferredCard) {
      setCardManagerOpen(true);
      return;
    }
    if (!subscription) {
      activateSubscription(plan);
      return;
    }
    setBilling((current) => ({ ...current, pendingPlan: plan }));
    setSubscriptionCheckout(null);
    setShowPlans(false);
  };

  const changeScenario = (scenario) => {
    setBilling(createBillingScenario(scenario));
    setShowPlans(scenario === "checkout");
  };

  return (
    <main className="content-page funding-page">
      <div className="page-heading">
        <div>
          <h1>Credits</h1>
        </div>
      </div>

      <div className="billing-scope-tabs" role="tablist" aria-label="Billing type">
        <button className={billingView === "payg" ? "active" : ""} onClick={() => setBillingView("payg")} role="tab" aria-selected={billingView === "payg"}>PAYG</button>
        <button className={billingView === "subscription" ? "active" : ""} onClick={() => setBillingView("subscription")} role="tab" aria-selected={billingView === "subscription"}>Subscription</button>
      </div>

      {billingView === "subscription" && (
      <>
      <section className="panel subscription-panel">
        <div className="panel-heading subscription-heading">
          <div>
            <span className="eyebrow">Phase 2 proposal · simulated</span>
            <h2>Subscription</h2>
            <p>Monthly allowance first, then PAYG Credits. Per-request pricing stays the same.</p>
          </div>
          <label className="prototype-scenario">
            <span>Prototype state</span>
            <select value={billing.scenario} onChange={(event) => changeScenario(event.target.value)}>
              {billingScenarioOptions.map((option) => (
                <option value={option.id} key={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {subscription ? (
          <div className="subscription-current">
            <div className="subscription-plan-summary">
              <div>
                <span className={`status-pill ${subscription.status === "past_due" ? "failed" : "success"}`}>
                  <i /> {subscription.status === "past_due" ? "Renewal failed" : subscription.cancelAtPeriodEnd ? "Ends this period" : "Active"}
                </span>
                <h3>{subscription.name}</h3>
                <p>${subscription.priceUsd}/month · {subscription.allowance.toLocaleString()} Credits</p>
              </div>
              <div className="subscription-renewal">
                <CalendarBlank size={18} />
                <span>
                  {subscription.status === "past_due" ? "Payment status" : subscription.cancelAtPeriodEnd ? "Access ends" : "Next renewal"}
                  <strong>{subscription.status === "past_due" ? "Retry required" : subscription.renewsAt}</strong>
                </span>
              </div>
            </div>
            <div className="subscription-progress">
              <div><span>Monthly allowance</span><strong>{totals.subscriptionRemaining.toLocaleString()} remaining</strong></div>
              <i><b style={{ width: `${Math.min((subscription.used / subscription.allowance) * 100, 100)}%` }} /></i>
              <small>{subscription.used.toLocaleString()} of {subscription.allowance.toLocaleString()} Credits used</small>
            </div>
            <div className="subscription-window-grid">
              {subscriptionWindows.map((window) => (
                <article className={window.percent >= 90 ? "warning" : ""} key={window.id}>
                  <span><b>{window.label}</b><strong>{window.percent}%</strong></span>
                  <i><em style={{ width: `${window.percent}%` }} /></i>
                  <small>{window.used.toLocaleString()} of {window.limit.toLocaleString()} · resets {window.reset}</small>
                </article>
              ))}
            </div>
            {subscriptionWindows.some((window) => window.percent >= 90) && <p className="billing-state-note">A subscription usage window is above 90%. An in-app warning has been sent.</p>}
            {billing.scenario === "low" && <p className="billing-state-note">Monthly allowance is low. PAYG Credits will be used automatically after it is exhausted.</p>}
            {billing.scenario === "exhausted" && <p className="billing-state-note">Allowance exhausted. Requests now use PAYG Credits.</p>}
            {billing.scenario === "insufficient" && <p className="billing-state-note danger">No usable Credits remain. Add Credits to continue.</p>}
            {subscription.status === "past_due" && <p className="billing-state-note">No new allowance was created. Existing PAYG Credits remain available.</p>}
            {subscription.cancelAtPeriodEnd && <p className="billing-state-note">Renewal is cancelled. Current allowance remains available through {subscription.renewsAt}.</p>}
            {billing.pendingPlan && <p className="billing-state-note">{billing.pendingPlan.name} begins at the next renewal. No prorated Credits are issued.</p>}
            <div className="subscription-actions">
              {subscription.status === "past_due" ? (
                <button className="primary-button compact" onClick={() => preferredCard ? activateSubscription(subscription) : setCardManagerOpen(true)}>{preferredCard ? "Retry card payment" : "Add renewal card"}</button>
              ) : subscription.cancelAtPeriodEnd ? (
                <button className="secondary-button compact" onClick={() => setBilling((current) => ({ ...current, scenario: "active", subscription: { ...current.subscription, cancelAtPeriodEnd: false } }))}>Resume renewal</button>
              ) : (
                <button className="secondary-button compact" onClick={() => setBilling((current) => ({ ...current, scenario: "cancelled", subscription: { ...current.subscription, cancelAtPeriodEnd: true } }))}>Cancel renewal</button>
              )}
              {subscription.status === "active" && !subscription.cancelAtPeriodEnd && (
                <button className="secondary-button compact" onClick={() => setShowPlans((value) => !value)}>Change plan</button>
              )}
            </div>
          </div>
        ) : (
          <div className="subscription-empty">
            <div><h3>Use PAYG Credits without a plan</h3><p>A subscription only adds a monthly allowance. It is not required to use Maxshot.</p></div>
            <button className="primary-button compact" onClick={() => setShowPlans(true)}>View plans</button>
          </div>
        )}

        {(showPlans || billing.scenario === "checkout") && (
          <div className="subscription-plans">
            {subscriptionPlans.map((plan) => (
              <article key={plan.id}>
                <div><h3>{plan.name}</h3><strong>${plan.priceUsd}<small>/month</small></strong></div>
                <p>{plan.allowance.toLocaleString()} Credits each month</p>
                <p>{plan.limits.fiveHour.toLocaleString()} / 5 hours · {plan.limits.weekly.toLocaleString()} / week</p>
                <button className="secondary-button compact" onClick={() => setSubscriptionCheckout(plan)}>
                  {subscription ? "Choose for next renewal" : "Choose plan"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel subscription-payment-panel">
        <div className="panel-heading">
          <div><h2>Renewal payment method</h2><p>Card details are stored and processed by the payment provider.</p></div>
          <div className="subscription-payment-actions">
            {preferredCard && <button className="secondary-button compact" onClick={() => setPreferredCard(null)}>Remove</button>}
            <button className="secondary-button compact" onClick={() => setCardManagerOpen(true)}>{preferredCard ? "Change card" : "Add card"}</button>
          </div>
        </div>
        {preferredCard ? (
          <div className="saved-payment-method">
            <CreditCard size={22} />
            <span><strong>{preferredCard.brand} •••• {preferredCard.last4}</strong><small>Expires {preferredCard.expires} · Preferred for subscription renewal</small></span>
          </div>
        ) : (
          <p className="billing-state-note">Add a provider-managed card before the next subscription renewal.</p>
        )}
      </section>

      <section className="panel funding-history subscription-billing-history">
        <div className="panel-heading"><div><h2>Subscription billing</h2><p>Invoices are separate from PAYG top-up receipts.</p></div></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th><th>Invoice</th></tr></thead>
            <tbody>
              {subscriptionInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.date}</td><td>{invoice.plan}</td><td>{invoice.amount}</td>
                  <td><span className="status-pill success"><i /> {invoice.status}</span></td>
                  <td><button className="receipt-button" onClick={() => setInvoiceTarget(invoice)}><DownloadSimple size={15} /> {invoice.id}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </>
      )}

      {billingView === "payg" && (
      <>
      <section className="credit-balance-grid">
        <BalanceCard
          icon={<CurrencyCircleDollar size={20} />}
          label="PAYG balance"
          value={totals.payg.toLocaleString()}
          note="Excludes subscription allowance"
        />
        <BalanceCard
          icon={<Wallet size={20} />}
          label="Paid credits"
          value={billing.balances.paid.toLocaleString()}
          note="From confirmed top-ups"
        />
        <BalanceCard
          icon={<Coins size={20} />}
          label="Free credits"
          value={billing.balances.free.toLocaleString()}
          note="Consumed before paid credits"
        />
        <BalanceCard
          icon={<CurrencyCircleDollar size={20} />}
          label="Referral rewards"
          value={billing.balances.referral.toLocaleString()}
          note="Promotional credits"
        />
      </section>

      <div className="funding-mode-tabs" role="tablist" aria-label="Add Credits method">
        <button className={fundingMode === "checkout" ? "active" : ""} onClick={() => setFundingMode("checkout")} role="tab" aria-selected={fundingMode === "checkout"}>Instant Checkout</button>
        <button className={fundingMode === "deposit" ? "active" : ""} onClick={() => setFundingMode("deposit")} role="tab" aria-selected={fundingMode === "deposit"}>Deposit Address</button>
      </div>

      {fundingMode === "checkout" ? (
        <div className="billing-layout">
          <section className="panel purchase-panel">
          <div className="panel-heading">
            <div>
              <h2>Add credits</h2>
              <p>Choose an amount and payment method.</p>
            </div>
          </div>

          <label className="field-label">Amount</label>
          <label className="topup-amount-input">
            <i>$</i>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => updateAmount(event.target.value)}
              aria-label="Custom top-up amount"
            />
          </label>

          <div className="amount-grid">
            {[5, 10, 25, 50, 100, 250].map((value) => (
              <button
                className={amount === value ? "selected" : ""}
                onClick={() => setAmount(value)}
                key={value}
              >
                <strong>${value}</strong>
              </button>
            ))}
          </div>

          <label className="field-label">Payment method</label>
          <div className="payment-methods payment-catalog">
            {paymentMethods.map((item) => (
              <button
                className={methodId === item.id ? "selected" : ""}
                onClick={() => !item.disabled && setMethodId(item.id)}
                key={item.id}
                disabled={item.disabled}
              >
                {item.id === "card" ? <CreditCard size={22} /> : <Wallet size={22} />}
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                {methodId === item.id && <Check size={18} />}
              </button>
            ))}
          </div>
          {methodId === "card" && (
            <label className="save-card-option">
              <input type="checkbox" checked={saveCard} onChange={(event) => setSaveCard(event.target.checked)} />
              <span><strong>Save as preferred card</strong><small>Used for future subscription renewals through the payment provider.</small></span>
            </label>
          )}
          </section>

          <aside className="panel order-summary">
          <span className="eyebrow">Credits added · estimated</span>
          <h2>{credits.toLocaleString()}</h2>
          <p>Credits added</p>
          <div className="summary-line">
            <span>Method</span>
            <strong>{method.name}</strong>
          </div>
          <div className="summary-line">
            <span>You pay</span>
            <strong>{paymentAmount}</strong>
          </div>
          <div className="summary-line">
            <span>Platform fee</span>
            <strong>{method.providerCalculatedFee ? "Calculated by provider" : `$${paymentFee.toFixed(2)} (${method.feeRate * 100}%)`}</strong>
          </div>
          <div className="summary-line">
            <span>Network fee</span>
            <strong>${networkFee.toFixed(2)}</strong>
          </div>
          <div className="summary-total">
            <span>You receive</span>
            <strong>${receivedAmount.toFixed(2)} → {credits.toLocaleString()}</strong>
          </div>
          <button className="primary-button" onClick={() => setCheckoutOpen(true)}>
            Continue <ArrowRight size={17} />
          </button>
          <small className="secure-note">
            <ShieldCheck size={15} /> Mock checkout · {method.settlement}
          </small>
          <small className="spend-only-note">
            Credits are for Maxshot usage only. Withdrawals/refunds are not supported.
          </small>
          </aside>
        </div>
      ) : (
        <section className="panel deposit-address-panel">
          <div>
            <span className="eyebrow">Base Network only</span>
            <h2>Deposit to your dedicated address</h2>
            <p>Transfer supported tokens on Base. Credits are added after on-chain confirmation.</p>
          </div>
          <div className="deposit-address-box">
            <code>0xYOUR_DEDICATED_BASE_ADDRESS</code>
            <button className="secondary-button compact" onClick={() => {
              navigator.clipboard?.writeText("0xYOUR_DEDICATED_BASE_ADDRESS");
              setDepositCopied(true);
              window.setTimeout(() => setDepositCopied(false), 1600);
            }}>
              {depositCopied ? <Check size={16} /> : <Copy size={16} />}
              {depositCopied ? "Copied" : "Copy"}
            </button>
          </div>
          <small>Send Base USDC or Base AIT to this address. Credits are credited automatically.</small>
        </section>
      )}

      <section className="panel funding-history">
        <div className="panel-heading">
          <div>
            <h2>Top-up history</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment method</th>
                <th>Paid</th>
                <th>Fees</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.method}</td>
                  <td>{item.paid}</td>
                  <td>{item.fees}</td>
                  <td>{item.credits}</td>
                  <td><span className="status-pill success"><i /> {item.status}</span></td>
                  <td><button className="receipt-button" onClick={() => setReceiptTarget(item)}><DownloadSimple size={15} /> {item.receipt}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal funding-checkout" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X size={19} /></button>
            <span className="api-modal-icon"><ShieldCheck size={22} /></span>
            <h2 id="checkout-title">Confirm mock payment</h2>
            <p>No funds will be transmitted.</p>
            <div className="checkout-review">
              <span><b>Method</b>{method.name}</span>
              <span><b>Payment</b>{paymentAmount}</span>
              <span><b>Credits</b>{credits.toLocaleString()}</span>
            </div>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setCheckoutOpen(false)}>Cancel</button>
              <button className="primary-button compact" onClick={completeMockPayment}>Confirm mock payment</button>
            </div>
          </section>
        </div>
      )}

      {subscriptionCheckout && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal funding-checkout" role="dialog" aria-modal="true" aria-labelledby="subscription-checkout-title">
            <button className="modal-close" onClick={() => setSubscriptionCheckout(null)} aria-label="Close subscription checkout"><X size={19} /></button>
            <span className="api-modal-icon"><CreditCard size={22} /></span>
            <h2 id="subscription-checkout-title">Confirm example plan</h2>
            <p>Simulated recurring card checkout. No funds will be transmitted.</p>
            <div className="checkout-review">
              <span><b>Plan</b>{subscriptionCheckout.name}</span>
              <span><b>Monthly allowance</b>{subscriptionCheckout.allowance.toLocaleString()} Credits</span>
              <span><b>Usage limits</b>{subscriptionCheckout.limits.fiveHour.toLocaleString()} / 5 hours · {subscriptionCheckout.limits.weekly.toLocaleString()} / week</span>
              <span><b>Monthly payment</b>${subscriptionCheckout.priceUsd}.00</span>
              <span><b>Renewal card</b>{preferredCard ? `${preferredCard.brand} •••• ${preferredCard.last4}` : "Required before activation"}</span>
              <span><b>Referral reward</b>Not eligible</span>
            </div>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setSubscriptionCheckout(null)}>Cancel</button>
              <button className="primary-button compact" onClick={() => confirmSubscriptionPlan(subscriptionCheckout)}>{!preferredCard ? "Add card first" : subscription ? "Schedule plan change" : "Confirm mock subscription"}</button>
            </div>
          </section>
        </div>
      )}

      {receiptTarget && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
            <button className="modal-close" onClick={() => setReceiptTarget(null)} aria-label="Close receipt"><X size={19} /></button>
            <span className="api-modal-icon"><DownloadSimple size={22} /></span>
            <h2 id="receipt-title">Payment receipt</h2>
            <p>{receiptTarget.receipt} · {receiptTarget.date}</p>
            <div className="checkout-review">
              <span><b>Payment method</b>{receiptTarget.method}</span>
              <span><b>Paid</b>{receiptTarget.paid}</span>
              <span><b>Fees</b>{receiptTarget.fees}</span>
              <span><b>Credits purchased</b>{receiptTarget.credits}</span>
              <span><b>Status</b>{receiptTarget.status}</span>
            </div>
            <button className="primary-button" onClick={() => setReceiptTarget(null)}>Done</button>
          </section>
        </div>
      )}

      {invoiceTarget && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal receipt-modal" role="dialog" aria-modal="true" aria-labelledby="invoice-title">
            <button className="modal-close" onClick={() => setInvoiceTarget(null)} aria-label="Close invoice"><X size={19} /></button>
            <span className="api-modal-icon"><DownloadSimple size={22} /></span>
            <h2 id="invoice-title">Subscription invoice</h2>
            <p>{invoiceTarget.id} · {invoiceTarget.date}</p>
            <div className="checkout-review">
              <span><b>Plan</b>{invoiceTarget.plan}</span>
              <span><b>Amount</b>{invoiceTarget.amount}</span>
              <span><b>Payment method</b>{invoiceTarget.method}</span>
              <span><b>Status</b>{invoiceTarget.status}</span>
            </div>
            <button className="primary-button" onClick={() => setInvoiceTarget(null)}>Done</button>
          </section>
        </div>
      )}

      {cardManagerOpen && (
        <div className="modal-backdrop api-modal-backdrop" role="presentation">
          <section className="api-modal funding-checkout" role="dialog" aria-modal="true" aria-labelledby="card-manager-title">
            <button className="modal-close" onClick={() => setCardManagerOpen(false)} aria-label="Close card manager"><X size={19} /></button>
            <span className="api-modal-icon"><CreditCard size={22} /></span>
            <h2 id="card-manager-title">Manage renewal card</h2>
            <p>Simulated provider-managed payment method. No card data is entered or stored by Maxshot.</p>
            <div className="checkout-review">
              <span><b>Current</b>{preferredCard ? `${preferredCard.brand} •••• ${preferredCard.last4}` : "No saved card"}</span>
              <span><b>Example replacement</b>Mastercard •••• 4444</span>
            </div>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setCardManagerOpen(false)}>Cancel</button>
              <button className="primary-button compact" onClick={() => {
                setPreferredCard({ brand: "Mastercard", last4: "4444", expires: "10/30" });
                setCardManagerOpen(false);
              }}>Use example provider card</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function BalanceCard({ icon, label, value, note }) {
  return (
    <article>
      <span>{icon}</span>
      <div><small>{label}</small><strong>{value}</strong><p>{note}</p></div>
    </article>
  );
}
