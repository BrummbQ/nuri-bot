import type {
  SearchGenerateRecipeBody,
  SearchGenerateRecipeResponse,
} from "~/lib/models";
import { generateRecipe } from "~/lib/search/generate-recipe";

export default defineEventHandler(
  async (event): Promise<SearchGenerateRecipeResponse> => {
    const query = await readBody<SearchGenerateRecipeBody>(event);
    const recipe = await generateRecipe(query);

    return { recipe };
  },
);
