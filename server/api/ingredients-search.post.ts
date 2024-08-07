import type {
  IngredientWithProducts,
  IngredientsSearchBody,
  IngredientsSearchResponse,
} from "~/lib/models";
import {
  collectIngredients,
  consolidateSimilarIngredients,
  filterCommonIngredients,
  searchSimilarProducts,
} from "~/lib/search";
import calcProductQuantity from "~/utils/calcProductQuantity";

export default defineEventHandler(
  async (event): Promise<IngredientsSearchResponse> => {
    const { recipes, market } = await readBody<IngredientsSearchBody>(event);

    const ingredients = filterCommonIngredients(recipes);
    console.time("collectIngredients");
    const collectedIngredients = await collectIngredients(ingredients);
    console.timeEnd("collectIngredients");
    const consolidatedIngredients =
      consolidateSimilarIngredients(collectedIngredients);

    console.time("db search products");
    const responseIngredients: IngredientWithProducts[] = await Promise.all(
      consolidatedIngredients.map(async (ingredient) => {
        const products = await searchSimilarProducts(ingredient, market);
        const ingredientWithProducts: IngredientWithProducts = {
          ...ingredient,
          products,
          selectedProducts: [],
        };

        // auto select first product for each ingredient
        if (products.length) {
          const product = products[0];
          ingredientWithProducts.selectedProducts = [
            {
              product,
              quantity:
                calcProductQuantity(ingredientWithProducts, product) ?? 1,
            },
          ];
        }

        return ingredientWithProducts;
      }),
    );
    console.timeEnd("db search products");

    return { ingredients: responseIngredients };
  },
);
