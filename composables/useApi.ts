import type {
  CreateBasketBody,
  CreateBasketResponse,
  IngredientsSearchResponse,
  IngredientWithProducts,
  RecipeSchema,
  RecipesSearchResponse,
  ReweBasketCookieData,
  SearchGenerateRecipeBody,
  SearchGenerateRecipeResponse,
  SearchGenerateTermQuery,
  SearchGenerateTermResponse,
} from "~/lib/models";

export const useGenerateRecipeLoading = () =>
  useState("generateRecipeLoading", () => false);
export const useApiError = () => useState("apiError", () => "");

export function useApi() {
  const { $api } = useNuxtApp();
  const generateRecipeLoading = useGenerateRecipeLoading();
  const apiError = useApiError();

  function getSearchRecipes(query: string): Promise<RecipesSearchResponse> {
    return $api("/api/recipes", {
      query: { query },
    });
  }

  async function postSearchIngredients(
    recipes: RecipeSchema[],
    marketId: string,
  ): Promise<IngredientsSearchResponse> {
    const result: IngredientsSearchResponse = await $api(
      "/api/ingredients-search",
      {
        method: "POST",
        body: { recipes, market: marketId },
      },
    );
    return result;
  }

  async function createBasket({
    basketId,
    recipes,
    ingredients,
  }: CreateBasketBody): Promise<CreateBasketResponse> {
    const result = await $api("/api/create-basket", {
      method: "POST",
      body: {
        basketId,
        ingredients,
        recipes,
      },
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

  function generateRecipe(
    body: SearchGenerateRecipeBody,
  ): Promise<SearchGenerateRecipeResponse | undefined> {
    generateRecipeLoading.value = true;
    apiError.value = "";
    return $api("/api/search/generate-recipe", {
      method: "POST",
      body: body,
    })
      .catch((e) => {
        apiError.value = e;
        return undefined;
      })
      .finally(() => {
        generateRecipeLoading.value = false;
      });
  }

  return {
    getSearchRecipes,
    postSearchIngredients,
    createBasket,
    postOrderIngredients,
    loadProducts,
    generateTerm,
    generateRecipe,
  };
}
