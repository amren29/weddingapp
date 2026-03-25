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
    .from("GalleryImage")
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
  const imageFile = formData.get("image") as File;
  const uploadedBy = formData.get("uploadedBy") as string;
  const caption = formData.get("caption") as string | null;

  if (!imageFile || !uploadedBy) {
    return NextResponse.json({ error: "Image and name are required" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
    return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 });
  }

  const ext = imageFile.type.split("/")[1];
  const fileName = `gallery/${weddingId}/${Date.now()}-${uploadedBy.replace(/\s+/g, "-")}.${ext}`;

  let publicUrl: string;
  try {
    publicUrl = await uploadToR2(imageFile, fileName, imageFile.type);
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("GalleryImage")
    .insert({
      weddingId,
      uploadedBy,
      fileUrl: publicUrl,
      caption: caption || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
