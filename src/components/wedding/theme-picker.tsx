"use client";

import { useState } from "react";
import { builtInThemes } from "@/config/themes";
import { ThemeConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Palette } from "lucide-react";

interface ThemePickerProps {
  currentThemeId: string | null;
  onSelect: (theme: ThemeConfig) => void;
}

export function ThemePicker({ currentThemeId, onSelect }: ThemePickerProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<ThemeConfig | null>(null);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/ai/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) throw new Error("Failed to generate theme");

      const theme = await res.json();
      setGeneratedTheme(theme);
      onSelect(theme);
      toast.success("Theme generated!");
    } catch {
      toast.error("Failed to generate theme. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="builtin">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="builtin">
          <Palette className="h-4 w-4 mr-2" />
          Built-in Themes
        </TabsTrigger>
        <TabsTrigger value="ai">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Generate
        </TabsTrigger>
      </TabsList>

      <TabsContent value="builtin" className="mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {builtInThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all hover:shadow-md",
                currentThemeId === theme.id ? "border-rose-500 shadow-md" : "border-gray-200"
              )}
            >
              <div
                className="h-20 rounded-md mb-3"
                style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
              />
              <p className="font-medium text-sm">{theme.name}</p>
              <div className="flex gap-1 mt-2">
                {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="ai" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              Generate with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your dream wedding theme... e.g., 'Elegant gold and navy blue with floral accents, romantic and luxurious feel'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleAiGenerate}
              disabled={generating || !aiPrompt.trim()}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generating ? "Generating..." : "Generate Theme"}
            </Button>

            {generatedTheme && (
              <div className="mt-4 p-4 border rounded-lg">
                <p className="font-medium mb-2">{generatedTheme.name}</p>
                <div
                  className="h-20 rounded-md mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${generatedTheme.colors.primary}, ${generatedTheme.colors.secondary})`,
                  }}
                />
                <div className="flex gap-2">
                  {Object.entries(generatedTheme.colors).map(([key, color]) => (
                    <div key={key} className="text-center">
                      <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color }} />
                      <p className="text-xs mt-1 text-muted-foreground">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
