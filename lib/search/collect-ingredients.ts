import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import OpenAI from "openai";
import type { Ingredient, RecipeIngredient } from "../models";

const openai = new OpenAI();

const ingredientsBasePrompt = (ingredients: RecipeIngredient[]) => `
Fasse folgende Zutatenliste in ein json zusammen. Gib nur ein JSON Array zurück ohne extra Text! Keine Zutat darf doppelt auftreten, fasse ähnliche zusammen und addiere die Mengen.

productName: Produktname (Plural bei Obst/Stück, ohne Markenbezeichnung)
quantity: Beschreibt die Anzahl oder Menge
unit: Mengeneinheit (EL, g, ml, kg, Stück)
note: Zusätzliche beschreibende Infos über das Produkt

Beispiel Antwort JSON:
{"ingredients":
[
  {
    "productName": "Olivenöl",
    "quantity": 1,
    "unit": "EL"
  },
  {
    "productName": "Salz"
  },
  {
    "productName": "Birnen",
    "quantity": 2
  },
  {
    "productName": "Paprika",
    "quantity": 1,
    "note": "rot"
  },
  {
    "productName": "Orangen",
    "quantity": 1,
    "unit": "Stück"
  }
  {
    "productName": "Eier",
    "quantity": 2,
    "unit": "Stück"
  }
]}

Zutaten:
${ingredients.map((i) => i.ingredient).join("\n")}
`;

export async function collectIngredients1(
  ingredients: RecipeIngredient[],
): Promise<Ingredient[]> {
  const client = new BedrockRuntimeClient({ region: "eu-central-1" });
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

  const ingredientPrompt = ingredientsBasePrompt(ingredients);

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: ingredientPrompt }],
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
    try {
      return JSON.parse(responseBody.content[0].text);
    } catch {
      console.error(responseBody.content[0].text);
      throw createError({
        statusCode: 500,
        statusMessage: "Could not parse ingredients response",
      });
    }
  }

  return [];
}

export async function collectIngredients(
  ingredients: RecipeIngredient[],
): Promise<Ingredient[]> {
  const ingredientPrompt = ingredientsBasePrompt(ingredients);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: ingredientPrompt }],
      },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 5000,
  });

  const resultIngredients = completion.choices[0].message.content;
  if (resultIngredients == null) {
    return [];
  }

  // Decode and return the response.
  try {
    const parsedIngredients = JSON.parse(resultIngredients);
    if (parsedIngredients.ingredients != null) {
      return parsedIngredients.ingredients;
    }
    return parsedIngredients;
  } catch {
    console.error(resultIngredients);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not parse ingredients response",
    });
  }
}
