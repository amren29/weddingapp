import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function callAI(
  messages: { role: "system" | "user"; content: string }[]
) {
  const system = messages.find((m) => m.role === "system")?.content || "";
  const userMsg = messages.find((m) => m.role === "user")?.content || "";

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system,
    prompt: userMsg,
  });

  return text;
}
