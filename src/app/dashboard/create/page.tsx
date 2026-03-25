"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { builtInThemes } from "@/config/themes";
import { cn } from "@/lib/utils";

type Step = "details" | "theme" | "review";

export default function CreateWeddingPage() {
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    groomFamily: "",
    brideFamily: "",
    eventDate: "",
    venue: "",
    venueAddress: "",
    venueMapUrl: "",
    customMessage: "",
    themeId: "classic",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const names = `${formData.groomName}-and-${formData.brideName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const suffix = Date.now().toString(36);
    return `${names}-${suffix}`;
  };

  const handleSubmit = async () => {
    if (!formData.eventDate) {
      toast.error("Please select an event date");
      return;
    }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "test-user-001"; // dev fallback

    const slug = generateSlug();
    const selectedTheme = builtInThemes.find((t) => t.id === formData.themeId);
    const eventDate = new Date(formData.eventDate);

    const { data, error } = await supabase
      .from("Wedding")
      .insert({
        slug,
        userId,
        groomName: formData.groomName,
        brideName: formData.brideName,
        groomFamily: formData.groomFamily || null,
        brideFamily: formData.brideFamily || null,
        eventDate: eventDate.toISOString(),
        venue: formData.venue,
        venueAddress: formData.venueAddress || null,
        venueMapUrl: formData.venueMapUrl || null,
        customMessage: formData.customMessage || null,
        themeId: formData.themeId,
        themeConfig: selectedTheme || null,
        status: "DRAFT",
      })
      .select("id")
      .single();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Wedding created successfully!");
    router.push(`/dashboard/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Wedding</h1>
        <p className="text-muted-foreground">Set up your wedding invitation</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        {(["details", "theme", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === s
                  ? "bg-rose-600 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {i + 1}
            </div>
            <span className={cn("text-sm capitalize", step === s ? "font-medium" : "text-muted-foreground")}>
              {s}
            </span>
            {i < 2 && <div className="w-12 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Wedding Details</CardTitle>
            <CardDescription>Tell us about the couple and the event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groomName">Groom&apos;s Name *</Label>
                <Input
                  id="groomName"
                  value={formData.groomName}
                  onChange={(e) => updateField("groomName", e.target.value)}
                  placeholder="Enter groom's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideName">Bride&apos;s Name *</Label>
                <Input
                  id="brideName"
                  value={formData.brideName}
                  onChange={(e) => updateField("brideName", e.target.value)}
                  placeholder="Enter bride's name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groomFamily">Groom&apos;s Family</Label>
                <Input
                  id="groomFamily"
                  value={formData.groomFamily}
                  onChange={(e) => updateField("groomFamily", e.target.value)}
                  placeholder="Son of..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideFamily">Bride&apos;s Family</Label>
                <Input
                  id="brideFamily"
                  value={formData.brideFamily}
                  onChange={(e) => updateField("brideFamily", e.target.value)}
                  placeholder="Daughter of..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => updateField("eventDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                placeholder="e.g., The Grand Ballroom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input
                id="venueAddress"
                value={formData.venueAddress}
                onChange={(e) => updateField("venueAddress", e.target.value)}
                placeholder="Full address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea
                id="customMessage"
                value={formData.customMessage}
                onChange={(e) => updateField("customMessage", e.target.value)}
                placeholder="A personal message to your guests..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep("theme")}
                className="bg-rose-600 hover:bg-rose-700"
                disabled={!formData.groomName || !formData.brideName || !formData.eventDate || !formData.venue}
              >
                Next: Choose Theme
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "theme" && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Theme</CardTitle>
            <CardDescription>Select a built-in theme or generate one with AI later</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {builtInThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateField("themeId", theme.id)}
                  className={cn(
                    "rounded-lg border-2 p-4 text-left transition-all hover:shadow-md",
                    formData.themeId === theme.id
                      ? "border-rose-500 shadow-md"
                      : "border-gray-200"
                  )}
                >
                  <div
                    className="h-20 rounded-md mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    }}
                  />
                  <p className="font-medium text-sm">{theme.name}</p>
                  <div className="flex gap-1 mt-2">
                    {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={() => setStep("review")} className="bg-rose-600 hover:bg-rose-700">
                Next: Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
            <CardDescription>Review your wedding details before creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Groom</p>
                <p className="font-medium">{formData.groomName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bride</p>
                <p className="font-medium">{formData.brideName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Date</p>
              <p className="font-medium">{formData.eventDate ? new Date(formData.eventDate).toLocaleDateString("en-US", { dateStyle: "full" }) : ""}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Venue</p>
              <p className="font-medium">{formData.venue}</p>
              {formData.venueAddress && <p className="text-sm text-muted-foreground">{formData.venueAddress}</p>}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Theme</p>
              <p className="font-medium">{builtInThemes.find((t) => t.id === formData.themeId)?.name || formData.themeId}</p>
            </div>
            {formData.customMessage && (
              <div>
                <p className="text-sm text-muted-foreground">Custom Message</p>
                <p className="text-sm">{formData.customMessage}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Wedding URL</p>
              <p className="font-medium text-rose-600">/w/{generateSlug()}</p>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("theme")}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
                {loading ? "Creating..." : "Create Wedding"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
