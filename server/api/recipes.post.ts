import { searchRecipes } from "~/lib/search";

interface RecipesBody {
  query: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RecipesBody>(event);

  const recipes = await searchRecipes(body.query);
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
});
