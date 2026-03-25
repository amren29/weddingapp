"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mic, Square, Play, Send, Trash2 } from "lucide-react";

interface VoiceRecorderProps {
  weddingId: string;
}

export function VoiceRecorder({ weddingId }: VoiceRecorderProps) {
  const [name, setName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 60000);
    } catch {
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || !name) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("audio", audioBlob, "voice-note.webm");
    formData.append("guestName", name);

    const res = await fetch(`/api/voice-notes/${weddingId}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Failed to send voice note");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    toast.success("Voice note sent!");
  };

  const reset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="py-8">
          <Mic className="h-12 w-12 text-rose-500 mx-auto mb-3" />
          <h3 className="font-semibold text-lg">Thank you!</h3>
          <p className="text-muted-foreground">Your voice note has been recorded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Record a Voice Note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="text-center py-4">
          {!audioBlob ? (
            <Button
              type="button"
              size="lg"
              className={`rounded-full h-20 w-20 ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-rose-600 hover:bg-rose-700"}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          ) : (
            <div className="space-y-3">
              {audioUrl && <audio src={audioUrl} controls className="w-full" />}
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={reset}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Re-record
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-rose-600 hover:bg-rose-700"
                  disabled={loading || !name}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          )}
          {isRecording && (
            <p className="text-sm text-red-500 mt-2 animate-pulse">Recording... (max 60s)</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
