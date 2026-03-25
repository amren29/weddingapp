"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InvitationCard } from "@/components/wedding/invitation-card";
import { builtInThemes } from "@/config/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sparkles,
  Send,
  Loader2,
  Heart,
  Check,
  Bot,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import type { ThemeConfig, Wedding } from "@/types";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}>
      <CreateFlow />
    </Suspense>
  );
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  typing?: boolean;
}

function CreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const supabase = createClient();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const [theme, setTheme] = useState<ThemeConfig>(builtInThemes[0]);
  const [wedding, setWedding] = useState({
    groomName: "",
    brideName: "",
    groomFamily: "",
    brideFamily: "",
    eventDate: "",
    venue: "",
    venueAddress: "",
    customMessage: "",
  });

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start with initial prompt
  useEffect(() => {
    if (initialPrompt) {
      addMessage("user", initialPrompt);
      processPrompt(initialPrompt);
    } else {
      addMessage("ai", "Hi! I'm your wedding invitation designer. Describe the style you want — colors, mood, theme — and I'll create it for you.");
    }
  }, []);

  const addMessage = (role: "user" | "ai", content: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const addTypingMessage = (content: string, delay: number = 0): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "ai", content }]);
        resolve();
      }, delay);
    });
  };

  const processPrompt = async (text: string) => {
    setIsThinking(true);

    // Step 1: Acknowledge
    await addTypingMessage("Understanding your vision...", 500);

    // Step 2: Generate theme
    await addTypingMessage("🎨 Generating color palette and typography...", 1000);

    try {
      const res = await fetch("/api/ai/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (res.ok) {
        const generatedTheme = await res.json();
        setTheme(generatedTheme);
        await addTypingMessage(`✅ Theme created: **${generatedTheme.name}**\n\nColors: ${generatedTheme.colors.primary}, ${generatedTheme.colors.secondary}, ${generatedTheme.colors.accent}\nFonts: ${generatedTheme.fonts.heading} + ${generatedTheme.fonts.body}`, 800);
      } else {
        const fallback = builtInThemes[Math.floor(Math.random() * builtInThemes.length)];
        setTheme(fallback);
        await addTypingMessage(`✅ I've selected **${fallback.name}** theme for you.`, 800);
      }
    } catch {
      const fallback = builtInThemes[Math.floor(Math.random() * builtInThemes.length)];
      setTheme(fallback);
      await addTypingMessage(`✅ I've selected **${fallback.name}** theme for you.`, 800);
    }

    // Step 3: Ask for details
    await addTypingMessage("Now I need some details. What are the **couple's names**? (e.g., Ahmad & Sarah)", 600);
    setIsThinking(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const text = input.trim();
    setInput("");
    addMessage("user", text);

    setIsThinking(true);

    // Smart parsing of user responses
    if (!wedding.groomName) {
      // Try to parse names
      const nameMatch = text.match(/(.+?)(?:\s*[&+]\s*|\s+and\s+)(.+)/i);
      if (nameMatch) {
        const groom = nameMatch[1].trim();
        const bride = nameMatch[2].trim();
        setWedding((prev) => ({ ...prev, groomName: groom, brideName: bride }));
        await addTypingMessage(`✅ Got it — **${groom}** & **${bride}**`, 500);
        await addTypingMessage("When is the wedding? (e.g., 25 December 2026, 7pm)", 600);
      } else {
        // Single name, assume groom
        setWedding((prev) => ({ ...prev, groomName: text }));
        await addTypingMessage(`✅ Groom: **${text}**. What's the bride's name?`, 500);
      }
    } else if (!wedding.brideName) {
      setWedding((prev) => ({ ...prev, brideName: text }));
      await addTypingMessage(`✅ **${wedding.groomName}** & **${text}**`, 500);
      await addTypingMessage("When is the wedding? (e.g., 25 December 2026, 7pm)", 600);
    } else if (!wedding.eventDate) {
      // Try to parse date
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        setWedding((prev) => ({ ...prev, eventDate: parsed.toISOString() }));
        await addTypingMessage(`✅ Date set: **${parsed.toLocaleDateString("en-US", { dateStyle: "full" })}**`, 500);
      } else {
        // Try common formats
        setWedding((prev) => ({ ...prev, eventDate: new Date("2026-12-25T19:00:00").toISOString() }));
        await addTypingMessage(`✅ I'll set the date for now — you can edit it later.`, 500);
      }
      await addTypingMessage("Where's the venue? (e.g., The Grand Ballroom, KL)", 600);
    } else if (!wedding.venue) {
      setWedding((prev) => ({ ...prev, venue: text }));
      await addTypingMessage(`✅ Venue: **${text}**`, 500);
      await addTypingMessage("Any personal message for your guests? (or type 'skip')", 600);
    } else if (!wedding.customMessage) {
      if (text.toLowerCase() !== "skip") {
        setWedding((prev) => ({ ...prev, customMessage: text }));
        await addTypingMessage(`✅ Message added.`, 300);
      } else {
        await addTypingMessage(`No problem, skipped.`, 300);
      }
      // Card is ready
      await addTypingMessage("🎉 Your invitation card is ready! Tap **Preview** to see it.", 500);
      setCardReady(true);
      setShowPreview(true);
    } else {
      // Card is already built — handle additional requests
      if (text.toLowerCase().includes("change") || text.toLowerCase().includes("edit")) {
        await addTypingMessage("You can edit details after publishing from the dashboard. Tap **Publish** when you're ready!", 500);
      } else {
        // Treat as family info or address
        if (!wedding.groomFamily) {
          setWedding((prev) => ({ ...prev, groomFamily: text }));
          await addTypingMessage(`✅ Added family info. Your card has been updated.`, 500);
        } else {
          await addTypingMessage("Your card is ready! Tap **Publish** to go live.", 500);
        }
      }
    }

    setIsThinking(false);
  };

  const mockWedding: Wedding = {
    id: "",
    slug: "",
    userId: "",
    groomName: wedding.groomName || "Groom",
    brideName: wedding.brideName || "Bride",
    groomFamily: wedding.groomFamily || null,
    brideFamily: wedding.brideFamily || null,
    eventDate: wedding.eventDate ? new Date(wedding.eventDate) : new Date("2026-12-25T19:00:00"),
    venue: wedding.venue || "Your Venue",
    venueAddress: wedding.venueAddress || null,
    venueMapUrl: null,
    themeId: theme.id,
    themeConfig: theme,
    cardImageUrl: null,
    customMessage: wedding.customMessage || null,
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
    if (!wedding.groomName || !wedding.brideName || !wedding.venue) {
      toast.error("Missing required details");
      return;
    }
    setPublishing(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.setItem("pendingWedding", JSON.stringify({
        form: wedding,
        theme,
      }));
      toast.info("Create an account to publish");
      router.push("/register?redirect=/create/publish");
      return;
    }

    const slug = `${wedding.groomName}-and-${wedding.brideName}-${Date.now().toString(36)}`
      .toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { data, error } = await supabase
      .from("Wedding")
      .insert({
        slug,
        userId: user.id,
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        groomFamily: wedding.groomFamily || null,
        brideFamily: wedding.brideFamily || null,
        eventDate: wedding.eventDate || new Date("2026-12-25T19:00:00").toISOString(),
        venue: wedding.venue,
        venueAddress: wedding.venueAddress || null,
        customMessage: wedding.customMessage || null,
        themeId: theme.id,
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

  const renderContent = (content: string) => {
    // Simple markdown bold
    return content.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 shrink-0">
        <div className="max-w-3xl mx-auto flex h-14 items-center justify-between px-4">
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-900" />
            <span className="font-semibold text-sm">Nikah Invite</span>
          </button>
          <div className="flex items-center gap-2">
            {cardReady && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {showPreview ? "Chat" : "Preview"}
              </Button>
            )}
            {cardReady && (
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 rounded-full text-xs"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          /* Preview Mode */
          <div className="h-full overflow-y-auto bg-neutral-100 flex justify-center py-6">
            <div className="w-full max-w-[380px]">
              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ backgroundColor: theme.colors.background }}
              >
                <InvitationCard wedding={mockWedding} theme={theme} />
              </div>
            </div>
          </div>
        ) : (
          /* Chat Mode */
          <div className="h-full flex flex-col max-w-2xl mx-auto">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gray-900 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-700 rounded-bl-md"
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-4 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2"
              >
                <Sparkles className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    !wedding.groomName ? "Type the couple's names..." :
                    !wedding.eventDate ? "Type the date..." :
                    !wedding.venue ? "Type the venue..." :
                    "Type a message..."
                  }
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                  disabled={isThinking}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
