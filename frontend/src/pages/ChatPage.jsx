import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CaretDown,
  ChatsCircle,
  Check,
  ClockCounterClockwise,
  FileText,
  Globe,
  ImageSquare,
  LinkSimple,
  LockKey,
  MagnifyingGlass,
  Paperclip,
  Plus,
  ShieldCheck,
  SidebarSimple,
  Sparkle,
  Stop,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  chatModels,
  mockAttachments,
  starterConversations,
} from "../data/chatData";

const responseText =
  "The mock gateway selected an eligible provider route, preserved the conversation's model and privacy requirements, and recorded token usage, latency, cost, and failover status. This response is streaming to demonstrate the production chat behavior.";

function createConversation(model) {
  return {
    id: `conversation-${Date.now()}`,
    title: "New conversation",
    model,
    updated: "Now",
    messages: [],
  };
}

export function ChatPage({ seedPrompt, onSeedConsumed }) {
  const [conversations, setConversations] = useState(starterConversations);
  const [transientConversation, setTransientConversation] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [value, setValue] = useState("");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyOpen, setHistoryOpen] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(max-width: 900px)").matches,
  );
  const [model, setModel] = useState(chatModels[0].name);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [temporary, setTemporary] = useState(false);
  const [zeroRetention, setZeroRetention] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const streamTimer = useRef(null);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ||
    (transientConversation?.id === activeId ? transientConversation : null);
  const selectedModel = chatModels.find((item) => item.name === model);
  const activeMessages = activeConversation?.messages || [];

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(historyQuery.toLowerCase()),
      ),
    [conversations, historyQuery],
  );

  useEffect(() => {
    if (!seedPrompt) return;
    setValue(seedPrompt);
    onSeedConsumed();
  }, [seedPrompt, onSeedConsumed]);

  useEffect(
    () => () => {
      if (streamTimer.current) window.clearInterval(streamTimer.current);
    },
    [],
  );

  const updateActiveConversation = (updater) => {
    if (transientConversation?.id === activeId) {
      setTransientConversation((current) => updater(current));
      return;
    }
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId ? updater(conversation) : conversation,
      ),
    );
  };

  const startNewChat = () => {
    if (streamTimer.current) window.clearInterval(streamTimer.current);
    setActiveId(null);
    setTransientConversation(null);
    setValue("");
    setAttachments([]);
    setStreamedText("");
    setStreaming(false);
    if (window.matchMedia("(max-width: 900px)").matches) setHistoryOpen(false);
  };

  const selectConversation = (conversation) => {
    if (streaming) return;
    setActiveId(conversation.id);
    setTransientConversation(null);
    setModel(conversation.model);
    setTemporary(false);
    setZeroRetention(false);
    setMemoryEnabled(true);
    setAttachments([]);
    if (window.matchMedia("(max-width: 900px)").matches) setHistoryOpen(false);
  };

  const toggleTemporary = () => {
    if (zeroRetention) {
      setZeroRetention(false);
      setTemporary(false);
      setMemoryEnabled(true);
      return;
    }

    const next = !temporary;
    setTemporary(next);
    if (next) {
      setMemoryEnabled(false);
      setActiveId(null);
      setTransientConversation(null);
    } else if (!zeroRetention) {
      setMemoryEnabled(true);
    }
  };

  const toggleZeroRetention = () => {
    if (!selectedModel.zeroRetention) return;
    const next = !zeroRetention;
    setZeroRetention(next);
    if (next) {
      setTemporary(true);
      setMemoryEnabled(false);
      setActiveId(null);
      setTransientConversation(null);
    }
  };

  const selectModel = (nextModel) => {
    setModel(nextModel.name);
    setModelMenuOpen(false);
    if (!nextModel.webSearch) setSearchEnabled(false);
    if (!nextModel.zeroRetention && zeroRetention) {
      setZeroRetention(false);
      setTemporary(true);
    }
  };

  const addAttachment = () => {
    const next = mockAttachments.find(
      (item) => !attachments.some((attachment) => attachment.id === item.id),
    );
    if (next) setAttachments((current) => [...current, next]);
  };

  const finishStream = (conversationId, assistantMessage, persist) => {
    if (!persist) {
      setTransientConversation((current) =>
        current?.id === conversationId
          ? {
              ...current,
              messages: [...current.messages, assistantMessage],
              updated: "Now",
            }
          : current,
      );
      setStreaming(false);
      setStreamedText("");
      streamTimer.current = null;
      return;
    }
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, assistantMessage],
              updated: "Now",
            }
          : conversation,
      ),
    );
    setStreaming(false);
    setStreamedText("");
    streamTimer.current = null;
  };

  const send = () => {
    if (!value.trim() || streaming) return;
    const prompt = value.trim();
    const userMessage = {
      role: "user",
      content: prompt,
      attachments,
    };
    const shouldPersist = !temporary;
    let conversationId = activeId;

    if (!conversationId || !activeConversation) {
      const nextConversation = createConversation(model);
      conversationId = nextConversation.id;
      nextConversation.title =
        prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt;
      nextConversation.messages = [userMessage];
      if (shouldPersist) {
        setConversations((current) => [nextConversation, ...current]);
        setActiveId(conversationId);
      } else {
        setTransientConversation(nextConversation);
        setActiveId(conversationId);
      }
    } else {
      updateActiveConversation((conversation) => ({
        ...conversation,
        title:
          conversation.messages.length === 0
            ? prompt.slice(0, 42)
            : conversation.title,
        messages: [...conversation.messages, userMessage],
        updated: "Now",
      }));
    }

    setValue("");
    setAttachments([]);
    setStreaming(true);
    setStreamedText("");

    let index = 0;
    streamTimer.current = window.setInterval(() => {
      index += 4;
      const nextText = responseText.slice(0, index);
      setStreamedText(nextText);
      if (index >= responseText.length) {
        window.clearInterval(streamTimer.current);
        finishStream(
          conversationId,
          {
            role: "assistant",
            content: responseText,
            citations: searchEnabled
              ? [
                  {
                    title: "Gateway routing baseline",
                    source: "Maxshot product baseline",
                    url: "#gateway-routing",
                  },
                  {
                    title: "Provider privacy controls",
                    source: "Provider configuration",
                    url: "#privacy-controls",
                  },
                ]
              : [],
          },
          shouldPersist,
        );
      }
    }, 24);
  };

  const stopStreaming = () => {
    if (!streamTimer.current) return;
    window.clearInterval(streamTimer.current);
    streamTimer.current = null;
    if (activeId && streamedText) {
      finishStream(
        activeId,
        {
          role: "assistant",
          content: `${streamedText} [Stopped]`,
          citations: [],
        },
        !temporary,
      );
    } else {
      setStreaming(false);
      setStreamedText("");
    }
  };

  const removeConversation = (event, id) => {
    event.stopPropagation();
    setConversations((current) =>
      current.filter((conversation) => conversation.id !== id),
    );
    if (activeId === id) startNewChat();
  };

  const messages = activeConversation?.messages || activeMessages;
  const hasMessages = messages.length > 0 || streaming;

  return (
    <main
      className={`chat-page chat-core ${historyOpen ? "history-visible" : "history-hidden"} ${hasMessages ? "has-messages" : ""}`}
    >
      <aside className={`history-panel ${historyOpen ? "open" : ""}`}>
        <div className="history-heading">
          <div>
            <span>Conversations</span>
            <strong>{conversations.length}</strong>
          </div>
          <button onClick={() => setHistoryOpen(false)} aria-label="Close history">
            <X size={17} />
          </button>
        </div>
        <button className="history-new" onClick={startNewChat}>
          <Plus size={17} /> New chat
        </button>
        <label className="history-search">
          <MagnifyingGlass size={16} />
          <input
            value={historyQuery}
            onChange={(event) => setHistoryQuery(event.target.value)}
            placeholder="Search conversations"
          />
        </label>
        <div className="history-list">
          {filteredConversations.map((conversation) => (
            <button
              className={`history-item ${
                conversation.id === activeId ? "active" : ""
              }`}
              onClick={() => selectConversation(conversation)}
              key={conversation.id}
            >
              <ChatsCircle size={17} />
              <span>
                <strong>{conversation.title}</strong>
                <small>
                  {conversation.model} · {conversation.updated}
                </small>
              </span>
              <i
                role="button"
                aria-label={`Delete ${conversation.title}`}
                onClick={(event) => removeConversation(event, conversation.id)}
              >
                <Trash size={14} />
              </i>
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-stage">
        <header className="chat-context-bar">
          <div>
            <button
              className="history-trigger"
              onClick={() => setHistoryOpen((state) => !state)}
              aria-label="Toggle conversation history"
            >
              <SidebarSimple size={18} />
            </button>
            <div className="chat-title">
              <strong>{activeConversation?.title || "New conversation"}</strong>
              <span>
                {zeroRetention
                  ? "Zero retention"
                  : temporary
                    ? "Temporary"
                    : "Saved to history"}
              </span>
            </div>
          </div>
          <div className="chat-context-actions">
            <div className="model-picker">
              <button
                onClick={() => setModelMenuOpen((state) => !state)}
                aria-label="Select chat model"
              >
                <span className="model-dot" />
                {model}
                <CaretDown size={13} />
              </button>
              {modelMenuOpen && (
                <div className="model-menu">
                  {chatModels.map((item) => (
                    <button
                      className={item.name === model ? "selected" : ""}
                      onClick={() => selectModel(item)}
                      key={item.name}
                    >
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.provider}</small>
                      </span>
                      {item.name === model && <Check size={15} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`privacy-button ${
                temporary || zeroRetention ? "enabled" : ""
              }`}
              onClick={() => setPrivacyOpen((state) => !state)}
            >
              {zeroRetention ? <LockKey size={17} /> : <ShieldCheck size={17} />}
              Privacy
            </button>
          </div>
          {privacyOpen && (
            <div className="privacy-popover">
              <div>
                <strong>Conversation privacy</strong>
                <button onClick={() => setPrivacyOpen(false)} aria-label="Close privacy">
                  <X size={16} />
                </button>
              </div>
              <button className="privacy-option" onClick={toggleTemporary}>
                <span>
                  <ClockCounterClockwise size={19} />
                  <i>
                    <strong>Temporary chat</strong>
                    <small>Not saved</small>
                  </i>
                </span>
                <b className={`mini-switch ${temporary ? "on" : ""}`} />
              </button>
              <button
                className="privacy-option"
                onClick={toggleZeroRetention}
                disabled={!selectedModel.zeroRetention}
              >
                <span>
                  <LockKey size={19} />
                  <i>
                    <strong>Zero retention</strong>
                    <small>
                      {selectedModel.zeroRetention
                        ? `${selectedModel.provider} eligible`
                        : "Unavailable for this model"}
                    </small>
                  </i>
                </span>
                <b className={`mini-switch ${zeroRetention ? "on" : ""}`} />
              </button>
              {(temporary || zeroRetention) && (
                <p>Memory off</p>
              )}
            </div>
          )}
        </header>

        {!hasMessages ? (
          <div className="chat-empty chat-core-empty">
            <div className="mode-summary">
              {zeroRetention ? (
                <>
                  <LockKey size={16} /> Zero-retention route
                </>
              ) : temporary ? (
                <>
                  <ClockCounterClockwise size={16} /> Temporary chat
                </>
              ) : (
                <>
                  <Sparkle size={16} /> Multi-model workspace
                </>
              )}
            </div>
            <h1>
              Welcome to <span className="wordmark">Maxshot</span>, how can I help?
            </h1>
            <ChatComposer
              value={value}
              setValue={setValue}
              send={send}
              streaming={streaming}
              stopStreaming={stopStreaming}
              searchEnabled={searchEnabled}
              setSearchEnabled={setSearchEnabled}
              searchAvailable={selectedModel.webSearch}
              memoryEnabled={memoryEnabled}
              setMemoryEnabled={setMemoryEnabled}
              memoryLocked={temporary || zeroRetention}
              attachments={attachments}
              addAttachment={addAttachment}
              removeAttachment={(id) =>
                setAttachments((current) =>
                  current.filter((attachment) => attachment.id !== id),
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="conversation chat-core-conversation">
              {messages.map((message, index) => (
                <Message message={message} key={`${message.role}-${index}`} />
              ))}
              {streaming && (
                <Message
                  message={{ role: "assistant", content: streamedText }}
                  streaming
                />
              )}
            </div>
            <div className="composer-dock chat-core-dock">
              <ChatComposer
                value={value}
                setValue={setValue}
                send={send}
                streaming={streaming}
                stopStreaming={stopStreaming}
                searchEnabled={searchEnabled}
                setSearchEnabled={setSearchEnabled}
                searchAvailable={selectedModel.webSearch}
                memoryEnabled={memoryEnabled}
                setMemoryEnabled={setMemoryEnabled}
                memoryLocked={temporary || zeroRetention}
                attachments={attachments}
                addAttachment={addAttachment}
                removeAttachment={(id) =>
                  setAttachments((current) =>
                    current.filter((attachment) => attachment.id !== id),
                  )
                }
              />
              <p>
                {temporary
                  ? "Not saved"
                  : "Check important information."}
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Message({ message, streaming = false }) {
  return (
    <article className={`message ${message.role}`}>
      <span className="message-role">
        {message.role === "user" ? "You" : "Maxshot"}
      </span>
      {message.attachments?.length > 0 && (
        <div className="message-attachments">
          {message.attachments.map((attachment) => (
            <span key={attachment.id}>
              {attachment.type === "image" ? (
                <ImageSquare size={17} />
              ) : (
                <FileText size={17} />
              )}
              {attachment.name}
            </span>
          ))}
        </div>
      )}
      <p>
        {message.content}
        {streaming && <i className="stream-cursor" />}
      </p>
      {message.citations?.length > 0 && (
        <div className="citation-list">
          <span>Sources</span>
          {message.citations.map((citation, index) => (
            <a href={citation.url} key={citation.title}>
              <b>{index + 1}</b>
              <i>
                <strong>{citation.title}</strong>
                <small>{citation.source}</small>
              </i>
              <LinkSimple size={15} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function ChatComposer({
  value,
  setValue,
  send,
  streaming,
  stopStreaming,
  searchEnabled,
  setSearchEnabled,
  searchAvailable,
  memoryEnabled,
  setMemoryEnabled,
  memoryLocked,
  attachments,
  addAttachment,
  removeAttachment,
}) {
  return (
    <div className="chat-composer chat-core-composer">
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((attachment) => (
            <span key={attachment.id}>
              {attachment.type === "image" ? (
                <ImageSquare size={17} />
              ) : (
                <FileText size={17} />
              )}
              <i>
                <strong>{attachment.name}</strong>
                <small>{attachment.size}</small>
              </i>
              <button
                onClick={() => removeAttachment(attachment.id)}
                aria-label={`Remove ${attachment.name}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
      <textarea
        aria-label="Ask me anything"
        placeholder="Ask me anything"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
      />
      <div className="composer-actions">
        <div className="composer-tools">
          <button onClick={addAttachment} aria-label="Add attachment" title="Add attachment">
            <Paperclip size={20} />
          </button>
          <button
            className={searchEnabled ? "enabled" : ""}
            onClick={() => searchAvailable && setSearchEnabled((state) => !state)}
            disabled={!searchAvailable}
            aria-label="Toggle web search"
            title={searchAvailable ? "Web search" : "Web search unavailable"}
          >
            <Globe size={20} />
          </button>
          <button
            className={memoryEnabled ? "enabled" : ""}
            onClick={() => !memoryLocked && setMemoryEnabled((state) => !state)}
            disabled={memoryLocked}
            aria-label="Toggle memory"
            title={memoryLocked ? "Memory disabled by privacy mode" : "Memory"}
          >
            <img src="/assets/memory-disabled.svg" alt="" />
          </button>
          {searchEnabled && <span className="composer-status"><Globe size={13} /> Search on</span>}
          {memoryLocked && <span className="composer-status"><LockKey size={13} /> Memory off</span>}
        </div>
        <button
          className="send-button"
          onClick={streaming ? stopStreaming : send}
          disabled={!streaming && !value.trim()}
          aria-label={streaming ? "Stop response" : "Send"}
        >
          {streaming ? <Stop size={17} weight="fill" /> : <ArrowRight size={19} />}
        </button>
      </div>
    </div>
  );
}
