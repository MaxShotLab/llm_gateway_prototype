import { useEffect, useMemo, useRef, useState } from "react";

const ABILITIES = {
  image: [["t2i", "T2I"], ["i2i", "I2I"]],
  video: [["t2v", "T2V"], ["i2v", "I2V"], ["v2v", "V2V"]],
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(Number(value) * 1_000));
}

function formatCount(value) {
  if (!value) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatDurations(values) {
  if (!values.length) return "—";
  const ordered = [...values].map(Number).sort((a, b) => a - b);
  return ordered.length > 2 && ordered.every((value, index) => index === 0 || value === ordered[index - 1] + 1)
    ? `${ordered[0]}–${ordered.at(-1)}s`
    : `${values.join(", ")}s`;
}

function ModelList({ models, type }) {
  if (!models.length) return <p className="media-empty">No selected models have this ability.</p>;
  return <div className="media-list">{models.map((model) => (
    <article className="media-model" key={model.id}>
      <div className="media-model-top">
        <div><strong>{model.name || model.id}</strong><code>{model.id}</code></div>
        <span className="media-score" title="Selection score within this medium">{model.score}</span>
      </div>
      <div className="media-badges">
        {ABILITIES[type].filter(([key]) => model.abilities[key]).map(([key, label]) => <span key={key}>{label}</span>)}
        {type === "video" && model.inputModalities?.includes("audio") ? <span className="media-audio">Audio input</span> : null}
        {type === "video" ? <span className="media-audio">{model.generateAudio === true ? "Audio output" : model.generateAudio === false ? "No audio output" : "Audio unreported"}</span> : null}
      </div>
      <div className="media-model-facts">
        {type === "image" ? <>
          <span>Weekly #{model.weeklyRank ?? "—"} · {formatCount(model.weeklyTokens)} tokens</span>
          <span>Monthly #{model.monthlyRank ?? "—"} · {formatCount(model.monthlyTokens)} tokens</span>
        </> : <>
          <span>Durations {formatDurations(model.supportedDurations)}</span>
          <span>Resolution {model.supportedResolutions.join(", ") || "—"}</span>
        </>}
        <span>Listed {formatDate(model.created)}</span>
      </div>
      <details className="media-details">
        <summary>Model details</summary>
        {model.description ? <p>{model.description}</p> : null}
        {type === "image" ? <>
          <p>Catalog image-output token rate: {model.imageOutputPrice == null ? "—" : Number(model.imageOutputPrice) === 0 ? "0 in this field; not proof of free image generation" : `$${(Number(model.imageOutputPrice) * 1_000_000).toFixed(2)} per 1M output image tokens`}</p>
          <p>Dedicated Image API: {model.inImageApi ? "Listed" : "Not listed"}</p>
          {model.inImageApi ? <p>Image API parameters: {Object.keys(model.supportedParameters).join(", ") || "—"}</p> : null}
        </> : <>
          <p>First/last frame support: {model.supportedFrameImages.join(", ") || "—"}</p>
          <p>OpenRouter pricing SKUs: {Object.entries(model.pricingSkus).map(([key, value]) => `${key}: ${value}`).join(" · ") || "—"}</p>
        </>}
      </details>
    </article>
  ))}</div>;
}

export default function MediaStrategyPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("image");
  const [ability, setAbility] = useState("all");
  const started = useRef(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/media-strategy");
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Media strategy request failed.");
      setData(payload);
      if (payload.error) setError(new Error(payload.error));
    } catch (nextError) {
      setError(nextError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void load();
  }, []);

  const selected = data?.[type] ?? [];
  const visible = useMemo(() => ability === "all" ? selected : selected.filter((model) => model.abilities[ability]), [selected, ability]);
  const exportJson = () => {
    if (!data) return;
    const json = JSON.stringify({ image: data.image, video: data.video, dataUpdatedAt: data.dataUpdatedAt }, null, 2);
    const url = URL.createObjectURL(new Blob([`${json}\n`], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "media-models.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <div className="media-page">
    <header className="gateway-page-header">
      <div><h1>Media Strategy</h1><p>OpenRouter image and video generation · separate from chat selection</p></div>
      <div className="gateway-header-status"><span>{data ? `Updated ${new Date(data.dataUpdatedAt).toLocaleString()}` : "Waiting for data"}</span><button className="button" type="button" onClick={exportJson} disabled={!data}>Export JSON</button><button className="button button-primary" type="button" onClick={load} disabled={loading}>{loading ? "Loading…" : "Refresh"}</button></div>
    </header>
    <div className="media-content">
      {error ? <div className="inline-error" role="alert">{error.message}</div> : null}
      <div className="media-intro"><span>Image {data?.image.length ?? 0}/15 · Video {data?.video.length ?? 0}/10</span><span>OpenRouter API catalog · 5-minute server cache</span></div>
      <div className="tabs" role="tablist" aria-label="Media type">
        <button type="button" role="tab" aria-selected={type === "image"} onClick={() => { setType("image"); setAbility("all"); }}>Image models</button>
        <button type="button" role="tab" aria-selected={type === "video"} onClick={() => { setType("video"); setAbility("all"); }}>Video models</button>
      </div>
      {data ? <>
        <div className="media-filter" aria-label="Filter by ability">
          <button type="button" aria-pressed={ability === "all"} onClick={() => setAbility("all")}>All {selected.length}</button>
          {ABILITIES[type].map(([key, label]) => <button key={key} type="button" aria-pressed={ability === key} onClick={() => setAbility(key)}>{label} {selected.filter((model) => model.abilities[key]).length}</button>)}
        </div>
        <p className="media-method">{type === "image" ? `Image score: 45% weekly usage + 25% monthly usage + 20% recency + 10% T2I/I2I breadth. Usage through ${data.usageWindow.end}.` : "Video score: 60% recency + 25% T2V/I2V/V2V breadth + 15% supported specs. OpenRouter does not provide a usable video popularity order through these APIs."} Abilities come from listed input/output modalities; no generation probes.</p>
        <ModelList models={visible} type={type} />
      </> : loading ? <div className="loading-state">Loading live media models…</div> : null}
    </div>
  </div>;
}
