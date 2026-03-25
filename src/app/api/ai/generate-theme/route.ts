import { NextRequest, NextResponse } from "next/server";
import { generateTheme } from "@/lib/ai/theme-generator";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long" }, { status: 400 });
    }

    const theme = await generateTheme(prompt);
    return NextResponse.json(theme);
  } catch (error) {
    console.error("Theme generation error:", error);
    return NextResponse.json({ error: "Failed to generate theme" }, { status: 500 });
  }
}
