import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { uploadToR2 } from "@/lib/storage/r2";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ weddingId: string }> }
) {
  const { weddingId } = await params;

  const { data, error } = await supabase
    .from("VoiceNote")
    .select("*")
    .eq("weddingId", weddingId)
    .eq("isApproved", true)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ weddingId: string }> }
) {
  const { weddingId } = await params;
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File;
  const guestName = formData.get("guestName") as string;

  if (!audioFile || !guestName) {
    return NextResponse.json({ error: "Audio file and name are required" }, { status: 400 });
  }

  const fileName = `voice-notes/${weddingId}/${Date.now()}-${guestName.replace(/\s+/g, "-")}.webm`;

  let publicUrl: string;
  try {
    publicUrl = await uploadToR2(audioFile, fileName, "audio/webm");
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("VoiceNote")
    .insert({
      weddingId,
      guestName,
      fileUrl: publicUrl,
      duration: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
