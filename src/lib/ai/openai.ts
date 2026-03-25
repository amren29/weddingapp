const OPENAI_API_URL = "https://api.openai.com/v1";

export async function callOpenAI(
  messages: { role: string; content: string }[],
  options?: { model?: string; response_format?: { type: string } }
) {
  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: options?.model || "gpt-4o",
      messages,
      response_format: options?.response_format,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return response.json();
}
