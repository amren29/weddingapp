import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weddingId: string }> }
) {
  const { weddingId } = await params;

  // Fetch all data
  const [wedding, guests, messages, voiceNotes, galleryImages, gifts] = await Promise.all([
    supabase.from("Wedding").select("*").eq("id", weddingId).single(),
    supabase.from("Guest").select("*").eq("weddingId", weddingId),
    supabase.from("Message").select("*").eq("weddingId", weddingId),
    supabase.from("VoiceNote").select("*").eq("weddingId", weddingId),
    supabase.from("GalleryImage").select("*").eq("weddingId", weddingId),
    supabase.from("Gift").select("*").eq("weddingId", weddingId),
  ]);

  if (!wedding.data) {
    return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  }

  const exportData = {
    wedding: wedding.data,
    guests: guests.data || [],
    messages: messages.data || [],
    voiceNotes: voiceNotes.data || [],
    galleryImages: galleryImages.data || [],
    gifts: gifts.data || [],
    exportedAt: new Date().toISOString(),
    summary: {
      totalGuests: guests.data?.length || 0,
      accepted: guests.data?.filter((g: any) => g.rsvpStatus === "ACCEPTED").length || 0,
      declined: guests.data?.filter((g: any) => g.rsvpStatus === "DECLINED").length || 0,
      totalMessages: messages.data?.length || 0,
      totalVoiceNotes: voiceNotes.data?.length || 0,
      totalPhotos: galleryImages.data?.length || 0,
      totalGifts: gifts.data?.length || 0,
      claimedGifts: gifts.data?.filter((g: any) => g.status === "CLAIMED").length || 0,
    },
  };

  return NextResponse.json(exportData);
}
