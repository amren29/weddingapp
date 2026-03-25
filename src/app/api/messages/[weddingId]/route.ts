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
    .from("Message")
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
  const { guestName, content } = await request.json();

  if (!guestName || !content) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("Message")
    .insert({ weddingId, guestName, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
