"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function EkrarAIFloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; action?: any }>>([
    {
      sender: "bot",
      text: "Namaste! I am Ekrar Intelligence, your AI rental copilot. Ask me anything about property vacancies, pending dues, or lease deed clauses in Hindi or English.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const quickPrompts = [
    "किसका rent pending है?",
    "कितने rooms vacant हैं?",
    "इस महीने collection कितनी हुई?",
    "Pending tenants को WhatsApp reminder भेजो",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await api.askAI(textToSend, conversationId);
      if (res.success && res.data) {
        setConversationId(res.data.conversation_id);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: res.data.message.content,
            action: res.data.action,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `⚠️ Please sign in to your Owner account to query organization data. (${err.message || "Failed to reach AI"})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async (actionId: string) => {
    try {
      setLoading(true);
      const res = await api.confirmAIAction(actionId);
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `✅ Action Confirmed: ${res.message}`,
          },
        ]);
      }
    } catch (err: any) {
      alert("Error confirming action: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button - Apple Floating Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 bg-[#1d1d1f] hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl border border-white/10 transition-all duration-300 hover:scale-105 group"
        >
          <div className="w-6 h-6 rounded-full bg-[#0071e3] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span className="font-medium text-xs tracking-tight text-[#f5f5f7]">Ekrar Intelligence</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-[#2997ff] font-semibold border border-white/10">
            AI
          </span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[420px] max-h-[620px] h-[80vh] bg-white rounded-3xl shadow-2xl border border-black/[0.08] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 font-sans">
          {/* Header - Apple Dark Obsidian */}
          <div className="bg-[#1d1d1f] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center font-bold text-white shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-[#f5f5f7] flex items-center gap-1.5">
                  Ekrar AI Assistant
                  <span className="text-[9px] bg-[#0071e3]/20 text-[#2997ff] border border-[#0071e3]/40 px-1.5 py-0.2 rounded-full font-medium">
                    Active
                  </span>
                </h3>
                <p className="text-[10px] text-[#86868b]">Bilingual Rental Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#86868b] hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#f5f5f7] border-b border-black/[0.06] px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-[#86868b] font-medium shrink-0 text-[10px] uppercase tracking-wider">Ask:</span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="shrink-0 bg-white border border-black/[0.08] text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] px-2.5 py-1 rounded-full transition text-[11px] font-normal shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbfbfd]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5 text-[#2997ff]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-[#0071e3] text-white font-normal rounded-tr-xs shadow-xs"
                      : "bg-white border border-black/[0.08] text-[#1d1d1f] rounded-tl-xs shadow-xs"
                  }`}
                >
                  {m.text}

                  {/* Sensitive Action Approval Banner */}
                  {m.action && m.action.status === "PREPARED" && (
                    <div className="mt-3 p-3 bg-[#f5f5f7] border border-black/[0.08] rounded-xl space-y-2 text-[#1d1d1f]">
                      <div className="flex items-center space-x-1.5 text-[#1d1d1f] font-semibold text-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span>Action Requires Confirmation</span>
                      </div>
                      <p className="text-[11px] text-[#86868b]">{m.action.preview_summary}</p>
                      <button
                        onClick={() => handleConfirmAction(m.action.id)}
                        disabled={loading}
                        className="w-full py-2 px-3 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full text-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm & Send Reminders</span>
                      </button>
                    </div>
                  )}
                </div>
                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#86868b]" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-[#86868b] text-xs">
                <Bot className="w-4 h-4 animate-spin text-[#0071e3]" />
                <span>Ekrar AI is querying data...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-black/[0.06] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request action..."
              className="flex-1 bg-[#f5f5f7] border border-transparent focus:border-[#0071e3] focus:bg-white rounded-full px-4 py-2 text-xs outline-none transition text-[#1d1d1f]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white rounded-full transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
