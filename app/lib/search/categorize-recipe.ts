import OpenAI from "openai";
import type { RecipeSchema } from "../models";
import type { RecipeCategorization } from "../models/recipe-category.model";

const openai = new OpenAI();

export const categorizeType = {
  $schema: "http://json-schema.org/draft-04/schema#",
  description: "Classify a recipe into category, cuisine, and complexity",
  type: "object",
  additionalProperties: false,
  properties: {
    category: {
      type: "string",
      enum: [
        "Appetizer",
        "Main",
        "Side",
        "Dessert",
        "Snack",
        "Breakfast",
        "Drink",
        "Sauce",
        "Other",
      ],
    },
    cuisine: {
      type: "string",
      description:
        "The regional cuisine style, e.g., Italian, Asian, American, Mediterranean, Thai. Try to be specific.",
    },
    complexity: {
      type: "string",
      enum: ["Easy", "Medium", "Hard"],
    },
    cost: {
      type: "string",
      enum: ["Low", "Medium", "High"],
    },
    season: {
      type: "string",
      enum: ["Spring", "Summer", "Autumn", "Winter", "All Year"],
    },
    dietary: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "Vegetarian",
          "Vegan",
          "Gluten-Free",
          "Dairy-Free",
          "Nut-Free",
          "Low-Carb",
          "High-Protein",
          "Paleo",
          "Keto",
        ],
      },
    },
  },
  required: ["category", "cuisine", "complexity", "cost", "season", "dietary"],
};

const schema = {
  name: "classify_recipe",
  strict: true,
  schema: categorizeType,
};

const categorizeRecipePrompt = (recipe: RecipeSchema) => `
You will receive a recipe in JSON format. Based on its title, ingredients, and instructions, return a JSON classification with the following fields:
- category: One of ["Appetizer", "Main", "Side", "Dessert", "Snack", "Breakfast", "Drink", "Sauce", "Other"]
- cuisine: A common cuisine style (e.g. Italian, German, Vietnam, Thai, Asian, American, Mediterranean)
- complexity: One of ["Easy", "Medium", "Hard"], based on the preparation steps and time.
- cost: One of ["Low", "Medium", "High"], based on the ingredients used.
- season: One of ["Spring", "Summer", "Autumn", "Winter", "All Year"], based on the ingredients and typical seasonal availability.
- dietary: An array of dietary tags such as ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Low-Carb", "High-Protein", "Paleo", "Keto"].

Recipe JSON:
${JSON.stringify(recipe, null, 2)}
`;

export async function categorizeRecipe(
  recipe: RecipeSchema,
): Promise<RecipeCategorization> {
  const prompt = categorizeRecipePrompt(recipe);

  try {
    const completion = await openai.beta.chat.completions.parse({
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 5000,
      response_format: { type: "json_schema", json_schema: schema },
    });

    if (completion.choices[0].finish_reason === "length") {
      throw createError({
        statusCode: 500,
        statusMessage: "categorize recipe: incomplete response",
      });
    }

    const recipeResponse = completion.choices[0].message;

    if (recipeResponse.refusal) {
      console.error(recipeResponse.refusal);
      throw createError({
        statusCode: 500,
        statusMessage: "Refused to categorize recipe",
      });
    } else if (recipeResponse.parsed) {
      const categorization = recipeResponse.parsed as RecipeCategorization;
      return categorization;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "No categorize recipe response",
      });
    }
  } catch (e) {
    console.error(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Unknown error: Could not categorize recipe",
    });
  }
}
