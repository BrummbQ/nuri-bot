import type { RecipesSearchResponse } from "~/lib/models";
import { searchRecipes } from "~/lib/search";

interface RecipesQuery {
  query: string;
}

export default defineEventHandler(
  async (event): Promise<RecipesSearchResponse> => {
    const query = getQuery<RecipesQuery>(event);

    const recipes = await searchRecipes(query.query);
    const parsedRecipes = recipes.map((r) => {
      if (r.metadata?.recipeSchema) {
        const recipeSchema = JSON.parse(r.metadata?.recipeSchema);
        r.metadata.recipeSchema = recipeSchema;
      }
      return r;
    });

    return {
      recipes: parsedRecipes,
    };
  },
);
