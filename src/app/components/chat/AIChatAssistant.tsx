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

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

      const { reply, projectImageMap, workImageMap } = await handleChat(
        conversationHistory,
        session?.userId
      );

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

        /* ── Mobile: full-screen takeover ── */
        @media (max-width: 639px) {
          .chat-widget-window {
            position: fixed !important;
            inset: 0 !important;
            width: 100dvw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }
      `}</style>

      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Toggle AI Chat"
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          // Respects iOS safe area (home bar / notch)
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          right: "1.5rem",
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
        className={`chat-widget-window fixed z-50 transition-all duration-300 origin-bottom-right
          sm:bottom-24 sm:right-6 sm:w-96 sm:rounded-2xl sm:max-h-[520px]
          ${isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-90 pointer-events-none"
          }`}
        style={{
          background: "var(--cw-bg)",
          border: "1px solid var(--cw-border)",
          boxShadow: "var(--cw-shadow)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — taller on mobile, respects notch */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{
            paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))",
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

          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--cw-header-name)" }}
          >
            Portfolio Assistant
          </p>

          {/* Larger close button for touch */}
          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto w-10 h-10 flex items-center justify-center rounded-full transition-colors text-lg"
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
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
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
                className={`max-w-[85%] sm:max-w-[80%] flex flex-col gap-1 ${
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

                {streamingId !== msg.id && (
                  <span className="text-xs px-1" style={{ color: "var(--cw-time)" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
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
                        backgroundColor: "var(--cw-msg-ai-text)",
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

        {/* Input — safe area padding for iOS home bar */}
        <div
          className="px-3 shrink-0"
          style={{
            paddingTop: "0.75rem",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
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
              // text-base (16px) prevents iOS auto-zoom on input focus
              className="flex-1 bg-transparent text-base sm:text-sm outline-none disabled:opacity-50"
              style={{ color: "var(--cw-input-text)" }}
            />
            {/* Larger touch target on mobile */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              style={{ background: "linear-gradient(135deg, rgb(45, 65, 111), rgb(11, 37, 103))" }}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
