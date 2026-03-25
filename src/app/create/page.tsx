"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "ai/react";
import { createClient } from "@/lib/supabase/client";
import { InvitationCard } from "@/components/wedding/invitation-card";
import { builtInThemes } from "@/config/themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sparkles,
  Send,
  Loader2,
  Heart,
  Check,
  ArrowLeft,
  Eye,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import type { ThemeConfig, Wedding } from "@/types";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>}>
      <CreateFlow />
    </Suspense>
  );
}

function parseCardData(messages: { role: string; content: string }[]) {
  // Find the latest card_data from AI messages (search from end)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant") {
      const match = msg.content.match(/<card_data>([\s\S]*?)<\/card_data>/);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch {
          continue;
        }
      }
    }
  }
  return null;
}

function stripCardData(content: string) {
  return content.replace(/<card_data>[\s\S]*?<\/card_data>/g, "").trim();
}

function CreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const supabase = createClient();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const { messages, input, setInput, handleSubmit, isLoading, append } = useChat({
    api: "/api/ai/chat",
  });

  // Auto-send initial prompt
  useEffect(() => {
    if (initialPrompt && !hasSentInitial) {
      setHasSentInitial(true);
      append({ role: "user", content: initialPrompt });
    } else if (!initialPrompt && !hasSentInitial) {
      setHasSentInitial(true);
      append({ role: "user", content: "Hi, I want to create a wedding invitation card." });
    }
  }, [initialPrompt, hasSentInitial, append]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse card data from messages
  const cardData = parseCardData(messages);
  const theme: ThemeConfig = cardData?.theme || builtInThemes[0];
  const weddingInfo = cardData?.wedding || {};
  const cardStatus = cardData?.status || "gathering_style";

  const mockWedding: Wedding = {
    id: "",
    slug: "",
    userId: "",
    groomName: weddingInfo.groomName || "Your Name",
    brideName: weddingInfo.brideName || "Partner's Name",
    groomFamily: weddingInfo.groomFamily || null,
    brideFamily: weddingInfo.brideFamily || null,
    eventDate: weddingInfo.eventDate ? new Date(weddingInfo.eventDate) : new Date("2026-12-25T19:00:00"),
    venue: weddingInfo.venue || "Your Venue",
    venueAddress: weddingInfo.venueAddress || null,
    venueMapUrl: null,
    themeId: theme.id || "ai",
    themeConfig: theme,
    cardImageUrl: null,
    customMessage: weddingInfo.customMessage || null,
    paymentMethod: null,
    paymentDetails: null,
    status: "DRAFT",
    expiresAt: null,
    exportedAt: null,
    exportUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const handlePublish = async () => {
    if (!weddingInfo.groomName || !weddingInfo.brideName || !weddingInfo.venue) {
      toast.error("Please provide all wedding details first");
      return;
    }
    setPublishing(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.setItem("pendingWedding", JSON.stringify({
        form: weddingInfo,
        theme,
      }));
      toast.info("Create an account to publish");
      router.push("/register?redirect=/create/publish");
      return;
    }

    const slug = `${weddingInfo.groomName}-and-${weddingInfo.brideName}-${Date.now().toString(36)}`
      .toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { data, error } = await supabase
      .from("Wedding")
      .insert({
        slug,
        userId: user.id,
        groomName: weddingInfo.groomName,
        brideName: weddingInfo.brideName,
        groomFamily: weddingInfo.groomFamily || null,
        brideFamily: weddingInfo.brideFamily || null,
        eventDate: weddingInfo.eventDate || new Date("2026-12-25T19:00:00").toISOString(),
        venue: weddingInfo.venue,
        venueAddress: weddingInfo.venueAddress || null,
        customMessage: weddingInfo.customMessage || null,
        themeId: theme.id || "ai",
        themeConfig: theme,
        status: "PUBLISHED",
      })
      .select("id")
      .single();

    if (error) {
      toast.error(error.message);
      setPublishing(false);
      return;
    }

    toast.success("Invitation published!");
    router.push(`/dashboard/${data.id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      {/* Top bar */}
      <header className="h-14 border-b border-gray-200/60 bg-white flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Nikah Invite</span>
          </div>
          {cardStatus !== "gathering_style" && (
            <div className="hidden sm:flex items-center gap-1.5 ml-3 text-[11px] text-gray-400">
              <div className={`w-1.5 h-1.5 rounded-full ${cardData ? "bg-green-400" : "bg-gray-300"}`} />
              {cardStatus === "ready" ? "Card ready" : "Building..."}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 gap-1.5 hidden sm:flex"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 gap-1.5 sm:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {cardStatus === "ready" && (
            <Button
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 rounded-lg text-xs h-8 px-4"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
              Publish
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        <div className={`flex flex-col ${showPreview ? "w-full sm:w-1/2 sm:border-r border-gray-200/60" : "w-full"} bg-white`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
              {messages.map((msg) => {
                const displayContent = msg.role === "assistant" ? stripCardData(msg.content) : msg.content;
                if (!displayContent) return null;

                return (
                  <div key={msg.id} className="space-y-1">
                    {/* Role label */}
                    <div className="flex items-center gap-1.5">
                      {msg.role === "assistant" ? (
                        <>
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Sparkles className="h-2.5 w-2.5 text-gray-500" />
                          </div>
                          <span className="text-[11px] font-medium text-gray-400">Nikah AI</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-md bg-gray-900 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white">U</span>
                          </div>
                          <span className="text-[11px] font-medium text-gray-400">You</span>
                        </>
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pl-7 text-[13.5px] leading-relaxed ${msg.role === "assistant" ? "text-gray-700" : "text-gray-900"}`}>
                      {displayContent}
                    </div>
                  </div>
                );
              })}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-gray-500" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-400">Nikah AI</span>
                  </div>
                  <div className="pl-7 flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4 shrink-0 bg-white">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your dream wedding card..."
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-20 shrink-0"
                >
                  <Send className="h-3 w-3 text-white" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                AI will design your card based on your conversation
              </p>
            </form>
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="hidden sm:flex flex-col w-1/2 bg-[#f5f5f4] overflow-y-auto">
            <div className="flex-1 flex items-start justify-center p-8">
              <div className="w-full max-w-[380px] sticky top-8">
                {/* Status bar */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cardStatus === "ready" ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
                    <span className="text-[11px] text-gray-500 font-medium">
                      {cardStatus === "ready" ? "Card complete" :
                       cardStatus === "gathering_style" ? "Designing theme..." :
                       cardStatus === "gathering_names" ? "Adding names..." :
                       cardStatus === "gathering_date" ? "Setting date..." :
                       cardStatus === "gathering_venue" ? "Adding venue..." :
                       cardStatus === "gathering_message" ? "Adding message..." :
                       "Building..."}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Live preview</span>
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 transition-all duration-500"
                  style={{ backgroundColor: theme.colors?.background || "#FAF8F5" }}
                >
                  <InvitationCard wedding={mockWedding} theme={theme} />
                </div>

                {/* Theme info */}
                <div className="mt-4 flex items-center gap-3 px-1">
                  <div className="flex gap-1">
                    {theme.colors && Object.values(theme.colors).slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: color as string }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{theme.name || "Theme"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile preview overlay */}
      {showPreview && (
        <div className="sm:hidden fixed inset-0 z-50 bg-[#f5f5f4] overflow-y-auto">
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 flex items-center justify-between px-4 h-12 z-10">
            <span className="text-xs font-medium text-gray-500">Live Preview</span>
            <button onClick={() => setShowPreview(false)} className="text-xs text-gray-500 underline underline-offset-2">
              Back to chat
            </button>
          </div>
          <div className="flex justify-center p-6">
            <div className="w-full max-w-[380px]">
              <div
                className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5"
                style={{ backgroundColor: theme.colors?.background || "#FAF8F5" }}
              >
                <InvitationCard wedding={mockWedding} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
