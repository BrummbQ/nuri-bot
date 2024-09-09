import { findRecipeSchemaByExternalId, isRecipeLiked } from "~/lib/db";
import type { RecipeSchema } from "~/lib/models";
import { getPineconeRecipeById } from "~/lib/search";

export default defineEventHandler(async (event): Promise<RecipeSchema> => {
  const recipeId = getRouterParam(event, "id");
  if (recipeId == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing route parameter recipe id",
    });
  }

  const decodedRecipeId = decodeURIComponent(recipeId);

  let recipe = await findRecipeSchemaByExternalId(decodedRecipeId);
  if (recipe == null) {
    recipe = await getPineconeRecipeById(decodedRecipeId);
  }

  if (recipe == null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Rezept nicht gefunden",
    });
  }

  const { userId } = event.context.auth;
  const liked = await isRecipeLiked(decodedRecipeId, userId);

  return { ...recipe, liked };
});
