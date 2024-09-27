import { protectApiRoute } from "~/lib/auth";
import { insertRecipe } from "~/lib/db";
import type {
  SearchGenerateRecipeBody,
  SearchGenerateRecipeResponse,
} from "~/lib/models";
import { generateRecipe } from "~/lib/search/generate-recipe";

export default defineEventHandler(
  async (event): Promise<SearchGenerateRecipeResponse> => {
    protectApiRoute(event.context.auth);
    const query = await readBody<SearchGenerateRecipeBody>(event);
    const { userId } = event.context.auth;

    const recipe = await generateRecipe(query);
    await insertRecipe(recipe, "GENERATED", userId);

    return { recipe };
  },
);
