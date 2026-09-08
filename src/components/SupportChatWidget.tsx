"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hallo! 👋 Ich bin der Offertenprofi.ch-Support. Frag mich gerne, wie die Plattform funktioniert, wie Aufträge oder Freischaltungen ablaufen, oder was du sonst wissen möchtest.",
};

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      const reply: string =
        data.reply || "Entschuldigung, da ist etwas schiefgelaufen. Bitte versuch es nochmal.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Entschuldigung, der Chat ist gerade nicht erreichbar. Bitte versuch es später nochmal.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-primary-700 px-4 py-3">
            <p className="text-sm font-semibold text-white">Offertenprofi.ch Support</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-primary-100 hover:text-white"
              aria-label="Chat schliessen"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-accent-500 text-white"
                    : "bg-primary-50 text-primary-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-primary-400">
                <Loader2 size={14} className="animate-spin" /> Schreibt...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-primary-100 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Deine Frage..."
              className="flex-1 rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-800 focus:border-accent-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-accent-500 text-white hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Senden"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-xl hover:bg-accent-600"
        aria-label="Support-Chat öffnen"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
