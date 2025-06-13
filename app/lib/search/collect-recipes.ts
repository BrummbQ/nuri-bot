import type { RecipeSchema } from "../models";
import { categorizeRecipe } from "./categorize-recipe";
import { generateMenuSearchTerms } from "./generate-search-term";
import { searchRecipes } from "./recipes";

type RecipeSearchTerm = [RecipeSchema, string];
const recipeCount = 40;

async function findRecipe(
  searchTerm: string,
): Promise<RecipeSchema | undefined> {
  const searchResults = await searchRecipes(searchTerm);
  const randomResult =
    searchResults[Math.floor(Math.random() * searchResults.length)];
  if (randomResult.metadata?.recipeSchema) {
    return JSON.parse(randomResult.metadata?.recipeSchema);
  }
}

/**
 * Search recipes with generated queries
 */
export async function collectRecipes(): Promise<RecipeSearchTerm[]> {
  const searchTerms = await generateMenuSearchTerms(recipeCount);
  return (
    await Promise.all(
      searchTerms.map(async (searchTerm) => {
        const recipe = await findRecipe(searchTerm);
        if (recipe != null) {
          const categorization = await categorizeRecipe(recipe);
          recipe.categorization = categorization;
          return [recipe, searchTerm];
        }
      }),
    )
  )
    .filter((r) => r != null)
    .slice(0, recipeCount) as RecipeSearchTerm[];
}
