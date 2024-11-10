import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import OpenAI from "openai";
import type { Ingredient, RecipeIngredient } from "../models";

const openai = new OpenAI();

const ingredientsBasePrompt = (ingredients: RecipeIngredient[]) => `

Fasse folgende Zutatenliste in ein CSV zusammen. Gib nur ein CSV zurück ohne extra Text! Keine Zutat darf doppelt auftreten, fasse ähnliche zusammen und addiere die Mengen.

1. Feld: Produktname (Plural bei Obst/Stück, ohne Markenbezeichnung)
2. Feld: Beschreibt die Anzahl oder Menge
3. Feld: Mengeneinheit (EL, g, ml, kg, Stück)
4. Feld: Kategorie des Produktes

Beispiel Antwort CSV, jeder Eintrag hat 4 Felder, also maximal 3 Kommas. Ohne Kopfzeile, nur Werte!
Olivenöl,1,EL,Öle
Salz,,,Salz
Birnen,2,,Birnen
Paprika,1,,Paprika
Orangen,1,Stück,Zitrusfrüchte
Eier,2,Stück,Eier
Vollmilch,1,Liter,Milch
Mais,400,g,Mais

Zutaten:
${ingredients.map((i) => i.ingredient).join("\n")}
`;

function parseIngredientsCSV(csv: string, delimiter = ","): Ingredient[] {
  const rows = csv.trim().split("\n");
  const ingredients: Ingredient[] = [];

  rows.forEach((row) => {
    const values = row.split(delimiter).map((value) => value.trim());
    // cleanup
    if (!values.length || values[0] === "```csv" || values[0] === "```") {
      return;
    }

    ingredients.push({
      productName: values[0],
      quantity: +values[1],
      unit: values[2],
      category: values[3],
      recipes: [],
    });
  });

  return ingredients;
}

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
    temperature: 0.5,
    max_tokens: 5000,
  });

  const resultIngredients = completion.choices[0].message.content;
  if (resultIngredients == null) {
    return [];
  }

  // Decode and return the response.
  try {
    const parsedIngredients = parseIngredientsCSV(resultIngredients);
    return parsedIngredients;
  } catch {
    console.error(resultIngredients);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not parse ingredients response",
    });
  }
}
