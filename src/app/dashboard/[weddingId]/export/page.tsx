"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Download, FileJson, Users, MessageSquare, ImageIcon, Gift, Mic } from "lucide-react";

export default function ExportPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportData, setExportData] = useState<any>(null);

  const handleExport = async () => {
    setExporting(true);
    setProgress(20);

    try {
      const res = await fetch(`/api/export/${weddingId}`);
      setProgress(60);

      if (!res.ok) throw new Error("Export failed");

      const data = await res.json();
      setProgress(80);
      setExportData(data);

      // Download as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wedding-export-${weddingId}.json`;
      a.click();

      setProgress(100);
      toast.success("Export downloaded!");
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-rose-500" />
            Export Wedding Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Download all your wedding data including guest list, messages, voice notes,
            photos, and gift registry information.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: Users, label: "Guest List & RSVPs" },
              { icon: MessageSquare, label: "Messages" },
              { icon: Mic, label: "Voice Notes" },
              { icon: ImageIcon, label: "Photo Gallery" },
              { icon: Gift, label: "Gift Registry" },
              { icon: FileJson, label: "Wedding Details" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm p-2 rounded bg-gray-50">
                <item.icon className="h-4 w-4 text-rose-500" />
                {item.label}
              </div>
            ))}
          </div>

          {exporting && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">Exporting...</p>
            </div>
          )}

          {exportData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Export Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Guests: {exportData.summary?.totalGuests || 0}</p>
                <p>Accepted: {exportData.summary?.accepted || 0}</p>
                <p>Messages: {exportData.summary?.totalMessages || 0}</p>
                <p>Voice Notes: {exportData.summary?.totalVoiceNotes || 0}</p>
                <p>Photos: {exportData.summary?.totalPhotos || 0}</p>
                <p>Gifts: {exportData.summary?.totalGifts || 0}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleExport}
            className="w-full bg-rose-600 hover:bg-rose-700"
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export All Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
