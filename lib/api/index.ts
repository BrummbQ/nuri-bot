import type {
  ReweBasketCookieData,
  Ingredient,
  IngredientWithProducts,
  IngredientsSearchResponse,
} from "~/lib/models";

export function getSearchRecipes(query: string) {
  return $fetch("/api/recipes", {
    query: { query },
  });
}

export async function postSearchIngredients(
  ingredients: Ingredient[],
  marketId: string,
): Promise<IngredientsSearchResponse> {
  const result: IngredientsSearchResponse = await $fetch(
    "/api/ingredients-search",
    {
      method: "POST",
      body: { ingredients: ingredients, market: marketId },
    },
  );
  // auto select first product for each ingredient
  result.ingredients.forEach((i) => {
    if (i.products.length) {
      const product = i.products[0];
      i.selectedProducts = [
        { product, quantity: calcProductQuantity(i, product) ?? 1 },
      ];
    }
  });

  return result;
}

export function postOrderIngredients(
  ingredientsWithProducts?: IngredientWithProducts[],
  basketData?: ReweBasketCookieData[],
) {
  if (ingredientsWithProducts == null || basketData == null) {
    throw new Error("Incomplete data");
  }

  return $fetch("/api/ingredients-order", {
    method: "POST",
    body: {
      ingredients: ingredientsWithProducts,
      reweCookies: extensionBasketDataToString(basketData),
    },
  });
}
