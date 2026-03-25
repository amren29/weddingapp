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

  const { data, error } = await supabase
    .from("Gift")
    .select("*")
    .eq("weddingId", weddingId)
    .order("createdAt", { ascending: true });

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
  const body = await request.json();

  const { name, description, imageUrl, link, price } = body;

  if (!name) {
    return NextResponse.json({ error: "Gift name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Gift")
    .insert({
      weddingId,
      name,
      description: description || null,
      imageUrl: imageUrl || null,
      link: link || null,
      price: price || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ weddingId: string }> }
) {
  await params; // consume params
  const { giftId, claimedBy } = await request.json();

  if (!giftId || !claimedBy) {
    return NextResponse.json({ error: "Gift ID and name are required" }, { status: 400 });
  }

  // Check if already claimed
  const { data: gift } = await supabase
    .from("Gift")
    .select("status")
    .eq("id", giftId)
    .single();

  if (gift?.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Gift already claimed" }, { status: 400 });
  }

  const { error } = await supabase
    .from("Gift")
    .update({
      claimedBy,
      claimedAt: new Date().toISOString(),
      status: "CLAIMED",
    })
    .eq("id", giftId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Gift claimed" });
}
