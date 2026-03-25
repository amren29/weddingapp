import { callAI } from "./openai";
import { ThemeConfig } from "@/types";
import { v4 as uuid } from "uuid";

const SYSTEM_PROMPT = `You are a wedding invitation theme designer. Given a user's description, generate a theme configuration as JSON only — no markdown, no explanation, just pure JSON.

The JSON must follow this exact structure:
{
  "name": "Theme Name",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "fonts": {
    "heading": "Google Font Name",
    "body": "Google Font Name"
  },
  "layout": "classic"
}

Guidelines:
- Choose colors that harmonize beautifully for wedding invitations
- Select Google Fonts that are elegant and readable
- layout must be one of: "classic", "modern", "minimal", "ornate"
- Ensure text color has good contrast with the background
- Return ONLY valid JSON, nothing else`;

export async function generateTheme(prompt: string): Promise<ThemeConfig> {
  const text = await callAI([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);

  // Extract JSON from response (handle if wrapped in markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse theme JSON from AI response");
  }

  const themeData = JSON.parse(jsonMatch[0]);

  return {
    id: `ai-${uuid()}`,
    ...themeData,
  };
}
