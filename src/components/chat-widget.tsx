"use client";

// Floating AI chat widget for Alex the Locksmith, modeled on the
// playapexgolf ChatWidget. Desktop: corner popout. Mobile: full-width bottom
// sheet that slides up. Talks to /api/chat (Claude).
// Guardrails: visible AI labelling, persistent disclaimer, per-session
// message cap (UX/cost bound in the UI only — not a security control).

import { useCallback, useEffect, useRef, useState } from "react";

const GREETING =
  "Hi! I'm Alex the Locksmith's AI assistant. I can answer questions about lockouts, rekeying, smart locks, car keys, and more. What can I help you with?";
const QUICK = ["I'm locked out", "Car keys", "Rekey my locks", "Smart locks"];

const PHONE_DISPLAY = "(650) 444-1034";
const PHONE_TEL = "tel:+16504441034";
const WHATSAPP_URL =
  "https://wa.me/16289461839?text=Hi%20Alex%2C%20I%20need%20locksmith%20services";

// Soft per-session cap on visitor messages, enforced in the UI only.
const MAX_USER_MESSAGES = 20;

const STORE_KEY = "alx_chat_v1";

type ChatMessage = { role: "user" | "assistant"; content: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LINKIFY =
  /(https?:\/\/[^\s<]+)|(\bwww\.[^\s<]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|((?:\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4})/g;

// Turn URLs, phone numbers, and emails in assistant replies into clickable
// links. Escape first (content is model output), then a single combined pass
// so we never re-process inside a link we just inserted.
function linkify(text: string): string {
  return escapeHtml(text).replace(LINKIFY, (m, url, www, email, phone) => {
    if (url) {
      const shown = /wa\.me/i.test(url) ? "WhatsApp" : url;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${shown}</a>`;
    }
    if (www)
      return `<a href="https://${www}" target="_blank" rel="noopener noreferrer">${www}</a>`;
    if (email) return `<a href="mailto:${email}">${email}</a>`;
    if (phone) {
      const d = phone.replace(/\D/g, "");
      if (d.length < 10) return phone;
      const tel = d.length === 10 ? `+1${d}` : `+${d}`;
      return `<a href="tel:${tel}">${phone}</a>`;
    }
    return m;
  });
}

type Action = { label: string; href: string; primary?: boolean };

// Surface the next step as real buttons rather than bare text in the reply.
function actionsFor(text: string): Action[] {
  const acts: Action[] = [];
  if (/wa\.me/i.test(text)) {
    acts.push({ label: "WhatsApp Us", href: WHATSAPP_URL, primary: true });
  }
  const p = text.match(/(?:\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/);
  if (p) {
    const d = p[0].replace(/\D/g, "");
    if (d.length >= 10) {
      acts.push({
        label: `Call ${p[0].trim()}`,
        href: `tel:${d.length === 10 ? `+1${d}` : `+${d}`}`,
      });
    }
  }
  return acts;
}

type StoredState = {
  messages: ChatMessage[];
  limitReached: boolean;
};

function loadState(): StoredState | null {
  try {
    const raw = window.sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as StoredState;
    if (!s || !Array.isArray(s.messages) || !s.messages.length) return null;
    return s;
  } catch {
    return null;
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Restore the conversation across page navigations (per tab).
  // sessionStorage is only readable after mount (SSR renders the greeting),
  // so a post-mount setState is the hydration-safe way to load it.
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages(saved.messages);
      setLimitReached(saved.limitReached);
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORE_KEY,
        JSON.stringify({ messages, limitReached }),
      );
    } catch {}
  }, [messages, limitReached]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending, open, error]);

  const isMobile = () =>
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 640px)").matches
      : window.innerWidth <= 640;

  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    if (open && isMobile()) document.body.classList.add("alx-chat-locked");
    else document.body.classList.remove("alx-chat-locked");
    return () => document.body.classList.remove("alx-chat-locked");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = (text || "").trim();
      if (!trimmed || sending || limitReached) return;
      setError(null);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(next);
      setInput("");
      setSending(true);

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
        .then((res) =>
          res.json().then((d) => ({ ok: res.ok, d: d as { reply?: string; error?: string } })),
        )
        .then((r) => {
          if (!r.ok) throw new Error(r.d?.error || "Something went wrong.");
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: r.d.reply ?? "" },
          ]);
          const users = next.filter((m) => m.role === "user").length;
          if (users >= MAX_USER_MESSAGES) setLimitReached(true);
        })
        .catch((err: Error) => {
          setError(err.message || "Something went wrong.");
        })
        .finally(() => setSending(false));
    },
    [messages, sending, limitReached],
  );

  const openChat = () => {
    setOpen(true);
    // Don't autofocus on mobile — it yanks the keyboard up over the sheet.
    if (!isMobile() && !limitReached) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const lockMessage = `Thanks for chatting! To keep going, let's get you to a person — call or text ${PHONE_DISPLAY}, or message Alex on WhatsApp: ${WHATSAPP_URL}`;

  return (
    <div className={`alx-chat-root${open ? " is-open" : ""}`} id="alx-chat">
      {/* Scrim (mobile bottom-sheet only) */}
      <div className="alx-chat-scrim" onClick={() => setOpen(false)} />

      {/* Panel / bottom sheet */}
      <div
        className="alx-chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Alex the Locksmith AI Assistant"
      >
        <div className="alx-chat-grabber" aria-hidden="true" />

        <div className="alx-chat-header">
          <span className="alx-chat-title">
            <span className="alx-chat-dot" /> Alex&apos;s AI Assistant
          </span>
          <div className="alx-chat-header-actions">
            <a
              href={PHONE_TEL}
              className="alx-chat-icon"
              aria-label="Call us"
              title="Call us"
            >
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="alx-chat-icon"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <button
              type="button"
              className="alx-chat-icon alx-chat-close-btn"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
        </div>

        <div className="alx-chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className="alx-chat-msg-group">
              {m.role === "user" ? (
                <div className="alx-chat-msg alx-chat-msg-user">{m.content}</div>
              ) : (
                <>
                  <div
                    className="alx-chat-msg alx-chat-msg-assistant"
                    dangerouslySetInnerHTML={{ __html: linkify(m.content) }}
                  />
                  {actionsFor(m.content).length > 0 && (
                    <div className="alx-chat-actions">
                      {actionsFor(m.content).map((a) => (
                        <a
                          key={a.label}
                          className={`alx-chat-action${a.primary ? " is-primary" : ""}`}
                          href={a.href}
                          {...(/^https?:/i.test(a.href)
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {a.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {sending && <div className="alx-chat-typing">…</div>}
          {error && <div className="alx-chat-error">{error}</div>}
          {messages.length === 1 && !limitReached && (
            <div className="alx-chat-quick">
              {QUICK.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          {limitReached && (
            <div className="alx-chat-msg-group">
              <div
                className="alx-chat-msg alx-chat-msg-assistant"
                dangerouslySetInnerHTML={{ __html: linkify(lockMessage) }}
              />
              <div className="alx-chat-actions">
                {actionsFor(lockMessage).map((a) => (
                  <a
                    key={a.label}
                    className={`alx-chat-action${a.primary ? " is-primary" : ""}`}
                    href={a.href}
                    {...(/^https?:/i.test(a.href)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {a.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Persistent, visible AI disclaimer (not buried in ToS). */}
        <p className="alx-chat-disclaimer">
          AI-generated — we&apos;ll confirm anything that matters directly.
        </p>

        <form
          className="alx-chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="alx-chat-input"
            placeholder={limitReached ? "Chat limit reached" : "Type a message…"}
            aria-label="Message"
            autoComplete="off"
            disabled={limitReached}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="alx-chat-send"
            aria-label="Send"
            disabled={sending || limitReached}
          >
            Send
          </button>
        </form>
      </div>

      {/* Launcher */}
      <button
        type="button"
        className="alx-chat-launcher"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openChat())}
      >
        <span className="alx-chat-launcher-dot" />
        Chat with us
      </button>

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.alx-chat-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  font-family: inherit;
}

/* ---------- Launcher ---------- */
.alx-chat-launcher {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: none;
  cursor: pointer;
  background: #2c2e6a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 18px;
  border-radius: 999px;
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.45);
  transition: background 0.15s ease, transform 0.15s ease;
}
.alx-chat-launcher:hover { background: #212352; transform: translateY(-1px); }
.alx-chat-launcher-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #a7f3d0; box-shadow: 0 0 8px #6ee7b7;
}

/* ---------- Scrim (mobile sheet only) ---------- */
.alx-chat-scrim {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0; visibility: hidden;
  transition: opacity .25s ease, visibility .25s ease;
  z-index: -1;
}

/* ---------- Panel (desktop popout) ---------- */
.alx-chat-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: min(370px, calc(100vw - 40px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.35);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity .18s ease, transform .18s ease, visibility .18s ease;
}
.alx-chat-root.is-open .alx-chat-panel {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.alx-chat-grabber { display: none; }

.alx-chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 16px;
  background: #2c2e6a; color: #fff;
  flex: none;
}
.alx-chat-title { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; }
.alx-chat-dot { width: 8px; height: 8px; border-radius: 50%; background: #a7f3d0; box-shadow: 0 0 8px #6ee7b7; }
.alx-chat-header-actions { display: inline-flex; align-items: center; gap: 14px; }
.alx-chat-icon {
  display: inline-flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer; padding: 2px;
  color: rgba(255,255,255,0.9); line-height: 1; text-decoration: none;
}
.alx-chat-icon:hover { color: #fff; }
.alx-chat-close-btn { font-size: 22px; }

.alx-chat-body {
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px;
  flex: 1 1 auto;
  min-height: 120px;
  max-height: 340px;
  overflow-y: auto;
  background: #f9fafb;
  -webkit-overflow-scrolling: touch;
}
.alx-chat-msg-group { display: flex; flex-direction: column; gap: 10px; }
.alx-chat-msg {
  max-width: 88%; padding: 10px 12px; border-radius: 12px;
  font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-wrap: break-word;
}
.alx-chat-msg-assistant { align-self: flex-start; background: #fff; border: 1px solid #e5e7eb; color: #1f2937; }
.alx-chat-msg-user { align-self: flex-end; background: #2c2e6a; color: #fff; }
.alx-chat-msg a { color: #2c2e6a; text-decoration: underline; word-break: break-word; }
.alx-chat-msg-user a { color: #e2dcd3; }
.alx-chat-typing { align-self: flex-start; color: #9ca3af; font-size: 18px; letter-spacing: 2px; padding: 6px 12px; }
.alx-chat-error { align-self: flex-start; color: #dc2626; font-size: 12.5px; }
.alx-chat-quick { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 4px; }
.alx-chat-quick button {
  cursor: pointer; background: #fff; border: 1px solid #d1d5db; color: #2c2e6a;
  border-radius: 999px; padding: 8px 13px; font-size: 13px; font-weight: 600;
}
.alx-chat-quick button:hover { border-color: #2c2e6a; }

/* Action buttons under a reply (call / WhatsApp) */
.alx-chat-actions {
  display: flex; flex-wrap: wrap; gap: 8px;
  align-self: flex-start; max-width: 100%;
}
.alx-chat-action {
  display: inline-flex; align-items: center;
  font-size: 13px; font-weight: 700; text-decoration: none;
  border: 1px solid #2c2e6a; color: #2c2e6a; background: #fff;
  border-radius: 999px; padding: 9px 14px; line-height: 1;
}
.alx-chat-action:hover { background: #eef0ff; }
.alx-chat-action.is-primary { background: #25D366; color: #fff; border-color: #25D366; }
.alx-chat-action.is-primary:hover { opacity: 0.9; }

.alx-chat-disclaimer {
  margin: 0; padding: 7px 12px; background: #f3f4f6; border-top: 1px solid #e5e7eb;
  color: #6b7280; font-size: 11px; line-height: 1.4; text-align: center; flex: none;
}
.alx-chat-form {
  display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e5e7eb; background: #fff;
  flex: none;
}
.alx-chat-input {
  flex: 1; min-width: 0; border: 1px solid #d1d5db; border-radius: 9px;
  padding: 11px; font-size: 16px; color: #1f2937; outline: none;
}
.alx-chat-input:focus { border-color: #2c2e6a; }
.alx-chat-send {
  cursor: pointer; border: none; background: #2c2e6a; color: #fff;
  font-weight: 600; padding: 0 16px; border-radius: 9px; font-size: 14px; flex: none;
}
.alx-chat-send:disabled { opacity: 0.5; cursor: default; }

/* ================= MOBILE: bottom sheet ================= */
@media (max-width: 640px) {
  .alx-chat-root { right: 16px; bottom: 16px; }

  .alx-chat-scrim { z-index: 1; }
  .alx-chat-root.is-open .alx-chat-scrim { opacity: 1; visibility: visible; }

  .alx-chat-panel {
    position: fixed;
    left: 0; right: 0; bottom: 0;
    top: auto;
    width: 100%;
    max-width: 100%;
    height: 85dvh;
    max-height: 85dvh;
    border: none;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -12px 40px -8px rgba(0, 0, 0, 0.35);
    transform: translateY(100%);
    opacity: 1;
    transition: transform .3s cubic-bezier(.32, .72, 0, 1), visibility .3s;
    z-index: 2;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .alx-chat-root.is-open .alx-chat-panel { transform: translateY(0); }

  /* Grabber sits in a brand band so it reads as one piece with the header. */
  .alx-chat-grabber {
    display: block;
    width: 100%;
    background: #2c2e6a;
    padding: 9px 0 3px;
    flex: none;
  }
  .alx-chat-grabber::before {
    content: "";
    display: block;
    width: 40px; height: 4px; border-radius: 999px;
    background: rgba(255, 255, 255, 0.55);
    margin: 0 auto;
  }

  .alx-chat-body { max-height: none; }

  /* The sheet owns the bottom of the screen — hide the launcher while open. */
  .alx-chat-root.is-open .alx-chat-launcher { display: none; }
}

@media (max-width: 640px) {
  body.alx-chat-locked { overflow: hidden; }
}
`;
