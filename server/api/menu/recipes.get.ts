import { protectApiRoute } from "~/lib/auth";
import { fetchRecipesForCurrentMenu } from "~/lib/db";
import type { MenuRecipesResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<MenuRecipesResponse> => {
    protectApiRoute(event.context.auth);
    const recipes = await fetchRecipesForCurrentMenu();
    return { recipes };
  },
);
