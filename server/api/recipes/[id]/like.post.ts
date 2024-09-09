import { getRecipeIdByExternalId, likeRecipe } from "~/lib/db";
import type { LikeRecipeBody } from "~/lib/models";

export default defineEventHandler(async (event): Promise<void> => {
  const recipeId = getRouterParam(event, "id");
  if (recipeId == null) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing route parameter recipe id",
    });
  }

  const decodedRecipeId = decodeURIComponent(recipeId);

  const query = await readBody<LikeRecipeBody>(event);
  const { userId } = event.context.auth;

  const recipeInternalId = await getRecipeIdByExternalId(decodedRecipeId);
  if (recipeInternalId == null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Rezept nicht gefunden",
    });
  }
  await likeRecipe(recipeInternalId, userId, query.like);
});
