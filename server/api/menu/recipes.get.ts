import { fetchRecipesForCurrentMenu } from "~/lib/db";
import type { MenuRecipesResponse } from "~/lib/models";

export default defineEventHandler(
  async (event): Promise<MenuRecipesResponse> => {
    const recipes = await fetchRecipesForCurrentMenu();
    return { recipes };
  },
);
