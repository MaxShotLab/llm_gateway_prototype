import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bank,
  Check,
  Coins,
  CreditCard,
  CurrencyCircleDollar,
  DownloadSimple,
  ShieldCheck,
  Wallet,
  X,
} from "@phosphor-icons/react";
import {
  paymentMethods,
  starterFundingTransactions,
} from "../data/billingData";

const creditsPerUsd = 1_000_000;

export function FundingPage() {
  const [amount, setAmount] = useState(25);
  const [methodId, setMethodId] = useState("card");
  const [transactions, setTransactions] = useState(starterFundingTransactions);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptTarget, setReceiptTarget] = useState(null);
  const [spendingLimit, setSpendingLimit] = useState(150);
  const [limitSaved, setLimitSaved] = useState(false);

  const method = paymentMethods.find((item) => item.id === methodId);
  const paymentFee = amount * method.feeRate + method.fixedFee;
  const networkFee = method.networkFee || 0;
  const total = amount + paymentFee + networkFee;
  const credits = amount * creditsPerUsd;

  const paymentAmount = useMemo(() => {
    if (methodId === "alipay") return `¥${(total * 7.24).toFixed(2)}`;
    if (methodId === "usdc") return `${total.toFixed(2)} USDC`;
    return `$${total.toFixed(2)}`;
  }, [methodId, total]);

  const completeMockPayment = () => {
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
    setCheckoutOpen(false);
  };

  return (
    <main className="content-page funding-page">
      <div className="page-heading">
        <div>
          <h1>Top-up</h1>
        </div>
      </div>

      <section className="credit-balance-grid">
        <BalanceCard
          icon={<Wallet size={20} />}
          label="Paid credits"
          value="48,200,000"
          note="From confirmed top-ups"
        />
        <BalanceCard
          icon={<Coins size={20} />}
          label="Free credits"
          value="6,800,000"
          note="Consumed before paid credits"
        />
        <BalanceCard
          icon={<CurrencyCircleDollar size={20} />}
          label="Referral rewards"
          value="500,000"
          note="Promotional credits"
        />
        <BalanceCard
          icon={<CurrencyCircleDollar size={20} />}
          label="Usable balance"
          value="$55.50"
          note="55.5M credits"
        />
      </section>

      <div className="billing-layout">
        <section className="panel purchase-panel">
          <div className="panel-heading">
            <div>
              <h2>Top up credits</h2>
            </div>
          </div>
          <div className="amount-grid">
            {[5, 10, 25, 50, 100, 250].map((value) => (
              <button
                className={amount === value ? "selected" : ""}
                onClick={() => setAmount(value)}
                key={value}
              >
                <strong>${value}</strong>
                <span>{value}M credits</span>
              </button>
            ))}
          </div>

          <label className="field-label">Payment method</label>
          <div className="payment-methods payment-catalog">
            {paymentMethods.map((item) => (
              <button
                className={methodId === item.id ? "selected" : ""}
                onClick={() => setMethodId(item.id)}
                key={item.id}
              >
                {item.id === "card" ? <CreditCard size={22} /> : item.id === "alipay" ? <Bank size={22} /> : <Wallet size={22} />}
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                {methodId === item.id && <Check size={18} />}
              </button>
            ))}
          </div>
        </section>

        <aside className="panel order-summary">
          <span className="eyebrow">Summary</span>
          <h2>{credits.toLocaleString()}</h2>
          <div className="summary-line">
            <span>Credit purchase</span>
            <strong>${amount.toFixed(2)}</strong>
          </div>
          <div className="summary-line">
            <span>Payment fee</span>
            <strong>${paymentFee.toFixed(2)}</strong>
          </div>
          <div className="summary-line">
            <span>Network fee</span>
            <strong>{networkFee ? `$${networkFee.toFixed(2)}` : "None"}</strong>
          </div>
          {method.exchangeRate && (
            <div className="summary-line">
              <span>Exchange rate</span>
              <strong>{method.exchangeRate}</strong>
            </div>
          )}
          <div className="summary-total">
            <span>Payment total</span>
            <strong>{paymentAmount}</strong>
          </div>
          <button className="primary-button" onClick={() => setCheckoutOpen(true)}>
            Continue <ArrowRight size={17} />
          </button>
          <small className="secure-note">
            <ShieldCheck size={15} /> Mock checkout · {method.settlement}
          </small>
        </aside>
      </div>

      <section className="panel account-limit-panel">
        <div>
          <h2>Monthly limit</h2>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setLimitSaved(true);
            window.setTimeout(() => setLimitSaved(false), 1600);
          }}
        >
          <label className="currency-input">
            <i>$</i>
            <input
              type="number"
              min="0"
              value={spendingLimit}
              onChange={(event) => setSpendingLimit(Number(event.target.value))}
              aria-label="Account monthly spending limit"
            />
          </label>
          <button className="secondary-button compact" type="submit">
            {limitSaved ? <><Check size={16} /> Saved</> : "Save limit"}
          </button>
        </form>
      </section>

      <section className="panel funding-history">
        <div className="panel-heading">
          <div>
            <h2>Transactions</h2>
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
