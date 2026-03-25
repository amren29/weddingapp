"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface MessageItem {
  id: string;
  guestName: string;
  content: string;
  createdAt: string;
}

interface MessageBoardProps {
  weddingId: string;
  isAdmin?: boolean;
}

export function MessageBoard({ weddingId, isAdmin = false }: MessageBoardProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${weddingId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [weddingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/messages/${weddingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestName: name, content }),
    });

    if (!res.ok) {
      toast.error("Failed to send message");
      setLoading(false);
      return;
    }

    toast.success("Message sent!");
    setContent("");
    fetchMessages();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write a message for the couple..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
              />
              <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No messages yet. Be the first to leave a wish!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{msg.guestName}</p>
                    <p className="text-muted-foreground mt-1">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
