import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, DownloadSimple, MagicWand, Plus, ShareNetwork, Trash, UploadSimple } from "@phosphor-icons/react";
import { getBillingTotals } from "../data/billingData";
import "./studio.css";

const paths = {
  Image: ["Text to Image", "Image to Image"],
  Video: ["Text to Video", "Image to Video"],
};

const models = {
  Image: ["Seedream 5.0 Flash", "Seedream 4.5", "Seedream 5.0 Pro", "Grok Imagine Image 2.0", "FLUX 3 Image", "Recraft V4"],
  Video: ["Seedance 2.0 Mini", "Veo 3.1 Fast", "Wan 3.0", "Seedance 2.5", "Veo 3.1 Lite"],
};

const soundtrackModels = new Set(["Seedance 2.0 Mini", "Seedance 2.5", "Wan 3.0"]);

const initialCreations = [
  { id: "mine-1", kind: "Image", path: "Text to Image", title: "Quiet city at dusk", creator: "You", model: "Seedream 5.0 Flash", prompt: "A quiet city street at dusk, warm light reflected on wet pavement.", status: "Generated", art: 1, date: "Nov 2, 2026", resolution: "2K", references: [] },
  { id: "mine-2", kind: "Video", path: "Image to Video", title: "Light through the window", creator: "You", model: "Seedance 2.0 Mini", prompt: "Slow camera movement as afternoon light crosses the room.", status: "Pending", art: 2, date: "Nov 2, 2026", resolution: "720p", duration: "4s", references: ["room-reference.png"] },
  { id: "mine-3", kind: "Video", path: "Text to Video", title: "Evening skyline", creator: "You", model: "Wan 3.0", prompt: "An evening skyline in soft rain.", status: "Failed", art: 3, date: "Nov 1, 2026", resolution: "720p", duration: "4s", references: [] },
];

export const platformWorks = [
  { id: "discover-1", kind: "Image", path: "Text to Image", title: "Paper city", creator: "Maxshot demo", model: "Seedream 5.0 Flash", prompt: "A miniature paper city in the early morning, soft shadows and warm windows.", mode: "method", status: "Generated", art: 4, date: "Oct 28, 2026", resolution: "2K" },
  { id: "discover-2", kind: "Video", title: "Shared work", creator: "Maxshot demo", mode: "result", status: "Generated", art: 5 },
  { id: "discover-3", kind: "Image", path: "Text to Image", title: "Amber still life", creator: "Maxshot demo", model: "Recraft V4", prompt: "An amber glass vessel and folded linen on a stone table.", mode: "method", status: "Generated", art: 6, date: "Oct 26, 2026", resolution: "2K" },
  { id: "discover-4", kind: "Video", path: "Text to Video", title: "Night transit", creator: "Maxshot demo", model: "Wan 3.0", prompt: "A tram moves through a rainy city at night, cinematic reflections.", mode: "method", status: "Generated", art: 7, date: "Oct 25, 2026", resolution: "720p", duration: "4s" },
  { id: "discover-5", kind: "Image", title: "Shared work", creator: "Maxshot demo", mode: "result", status: "Generated", art: 8 },
  { id: "discover-6", kind: "Image", path: "Text to Image", title: "Studio flowers", creator: "Maxshot demo", model: "Seedream 4.5", prompt: "Sculptural flowers under soft studio lighting.", mode: "method", status: "Generated", art: 9, date: "Oct 23, 2026", resolution: "2K" },
];

function Artwork({ item }) {
  return <div className={`studio-art studio-art-${item.art}`}><span>{item.kind === "Video" ? "▶" : "✦"}</span></div>;
}

function GalleryCard({ item, onOpen, onTry }) {
  return (
    <article className="studio-gallery-card">
      <button className="studio-card-open" onClick={() => onOpen(item)} aria-label={`Open ${item.title}`}>
        <Artwork item={item} />
        {item.mode !== "result" && <span className="studio-kind-tag">{item.kind}</span>}
        {item.status !== "Generated" && <span className={`studio-status-tag ${item.status.toLowerCase()}`}>{item.status}</span>}
      </button>
      <div className="studio-card-caption">
        <div><strong>{item.title}</strong><small>{item.mode === "result" ? item.creator : `${item.creator} · ${item.model}`}</small></div>
        {item.status === "Generated" && <button onClick={() => onTry(item)} aria-label={`${item.mode === "result" ? "Create your own" : "Try this"}: ${item.title}`}>{item.mode === "result" ? "Create your own" : "Try this"}</button>}
      </div>
    </article>
  );
}

export function StudioPage({ billing, canGenerateAccount, onLoginRequired, seed, onSeedConsumed, publicWorks, onPublish, onUnshare, onOpenShare }) {
  const [kind, setKind] = useState("Image");
  const [path, setPath] = useState("Text to Image");
  const [model, setModel] = useState(models.Image[0]);
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1K");
  const [aspect, setAspect] = useState("16:9");
  const [duration, setDuration] = useState(4);
  const [audio, setAudio] = useState("Model audio");
  const [soundtrack, setSoundtrack] = useState("");
  const [strength, setStrength] = useState("Medium");
  const [firstLast, setFirstLast] = useState(false);
  const [references, setReferences] = useState([]);
  const [firstFrame, setFirstFrame] = useState("");
  const [lastFrame, setLastFrame] = useState("");
  const [creations, setCreations] = useState(() => JSON.parse(localStorage.getItem("maxshot-demo-creations") || "null") || initialCreations);
  const [mineFilter, setMineFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [discoverFilter, setDiscoverFilter] = useState("All");
  const [detailRef, setDetailRef] = useState(null);
  const [notice, setNotice] = useState("");
  const [sourceAttribution, setSourceAttribution] = useState("");
  const [publishTarget, setPublishTarget] = useState(null);
  const [publishMode, setPublishMode] = useState("result");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(({ handle }) => clearTimeout(handle)), []);
  useEffect(() => { localStorage.setItem("maxshot-demo-creations", JSON.stringify(creations)); }, [creations]);
  useEffect(() => {
    if (!seed) return;
    setKind(seed.kind);
    setPath(seed.mode === "result" ? paths[seed.kind][0] : seed.path);
    setModel(seed.mode === "result" ? models[seed.kind][0] : seed.model);
    setPrompt(seed.mode === "result" ? "" : seed.prompt);
    setResolution(seed.resolution || (seed.kind === "Image" ? "1K" : "720p"));
    setReferences([]);
    setFirstLast(false);
    setFirstFrame("");
    setLastFrame("");
    setSourceAttribution(seed.source || "Shared method");
    setNotice(seed.mode === "result" ? "Start a new creation. No source inputs were copied." : models[seed.kind].includes(seed.model) ? `${seed.source || "Shared method"} loaded. Review the settings before generating.` : `${seed.model} is unavailable. Choose another model before generating.`);
    onSeedConsumed();
  }, [seed, onSeedConsumed]);

  const detail = detailRef && (detailRef.source === "mine" ? (canGenerateAccount ? creations : []) : publicWorks).find((item) => item.id === detailRef.id);
  const published = detail && publicWorks.find((item) => item.id === detail.id && item.creator === "You");
  const canShareMethod = publishTarget && publishTarget.path.startsWith("Text to") && publishTarget.references.length === 0 && !publishTarget.usesSoundtrack;
  const totals = getBillingTotals(billing);
  const isReferencePath = path.startsWith("Image to");
  const modelUnavailable = !models[kind].includes(model);
  const needsReferences = isReferencePath && (firstLast && kind === "Video" ? !firstFrame || !lastFrame : references.length === 0);
  const baseCost = kind === "Video" ? 300_000 : 120_000;
  const estimate = Math.round(baseCost * (resolution === "2K" || resolution === "1080p" ? 1.5 : 1) * (kind === "Video" ? duration / 4 : 1));
  const hold = Math.ceil(estimate * 1.15);
  const available = totals.premiumRemaining + totals.promotionalCredits + totals.dollarBalanceCents * 10_000;
  const canGenerate = Boolean(prompt.trim()) && !modelUnavailable && !needsReferences && (audio !== "Upload soundtrack" || Boolean(soundtrack)) && prompt.length <= 5000 && (!canGenerateAccount || available >= hold);

  const switchKind = (next) => {
    setKind(next);
    setPath(paths[next][0]);
    setModel(models[next][0]);
    setResolution(next === "Image" ? "1K" : "720p");
    setAudio("Model audio");
    setReferences([]);
    setFirstLast(false);
    setFirstFrame("");
    setLastFrame("");
    setSoundtrack("");
    setNotice("");
    setSourceAttribution("");
  };

  const tryThis = (item, source = "discover") => {
    if (item.mode === "result") {
      switchKind(item.kind);
      setPrompt("");
      setDetailRef(null);
      setSourceAttribution(`Share: ${item.id}`);
      setNotice("Start a new creation. No source inputs were copied.");
      return;
    }
    setKind(item.kind);
    setPath(item.path);
    setModel(item.model);
    setPrompt(item.prompt);
    setResolution(item.resolution || (item.kind === "Image" ? "1K" : "720p"));
    setAudio("Model audio");
    setSoundtrack("");
    setReferences([]);
    setFirstLast(false);
    setFirstFrame("");
    setLastFrame("");
    setDetailRef(null);
    setSourceAttribution(source === "mine" ? "" : `Share: ${item.id}`);
    setNotice(!models[item.kind].includes(item.model) ? `${item.model} is unavailable. Choose another model before generating.` : item.references?.length ? "Reference files belong to the original creator. Upload your own to try this." : `Loaded ${source === "mine" ? "your" : "the creator's"} prompt and settings. Review them before generating.`);
    document.querySelector(".studio-page")?.scrollIntoView({ behavior: "smooth" });
  };

  const generate = () => {
    if (!canGenerate) return;
    if (!canGenerateAccount) { onLoginRequired(); return; }
    const id = `mine-${Date.now()}`;
    const item = {
      id, kind, path, model, prompt: prompt.trim(), title: prompt.trim().slice(0, 34), creator: "You",
      status: "Pending", art: (creations.length % 9) + 1, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      resolution, duration: kind === "Video" ? `${duration}s` : undefined,
      references: isReferencePath && firstLast && kind === "Video" ? [firstFrame, lastFrame] : references,
      usesSoundtrack: audio === "Upload soundtrack", source: sourceAttribution || undefined,
    };
    setCreations((current) => [item, ...current]);
    setMineFilter("All");
    setStatusFilter("All status");
    setDetailRef({ source: "mine", id });
    setPrompt("");
    setReferences([]);
    setFirstFrame("");
    setLastFrame("");
    setSoundtrack("");
    setNotice(`Simulation only. No provider request or balance change was made.${sourceAttribution ? ` Source: ${sourceAttribution}.` : ""}`);
    const handle = setTimeout(() => {
      const generated = { ...item, status: "Generated" };
      setCreations((current) => current.map((entry) => entry.id === id ? generated : entry));
      timers.current = timers.current.filter((timer) => timer.id !== id);
    }, 1400);
    timers.current.push({ id, handle });
  };

  const filteredCreations = creations.filter((item) => (mineFilter === "All" || item.kind === mineFilter) && (statusFilter === "All status" || item.status === statusFilter));
  const filteredDiscover = publicWorks.filter((item) => discoverFilter === "All" || item.kind === discoverFilter);

  const openPublish = (item) => {
    if (item.usesSoundtrack) return;
    setPublishTarget(item);
    setPublishMode(publicWorks.find((work) => work.id === item.id)?.mode || "result");
    setRightsConfirmed(false);
  };

  const publish = () => {
    if (!rightsConfirmed || !publishTarget) return;
    const mode = canShareMethod ? publishMode : "result";
    onPublish({
      id: publishTarget.id, kind: publishTarget.kind, title: mode === "result" ? `Shared ${publishTarget.kind.toLowerCase()}` : publishTarget.title, creator: publishTarget.creator,
      model: publishTarget.model, art: publishTarget.art, date: publishTarget.date, resolution: publishTarget.resolution,
      duration: publishTarget.duration, status: "Generated", mode,
      ...(mode === "method" ? { path: publishTarget.path, prompt: publishTarget.prompt } : {}),
    });
    setPublishTarget(null);
    setNotice("Published with your selected disclosure mode. It now appears in Discover.");
  };

  return (
    <main className="content-page studio-page">
      {detail ? (
        <div className="studio-detail">
          <button className="studio-back" onClick={() => setDetailRef(null)}><ArrowLeft size={16} /> Back to Studio</button>
          <div className="studio-detail-heading">
            <div><h1>{detail.title}</h1><p>{detail.mode === "result" ? `By ${detail.creator}` : `${detail.kind} · ${detail.model} · by ${detail.creator}`}</p>{detail.mode !== "result" && <small>{detail.date} · {detail.resolution}{detail.duration ? ` · ${detail.duration}` : ""} · {detail.status}</small>}</div>
            <div className="studio-detail-actions">
              {detail.status === "Generated" && detail.mode !== "result" && <button onClick={() => tryThis(detail, detailRef.source)}><Plus size={15} /> Try this</button>}
              {detailRef.source === "mine" && detail.status === "Generated" && <button disabled={detail.usesSoundtrack} title={detail.usesSoundtrack ? "Sharing uploaded audio is deferred until rights handling is defined" : undefined} onClick={() => openPublish(detail)}><ShareNetwork size={15} /> {detail.usesSoundtrack ? "Sharing unavailable" : published ? "Edit sharing" : "Share"}</button>}
              {detailRef.source === "mine" && published && <button onClick={() => onUnshare(detail.id)}>Unshare</button>}
              {detailRef.source === "discover" && <button onClick={() => onOpenShare(detail.id)}>Public preview</button>}
              {detailRef.source === "mine" && detail.kind === "Image" && detail.status === "Generated" && <button onClick={() => {
                switchKind("Video"); setPath("Image to Video"); setReferences([`From My Creations: ${detail.title}`]); setDetailRef(null);
                setNotice("Your image is selected as the video reference. Add a prompt to continue.");
              }}>Animate</button>}
              {detailRef.source === "mine" && <button disabled title="Mock media has no downloadable file"><DownloadSimple size={15} /> Download</button>}
              {detailRef.source === "mine" && <button className="studio-delete" onClick={() => {
                if (window.confirm("Delete this mock creation?")) {
                  timers.current.filter((timer) => timer.id === detail.id).forEach(({ handle }) => clearTimeout(handle));
                  timers.current = timers.current.filter((timer) => timer.id !== detail.id);
                  setCreations((current) => current.filter((item) => item.id !== detail.id));
                  onUnshare(detail.id);
                  setDetailRef(null);
                }
              }}><Trash size={15} /> Delete</button>}
            </div>
          </div>
          <Artwork item={detail} />
          {detail.status === "Pending" && <p className="studio-detail-note">Generating... this mock job will complete shortly.</p>}
          {detail.status === "Failed" && <p className="studio-detail-note">This sample job failed. No Credits were charged.</p>}
          {detail.prompt && <div className="studio-prompt-detail"><small>PROMPT</small><p>{detail.prompt}</p></div>}
          {detail.references?.length > 0 && <p className="studio-detail-note">Reference used: {detail.references.join(", ")}</p>}
        </div>
      ) : (
        <>
          <div className="studio-page-intro"><div><span>STUDIO · INTERACTIVE PROTOTYPE</span><h1>Create with image and video models</h1></div><p>Generation, gallery, and pricing states below are simulated. Subscription and PAYG rules remain as shown in Credits.</p></div>
          {notice && <div className="studio-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notice">×</button></div>}
          <div className="studio-switch" role="tablist" aria-label="Media type">
            {Object.keys(paths).map((option) => <button key={option} role="tab" aria-selected={kind === option} className={kind === option ? "active" : ""} onClick={() => switchKind(option)}>{option}</button>)}
          </div>
          <section className="studio-composer" aria-label="Studio composer">
            <div className="studio-path-tabs" role="tablist" aria-label="Generation path">
              {paths[kind].map((option) => <button key={option} role="tab" aria-selected={path === option} className={path === option ? "active" : ""} onClick={() => { setPath(option); setReferences([]); setFirstLast(false); setFirstFrame(""); setLastFrame(""); }}>{option}</button>)}
            </div>
            {isReferencePath && <div className="studio-reference-area">
              {kind === "Video" && <label className="studio-toggle"><input type="checkbox" checked={firstLast} onChange={(event) => setFirstLast(event.target.checked)} /> First & last frame</label>}
              {firstLast && kind === "Video" ? <div className="studio-frame-pair">
                <label>First frame<input type="file" accept="image/*" onChange={(event) => setFirstFrame(event.target.files?.[0]?.name || "")} /><span>{firstFrame || "Choose image"}</span></label>
                <label>Last frame<input type="file" accept="image/*" onChange={(event) => setLastFrame(event.target.files?.[0]?.name || "")} /><span>{lastFrame || "Choose image"}</span></label>
              </div> : <>
                <label className="studio-upload"><UploadSimple size={18} /><span>Add reference images</span><small>Upload from device · up to 5 in this demo</small><input type="file" accept="image/*" multiple onChange={(event) => setReferences((current) => [...current, ...Array.from(event.target.files || [], (file) => file.name)].slice(0, 5))} /></label>
                <button className="studio-own-reference" onClick={() => setReferences((current) => [...current, "From My Creations: Quiet city at dusk"].slice(0, 5))}>Select from My Creations</button>
                {references.length > 0 && <div className="studio-reference-list">{references.map((name, index) => <button key={`${name}-${index}`} onClick={() => setReferences((current) => current.filter((_, i) => i !== index))} title="Remove reference">{name} ×</button>)}</div>}
              </>}
            </div>}
            <label className="studio-prompt"><textarea value={prompt} maxLength={5000} onChange={(event) => setPrompt(event.target.value)} placeholder={`Describe the ${kind.toLowerCase()} you want to create...`} /><span>{prompt.length} / 5,000</span></label>
            <div className="studio-controls">
              <label>Model<select aria-label="Model" value={model} onChange={(event) => { setModel(event.target.value); if (!soundtrackModels.has(event.target.value)) { setAudio("Model audio"); setSoundtrack(""); } }}>{modelUnavailable && <option value={model} disabled>Unavailable: {model}</option>}{models[kind].map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>Aspect<select aria-label="Aspect ratio" value={aspect} onChange={(event) => setAspect(event.target.value)}>{["16:9", "9:16", "1:1", "4:3"].map((option) => <option key={option}>{option}</option>)}</select></label>
              <label>Resolution<select aria-label="Resolution" value={resolution} onChange={(event) => setResolution(event.target.value)}>{(kind === "Image" ? ["1K", "2K"] : ["720p", "1080p"]).map((option) => <option key={option}>{option}</option>)}</select></label>
              {kind === "Video" && <><label>Duration<select aria-label="Duration" value={duration} onChange={(event) => setDuration(Number(event.target.value))}>{[4, 6, 8].map((option) => <option key={option} value={option}>{option}s</option>)}</select></label><label>Audio<select aria-label="Audio" value={audio} onChange={(event) => setAudio(event.target.value)}><option>Model audio</option><option>No audio</option>{soundtrackModels.has(model) && <option>Upload soundtrack</option>}</select></label></>}
              {path === "Image to Image" && <label>Reference strength<select aria-label="Reference strength" value={strength} onChange={(event) => setStrength(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>}
              <button className="studio-optimize" disabled={!prompt.trim()} onClick={() => { setPrompt((value) => `${value.trim()}\nClear composition, coherent lighting, detailed textures.`); setNotice("Prompt optimization is simulated; no Credits were used."); }} title="Simulated prompt optimization"><MagicWand size={17} /> Optimize</button>
            </div>
            {kind === "Video" && audio === "Upload soundtrack" && <label className="studio-soundtrack">Soundtrack (MP3 or WAV)<input type="file" accept="audio/mpeg,audio/wav" onChange={(event) => setSoundtrack(event.target.files?.[0]?.name || "")} /><span>{soundtrack || "Choose audio file"}</span></label>}
            <div className="studio-submit-row"><p>{modelUnavailable ? <strong>{model} is unavailable. Select a current model to continue.</strong> : prompt.trim() ? <>Estimated {estimate.toLocaleString()} Credits · hold {hold.toLocaleString()} <span>· illustrative</span></> : "Enter a prompt to see an illustrative Credit estimate."}{available < hold && prompt.trim() && !modelUnavailable && <strong> Insufficient mock balance.</strong>}{sourceAttribution && <span> · Source: {sourceAttribution}</span>}</p><button className="studio-generate" disabled={!canGenerate} onClick={generate} aria-label="Generate"><ArrowUp size={19} /></button></div>
          </section>
          {canGenerateAccount && <section className="studio-library"><div className="studio-section-heading"><div><h2>My Creations</h2><p>Sample creations and simulated job states</p></div><select aria-label="Filter creation status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{["All status", "Generated", "Pending", "Failed"].map((option) => <option key={option}>{option}</option>)}</select></div>
            <div className="studio-filter-tabs" role="tablist" aria-label="Filter My Creations">{["All", "Image", "Video"].map((option) => <button key={option} role="tab" aria-selected={mineFilter === option} className={mineFilter === option ? "active" : ""} onClick={() => setMineFilter(option)}>{option}</button>)}</div>
            {filteredCreations.length ? <div className="studio-gallery">{filteredCreations.map((item) => <GalleryCard key={item.id} item={item} onOpen={() => setDetailRef({ source: "mine", id: item.id })} onTry={() => tryThis(item, "mine")} />)}</div> : <p className="studio-empty">No creations match these filters.</p>}
          </section>}
          <section className="studio-library"><div className="studio-section-heading"><div><h2>Discover</h2><p>Maxshot demo works and creations explicitly published by their owners.</p></div></div>
            <div className="studio-filter-tabs" role="tablist" aria-label="Filter Discover">{["All", "Image", "Video"].map((option) => <button key={option} role="tab" aria-selected={discoverFilter === option} className={discoverFilter === option ? "active" : ""} onClick={() => setDiscoverFilter(option)}>{option}</button>)}</div>
            <div className="studio-gallery">{filteredDiscover.map((item) => <GalleryCard key={item.id} item={item} onOpen={() => setDetailRef({ source: "discover", id: item.id })} onTry={() => tryThis(item)} />)}</div>
          </section>
        </>
      )}
      {publishTarget && <div className="studio-publish-backdrop" role="presentation" onMouseDown={() => setPublishTarget(null)}><section className="studio-publish-dialog" role="dialog" aria-modal="true" aria-label="Share creation" onMouseDown={(event) => event.stopPropagation()}>
        <h2>Share this work</h2><p>Published works appear in Discover and have a public preview. You can unshare later.</p>
        <label><input type="radio" checked={publishMode === "result"} onChange={() => setPublishMode("result")} /> Result only: hide input and method</label>
        <label><input type="radio" checked={publishMode === "method"} disabled={!canShareMethod} onChange={() => setPublishMode("method")} /> Share method: show prompt and settings</label>
        {!canShareMethod && <small>Method sharing is available only for text-only paths without references or uploaded audio.</small>}
        <label><input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} /> I have rights to publish this result and the selected details.</label>
        <div><button onClick={() => setPublishTarget(null)}>Cancel</button><button disabled={!rightsConfirmed} onClick={publish}>Publish</button></div>
      </section></div>}
    </main>
  );
}
