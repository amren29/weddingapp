"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InvitationCard } from "@/components/wedding/invitation-card";
import { builtInThemes } from "@/config/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  Loader2,
  Heart,
  Check,
} from "lucide-react";
import type { ThemeConfig, Wedding } from "@/types";

export default function CreatePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CreateFlow />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );
}

type Step = "prompt" | "details" | "preview";

function CreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const supabase = createClient();

  const [step, setStep] = useState<Step>(initialPrompt ? "prompt" : "prompt");
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generating, setGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(builtInThemes[0]);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    groomName: "",
    brideName: "",
    groomFamily: "",
    brideFamily: "",
    eventDate: "",
    venue: "",
    venueAddress: "",
    customMessage: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-generate theme from prompt on mount
  useEffect(() => {
    if (initialPrompt) {
      handleGenerateTheme(initialPrompt);
    }
  }, []);

  const handleGenerateTheme = async (text: string) => {
    if (!text.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) throw new Error();

      const theme = await res.json();
      setSelectedTheme(theme);
      toast.success("Theme generated!");
      setStep("details");
    } catch {
      // Fallback to a random built-in theme
      const random = builtInThemes[Math.floor(Math.random() * builtInThemes.length)];
      setSelectedTheme(random);
      toast.error("AI generation failed — using a built-in theme instead. You can change it later.");
      setStep("details");
    } finally {
      setGenerating(false);
    }
  };

  const mockWedding: Wedding = {
    id: "",
    slug: "",
    userId: "",
    groomName: form.groomName || "Groom",
    brideName: form.brideName || "Bride",
    groomFamily: form.groomFamily || null,
    brideFamily: form.brideFamily || null,
    eventDate: form.eventDate ? new Date(form.eventDate) : new Date("2026-12-25T19:00:00"),
    venue: form.venue || "Your Venue",
    venueAddress: form.venueAddress || null,
    venueMapUrl: null,
    themeId: selectedTheme.id,
    themeConfig: selectedTheme,
    cardImageUrl: null,
    customMessage: form.customMessage || null,
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
    if (!form.groomName || !form.brideName || !form.eventDate || !form.venue) {
      toast.error("Please fill in all required fields");
      setStep("details");
      return;
    }

    setPublishing(true);

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Save form data to sessionStorage so we can restore after login
      sessionStorage.setItem("pendingWedding", JSON.stringify({
        form,
        theme: selectedTheme,
        prompt,
      }));
      toast.info("Please create an account to publish your invitation");
      router.push("/register?redirect=/create/publish");
      return;
    }

    // User is logged in — create the wedding
    await createWedding(user.id);
  };

  const createWedding = async (userId: string) => {
    const slug = `${form.groomName}-and-${form.brideName}-${Date.now().toString(36)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const { data, error } = await supabase
      .from("Wedding")
      .insert({
        slug,
        userId,
        groomName: form.groomName,
        brideName: form.brideName,
        groomFamily: form.groomFamily || null,
        brideFamily: form.brideFamily || null,
        eventDate: new Date(form.eventDate).toISOString(),
        venue: form.venue,
        venueAddress: form.venueAddress || null,
        customMessage: form.customMessage || null,
        themeId: selectedTheme.id,
        themeConfig: selectedTheme,
        status: "PUBLISHED",
      })
      .select("id, slug")
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-900" />
            <span className="font-semibold text-sm">Create Invitation</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Step indicators */}
            {(["prompt", "details", "preview"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step === s ? "bg-gray-900" : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step: Prompt */}
      {step === "prompt" && (
        <div className="max-w-xl mx-auto px-4 pt-20 pb-12">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Describe your dream invitation
            </h1>
            <p className="text-gray-500 text-sm">
              Tell AI what style, colors, and mood you want for your wedding card
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Elegant gold and cream Malay wedding with subtle floral patterns, romantic and luxurious feel with serif fonts..."
              rows={4}
              className="text-sm"
            />

            <Button
              onClick={() => handleGenerateTheme(prompt)}
              disabled={generating || !prompt.trim()}
              className="w-full bg-gray-900 hover:bg-gray-800 rounded-full h-11"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating your theme...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-3 text-gray-400">or pick a theme</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {builtInThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme);
                    setStep("details");
                  }}
                  className="rounded-lg border border-gray-200 p-3 text-left hover:border-gray-400 transition-colors"
                >
                  <div
                    className="h-12 rounded-md mb-2"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                  />
                  <p className="text-[10px] font-medium text-gray-700 truncate">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Details */}
      {step === "details" && (
        <div className="max-w-xl mx-auto px-4 pt-8 pb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Wedding details</h2>
            <p className="text-sm text-gray-500">Fill in the information for your invitation card</p>
          </div>

          {/* Theme preview strip */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 mb-6">
            <div
              className="w-10 h-10 rounded-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})` }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedTheme.name}</p>
              <p className="text-xs text-gray-400">Theme</p>
            </div>
            <button
              onClick={() => setStep("prompt")}
              className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2"
            >
              Change
            </button>
          </div>

          <div className="space-y-4 bg-white rounded-2xl border border-gray-200 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Groom&apos;s Name *</Label>
                <Input value={form.groomName} onChange={(e) => updateForm("groomName", e.target.value)} placeholder="Ahmad" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Bride&apos;s Name *</Label>
                <Input value={form.brideName} onChange={(e) => updateForm("brideName", e.target.value)} placeholder="Sarah" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Groom&apos;s Family</Label>
                <Input value={form.groomFamily} onChange={(e) => updateForm("groomFamily", e.target.value)} placeholder="Son of..." className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Bride&apos;s Family</Label>
                <Input value={form.brideFamily} onChange={(e) => updateForm("brideFamily", e.target.value)} placeholder="Daughter of..." className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Event Date & Time *</Label>
              <Input type="datetime-local" value={form.eventDate} onChange={(e) => updateForm("eventDate", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Venue *</Label>
              <Input value={form.venue} onChange={(e) => updateForm("venue", e.target.value)} placeholder="The Grand Ballroom" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Venue Address</Label>
              <Input value={form.venueAddress} onChange={(e) => updateForm("venueAddress", e.target.value)} placeholder="Full address" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Personal Message</Label>
              <Textarea value={form.customMessage} onChange={(e) => updateForm("customMessage", e.target.value)} placeholder="A message to your guests..." rows={2} className="mt-1" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setStep("prompt")} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              onClick={() => setStep("preview")}
              disabled={!form.groomName || !form.brideName || !form.eventDate || !form.venue}
              className="flex-1 bg-gray-900 hover:bg-gray-800 rounded-full"
            >
              Preview Card
              <Eye className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="pb-12">
          {/* Phone frame preview */}
          <div className="flex justify-center py-6">
            <div
              className="w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200"
              style={{ backgroundColor: selectedTheme.colors.background }}
            >
              <InvitationCard wedding={mockWedding} theme={selectedTheme} />
            </div>
          </div>

          {/* Actions */}
          <div className="max-w-sm mx-auto px-4 space-y-3">
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-gray-900 hover:bg-gray-800 rounded-full h-12 text-base"
            >
              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Publish Invitation
                </>
              )}
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("details")} className="flex-1 rounded-full">
                Edit Details
              </Button>
              <Button variant="outline" onClick={() => setStep("prompt")} className="flex-1 rounded-full">
                Change Theme
              </Button>
            </div>

            <p className="text-[11px] text-gray-400 text-center pt-2">
              You&apos;ll need to create an account to publish. Your card design will be saved.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
