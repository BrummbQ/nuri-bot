import { getLikedRecipes } from "~/lib/db";
import type { LikedRecipesResponse, RecipeSchema } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<LikedRecipesResponse> => {
    const { userId } = event.context.auth;
    const recipes = await getLikedRecipes(userId);

    return { recipes };
  },
);
