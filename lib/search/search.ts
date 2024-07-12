import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { SearchGenerateTermQuery } from "../models";

const searchBasePrompt = `
Erstelle eine Sucheingabe für eine Rezeptsuche. Maximal 30 Zeichen, Gib nur den Suchtext zurück ohne weitere Angaben

Beispiele:
`;

/**
 * Creates a randomized search query with an llm to seed the recipe search
 */
export async function generateSearchTerm(
  query: SearchGenerateTermQuery,
): Promise<string> {
  const client = new BedrockRuntimeClient({ region: "eu-central-1" });
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

  let prompt = searchBasePrompt;
  if (query.seed) {
    prompt += ` Nutze insbesondere: ${query.seed}`;
  } else {
    prompt +=
      "deftiges Frühstück, gesundes Abendessen, Pizza, Pasta, Deutsche Küche";
  }
  if (query.dietType === "vegan") {
    prompt += ` Nur vegane Gerichte!`;
  } else if (query.dietType === "vegetarian") {
    prompt += ` Nur vegetarische Gerichte!`;
  }

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  };

  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response.
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  const responseBody = JSON.parse(decodedResponseBody);
  if (responseBody.content.length) {
    return responseBody.content[0].text;
  }

  return "";
}
