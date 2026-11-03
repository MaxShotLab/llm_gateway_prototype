import { useState } from "react";
import "./pricing.css";

const sampleModels = {
  Text: [
    { id: "aion-labs/aion-3.5-mini", input: 0.70, output: 1.40, cache: 0.18, unit: "1M tokens", detail: "Text model with input, output, and cache-read rates." },
    { id: "anthropic/claude-sonnet-4.6", input: 3, output: 15, cache: 0.30, unit: "1M tokens", detail: "Text model with multiple live providers; sample rates are illustrative." },
    { id: "minimax/minimax-m3", input: 0.30, output: 1.20, cache: 0.06, unit: "1M tokens", detail: "Text model with input, output, and cache-read rates." },
  ],
  Image: [
    { id: "bytedance-seed/seedream-5-0-flash", abilities: ["T2I", "I2I"], input: 0, output: 0.018, unit: "image", detail: "Image output is priced per generated image." },
    { id: "black-forest-labs/flux-3-image", abilities: ["T2I", "I2I"], input: null, output: 0.041, unit: "image", from: true, detail: "Starting rate; resolution can change the final price." },
    { id: "black-forest-labs/flux.2-max", abilities: ["T2I", "I2I"], input: null, output: 0.07, unit: "megapixel", detail: "This model is priced per megapixel, not per image." },
  ],
  Video: [
    { id: "alibaba/wan-3.0-prime", abilities: ["T2V", "I2V"], input: null, output: 0.068, unit: "second", from: true, detail: "Starting rate; mode and resolution can change the final price." },
    { id: "alibaba/wan-3.0", abilities: ["T2V", "I2V"], input: null, output: 0.05, unit: "second", from: true, detail: "Starting rate; mode and resolution can change the final price." },
    { id: "alibaba/wan-2.7", abilities: ["T2V", "I2V"], input: null, output: 0.10, unit: "second", detail: "Video output is priced per generated second." },
  ],
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 });

function price(value, unit, from = false) {
  if (value === null) return "-";
  if (value === 0) return "Free";
  return `${from ? "from " : ""}${usd.format(value)} / ${unit}`;
}

export function PricingPage() {
  const [type, setType] = useState("Text");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(sampleModels.Text[0].id);
  const [copiedId, setCopiedId] = useState("");
  const rows = sampleModels[type].filter((model) => model.id.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = rows.find((model) => model.id === selectedId) || rows[0];

  const copyId = async (id) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
  };

  return (
    <main className="content-page pricing-page">
      <div className="pricing-heading"><h1>Pricing</h1><span>Catalog sample · Nov 2, 2026</span></div>
      <div className="pricing-layout">
        <section className="pricing-catalog" aria-label="Models">
          <div className="pricing-catalog-heading"><h2>Models</h2><input type="search" aria-label="Search models" placeholder="Search models" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="pricing-tabs" role="tablist" aria-label="Pricing">
            {Object.keys(sampleModels).map((option) => <button key={option} role="tab" aria-selected={type === option} className={type === option ? "active" : ""} onClick={() => { setType(option); setQuery(""); setSelectedId(sampleModels[option][0].id); }}>{option}</button>)}
          </div>
          <p className="pricing-disclaimer">Representative live models and sampled rates. 1 Credit = $0.000001. Actual catalog, options, and charges may change; check live Pricing before use.</p>
          <div className="pricing-table-wrap"><table>
            <thead><tr><th>Model ID</th><th>{type === "Text" ? "Input / 1M" : "Abilities"}</th><th>{type === "Text" ? "Output / 1M" : "Input"}</th><th>{type === "Text" ? "Cache read / 1M" : "Output"}</th><th><span className="sr-only">Copy</span></th></tr></thead>
            <tbody>{rows.map((model) => <tr key={model.id} className={selected?.id === model.id ? "selected" : ""}>
              <td><button className="pricing-model-select" onClick={() => setSelectedId(model.id)}>{model.id}</button></td>
              <td>{type === "Text" ? price(model.input, model.unit) : model.abilities.join(" · ")}</td>
              <td>{type === "Text" ? price(model.output, model.unit) : price(model.input, model.unit)}</td>
              <td>{type === "Text" ? price(model.cache, model.unit) : price(model.output, model.unit, model.from)}</td>
              <td><button className="pricing-copy" onClick={() => copyId(model.id)} aria-label={`Copy ${model.id}`}>{copiedId === model.id ? "Copied" : "Copy"}</button></td>
            </tr>)}</tbody>
          </table>{rows.length === 0 && <p className="pricing-empty">No sample models match this search.</p>}</div>
        </section>
        <aside className="pricing-detail" aria-label="Model details">
          <h2>Model details</h2>
          {selected ? <><h3>{selected.id.split("/")[1]}</h3><code>{selected.id}</code><p>{selected.detail}</p>
            {selected.abilities && <div className="pricing-abilities">{selected.abilities.map((ability) => <span key={ability}>{ability}</span>)}</div>}
            <h4>Pricing</h4>
            {selected.input !== null && <div className="pricing-detail-row"><span>Input</span><strong>{price(selected.input, selected.unit)}</strong></div>}
            <div className="pricing-detail-row"><span>Output</span><strong>{price(selected.output, selected.unit, selected.from)}</strong></div>
            {type === "Text" && <div className="pricing-detail-row"><span>Cache read</span><strong>{price(selected.cache, selected.unit)}</strong></div>}
            <p className="pricing-credit-equivalent">Output rate: {Math.round(selected.output * 1_000_000).toLocaleString()} Credits / {selected.unit}{selected.from ? " and up" : ""}</p>
            <button className="pricing-copy-detail" onClick={() => copyId(selected.id)}>{copiedId === selected.id ? "Copied ID" : "Copy ID"}</button>
          </> : <p>Select a sample model to see its rates.</p>}
        </aside>
      </div>
    </main>
  );
}
