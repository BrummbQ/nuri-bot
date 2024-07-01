import type {
  IngredientWithProducts,
  IngredientsSearchBody,
  IngredientsSearchResponse,
} from "~/lib/models";
import { searchSimilarProducts } from "~/lib/search";

export default defineEventHandler(
  async (event): Promise<IngredientsSearchResponse> => {
    const body = await readBody<IngredientsSearchBody>(event);

    const responseIngredients: IngredientWithProducts[] = await Promise.all(
      body.ingredients.map(async (ingredient) => {
        const products = await searchSimilarProducts(
          ingredient.productName,
          body.market,
        );
        return { ...ingredient, products };
      }),
    );

    return { ingredients: responseIngredients };
  },
);
