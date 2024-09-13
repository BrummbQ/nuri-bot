import OpenAI from "openai";

const openai = new OpenAI();

const searchBasePrompt = `
Erstelle ein Titel für ein Kochrezept. Es sollte ein Hauptgericht sein. Maximal 30 Zeichen
Bedingung:
`;

/**
 * Creates a randomized search query with an llm to seed the recipe search
 */
export async function generateSearchTerm(seed: string): Promise<string> {
  let prompt = searchBasePrompt;
  prompt += seed;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    model: "gpt-4o-mini",
    max_tokens: 100,
  });

  const searchTerm = completion.choices[0].message.content ?? "";
  return searchTerm
    .trim()
    .replaceAll('"', "")
    .replaceAll("“", "")
    .replaceAll("„", "");
}
