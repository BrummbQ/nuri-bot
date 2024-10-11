import OpenAI from "openai";
import type {
  Ingredient,
  RecipeSchema,
  SearchGenerateRecipeBody,
} from "../models";

const openai = new OpenAI();

const generateRecipePrompt = (ingredients: Ingredient[]) => `
Erstelle ein neues Rezept auf deutsch. Nutze die Zutaten und optionalen Angaben

Zutaten:
${ingredients.map((i) => i.productName).join("\n")}
`;

/**
 * Creates a new recipe from ingredients list and optional input
 */
export async function generateRecipe(
  query: SearchGenerateRecipeBody,
): Promise<RecipeSchema> {
  const prompt = generateRecipePrompt(query.ingredients);

  try {
    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 5000,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "recipe_response",
          strict: true,
          schema: {
            $schema: "http://json-schema.org/draft-04/schema#",
            description: "",
            type: "object",
            additionalProperties: false,
            properties: {
              name: {
                type: "string",
              },
              "@context": {
                type: "string",
              },
              keywords: {
                type: "string",
              },
              nutrition: {
                type: "object",
                properties: {
                  "@type": {
                    type: "string",
                  },
                  calories: {
                    type: "string",
                  },
                  servingSize: {
                    type: "string",
                  },
                },
                additionalProperties: false,
                required: ["@type", "calories", "servingSize"],
              },
              totalTime: {
                type: "string",
              },
              description: {
                type: "string",
              },
              recipeYield: {
                type: "string",
              },
              recipeCategory: {
                type: "string",
              },
              recipeIngredient: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              recipeInstructions: {
                type: "array",
                items: {
                  required: ["url", "name", "text", "@type"],
                  additionalProperties: false,
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                    text: {
                      type: "string",
                    },
                    "@type": {
                      type: "string",
                    },
                  },
                },
              },
            },
            required: [
              "name",
              "@context",
              "keywords",
              "nutrition",
              "totalTime",
              "description",
              "recipeYield",
              "recipeCategory",
              "recipeIngredient",
              "recipeInstructions",
            ],
          },
        },
      },
    });

    if (completion.choices[0].finish_reason === "length") {
      throw createError({
        statusCode: 500,
        statusMessage: "generate recipe: incomplete response",
      });
    }

    const recipeResponse = completion.choices[0].message;

    if (recipeResponse.refusal) {
      console.error(recipeResponse.refusal);
      throw createError({
        statusCode: 500,
        statusMessage: "Refused to generate recipe",
      });
    } else if (recipeResponse.parsed) {
      const recipe = recipeResponse.parsed as RecipeSchema;
      // add missing default values
      recipe["@id"] = `wizard-${crypto.randomUUID()}`;
      recipe.image = [];
      return recipe;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "No generated recipe response",
      });
    }
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Unknown error: Could not generate recipe",
    });
  }
}
