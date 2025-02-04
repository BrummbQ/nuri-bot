import OpenAI from "openai";

const openai = new OpenAI();

const menuBasePrompt = `
Erstelle ein Wochenmenü für eine Speisekarte. Es müssen 20 Gerichte sein. Nutze saisonale Zutaten und gestalte das Menu international und abwechslungsreich mit einfachen/schwierigen, günstigen/teuren, zu 70% vegatarischen, mind 1 Burger, Gerichten. Ein Gericht pro Zeile ohne extra Text und ohne Aufzählung.
`;

/**
 * Creates a list of search terms with an llm to seed the recipe search
 */
export async function generateMenuSearchTerms(): Promise<string[]> {
  let prompt = menuBasePrompt;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    model: "gpt-4o-mini",
    max_tokens: 500,
  });

  const searchTerm = completion.choices[0].message.content ?? "";
  return searchTerm.split("\n").map((r) => r.trim());
}
