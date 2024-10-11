import { protectApiRoute } from "~/lib/auth";
import { getLikedRecipes } from "~/lib/db";
import type { LikedRecipesResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<LikedRecipesResponse> => {
    protectApiRoute(event.context.auth);
    const { userId } = event.context.auth;
    const recipes = await getLikedRecipes(userId);

    return { recipes };
  },
);
