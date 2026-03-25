"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, MessageSquare, ImageIcon, Gift, Mic, QrCode,
  Palette, Download, Calendar, MapPin, ExternalLink, Settings,
} from "lucide-react";
import { format } from "date-fns";

export default function WeddingDetailPage() {
  const params = useParams();
  const weddingId = params.weddingId as string;
  const [wedding, setWedding] = useState<any>(null);
  const [stats, setStats] = useState({ guests: 0, accepted: 0, messages: 0, images: 0, gifts: 0, voiceNotes: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: w } = await supabase
        .from("Wedding")
        .select("*")
        .eq("id", weddingId)
        .single();
      setWedding(w);

      if (w) {
        const [guests, accepted, messages, images, gifts, voiceNotes] = await Promise.all([
          supabase.from("Guest").select("id", { count: "exact", head: true }).eq("weddingId", weddingId),
          supabase.from("Guest").select("id", { count: "exact", head: true }).eq("weddingId", weddingId).eq("rsvpStatus", "ACCEPTED"),
          supabase.from("Message").select("id", { count: "exact", head: true }).eq("weddingId", weddingId),
          supabase.from("GalleryImage").select("id", { count: "exact", head: true }).eq("weddingId", weddingId),
          supabase.from("Gift").select("id", { count: "exact", head: true }).eq("weddingId", weddingId),
          supabase.from("VoiceNote").select("id", { count: "exact", head: true }).eq("weddingId", weddingId),
        ]);
        setStats({
          guests: guests.count || 0,
          accepted: accepted.count || 0,
          messages: messages.count || 0,
          images: images.count || 0,
          gifts: gifts.count || 0,
          voiceNotes: voiceNotes.count || 0,
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [weddingId, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (!wedding) {
    return <div className="text-center py-12">Wedding not found</div>;
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    PUBLISHED: "bg-green-100 text-green-700",
    EXPIRED: "bg-amber-100 text-amber-700",
    ARCHIVED: "bg-red-100 text-red-700",
  };

  const sections = [
    { href: "guests", label: "Guests & RSVP", icon: Users, count: `${stats.accepted}/${stats.guests}`, desc: "Manage guest list" },
    { href: "theme", label: "Theme", icon: Palette, count: null, desc: "Customize design" },
    { href: "messages", label: "Messages", icon: MessageSquare, count: stats.messages, desc: "Guest messages", premium: true },
    { href: "gallery", label: "Gallery", icon: ImageIcon, count: stats.images, desc: "Photo gallery", premium: true },
    { href: "gifts", label: "Gifts", icon: Gift, count: stats.gifts, desc: "Gift registry", premium: true },
    { href: "payment", label: "Payment QR", icon: QrCode, count: null, desc: "QR code setup", premium: true },
    { href: "export", label: "Export", icon: Download, count: null, desc: "Export data" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {wedding.groomName} & {wedding.brideName}
            </h1>
            <Badge className={statusColors[wedding.status] || ""}>
              {wedding.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(wedding.eventDate), "PPP")}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {wedding.venue}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/w/${wedding.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Link href={`/dashboard/${weddingId}/edit`}>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={`/dashboard/${weddingId}/${section.href}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <section.icon className="h-5 w-5 text-rose-500" />
                  {section.premium && (
                    <Badge variant="secondary" className="text-xs">Premium</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base mb-1">{section.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{section.desc}</p>
                {section.count !== null && (
                  <p className="text-2xl font-bold mt-2 text-rose-600">{section.count}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
