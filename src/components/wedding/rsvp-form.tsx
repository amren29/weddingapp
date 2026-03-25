"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, X, HelpCircle } from "lucide-react";

interface RsvpFormProps {
  weddingId: string;
  accentColor?: string;
}

export function RsvpForm({ weddingId, accentColor = "#D4AF37" }: RsvpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<string>("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpStatus) {
      toast.error("Please select your RSVP status");
      return;
    }
    setLoading(true);

    const res = await fetch(`/api/rsvp/${weddingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, rsvpStatus, plusOnes, dietaryNotes }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to submit RSVP");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    toast.success("RSVP submitted! Thank you!");
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: accentColor + "20" }}
          >
            <Check className="h-8 w-8" style={{ color: accentColor }} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">Your RSVP has been submitted successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Your Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+60 12-345 6789" />
          </div>
          <div className="space-y-2">
            <Label>Will you attend? *</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "ACCEPTED", label: "Yes", icon: Check, color: "green" },
                { value: "DECLINED", label: "No", icon: X, color: "red" },
                { value: "MAYBE", label: "Maybe", icon: HelpCircle, color: "amber" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRsvpStatus(option.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    rsvpStatus === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option.icon className={`h-5 w-5 ${rsvpStatus === option.value ? `text-${option.color}-500` : "text-gray-400"}`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          {rsvpStatus === "ACCEPTED" && (
            <>
              <div className="space-y-2">
                <Label>Number of additional guests</Label>
                <Input type="number" min={0} max={10} value={plusOnes} onChange={(e) => setPlusOnes(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Dietary requirements</Label>
                <Textarea value={dietaryNotes} onChange={(e) => setDietaryNotes(e.target.value)} placeholder="Any allergies or dietary needs?" rows={2} />
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full"
            style={{ backgroundColor: accentColor }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit RSVP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
