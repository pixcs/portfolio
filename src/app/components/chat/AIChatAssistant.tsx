"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { handleChat } from "@/app/lib/chatAction";
import { IronSession } from "iron-session";

type Props = {
  session: IronSession<SessionData> | undefined;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What are your skills?",
  "Tell me about your projects",
  "What's your experience?",
  "How can I contact you?",
];

// Hook: streams text character by character
function useTypewriter(text: string, enabled: boolean, speed = 50) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    // Reset when text changes (new message)
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const tick = (now: number) => {
      const elapsed = now - lastTimeRef.current;
      if (elapsed >= speed) {
        lastTimeRef.current = now;
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) {
          setDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, enabled, speed]);

  return { displayed, done };
}

// Wrapper: renders a single AI bubble with optional typewriter
function AIBubble({
  content,
  stream,
  onDone,
}: {
  content: string;
  stream: boolean;
  onDone?: () => void;
}) {
  const { displayed, done } = useTypewriter(content, stream, 1);

  useEffect(() => {
    if (done && stream && onDone) onDone();
  }, [done, stream, onDone]);

  return (
    <div className="ai-markdown">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),

          img: ({ src, alt }) => (
            <img
              src={src || ""}
              alt={alt || ""}
              className="rounded-xl mt-2 max-w-full border border-white/10"
            />
          ),
        }}
      >
        {displayed}
      </ReactMarkdown>
      {/* blinking cursor while typing */}
      {stream && !done && (
        <span
          className="inline-block w-[2px] h-[1em] ml-[1px] align-middle animate-blink"
          style={{ background: "currentColor", borderRadius: "1px" }}
        />
      )}
    </div>
  );
}

export default function AIChatAssistant({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! 👋 I'm Patrick's AI assistant. Ask me anything about his skills, experience, or projects!",
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  // track which message id is currently streaming
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = updatedMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply, projectImageMap, workImageMap } = await handleChat(conversationHistory, session?.userId);

      let enriched = reply;

      if (Object.keys(projectImageMap).length > 0) {
        const imageLines = Object.entries(projectImageMap)
          .map(([name, url]) => `![${name}](${url})`)
          .join("\n\n");
        enriched += "\n\n---\n\n" + imageLines;
      }

      if (Object.keys(workImageMap).length > 0) {
        const imageLines = Object.entries(workImageMap)
          .map(([name, url]) => `![${name}](${url})`)
          .join("\n\n");
        enriched += "\n\n---\n\n" + imageLines;
      }

      const assistantId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: enriched,
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingId(assistantId);
      if (!isOpen) setHasUnread(true);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
        timestamp: new Date(),
        isStreaming: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamDone = (id: string) => {
    setStreamingId(null);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        /* blink animation for the cursor */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .animate-blink { animation: blink 0.85s step-start infinite; }

        .chat-widget-window {
          --cw-bg:            #ffffff;
          --cw-bg-secondary:  #f8fafc;
          --cw-border:        rgba(99,102,241,0.18);
          --cw-header-bg:     rgba(99,102,241,0.06);
          --cw-msg-ai-bg:     #f1f5f9;
          --cw-msg-ai-border: rgba(99,102,241,0.12);
          --cw-msg-ai-text:   #1e293b;
          --cw-input-bg:      #f1f5f9;
          --cw-input-border:  rgba(99,102,241,0.2);
          --cw-input-text:    #1e293b;
          --cw-placeholder:   #94a3b8;
          --cw-subtext:       #94a3b8;
          --cw-brand-text:    rgb(15, 23, 42);
          --cw-chip-bg:       rgba(99,102,241,0.08);
          --cw-chip-border:   rgba(99,102,241,0.25);
          --cw-chip-text:     #0e107a;
          --cw-header-name:   #1e293b;
          --cw-header-sub:    rgb(11, 37, 103);
          --cw-time:          #94a3b8;
          --cw-close:         #94a3b8;
          --cw-close-hover:   #475569;
          --cw-link:          #161643;
          --cw-shadow:        0 24px 80px rgba(15,23,42,0.12), 0 0 0 1px rgba(99,102,241,0.1);
        }

        .dark .chat-widget-window {
          --cw-bg:            #0f172a;
          --cw-bg-secondary:  #1e293b;
          --cw-border:        rgba(99,102,241,0.22);
          --cw-header-bg:     rgba(99,102,241,0.10);
          --cw-msg-ai-bg:     rgba(255,255,255,0.06);
          --cw-msg-ai-border: rgba(255,255,255,0.08);
          --cw-msg-ai-text:   #cbd5e1;
          --cw-input-bg:      rgba(255,255,255,0.05);
          --cw-input-border:  rgba(99,102,241,0.22);
          --cw-input-text:    #e2e8f0;
          --cw-placeholder:   #475569;
          --cw-subtext:       #475569;
          --cw-brand-text:    #818cf8;
          --cw-chip-bg:       rgba(99,102,241,0.12);
          --cw-chip-border:   rgba(99,102,241,0.3);
          --cw-chip-text:     #a5b4fc;
          --cw-header-name:   #f8fafc;
          --cw-header-sub:    #818cf8;
          --cw-time:          #475569;
          --cw-close:         #475569;
          --cw-close-hover:   #94a3b8;
          --cw-link:          #a5b4fc;
          --cw-shadow:        0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
        }

        .chat-widget-window input::placeholder {
          color: var(--cw-placeholder);
        }

        /* Markdown styles scoped to AI bubbles only */
        .ai-markdown p             { margin-bottom: 0.25rem; }
        .ai-markdown p:last-child  { margin-bottom: 0; }
        .ai-markdown ul            { list-style: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
        .ai-markdown ol            { list-style: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
        .ai-markdown li            { margin-bottom: 0.15rem; }
        .ai-markdown strong        { font-weight: 600; }
        .ai-markdown a             { color: var(--cw-link); text-decoration: underline; word-break: break-all; }
        .ai-markdown a:hover       { opacity: 0.75; }
        .ai-markdown code          { font-size: 0.75rem; background: rgba(99,102,241,0.1); padding: 0.1rem 0.3rem; border-radius: 4px; }
        .ai-markdown h1,
        .ai-markdown h2,
        .ai-markdown h3            { font-weight: 600; margin: 0.4rem 0 0.2rem; }
      `}</style>

      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Toggle AI Chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(11, 37, 103))",
          boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
        }}
      >
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
        <span className="text-white text-xl transition-transform duration-300 select-none">
          {isOpen ? "✕" : "✦"}
        </span>
      </button>

      {/* ── Chat window ── */}
      <div
        className={`chat-widget-window fixed bottom-24 right-6 z-50 w-[22rem] sm:w-96 rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
        style={{
          background: "var(--cw-bg)",
          border: "1px solid var(--cw-border)",
          boxShadow: "var(--cw-shadow)",
          maxHeight: "520px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{
            background: "var(--cw-header-bg)",
            borderBottom: "1px solid var(--cw-border)",
          }}
        >
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(11, 37, 103))" }}
            >
              AI
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 animate-pulse"
              style={{ backgroundColor: "#34d399", borderColor: "var(--cw-bg)" }}
            />
          </div>

          <div>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "var(--cw-header-name)" }}
            >
              Portfolio Assistant
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto text-lg leading-none transition-colors"
            style={{ color: "var(--cw-close)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cw-close-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cw-close)")}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ background: "var(--cw-bg)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white mt-1"
                  style={{ background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(11, 37, 103))" }}
                >
                  AI
                </div>
              )}

              <div
                className={`max-w-[80%] flex flex-col gap-1 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, rgb(45, 65, 111), rgb(11, 37, 103))",
                          color: "white",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "var(--cw-msg-ai-bg)",
                          color: "var(--cw-msg-ai-text)",
                          borderBottomLeftRadius: "4px",
                          border: "1px solid var(--cw-msg-ai-border)",
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <AIBubble
                      content={msg.content}
                      stream={streamingId === msg.id}
                      onDone={
                        streamingId === msg.id
                          ? () => handleStreamDone(msg.id)
                          : undefined
                      }
                    />
                  ) : (
                    msg.content
                  )}
                </div>

                {/* hide timestamp while still typing */}
                {streamingId !== msg.id && (
                  <span className="text-xs px-1" style={{ color: "var(--cw-time)" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator — shown only while waiting for the API response */}
          {isLoading && (
            <div className="flex gap-2 items-end">
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, rgb(45, 65, 111), rgb(11, 37, 103))" }}
              >
                AI
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{
                  background: "var(--cw-msg-ai-bg)",
                  border: "1px solid var(--cw-msg-ai-border)",
                }}
              >
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--cw-msg-ai-text)",  // ← adapts to light/dark
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested chips */}
        {messages.length === 1 && (
          <div
            className="px-4 pb-2 flex flex-wrap gap-2 shrink-0"
            style={{ background: "var(--cw-bg)" }}
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "var(--cw-chip-bg)",
                  border: "1px solid var(--cw-chip-border)",
                  color: "var(--cw-chip-text)",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="px-3 py-3 shrink-0"
          style={{
            borderTop: "1px solid var(--cw-border)",
            background: "var(--cw-bg)",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: "var(--cw-input-bg)",
              border: "1px solid var(--cw-input-border)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
              style={{ color: "var(--cw-input-text)" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              style={{ background: "linear-gradient(135deg, rgb(45, 65, 111), rgb(11, 37, 103))" }}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
