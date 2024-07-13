import type {
  Ingredient,
  IngredientsSearchResponse,
  IngredientWithProducts,
  RecipesSearchResponse,
  ReweBasketCookieData,
  SearchGenerateTermQuery,
  SearchGenerateTermResponse,
} from "~/lib/models";

export function useApi() {
  const { $api } = useNuxtApp();

  function getSearchRecipes(query: string): Promise<RecipesSearchResponse> {
    return $api("/api/recipes", {
      query: { query },
    });
  }

  async function postSearchIngredients(
    ingredients: Ingredient[],
    marketId: string,
  ): Promise<IngredientsSearchResponse> {
    const result: IngredientsSearchResponse = await $api(
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

  function postOrderIngredients(
    ingredientsWithProducts?: IngredientWithProducts[],
    basketData?: ReweBasketCookieData[],
  ) {
    if (ingredientsWithProducts == null || basketData == null) {
      throw new Error("Incomplete data");
    }

    return $api("/api/ingredients-order", {
      method: "POST",
      body: {
        ingredients: ingredientsWithProducts,
        reweCookies: extensionBasketDataToString(basketData),
      },
    });
  }

  async function loadProducts(marketId: string) {
    await $api("/api/load-products", {
      method: "POST",
      body: { marketId },
    });
  }

  function generateTerm(
    query: SearchGenerateTermQuery,
  ): Promise<SearchGenerateTermResponse> {
    return $api("/api/search/generate-term", {
      query,
    });
  }

  return {
    getSearchRecipes,
    postSearchIngredients,
    postOrderIngredients,
    loadProducts,
    generateTerm,
  };
}
