"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { handleChat } from "@/app/lib/chatAction";

type Props = {
  profileUserId: string;
  username: string;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What's your tech stack?",
  "Show me your best project",
  "Can you tell me about your experience?",
  "Are you open to work?",
  "How do I reach you?",
];

const CLIENT_COOLDOWN_MS = 10_000;

function useTypewriter(text: string, enabled: boolean, speed = 8, charsPerTick = 3) {
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
        indexRef.current = Math.min(indexRef.current + charsPerTick, text.length);
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
  const { displayed, done } = useTypewriter(content, stream);

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
              className="rounded-sm mt-2 max-w-full"
              style={{ border: "1px solid var(--cw-msg-ai-border)" }}
            />
          ),
        }}
      >
        {displayed}
      </ReactMarkdown>
      {stream && !done && (
        <span
          className="inline-block w-[2px] h-[1em] ml-[1px] align-middle animate-cw-blink"
          style={{ background: "currentColor", borderRadius: "1px" }}
        />
      )}
    </div>
  );
}

function CooldownBar({ seconds }: { seconds: number }) {
  return (
    <div className="flex items-center gap-2 px-1 py-0.5">
      <div
        className="flex-1 h-[3px] rounded-full overflow-hidden"
        style={{ background: "var(--cw-input-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${(seconds / (CLIENT_COOLDOWN_MS / 1000)) * 100}%`,
            background: "linear-gradient(90deg, rgb(15,23,42), rgb(11,37,103))",
          }}
        />
      </div>
      <span
        className="text-xs shrink-0 tabular-nums"
        style={{ color: "var(--cw-subtext)" }}
      >
        {seconds}s
      </span>
    </div>
  );
}

/** Small sparkle SVG used in the toggle button */
function SparkleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M19 16L19.75 18.25L22 19L19.75 19.75L19 22L18.25 19.75L16 19L18.25 18.25L19 16Z"
        fill="white"
        fillOpacity="0.7"
      />
    </svg>
  );
}

/** Brain/circuit AI avatar icon */
function AIAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-10 h-10" : "w-7 h-7";
  const iconSize = size === "md" ? 16 : 12;
  return (
    <div
      className={`${dim} rounded-sm shrink-0 flex items-center justify-center`}
      style={{
        background: "linear-gradient(135deg, rgb(15,23,42) 0%, rgb(11,37,103) 100%)",
      }}
    >
      {/* Simple circuit-node icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="2.5" fill="white" />
        <circle cx="4" cy="4" r="1.5" fill="white" fillOpacity="0.7" />
        <circle cx="16" cy="4" r="1.5" fill="white" fillOpacity="0.7" />
        <circle cx="4" cy="16" r="1.5" fill="white" fillOpacity="0.7" />
        <circle cx="16" cy="16" r="1.5" fill="white" fillOpacity="0.7" />
        <line x1="10" y1="7.5" x2="10" y2="4" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="10" y1="12.5" x2="10" y2="16" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="7.5" y1="10" x2="4" y2="10" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="12.5" y1="10" x2="16" y2="10" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
        <line x1="8.2" y1="8.2" x2="5.5" y2="5.5" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="11.8" y1="8.2" x2="14.5" y2="5.5" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="8.2" y1="11.8" x2="5.5" y2="14.5" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="11.8" y1="11.8" x2="14.5" y2="14.5" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function AIChatAssistant({ profileUserId, username }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi there! 👋 I'm an AI assistant trained on **${username}'s** portfolio. Ask me about their skills, experience, or projects and I'll do my best to help.`,
      timestamp: new Date(),
      isStreaming: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSecs, setCooldownSecs] = useState(0);
  const [hasUnread, setHasUnread] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCoolingDown = cooldownSecs > 0;

  const startCooldown = useCallback((secs: number) => {
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    setCooldownSecs(secs);
    cooldownTimer.current = setInterval(() => {
      setCooldownSecs((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(
    () => () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const addAssistantMessage = (content: string, streaming = false) => {
    const id = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id, role: "assistant", content, timestamp: new Date(), isStreaming: streaming },
    ]);
    return id;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading || isCoolingDown) return;

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

      const { reply, projectImageMap, workImageMap, profileImageMap } = await handleChat(
        conversationHistory,
        profileUserId
      );

      let enriched = reply;
      if (Object.keys(projectImageMap).length > 0) {
        enriched +=
          "\n\n---\n\n" +
          Object.entries(projectImageMap)
            .map(([name, url]) => `![${name}](${url})`)
            .join("\n\n");
      }
      if (Object.keys(workImageMap).length > 0) {
        enriched +=
          "\n\n---\n\n" +
          Object.entries(workImageMap)
            .map(([name, url]) => `![${name}](${url})`)
            .join("\n\n");
      }
      if (Object.keys(profileImageMap).length > 0) {
        enriched +=
          "\n\n---\n\n" +
          Object.entries(profileImageMap)
            .map(([name, url]) => `![${name}](${url})`)
            .join("\n\n");
      }

      const assistantId = addAssistantMessage(enriched, true);
      setStreamingId(assistantId);
      if (!isOpen) setHasUnread(true);
      startCooldown(CLIENT_COOLDOWN_MS / 1000);
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.startsWith("COOLDOWN:")) {
        const secs = parseInt(msg.split(":")[1], 10) || 10;
        startCooldown(secs);
        addAssistantMessage(
          `⏳ Please wait **${secs} seconds** before sending another message.`
        );
      } else if (msg === "RATE_LIMIT") {
        startCooldown(30);
        addAssistantMessage(
          "⚠️ The AI service is currently rate-limited. Please wait **30 seconds** and try again."
        );
      } else {
        addAssistantMessage("Sorry, something went wrong. Please try again later.");
      }
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

  const isSendDisabled = !input.trim() || isLoading || isCoolingDown;

  return (
    <>
      <style>{`
        @keyframes cw-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .animate-cw-blink { animation: cw-blink 0.85s step-start infinite; }

        /* ── Light mode (default) — mirrors Introduction light palette ── */
        .chat-widget-window {
          --cw-bg:             #ffffff;
          --cw-bg-secondary:   #f8fafc;
          --cw-border:         #e2e8f0;
          --cw-header-bg:      #f8fafc;
          --cw-header-border:  #e2e8f0;

          --cw-msg-ai-bg:      #f1f5f9;
          --cw-msg-ai-border:  #e2e8f0;
          --cw-msg-ai-text:    #1e293b;

          --cw-msg-user-from:  rgb(15, 23, 42);
          --cw-msg-user-to:    rgb(11, 37, 103);

          --cw-input-bg:       #f1f5f9;
          --cw-input-border:   #cbd5e1;
          --cw-input-text:     #1e293b;
          --cw-placeholder:    #94a3b8;
          --cw-subtext:        #94a3b8;

          --cw-chip-bg:        #f1f5f9;
          --cw-chip-border:    #cbd5e1;
          --cw-chip-text:      rgb(11, 37, 103);
          --cw-chip-hover-bg:  #e2e8f0;

          --cw-header-name:    #0f172a;
          --cw-header-sub:     #475569;
          --cw-badge-bg:       #f1f5f9;
          --cw-badge-text:     rgb(11, 37, 103);
          --cw-badge-border:   #cbd5e1;

          --cw-time:           #94a3b8;
          --cw-close:          #94a3b8;
          --cw-close-hover:    #475569;
          --cw-link:           rgb(11, 37, 103);

          --cw-shadow:         0 20px 60px rgba(15,23,42,0.10), 0 0 0 1px #e2e8f0;
          --cw-toggle-shadow:  0 8px 24px rgba(15,23,42,0.20);

          --cw-deco-bg:        #e2e8f0;
        }

        /* ── Dark mode — mirrors Introduction dark palette ── */
        .dark .chat-widget-window {
          --cw-bg:             #0f172a;
          --cw-bg-secondary:   #1e293b;
          --cw-border:         rgba(255,255,255,0.08);
          --cw-header-bg:      #1e293b;
          --cw-header-border:  rgba(255,255,255,0.08);

          --cw-msg-ai-bg:      #1e293b;
          --cw-msg-ai-border:  rgba(255,255,255,0.07);
          --cw-msg-ai-text:    #cbd5e1;

          --cw-msg-user-from:  rgb(30, 41, 82);
          --cw-msg-user-to:    rgb(15, 32, 90);

          --cw-input-bg:       #1e293b;
          --cw-input-border:   rgba(255,255,255,0.1);
          --cw-input-text:     #e2e8f0;
          --cw-placeholder:    #475569;
          --cw-subtext:        #475569;

          --cw-chip-bg:        #1e293b;
          --cw-chip-border:    rgba(255,255,255,0.1);
          --cw-chip-text:      #94a3b8;
          --cw-chip-hover-bg:  #334155;

          --cw-header-name:    #f8fafc;
          --cw-header-sub:     #64748b;
          --cw-badge-bg:       rgba(255,255,255,0.06);
          --cw-badge-text:     #94a3b8;
          --cw-badge-border:   rgba(255,255,255,0.08);

          --cw-time:           #475569;
          --cw-close:          #475569;
          --cw-close-hover:    #94a3b8;
          --cw-link:           #93c5fd;

          --cw-shadow:         0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          --cw-toggle-shadow:  0 8px 24px rgba(0,0,0,0.4);

          --cw-deco-bg:        #1e293b;
        }

        .chat-widget-window input::placeholder { color: var(--cw-placeholder); }

        /* Markdown styles */
        .ai-markdown p             { margin-bottom: 0.3rem; }
        .ai-markdown p:last-child  { margin-bottom: 0; }
        .ai-markdown ul            { list-style: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
        .ai-markdown ol            { list-style: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
        .ai-markdown li            { margin-bottom: 0.15rem; }
        .ai-markdown strong        { font-weight: 600; }
        .ai-markdown a             { color: var(--cw-link); text-decoration: underline; word-break: break-all; }
        .ai-markdown a:hover       { opacity: 0.7; }
        .ai-markdown code          { font-size: 0.72rem; background: rgba(15,23,42,0.07); padding: 0.1rem 0.3rem; border-radius: 3px; }
        .dark .ai-markdown code    { background: rgba(255,255,255,0.08); }
        .ai-markdown h1,
        .ai-markdown h2,
        .ai-markdown h3            { font-weight: 600; margin: 0.4rem 0 0.15rem; }

        /* Chip hover */
        .cw-chip:hover:not(:disabled) {
          background: var(--cw-chip-hover-bg) !important;
        }

        /* Scrollbar */
        .cw-messages::-webkit-scrollbar       { width: 4px; }
        .cw-messages::-webkit-scrollbar-track { background: transparent; }
        .cw-messages::-webkit-scrollbar-thumb { background: var(--cw-border); border-radius: 4px; }

        /* Mobile full-screen */
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

      {/* ── Toggle button — matches Introduction brand gradient ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Toggle AI Chat"
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
          right: "1.5rem",
          background: "linear-gradient(135deg, rgb(15,23,42) 0%, rgb(11,37,103) 100%)",
          boxShadow: "var(--cw-toggle-shadow, 0 8px 24px rgba(15,23,42,0.25))",
        }}
      >
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
        <span className="transition-transform duration-200 select-none">
          {isOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <SparkleIcon />
          )}
        </span>
      </button>

      {/* ── Chat window ── */}
      <div
        className={`chat-widget-window fixed z-50 transition-all duration-300 origin-bottom-right
          sm:bottom-24 sm:right-6 sm:w-[22rem] sm:rounded-sm sm:max-h-[540px]
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        style={{
          background: "var(--cw-bg)",
          border: "1px solid var(--cw-border)",
          boxShadow: "var(--cw-shadow)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{
            paddingTop: "calc(0.875rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "0.875rem",
            background: "var(--cw-header-bg)",
            borderBottom: "1px solid var(--cw-header-border)",
          }}
        >
          <AIAvatar size="md" />

          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-semibold leading-tight tracking-tight truncate"
              style={{ color: "var(--cw-header-name)" }}
            >
              {username} · AI Assistant
            </span>
            {/* AI identity badge */}
            <span
              className="inline-flex items-center gap-1 text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded-sm w-fit"
              style={{
                background: "var(--cw-badge-bg)",
                border: "1px solid var(--cw-badge-border)",
                color: "var(--cw-badge-text)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: "#34d399" }}
              />
              Powered by Groq
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-sm transition-colors shrink-0"
            style={{ color: "var(--cw-close)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--cw-close-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--cw-close)")
            }
            aria-label="Close chat"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Messages ── */}
        <div
          className="cw-messages flex-1 overflow-y-auto px-4 py-3 space-y-3"
          style={{ background: "var(--cw-bg)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.role === "assistant" && <AIAvatar size="sm" />}

              <div
                className={`max-w-[85%] sm:max-w-[80%] flex flex-col gap-1 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className="px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: `linear-gradient(135deg, var(--cw-msg-user-from), var(--cw-msg-user-to))`,
                          color: "white",
                          borderRadius: "6px 6px 2px 6px",
                        }
                      : {
                          background: "var(--cw-msg-ai-bg)",
                          color: "var(--cw-msg-ai-text)",
                          borderRadius: "2px 6px 6px 6px",
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
                  <span
                    className="text-[10px] px-1"
                    style={{ color: "var(--cw-time)" }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2 items-end">
              <AIAvatar size="sm" />
              <div
                className="px-4 py-3"
                style={{
                  background: "var(--cw-msg-ai-bg)",
                  border: "1px solid var(--cw-msg-ai-border)",
                  borderRadius: "2px 6px 6px 6px",
                }}
              >
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--cw-msg-ai-text)",
                        opacity: 0.5,
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

        {/* ── Suggested chips ── */}
        {messages.length === 1 && (
          <div
            className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 shrink-0"
            style={{
              background: "var(--cw-bg)",
              borderTop: "1px solid var(--cw-border)",
            }}
          >
            <p
              className="w-full text-[10px] font-medium mb-0.5 uppercase tracking-wider"
              style={{ color: "var(--cw-subtext)" }}
            >
              Suggested
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isCoolingDown || isLoading}
                className="cw-chip text-xs px-2.5 py-1 rounded-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* ── Input ── */}
        <div
          className="px-3 shrink-0"
          style={{
            paddingTop: "0.75rem",
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            borderTop: "1px solid var(--cw-border)",
            background: "var(--cw-bg)",
          }}
        >
          {isCoolingDown && <CooldownBar seconds={cooldownSecs} />}

          <div
            className="flex items-center gap-2 rounded-sm px-3 py-2 mt-1"
            style={{
              background: "var(--cw-input-bg)",
              border: `1px solid ${
                isCoolingDown
                  ? "rgba(11,37,103,0.35)"
                  : "var(--cw-input-border)"
              }`,
              transition: "border-color 0.2s",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isCoolingDown ? `Wait ${cooldownSecs}s…` : "Ask me anything…"
              }
              disabled={isLoading || isCoolingDown}
              className="flex-1 bg-transparent text-base sm:text-sm outline-none disabled:opacity-50"
              style={{ color: "var(--cw-input-text)" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isSendDisabled}
              className="w-8 h-8 rounded-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgb(15,23,42) 0%, rgb(11,37,103) 100%)",
              }}
              aria-label="Send message"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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

          {/* Disclaimer */}
          <p
            className="text-[10px] text-center mt-1.5"
            style={{ color: "var(--cw-subtext)" }}
          >
            AI responses may be inaccurate — verify important info directly.
          </p>
        </div>
      </div>
    </>
  );
}
