import { useState } from "react";
import { ArrowRight, Check, Copy } from "@phosphor-icons/react";
import "./growth.css";

const baseUrl = "https://api.maxshot.ai/v1";
const sampleBody = JSON.stringify({ model: "source-model-id", messages: [{ role: "user", content: "Write one sentence about a paper city." }] }, null, 2);
const taskPrompts = {
  Chat: "Write one sentence about a paper city.",
  Image: "A miniature paper city at sunrise, warm windows and soft shadows.",
  Video: "A paper boat floating along a stream at golden hour.",
};

function translateRequest(input, targetModel) {
  let source;
  try {
    source = JSON.parse(input);
  } catch {
    return { error: "Enter a valid JSON request body." };
  }
  if (!source || Array.isArray(source) || typeof source !== "object") return { error: "The request body must be a JSON object." };
  if (!Array.isArray(source.messages) || !source.messages.length || !source.messages.every((message) =>
    message && ["system", "user", "assistant"].includes(message.role) && typeof message.content === "string"
  )) return { error: "This demo accepts text-only Chat Completions messages with system, user, or assistant roles." };
  if (source.stream !== undefined && typeof source.stream !== "boolean") return { error: "stream must be true or false." };
  const unsupported = Object.keys(source).filter((key) => !["model", "messages", "stream"].includes(key));
  const body = { model: targetModel.trim(), messages: source.messages.map(({ role, content }) => ({ role, content })) };
  if (source.stream !== undefined) body.stream = source.stream;
  return { body, unsupported, prompt: [...source.messages].reverse().find((message) => message.role === "user")?.content || "" };
}

export function PlaygroundPage({ onOpenChat, onOpenStudio, onApi, onPricing }) {
  const [mode, setMode] = useState("try");
  const [task, setTask] = useState("Chat");
  const [prompt, setPrompt] = useState(taskPrompts.Chat);
  const [source, setSource] = useState("Venice");
  const [sourceBody, setSourceBody] = useState(sampleBody);
  const [targetModel, setTargetModel] = useState("openrouter/free");
  const [copied, setCopied] = useState(false);
  const translated = translateRequest(sourceBody, targetModel);
  const chatBody = { model: "openrouter/free", messages: [{ role: "user", content: prompt }] };
  const requestBody = mode === "try" ? chatBody : translated.body;
  const canCopy = Boolean(requestBody && (mode === "try" ? task === "Chat" && prompt.trim() : targetModel.trim()));
  const studioKind = task === "Image" ? "Image" : "Video";
  const studioModel = task === "Image" ? "Seedream 5.0 Flash" : "Wan 3.0";

  return <main className="content-page growth-page playground-page">
    <div className="growth-intro"><h1>Playground</h1><p>Try a prompt on the existing Chat or Studio path, or preview a narrow API migration. No request is sent from this page.</p></div>
    <div className="growth-guide-tabs" role="tablist" aria-label="Playground mode">
      <button role="tab" aria-selected={mode === "try"} className={mode === "try" ? "active" : ""} onClick={() => { setMode("try"); setCopied(false); }}>Try a prompt</button>
      <button role="tab" aria-selected={mode === "migrate"} className={mode === "migrate" ? "active" : ""} onClick={() => { setMode("migrate"); setCopied(false); }}>Translate a request</button>
    </div>
    <section className="growth-section playground-workspace">
      <div>
        {mode === "try" ? <>
          <h2>Shape the input</h2>
          <label>Surface<select value={task} onChange={(event) => { setTask(event.target.value); setPrompt(taskPrompts[event.target.value]); setCopied(false); }}><option>Chat</option><option>Image</option><option>Video</option></select></label>
          <label>Prompt<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} /></label>
          <p>{task === "Chat" ? "The API preview is illustrative, not an exact export of Chat. Choose the live model and features in Chat before sending." : "Image and video generation run through Studio. There is no equivalent public media API request in this prototype."}</p>
          <div className="growth-actions"><button onClick={onPricing}>View Pricing</button><button className="growth-primary" disabled={!prompt.trim()} onClick={() => task === "Chat" ? onOpenChat(prompt) : onOpenStudio({ kind: studioKind, path: `Text to ${studioKind}`, model: studioModel, prompt, source: `Playground: ${task.toLowerCase()}@v1` })}>Open in {task === "Chat" ? "Chat" : "Studio"} <ArrowRight size={15} /></button></div>
        </> : <>
          <h2>Translate a text request</h2>
          <label>Source gateway<select value={source} onChange={(event) => setSource(event.target.value)}><option>Venice</option><option>b.ai</option></select></label>
          <p>Paste a JSON <strong>request body only</strong>, never an API key or Authorization header. This demo handles text-only Chat Completions, not Responses, tools, or media.</p>
          <label>Source body<textarea className="playground-json-input" value={sourceBody} onChange={(event) => setSourceBody(event.target.value)} spellCheck={false} /></label>
          <label>Maxshot model ID<input value={targetModel} onChange={(event) => setTargetModel(event.target.value)} /></label>
          <p>Choose a valid ID from Maxshot API Docs or GET /models. Source model IDs are never mapped automatically.</p>
          {translated.error ? <p className="playground-error" role="alert">{translated.error}</p> : translated.unsupported.length > 0 ? <p className="playground-warning" role="status">Not translated: {translated.unsupported.join(", ")}. Review these fields manually before using the request.</p> : <p className="playground-ok" role="status">Common text-message fields are ready to review.</p>}
          <div className="growth-actions"><button onClick={onApi}>Open API keys</button><button onClick={onPricing}>View Pricing</button>{translated.prompt && <button className="growth-primary" onClick={() => onOpenChat(translated.prompt)}>Try last user prompt in Chat <ArrowRight size={15} /></button>}</div>
        </>}
      </div>
      <div className="playground-preview">
        <h2>{mode === "try" && task !== "Chat" ? "Studio handoff" : mode === "try" ? "Illustrative API request" : "Maxshot request preview"}</h2>
        {mode === "try" && task !== "Chat" ? <p>Continue in Studio to choose the current model, settings, and price before generation. Do not treat Studio settings as public API parameters.</p> : <>
          <p><code>POST {baseUrl}/chat/completions</code></p>
          <pre className="growth-code"><code>{requestBody ? JSON.stringify(requestBody, null, 2) : "Fix the source body to preview a request."}</code></pre>
          <div className="growth-actions"><button disabled={!canCopy} onClick={async () => { await navigator.clipboard.writeText(JSON.stringify(requestBody, null, 2)); setCopied(true); }}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? "Copied" : "Copy JSON body"}</button></div>
          <small>Use your own Maxshot key server-side. This prototype does not validate live model availability or make an API request.</small>
        </>}
      </div>
    </section>
  </main>;
}
