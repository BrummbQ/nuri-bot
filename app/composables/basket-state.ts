import {
  type RecipeSchema,
  type Basket,
  type IngredientWithProducts,
  type ReweBasketCookieData,
  type SelectedProduct,
} from "~/lib/models";

type BasketState = Record<string, Basket>;

const basketsSessionKey = "baskets";

export const newBasketId = "new";
export const useBaskets = () => useState<BasketState>("baskets", () => ({}));
export const useCurrentBasket = () =>
  useState<string>("currentBasket", () => newBasketId);
const useSearchLoading = () => useState("searchLoading", () => false);
const useSearchError = () => useState("searchError", () => "");
const useMarketId = () =>
  useState<string | undefined>("marketId", () => readMarketId());

export const useBasketStore = () => {
  const baskets = useBaskets();
  const currentBasket = useCurrentBasket();
  const searchLoading = useSearchLoading();
  const searchError = useSearchError();
  const marketId = useMarketId();
  // try to read basket data from local storage
  const reweCookieData = ref<ReweBasketCookieData[] | undefined>(
    readExtensionBasketData(),
  );
  const { getItem, setItem } = useSessionStorage<BasketState>();
  const { postSearchIngredients, loadProducts } = useApi();

  onMounted(() => {
    baskets.value = getItem(basketsSessionKey) ?? {};
  });

  const recipes = computed(() => {
    if (baskets.value[currentBasket.value] != null) {
      return baskets.value[currentBasket.value].recipes;
    }
    return [];
  });

  const ingredientsWithProducts = computed(() => {
    if (baskets.value[currentBasket.value] != null) {
      return baskets.value[currentBasket.value].ingredientsWithProducts;
    }
  });

  async function searchIngedients(
    recipes: RecipeSchema[],
    marketId: string,
    basketId: string,
  ) {
    searchLoading.value = true;
    searchError.value = "";

    try {
      await loadProducts(marketId);

      const result = await postSearchIngredients(recipes, marketId);
      updateIngredientsWithProducts(result.ingredients, basketId);
    } catch (e) {
      console.error(e);
      searchError.value = "Could not search ingredients";
    } finally {
      searchLoading.value = false;
    }
  }

  function createOrSetBasket(id: string) {
    if (baskets.value[id] == null) {
      baskets.value[id] = {
        recipes: [],
        ingredientsWithProducts: [],
        basketId: id,
      };
    }
    currentBasket.value = id;
  }

  function addRecipe(recipe: RecipeSchema, basketId: string) {
    createOrSetBasket(basketId);
    const basket = baskets.value[basketId];
    const recipes = basket.recipes;
    if (basket.recipes.find((r) => r["@id"] === recipe["@id"]) == null) {
      recipes.push(recipe);
    }

    baskets.value[basketId] = { ...basket, recipes };
    setItem(basketsSessionKey, baskets.value);
  }

  function removeRecipe(recipe: RecipeSchema, basketId: string) {
    createOrSetBasket(basketId);
    const basket = baskets.value[basketId];
    const recipes = basket.recipes.filter((r) => r["@id"] !== recipe["@id"]);

    baskets.value[basketId] = { ...basket, recipes };
    setItem(basketsSessionKey, baskets.value);
  }

  function updateIngredientsWithProducts(
    ingredientsWithProducts: IngredientWithProducts[],
    basketId: string,
  ) {
    createOrSetBasket(basketId);

    baskets.value[basketId] = {
      ...baskets.value[basketId],
      ingredientsWithProducts,
    };
    setItem(basketsSessionKey, baskets.value);
  }

  function updateIngredientSelectedProducts(
    product: SelectedProduct,
    ingredient: IngredientWithProducts,
    basketId: string,
  ) {
    createOrSetBasket(basketId);

    const ingredients = baskets.value[basketId].ingredientsWithProducts;
    if (ingredients != null) {
      const basketIngredient = ingredients.find(
        (i) => i.productName === ingredient.productName,
      );
      if (basketIngredient != null) {
        basketIngredient.selectedProducts = [product];
      }
    }
    setItem(basketsSessionKey, baskets.value);
  }

  const marketIdValue = computed(() => marketId.value);
  const reweCookieDataValue = computed(() => reweCookieData.value);

  function updateReweCookieData() {
    reweCookieData.value = readExtensionBasketData();
    marketId.value = readMarketId();

    if (marketId.value != null) {
      const basketValue = baskets.value[currentBasket.value];
      if (basketValue != null) {
        searchIngedients(
          basketValue.recipes,
          marketId.value,
          currentBasket.value,
        );
      }
    }
  }

  function completeCurrentBasket() {
    if (currentBasket.value) {
      delete baskets.value[currentBasket.value];
      currentBasket.value = newBasketId;
    }
  }

  return {
    createOrSetBasket,
    baskets,
    currentBasket,
    addRecipe,
    removeRecipe,
    recipes,
    ingredientsWithProducts,
    marketIdValue,
    updateReweCookieData,
    reweCookieDataValue,
    updateIngredientSelectedProducts,
    searchLoading,
    searchError,
    completeCurrentBasket,
    searchIngedients,
  };
};
