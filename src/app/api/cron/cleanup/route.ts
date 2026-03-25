import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find weddings that have expired (eventDate + 30 days < now)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: expiredWeddings, error } = await supabase
    .from("Wedding")
    .select("id")
    .eq("status", "PUBLISHED")
    .lt("eventDate", thirtyDaysAgo.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (expiredWeddings && expiredWeddings.length > 0) {
    const ids = expiredWeddings.map((w) => w.id);
    await supabase
      .from("Wedding")
      .update({ status: "EXPIRED", expiresAt: new Date().toISOString() })
      .in("id", ids);
  }

  return NextResponse.json({
    message: `Processed ${expiredWeddings?.length || 0} expired weddings`,
  });
}
