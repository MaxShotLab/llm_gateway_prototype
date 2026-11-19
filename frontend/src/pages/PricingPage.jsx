import { useState } from "react";
import { modelCatalog } from "../data/providerCatalog";
import "./pricing.css";

const modelTypes = [...new Set(modelCatalog.map((model) => model.type))];
const firstAvailableModel = (type) => modelCatalog.find((model) => model.type === type && model.providers.some((provider) => provider.available)) || modelCatalog.find((model) => model.type === type);

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 });

const units = { per_1m_tokens: "1M tokens", per_image: "image", per_megapixel: "megapixel", per_second: "second" };
const labels = { input_tokens: "Input", output_tokens: "Output", cache_read_tokens: "Cache read", input_image: "Input", output_image: "Output", output_video: "Output" };

function price(component, from = false) {
  if (!component) return "-";
  if (Number(component.amount) === 0) return "Free";
  return `${from ? "from " : ""}${usd.format(Number(component.amount))} / ${units[component.unit]}`;
}

function catalogPrice(model, kind) {
  if (model.providers.every((provider) => !provider.rateCard.components.some((component) => component.kind === kind))) return "-";
  if (model.providers.length > 1) return "See provider rates";
  const components = model.providers[0].rateCard.components.filter((component) => component.kind === kind);
  if (!components.length) return "-";
  return price(components.reduce((lowest, current) => Number(current.amount) < Number(lowest.amount) ? current : lowest), components.length > 1);
}

export function PricingPage({ initialModelId }) {
  const initialModel = modelCatalog.find((model) => model.id === initialModelId) || firstAvailableModel(modelTypes[0]);
  const [type, setType] = useState(initialModel.type);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialModel.id);
  const [copiedId, setCopiedId] = useState("");
  const rows = modelCatalog.filter((model) => model.type === type).filter((model) => model.id.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = rows.find((model) => model.id === selectedId) || rows[0];

  const copyId = async (id) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
  };

  return (
    <main className="content-page pricing-page">
      <div className="pricing-heading"><h1>Models</h1><span>Compare provider prices · sample data</span></div>
      <div className="pricing-layout">
        <section className="pricing-catalog" aria-label="Models">
          <div className="pricing-catalog-heading"><h2>Models</h2><input type="search" aria-label="Search models" placeholder="Search models" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="pricing-tabs" role="tablist" aria-label="Pricing">
            {modelTypes.map((option) => <button key={option} role="tab" aria-selected={type === option} className={type === option ? "active" : ""} onClick={() => { setType(option); setQuery(""); setSelectedId(firstAvailableModel(option).id); }}>{option}</button>)}
          </div>
          <p className="pricing-disclaimer">Illustrative models, provider offerings, and customer rates. Admission-pending offerings are not routable. Prices may differ by provider; open a model to compare complete rate cards. 1 Credit = $0.000001. The selected route and maximum charge must be quoted before a request.</p>
          <div className="pricing-table-wrap"><table>
            <thead><tr><th>Model ID</th><th>{type === "Text" ? "Input / 1M" : "Abilities"}</th><th>{type === "Text" ? "Output / 1M" : "Input"}</th><th>{type === "Text" ? "Cache read / 1M" : "Output"}</th><th>Providers</th><th><span className="sr-only">Copy</span></th></tr></thead>
            <tbody>{rows.map((model) => <tr key={model.id} className={selected?.id === model.id ? "selected" : ""}>
              <td><button className="pricing-model-select" onClick={() => setSelectedId(model.id)}>{model.id}</button>{!model.providers.some((provider) => provider.admitted) && <small className="pricing-pending">Admission pending · example</small>}</td>
              {type === "Text" && model.providers.length > 1 ? <td colSpan="3">Compare provider rate cards in model details</td> : <>
                <td>{type === "Text" ? catalogPrice(model, "input_tokens") : model.abilities.join(" · ")}</td>
                <td>{type === "Text" ? catalogPrice(model, "output_tokens") : catalogPrice(model, "input_image")}</td>
                <td>{type === "Text" ? catalogPrice(model, "cache_read_tokens") : catalogPrice(model, type === "Image" ? "output_image" : "output_video")}</td>
              </>}
              <td>{model.providers.length}</td>
              <td><button className="pricing-copy" onClick={() => copyId(model.id)} aria-label={`Copy ${model.id}`}>{copiedId === model.id ? "Copied" : "Copy"}</button></td>
            </tr>)}</tbody>
          </table>{rows.length === 0 && <p className="pricing-empty">No sample models match this search.</p>}</div>
        </section>
        <aside className="pricing-detail" aria-label="Model details">
          <h2>Model details</h2>
          {selected ? <><h3>{selected.id.split("/")[1]}</h3><code>{selected.id}</code><p>{selected.detail}</p>
            {selected.abilities && <div className="pricing-abilities">{selected.abilities.map((ability) => <span key={ability}>{ability}</span>)}</div>}
            <h4>Provider prices <span className="pricing-route-count">{selected.providers.length} offerings</span></h4>
            <p>Illustrative customer rates. Each provider has its own rate card. The selected route and maximum charge must be quoted before a request.</p>
            <div className="pricing-provider-list">{selected.providers.map((provider) => <div key={provider.id} className="pricing-provider-card">
              <strong>{provider.name} · {provider.admitted ? provider.available ? "Available" : "Unavailable" : "Admission pending"}</strong>
              {provider.rateCard.components.map((component) => <div key={`${component.kind}-${component.condition || "base"}`} className="pricing-detail-row"><span>{labels[component.kind]}{component.condition ? ` · ${component.condition}` : ""}</span><b>{price(component)}</b></div>)}
              <small>Rate {provider.rateCard.rateCardVersion} · effective {provider.rateCard.effectiveAt.slice(0, 10)}</small>
            </div>)}</div>
            <button className="pricing-copy-detail" onClick={() => copyId(selected.id)}>{copiedId === selected.id ? "Copied ID" : "Copy ID"}</button>
          </> : <p>Select a sample model to see its rates.</p>}
        </aside>
      </div>
    </main>
  );
}
