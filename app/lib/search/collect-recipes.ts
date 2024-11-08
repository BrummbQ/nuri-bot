import type { RecipeSchema } from "../models";
import { generateMenuSearchTerms } from "./generate-search-term";
import { searchRecipes } from "./recipes";

type RecipeSearchTerm = [RecipeSchema, string];

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
  const searchTerms = await generateMenuSearchTerms();
  return (
    await Promise.all(
      searchTerms.map(async (searchTerm) => {
        const recipe = await findRecipe(searchTerm);
        if (recipe != null) {
          return [recipe, searchTerm];
        }
      }),
    )
  )
    .filter((r) => r != null)
    .slice(0, 20) as RecipeSearchTerm[];
}
