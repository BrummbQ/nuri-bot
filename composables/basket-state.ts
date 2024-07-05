import {
  type RecipeSchema,
  type Basket,
  type IngredientWithProducts,
} from "~/lib/models";

export const useBaskets = () =>
  useState<Record<string, Basket>>("baskets", () => ({}));
export const useCurrentBasket = () =>
  useState<string | undefined>("currentBasket", () => undefined);

export const useBasketStore = () => {
  const baskets = useBaskets();
  const currentBasket = useCurrentBasket();

  const recipes = computed(() => {
    if (currentBasket.value != null) {
      return baskets.value[currentBasket.value].recipes;
    }
    return [];
  });

  const ingredientsWithProducts = computed(() => {
    if (currentBasket.value != null) {
      return baskets.value[currentBasket.value].ingredientsWithProducts;
    }
  });

  function createOrSetBasket(id: string) {
    if (baskets.value[id] == null) {
      baskets.value[id] = {
        recipes: [],
        ingredientsWithProducts: [],
        basketId: "new",
      };
    }
    currentBasket.value = id;
  }

  function updateRecipes(recipes: RecipeSchema[], basketId?: string) {
    if (basketId == null || baskets.value[basketId] == null) {
      return;
    }

    baskets.value[basketId] = { ...baskets.value[basketId], recipes };
  }

  function updateIngredientsWithProducts(
    ingredientsWithProducts: IngredientWithProducts[],
    basketId?: string,
  ) {
    if (basketId == null || baskets.value[basketId] == null) {
      return;
    }

    baskets.value[basketId] = {
      ...baskets.value[basketId],
      ingredientsWithProducts,
    };
  }

  return {
    baskets,
    currentBasket,
    createOrSetBasket,
    updateRecipes,
    updateIngredientsWithProducts,
    recipes,
    ingredientsWithProducts,
  };
};
