"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemePicker } from "@/components/wedding/theme-picker";
import { InvitationCard } from "@/components/wedding/invitation-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { builtInThemes } from "@/config/themes";
import type { ThemeConfig, Wedding } from "@/types";

export default function ThemePage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [wedding, setWedding] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("Wedding").select("*").eq("id", weddingId).single();
      setWedding(data);
      if (data) {
        const theme = data.themeConfig || builtInThemes.find((t) => t.id === data.themeId) || builtInThemes[0];
        setSelectedTheme(theme);
      }
    }
    fetch();
  }, [weddingId]);

  const handleSave = async () => {
    if (!selectedTheme) return;
    setSaving(true);

    const { error } = await supabase
      .from("Wedding")
      .update({ themeId: selectedTheme.id, themeConfig: selectedTheme })
      .eq("id", weddingId);

    if (error) {
      toast.error("Failed to save theme");
    } else {
      toast.success("Theme saved!");
    }
    setSaving(false);
  };

  if (!wedding || !selectedTheme) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Theme & Design</h1>
        <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700" disabled={saving}>
          {saving ? "Saving..." : "Save Theme"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <ThemePicker
            currentThemeId={selectedTheme.id}
            onSelect={setSelectedTheme}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-4">Preview</h3>
          <div className="transform scale-[0.8] origin-top">
            <InvitationCard wedding={wedding as unknown as Wedding} theme={selectedTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}
