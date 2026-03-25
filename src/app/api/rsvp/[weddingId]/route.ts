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
    .from("Guest")
    .select("*")
    .eq("weddingId", weddingId)
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
  const body = await request.json();

  const { name, email, phone, rsvpStatus, plusOnes, dietaryNotes } = body;

  if (!name || !rsvpStatus) {
    return NextResponse.json({ error: "Name and RSVP status are required" }, { status: 400 });
  }

  // Check if guest already responded (by email if provided)
  if (email) {
    const { data: existing } = await supabase
      .from("Guest")
      .select("id")
      .eq("weddingId", weddingId)
      .eq("email", email)
      .single();

    if (existing) {
      // Update existing RSVP
      const { error } = await supabase
        .from("Guest")
        .update({
          name,
          phone: phone || null,
          rsvpStatus,
          plusOnes: plusOnes || 0,
          dietaryNotes: dietaryNotes || null,
          respondedAt: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: "RSVP updated" });
    }
  }

  const { error } = await supabase.from("Guest").insert({
    weddingId,
    name,
    email: email || null,
    phone: phone || null,
    rsvpStatus,
    plusOnes: plusOnes || 0,
    dietaryNotes: dietaryNotes || null,
    respondedAt: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "RSVP submitted" }, { status: 201 });
}
