import { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, ShareNetwork, X } from "@phosphor-icons/react";
import "./growth.css";

const starters = [
  { id: "paper-city", title: "Make a scene", kind: "Image", path: "Text to Image", model: "Seedream 5.0 Flash", prompt: "A miniature paper city at sunrise, warm windows and soft shadows.", art: 4 },
  { id: "studio-still-life", title: "Create a product image", kind: "Image", path: "Text to Image", model: "Recraft V4", prompt: "A clear glass bottle on a warm stone table, soft studio lighting.", art: 6 },
  { id: "night-transit", title: "Animate an idea", kind: "Video", path: "Text to Video", model: "Wan 3.0", prompt: "A tram crosses a rainy city at night, gentle camera movement.", art: 7 },
  { id: "portrait", title: "Design a portrait", kind: "Image", path: "Text to Image", model: "Seedream 4.5", prompt: "A thoughtful portrait in soft window light, muted background.", art: 8 },
  { id: "short-film", title: "Create a short scene", kind: "Video", path: "Text to Video", model: "Veo 3.1 Fast", prompt: "A paper boat floating along a stream at golden hour.", art: 5 },
];

export function StartersPage({ canRun, onLoginRequired, onOpenStudio, onPricing, onApi, onPlayground }) {
  const [selected, setSelected] = useState(starters[0]);
  const [prompt, setPrompt] = useState(starters[0].prompt);
  const [guide, setGuide] = useState("Venice");
  const [apiPrompt, setApiPrompt] = useState("Say hello in one sentence.");
  const [runResult, setRunResult] = useState("");
  const [copied, setCopied] = useState(false);
  const sourceBaseUrl = guide === "Venice" ? "https://api.venice.ai/api/v1" : "https://api.b.ai/v1";
  const [exampleFormat, setExampleFormat] = useState("cURL");
  const apiExample = [
    "curl https://api.maxshot.ai/v1/chat/completions \\",
    '  -H "Authorization: Bearer YOUR_MAXSHOT_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    `  -d '${JSON.stringify({ model: "openrouter/free", messages: [{ role: "user", content: apiPrompt }] }).replaceAll("'", "'\\''")}'`,
  ].join("\n");
  const sdkExample = [
    'import OpenAI from "openai";',
    'const client = new OpenAI({',
    '  apiKey: process.env.MAXSHOT_API_KEY,',
    '  baseURL: "https://api.maxshot.ai/v1",',
    '});',
    `const response = await client.chat.completions.create(${JSON.stringify({ model: "openrouter/free", messages: [{ role: "user", content: apiPrompt }] })});`,
    'console.log(response.choices[0].message.content);',
  ].join("\n");
  const selectedExample = exampleFormat === "cURL" ? apiExample : sdkExample;

  const chooseStarter = (starter) => {
    setSelected(starter);
    setPrompt(starter.prompt);
  };

  return (
    <main className="content-page growth-page">
      <div className="growth-intro"><span>PRODUCT GROWTH · INTERACTIVE PROTOTYPE</span><h1>Start with an example</h1><p>Explore and edit before signing in. Generation uses the existing Studio path, account, and pricing.</p></div>
      <section className="growth-section" aria-label="Starters">
        <div className="growth-section-heading"><h2>Starters</h2><p>Curated examples, not a new generation engine</p></div>
        <div className="growth-starter-grid">{starters.map((starter) => <button key={starter.id} className={`growth-starter-card ${selected.id === starter.id ? "active" : ""}`} onClick={() => chooseStarter(starter)} aria-pressed={selected.id === starter.id}><span className={`studio-art studio-art-${starter.art}`}><span>{starter.kind === "Video" ? "▶" : "✦"}</span></span><strong>{starter.title}</strong><small>{starter.path} · {starter.model}</small></button>)}</div>
        <div className="growth-edit"><div><h3>{selected.title}</h3><p>Change the prompt, then continue in Studio. The current model and Credit estimate are checked there.</p></div><textarea aria-label="Starter prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} /><div className="growth-actions"><button onClick={onPricing}>View model pricing</button><button className="growth-primary" disabled={!prompt.trim()} onClick={() => onOpenStudio({ ...selected, prompt, source: `Starter: ${selected.id}@v1` })}>Open in Studio <ArrowRight size={15} /></button></div></div>
      </section>
      <section className="growth-section" aria-label="Switching guides">
        <div className="growth-section-heading"><h2>Switch to Maxshot</h2><p>Guided configuration, no credential or history import</p></div>
        <div className="growth-guide-tabs" role="tablist" aria-label="Previous gateway">{["Venice", "b.ai"].map((name) => <button key={name} role="tab" aria-selected={guide === name} className={guide === name ? "active" : ""} onClick={() => setGuide(name)}>{name}</button>)}</div>
        <div className="growth-guide"><p>For OpenAI-compatible Chat Completions, replace {guide}'s <code>{sourceBaseUrl}</code> with <code>https://api.maxshot.ai/v1</code>.</p><ol><li>Create a new Maxshot API key. Never reuse or paste your old gateway key.</li><li>Choose a Maxshot model ID from API Docs or <code>GET /models</code>; old provider model IDs do not automatically map.</li><li>Translate a request in Playground, test the prompt in Chat, then check Usage and Pricing before moving production traffic.</li></ol><div className="growth-actions"><button onClick={onApi}>Open Maxshot API</button><button className="growth-primary" onClick={onPlayground}>Open Playground <ArrowRight size={15} /></button></div><small>Chat Completions only. Provider-specific fields, Responses, image, and video routes require separate compatibility checks.</small></div>
      </section>
      <section className="growth-section" aria-label="API example">
        <div className="growth-section-heading"><h2>Runnable API example</h2><p>Copy a request or try the simulated browser run</p></div>
        <label className="growth-api-input">Prompt<input value={apiPrompt} onChange={(event) => { setApiPrompt(event.target.value); setRunResult(""); }} /></label>
        <div className="growth-guide-tabs" role="tablist" aria-label="API example format">{["cURL", "JavaScript SDK"].map((format) => <button key={format} role="tab" aria-selected={exampleFormat === format} className={exampleFormat === format ? "active" : ""} onClick={() => { setExampleFormat(format); setCopied(false); }}>{format}</button>)}</div>
        <pre className="growth-code"><code>{selectedExample}</code></pre>
        <div className="growth-actions"><button onClick={async () => { await navigator.clipboard.writeText(selectedExample); setCopied(true); }}><Copy size={15} /> {copied ? "Copied" : `Copy ${exampleFormat}`}</button><button className="growth-primary" disabled={!apiPrompt.trim()} onClick={() => { if (!canRun) { onLoginRequired(); return; } setRunResult(`Demo response to: ${apiPrompt}`); }}>Run example <ArrowRight size={15} /></button></div>
        {runResult && <div className="growth-response" role="status"><strong>Simulated response</strong><p>{runResult}</p><small>No provider request or balance change was made. A live run would use your account and normal billing.</small></div>}
        <p className="growth-footnote">Guests can edit and copy. Running requires login. The sample uses a placeholder key and the documented Maxshot API endpoint.</p>
      </section>
    </main>
  );
}

export function SharedWorkPage({ work, onBack, onTry }) {
  const [copied, setCopied] = useState(false);
  const [xPreview, setXPreview] = useState(false);

  if (!work) return <main className="content-page growth-page"><button className="growth-back" onClick={onBack}><ArrowLeft size={16} /> Back to Studio</button><h1>Shared work unavailable</h1><p>This work is unpublished, revoked, or not present in this prototype.</p></main>;

  const isMethod = work.mode === "method";
  const postText = isMethod ? `Made with Maxshot: ${work.title}` : "Shared a work made with Maxshot";
  const canonicalUrl = new URL(window.location.href);
  canonicalUrl.searchParams.delete("via");
  const xUrl = new URL(canonicalUrl.href);
  xUrl.searchParams.set("via", "x");
  const viaX = new URLSearchParams(window.location.search).get("via") === "x";
  return (
    <main className="content-page growth-page growth-public">
      <button className="growth-back" onClick={onBack}><ArrowLeft size={16} /> Back to Studio</button>
      <div className="growth-public-layout"><div><span className="growth-eyebrow">SHARED WORK · {isMethod ? "CREATION METHOD" : "RESULT ONLY"}</span><h1>{work.title}</h1><p>{isMethod ? `By ${work.creator} · ${work.kind} · ${work.model}` : `By ${work.creator}`}</p><div className={`studio-art studio-art-${work.art}`}><span>{work.kind === "Video" ? "▶" : "✦"}</span></div></div><aside className="growth-public-panel"><h2>{isMethod ? "Try this method" : "Enjoy the result"}</h2><p>{isMethod ? "The creator approved this prompt and reusable settings. Edit them in Studio before generating your own result." : "The creator shared the result only. The prompt and source inputs are private."}</p>{viaX && <small>Arrival source: X (prototype URL marker)</small>}{isMethod && <div className="growth-public-prompt"><small>APPROVED PROMPT</small><p>{work.prompt}</p></div>}<div className="growth-public-actions"><button className="growth-primary" onClick={() => onTry(work)}>{isMethod ? "Try this" : "Create your own"} <ArrowRight size={15} /></button><button onClick={async () => { await navigator.clipboard.writeText(canonicalUrl.href); setCopied(true); }}><Copy size={15} /> {copied ? "Copied" : "Copy link"}</button><button onClick={() => setXPreview(true)}><ShareNetwork size={15} /> Share to X</button></div><small>Prototype link: works with this browser's local demo data. No creator reward is active.</small></aside></div>
      {xPreview && <div className="growth-modal-backdrop" role="presentation"><div className="growth-x-preview" role="dialog" aria-modal="true" aria-label="Share to X preview"><button className="growth-x-close" onClick={() => setXPreview(false)} aria-label="Close X preview"><X size={18} /></button><h2>Share to X</h2><p>Open an editable X post. This local link works only in your browser; use a deployed public link for real sharing. No media is uploaded automatically.</p><div className="growth-x-post"><strong>{postText}</strong><span>{xUrl.href}</span><small>{isMethod ? `${work.title} · ${work.kind} by ${work.creator}` : `Work by ${work.creator}`}</small></div><a className="growth-primary" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(xUrl.href)}`} target="_blank" rel="noopener noreferrer">Open X composer</a></div></div>}
    </main>
  );
}
