import { callOpenAI } from "./openai";
import { ThemeConfig } from "@/types";
import { v4 as uuid } from "uuid";

const SYSTEM_PROMPT = `You are a wedding invitation theme designer. Given a user's description of their desired wedding theme, generate a complete theme configuration as JSON.

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
  "layout": "classic" | "modern" | "minimal" | "ornate"
}

Guidelines:
- Choose colors that harmonize beautifully and are appropriate for wedding invitations
- Select Google Fonts that are elegant and readable
- The layout should match the overall aesthetic described
- Ensure text color has good contrast with the background
- Keep the theme romantic and celebratory`;

export async function generateTheme(prompt: string): Promise<ThemeConfig> {
  const result = await callOpenAI(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    { response_format: { type: "json_object" } }
  );

  const themeData = JSON.parse(result.choices[0].message.content);

  return {
    id: `ai-${uuid()}`,
    ...themeData,
  };
}
