<template>
  <BasketSetup @buildBasket="saveBasketData($event)" />

  <UiHeader v-if="ingredientsWithProducts" :level="2" class="mt-4"
    >Zutaten</UiHeader
  >

  <div v-if="searchLoading" class="text-center">
    <Icon name="line-md:loading-loop" width="50" height="50" />
  </div>
  <ul v-else class="mb-4">
    <BasketIngredientItem
      v-if="ingredientsWithProducts"
      :ingredientsWithProducts="ingredientsWithProducts"
      @selectProduct="selectProduct($event.selectedProduct, $event.ingredient)"
    />
  </ul>

  <div v-if="ingredientsWithProducts && !searchLoading" class="flex gap-4">
    <UiButton v-if="basketDirty" :loading="orderLoading" @click="orderBasket()"
      >Bestellen</UiButton
    >
  </div>
</template>

<script setup lang="ts">
import {
  type ReweBasketCookieData,
  type Ingredient,
  type IngredientWithProducts,
  type RecipeSchema,
  type SelectedProduct,
} from "~/lib/models";
import type { BuildBasketEvent } from "./BasketSetup.vue";
import { postOrderIngredients, postSearchIngredients } from "~/lib/api";

const props = defineProps<{
  recipes: RecipeSchema[];
  ingredientsWithProducts?: IngredientWithProducts[];
  basketId: string;
}>();
const emit = defineEmits<{
  updateIngredientsWithProducts: [IngredientWithProducts[]];
}>();

const ingredients = computed(() => {
  return collectIngredients(props.recipes);
});
const marketId = ref<string | undefined>();
const basketData = ref<ReweBasketCookieData[] | undefined>();
const searchLoading = ref(false);
const orderLoading = ref(false);
const basketDirty = ref(false);

watchEffect(() => {
  if (marketId.value && ingredients.value.length) {
    searchIngedients(ingredients.value, marketId.value);
  }
});

const selectProduct = (
  event: SelectedProduct,
  ingredient: IngredientWithProducts,
) => {
  if (event.quantity) {
    ingredient.selectedProducts = [event];
  } else {
    ingredient.selectedProducts = [];
  }
  basketDirty.value = true;
};

const saveBasketData = (event: BuildBasketEvent) => {
  marketId.value = event.marketId;
  basketData.value = event.basketData;
};

const searchIngedients = async (
  ingredients: Ingredient[],
  marketId: string,
) => {
  searchLoading.value = true;

  await $fetch("/api/load-products", {
    method: "POST",
    body: { marketId },
  });

  const result = await postSearchIngredients(ingredients, marketId);
  emit("updateIngredientsWithProducts", result.ingredients);
  basketDirty.value = true;
  searchLoading.value = false;
};

const orderBasket = async () => {
  if (basketData.value == null) {
    console.error("No rewe cookies!");
    return;
  }

  try {
    const createBasketResponse = await $fetch("/api/create-basket", {
      method: "POST",
      body: {
        basketId: props.basketId,
        ingredients: props.ingredientsWithProducts,
      },
    });

    orderLoading.value = true;
    await postOrderIngredients(props.ingredientsWithProducts, basketData.value);
    orderLoading.value = false;
    basketDirty.value = false;
    await navigateTo(`/basket/${createBasketResponse.basketId}/ordered`);
  } catch (e) {
    orderLoading.value = false;
    console.error(e);
  }
};
</script>
