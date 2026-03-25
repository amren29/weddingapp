"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addDays } from "date-fns";

export default function EditWeddingPage() {
  const params = useParams();
  const router = useRouter();
  const weddingId = params.weddingId as string;
  const [wedding, setWedding] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from("Wedding").select("*").eq("id", weddingId).single();
      setWedding(data);
    }
    fetch();
  }, [weddingId]);

  const updateField = (field: string, value: string) => {
    setWedding((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("Wedding")
      .update({
        groomName: wedding.groomName,
        brideName: wedding.brideName,
        groomFamily: wedding.groomFamily || null,
        brideFamily: wedding.brideFamily || null,
        eventDate: wedding.eventDate,
        venue: wedding.venue,
        venueAddress: wedding.venueAddress || null,
        venueMapUrl: wedding.venueMapUrl || null,
        customMessage: wedding.customMessage || null,
      })
      .eq("id", weddingId);

    if (error) toast.error(error.message);
    else toast.success("Wedding updated!");
    setSaving(false);
  };

  const handlePublish = async () => {
    const expiresAt = addDays(new Date(wedding.eventDate), 30).toISOString();
    const { error } = await supabase
      .from("Wedding")
      .update({ status: "PUBLISHED", expiresAt })
      .eq("id", weddingId);

    if (error) toast.error(error.message);
    else {
      toast.success("Wedding published!");
      router.push(`/dashboard/${weddingId}`);
    }
  };

  if (!wedding) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Wedding</h1>
        <div className="flex gap-2">
          {wedding.status === "DRAFT" && (
            <Button onClick={handlePublish} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              Publish
            </Button>
          )}
          <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Groom&apos;s Name</Label>
              <Input value={wedding.groomName} onChange={(e) => updateField("groomName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bride&apos;s Name</Label>
              <Input value={wedding.brideName} onChange={(e) => updateField("brideName", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Groom&apos;s Family</Label>
              <Input value={wedding.groomFamily || ""} onChange={(e) => updateField("groomFamily", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bride&apos;s Family</Label>
              <Input value={wedding.brideFamily || ""} onChange={(e) => updateField("brideFamily", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Event Date</Label>
            <Input type="datetime-local" value={wedding.eventDate?.slice(0, 16) || ""} onChange={(e) => updateField("eventDate", new Date(e.target.value).toISOString())} />
          </div>
          <div className="space-y-2">
            <Label>Venue</Label>
            <Input value={wedding.venue} onChange={(e) => updateField("venue", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Venue Address</Label>
            <Input value={wedding.venueAddress || ""} onChange={(e) => updateField("venueAddress", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Map URL</Label>
            <Input value={wedding.venueMapUrl || ""} onChange={(e) => updateField("venueMapUrl", e.target.value)} placeholder="Google Maps link" />
          </div>
          <div className="space-y-2">
            <Label>Custom Message</Label>
            <Textarea value={wedding.customMessage || ""} onChange={(e) => updateField("customMessage", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <p className="text-sm font-medium">{wedding.status}</p>
          </div>
          <div className="space-y-2">
            <Label>Wedding URL</Label>
            <p className="text-sm font-mono text-rose-600">/w/{wedding.slug}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
