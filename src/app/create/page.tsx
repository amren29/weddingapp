"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InvitationCard } from "@/components/wedding/invitation-card";
import { builtInThemes } from "@/config/themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  Heart,
  Check,
  ArrowLeft,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import type { ThemeConfig, Wedding } from "@/types";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-neutral-950"><Loader2 className="h-5 w-5 animate-spin text-neutral-600" /></div>}>
      <CreateFlow />
    </Suspense>
  );
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function parseCardData(msgs: Message[]) {
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === "assistant") {
      const m = msgs[i].content.match(/<card_data>([\s\S]*?)<\/card_data>/);
      if (m) { try { return JSON.parse(m[1]); } catch { continue; } }
    }
  }
  return null;
}

function stripCardData(s: string) {
  return s.replace(/<card_data>[\s\S]*?<\/card_data>/g, "").trim();
}

function CreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const supabase = createClient();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [started, setStarted] = useState(false);

  const scroll = () => setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

  const sendMessage = useCallback(async (text: string, prev: Message[]) => {
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const all = [...prev, userMsg];
    setMessages(all);
    setIsLoading(true);
    scroll();

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: all.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error();
      const { reply } = await res.json();
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: "assistant", content: "I had a hiccup. Could you say that again?" }]);
    } finally {
      setIsLoading(false);
      scroll();
    }
  }, []);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    sendMessage(initialPrompt || "Hi, I want to create a wedding invitation.", []);
  }, [initialPrompt, started, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim(), messages);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const cardData = parseCardData(messages);
  const theme: ThemeConfig = cardData?.theme || builtInThemes[0];
  const info = cardData?.wedding || {};
  const status = cardData?.status || "gathering_style";

  const mockWedding: Wedding = {
    id: "", slug: "", userId: "",
    groomName: info.groomName || "Your Name",
    brideName: info.brideName || "Partner",
    groomFamily: info.groomFamily || null,
    brideFamily: info.brideFamily || null,
    eventDate: info.eventDate ? new Date(info.eventDate) : new Date("2026-12-25T19:00:00"),
    venue: info.venue || "Venue",
    venueAddress: info.venueAddress || null,
    venueMapUrl: null, themeId: theme.id || "ai", themeConfig: theme,
    cardImageUrl: null, customMessage: info.customMessage || null,
    paymentMethod: null, paymentDetails: null, status: "DRAFT",
    expiresAt: null, exportedAt: null, exportUrl: null,
    createdAt: new Date(), updatedAt: new Date(),
  };

  const handlePublish = async () => {
    if (!info.groomName || !info.brideName || !info.venue) {
      toast.error("Still need some details — keep chatting!");
      return;
    }
    setPublishing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      sessionStorage.setItem("pendingWedding", JSON.stringify({ form: info, theme }));
      router.push("/register?redirect=/create/publish");
      return;
    }
    const slug = `${info.groomName}-and-${info.brideName}-${Date.now().toString(36)}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase.from("Wedding").insert({
      slug, userId: user.id, groomName: info.groomName, brideName: info.brideName,
      groomFamily: info.groomFamily || null, brideFamily: info.brideFamily || null,
      eventDate: info.eventDate || new Date("2026-12-25T19:00:00").toISOString(),
      venue: info.venue, venueAddress: info.venueAddress || null,
      customMessage: info.customMessage || null,
      themeId: theme.id || "ai", themeConfig: theme, status: "PUBLISHED",
    }).select("id").single();
    if (error) { toast.error(error.message); setPublishing(false); return; }
    toast.success("Published!");
    router.push(`/dashboard/${data.id}`);
  };

  const visibleMessages = messages.filter((m) => {
    if (m.role === "assistant") return stripCardData(m.content).length > 0;
    return true;
  });

  return (
    <div className="h-screen flex bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar / Chat */}
      <div className={`flex flex-col h-full ${showPreview ? "hidden sm:flex sm:w-[480px]" : "w-full"} border-r border-white/[0.06]`}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-neutral-500 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-neutral-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium leading-none">Nikah AI</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {isLoading ? "Thinking..." : status === "ready" ? "Card ready" : "Designing your card"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg transition-all"
            >
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            {status === "ready" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 text-[12px] font-medium bg-white text-neutral-950 hover:bg-neutral-200 px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                {publishing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                Publish
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-lg mx-auto px-5 py-8 space-y-6">
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={`${msg.role === "user" ? "flex justify-end" : ""}`}>
                {msg.role === "assistant" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center ring-1 ring-white/10">
                        <Sparkles className="h-2.5 w-2.5 text-violet-400" />
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">Nikah AI</span>
                    </div>
                    <div className="ml-7 text-[13.5px] leading-[1.7] text-neutral-300">
                      {stripCardData(msg.content)}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.07] border border-white/[0.06] rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                    <p className="text-[13.5px] leading-[1.6] text-neutral-200">{msg.content}</p>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center ring-1 ring-white/10">
                    <Sparkles className="h-2.5 w-2.5 text-violet-400" />
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">Nikah AI</span>
                </div>
                <div className="ml-7 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[11px] text-neutral-600">
                    {status === "gathering_style" ? "Designing your theme..." :
                     status === "gathering_names" ? "Setting up names..." :
                     status === "gathering_date" ? "Configuring date..." :
                     "Working on it..."}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 shrink-0">
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="relative bg-white/[0.05] border border-white/[0.08] rounded-xl focus-within:border-white/[0.15] focus-within:bg-white/[0.07] transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell Nikah AI about your dream wedding card..."
                rows={1}
                className="w-full bg-transparent text-[13.5px] text-neutral-200 placeholder:text-neutral-600 px-4 pt-3 pb-10 resize-none focus:outline-none"
                disabled={isLoading}
              />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] text-neutral-700">
                  {status === "ready" ? "Your card is ready to publish" : "Press Enter to send"}
                </span>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-20"
                >
                  <Send className="h-3 w-3 text-neutral-400" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Preview panel */}
      <div className={`${showPreview ? "flex" : "hidden sm:flex"} flex-1 flex-col bg-neutral-900/50 overflow-hidden`}>
        {/* Preview header */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === "ready" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
              <span className="text-[12px] text-neutral-500 font-medium">
                {status === "ready" ? "Card complete" :
                 status === "gathering_style" ? "Generating theme..." :
                 status === "gathering_names" ? "Adding couple names..." :
                 status === "gathering_date" ? "Setting event date..." :
                 status === "gathering_venue" ? "Adding venue..." :
                 status === "gathering_message" ? "Adding message..." :
                 "Live preview"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Color dots */}
            {cardData && theme.colors && (
              <div className="hidden sm:flex items-center gap-1">
                {Object.values(theme.colors).map((color, i) => (
                  <div key={i} className="w-3 h-3 rounded-full ring-1 ring-white/10" style={{ backgroundColor: color as string }} />
                ))}
              </div>
            )}
            <button
              onClick={() => setShowPreview(false)}
              className="sm:hidden text-neutral-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card preview */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-6 sm:p-10">
          <div className="w-full max-w-[400px]">
            <div
              className="rounded-2xl overflow-hidden ring-1 ring-white/[0.08] shadow-2xl transition-all duration-700"
              style={{ backgroundColor: theme.colors?.background || "#FAF8F5" }}
            >
              <InvitationCard wedding={mockWedding} theme={theme} />
            </div>

            {/* Theme label */}
            {cardData && (
              <div className="mt-4 text-center">
                <span className="text-[11px] text-neutral-600">{theme.name || "Custom Theme"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
