import type {
  CreateBasketBody,
  CreateBasketResponse,
  IngredientsSearchResponse,
  IngredientWithProducts,
  LikeRecipeBody,
  RecipeSchema,
  ReweBasketCookieData,
  SearchGenerateRecipeBody,
  SearchGenerateRecipeResponse,
  ShareBasketResponse,
} from "~/lib/models";

export const useGenerateRecipeLoading = () =>
  useState("generateRecipeLoading", () => false);
export const useApiError = () => useState("apiError", () => "");

export function useApi() {
  const { $api } = useNuxtApp();
  const generateRecipeLoading = useGenerateRecipeLoading();
  const apiError = useApiError();

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
    const result = await $api("/api/baskets/create", {
      method: "POST",
      body: {
        basketId,
        ingredients,
        recipes,
      },
    });
    return result;
  }

  async function shareBasket(basketId: string): Promise<ShareBasketResponse> {
    const result = await $api(`/api/baskets/${basketId}/share`, {
      method: "POST",
      body: {},
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

  async function loadProducts(marketId: string): Promise<void> {
    await $api("/api/load-products", {
      method: "POST",
      body: { marketId },
    });
  }

  async function validateIngredientsOrder(
    marketId: string,
    basketData?: ReweBasketCookieData[],
  ): Promise<void> {
    if (basketData == null) {
      throw new Error("Incomplete data");
    }
    await $api("/api/validate-ingredients-order", {
      method: "POST",
      body: { marketId, reweCookies: extensionBasketDataToString(basketData) },
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

  function likeRecipe(
    recipeId: string,
    body: LikeRecipeBody,
  ): Promise<unknown> {
    apiError.value = "";
    return $api(`/api/recipes/${recipeId}/like`, {
      method: "POST",
      body,
    }).catch((e) => {
      apiError.value = e;
      return undefined;
    });
  }

  return {
    postSearchIngredients,
    createBasket,
    shareBasket,
    postOrderIngredients,
    validateIngredientsOrder,
    loadProducts,
    generateRecipe,
    likeRecipe,
  };
}
