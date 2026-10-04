"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Sparkles, Send, User, Bot, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface Message { role: "user" | "ai"; text: string; action?: any; }

export default function DashboardAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Namaste! 🙏 I'm Ekrar AI — your rental business assistant. Ask me anything about your properties, tenants, rent, agreements, or complaints. I understand Hindi and English.\n\nTry: \"किसका rent pending है?\" or \"How many rooms are vacant?\"" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.askAI(userMsg, conversationId);
      if (res.success && res.data) {
        setConversationId(res.data.conversation_id);
        setMessages((prev) => [...prev, {
          role: "ai", text: res.data.response, action: res.data.pending_action,
        }]);
      }
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I couldn't process that request. Please try again." }]);
    } finally { setLoading(false); }
  };

  const handleConfirmAction = async (actionId: string) => {
    try {
      const res = await api.confirmAIAction(actionId);
      if (res.success) {
        setMessages((prev) => [...prev, { role: "ai", text: "✅ Action executed successfully!" }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "ai", text: "❌ Action failed. Please try again." }]);
    }
  };

  const suggestions = [
    "किसका rent pending है?",
    "How many rooms are vacant?",
    "Show expiring agreements",
    "इस महीने collection कितनी हुई?",
    "Pending KYC list",
    "Open complaints count",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><Sparkles className="w-5 h-5"/></div>
          <div><h1 className="text-lg font-black">Ekrar AI</h1><p className="text-xs text-indigo-200">Your bilingual rental business assistant</p></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-md"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
            }`}>
              <div className="flex items-start gap-2">
                {msg.role === "ai" && <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5"/>}
                <div className="whitespace-pre-wrap text-xs leading-relaxed">{msg.text}</div>
              </div>
              {msg.action && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] text-amber-800 font-bold flex items-center gap-1 mb-2"><AlertTriangle className="w-3 h-3"/>Action requires confirmation</p>
                  <p className="text-[10px] text-amber-700 mb-2">{msg.action.description}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>handleConfirmAction(msg.action.id)} className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Confirm</button>
                    <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg hover:bg-slate-300 transition">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm"><Loader2 className="w-4 h-4 text-indigo-600 animate-spin"/></div></div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto scrollbar-hide">
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>{setInput(s);}} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-[10px] font-bold shrink-0 hover:bg-indigo-100 transition">{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-slate-200">
        <form onSubmit={(e)=>{e.preventDefault();handleSend();}} className="flex gap-2">
          <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask Ekrar AI anything about your business..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 transition"/>
          <button type="submit" disabled={loading || !input.trim()} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"><Send className="w-4 h-4"/><span>Send</span></button>
        </form>
      </div>
    </div>
  );
}
