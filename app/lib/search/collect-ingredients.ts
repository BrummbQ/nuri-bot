import OpenAI from "openai";
import type { Ingredient, RecipeIngredient } from "../models";

const openai = new OpenAI();

const ingredientsBasePrompt = (ingredients: RecipeIngredient[]) => `

Fasse folgende Zutatenliste in ein JSON zusammen. Keine Zutat darf doppelt auftreten, fasse ähnliche zusammen und addiere die Mengen.

Zutaten:
${ingredients.map((i) => i.ingredient).join("\n")}
`;

const ingredientsResponseFormat: OpenAI.ResponseFormatJSONSchema = {
  type: "json_schema",
  json_schema: {
    name: "ingredients_response",
    strict: true,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      description:
        "A list of ingredients with their quantities, units, and categories.",
      type: "object",
      additionalProperties: false,
      properties: {
        ingredients: {
          type: "array",
          description: "A list of ingredients",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              productName: {
                type: "string",
                description:
                  "Name of the ingredient in plural for fruits/units, without brand names.",
              },
              quantity: {
                type: ["number", "string", "null"],
                description:
                  "The quantity or amount of the ingredient. Can be null if unspecified.",
              },
              unit: {
                type: ["string", "null"],
                description:
                  "Unit of measurement (EL, g, ml, kg, Stück). Can be null if not applicable.",
              },
              category: {
                type: "string",
                description: "Category of the ingredient.",
              },
            },
            required: ["productName", "quantity", "unit", "category"],
          },
        },
      },
      required: ["ingredients"],
    },
  },
};

export async function collectIngredients(
  ingredients: RecipeIngredient[],
): Promise<Ingredient[]> {
  const ingredientPrompt = ingredientsBasePrompt(ingredients);
  console.debug("Collecting ingredients with prompt:", ingredientPrompt);

  const completion = await openai.beta.chat.completions.parse({
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: ingredientPrompt }],
      },
    ],
    model: "gpt-4o-mini",
    temperature: 0.5,
    max_tokens: 5000,
    response_format: ingredientsResponseFormat,
  });

  if (completion.choices[0].finish_reason === "length") {
    throw createError({
      statusCode: 500,
      statusMessage: "collect ingredients: incomplete response",
    });
  }

  const ingredientResponse = completion.choices[0].message;

  if (ingredientResponse.refusal) {
    console.error(ingredientResponse.refusal);
    throw createError({
      statusCode: 500,
      statusMessage: "Refused to collect ingredients",
    });
  } else if (ingredientResponse.parsed) {
    const ingredients = ingredientResponse.parsed as {
      ingredients: Ingredient[];
    };
    return ingredients.ingredients.map((i) => ({ ...i, recipes: [] }));
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: "No generated ingredient response",
    });
  }
}
