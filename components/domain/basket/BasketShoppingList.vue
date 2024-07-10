<template>
  <BasketSetup />

  <UiHeader v-if="ingredientsWithProducts" :level="2" class="mt-4"
    >Zutaten</UiHeader
  >

  <div v-if="searchLoadingValue" class="text-center">
    <Icon name="line-md:loading-loop" width="50" height="50" />
  </div>
  <ul v-else class="mb-4">
    <BasketIngredientItem
      v-if="ingredientsWithProducts"
      :ingredientsWithProducts="ingredientsWithProducts"
      @selectProduct="selectProduct($event.selectedProduct, $event.ingredient)"
    />
  </ul>

  <div v-if="ingredientsWithProducts && !searchLoadingValue" class="flex gap-4">
    <UiButton :loading="orderLoading" @click="orderBasket()"
      >Bestellen</UiButton
    >
  </div>
  <UiNotification v-if="error" severity="error"
    >Fehler beim Bestellen!</UiNotification
  >
</template>

<script setup lang="ts">
import {
  type IngredientWithProducts,
  type SelectedProduct,
} from "~/lib/models";
import { postOrderIngredients } from "~/lib/api";

const props = defineProps<{
  basketId: string;
}>();

const orderLoading = ref(false);
const error = ref();

const {
  searchLoadingValue,
  reweCookieDataValue,
  updateIngredientSelectedProducts,
  ingredientsWithProducts,
} = useBasketStore();

const selectProduct = (
  event: SelectedProduct,
  ingredient: IngredientWithProducts,
) => {
  updateIngredientSelectedProducts(event, ingredient, props.basketId);
};

const orderBasket = async () => {
  if (reweCookieDataValue.value == null) {
    console.error("No rewe cookies!");
    return;
  }

  try {
    const createBasketResponse = await $fetch("/api/create-basket", {
      method: "POST",
      body: {
        basketId: props.basketId,
        ingredients: ingredientsWithProducts.value,
      },
    });

    orderLoading.value = true;
    await postOrderIngredients(
      ingredientsWithProducts.value,
      reweCookieDataValue.value,
    );
    orderLoading.value = false;
    await navigateTo(`/basket/${createBasketResponse.basketId}/ordered`);
  } catch (e) {
    orderLoading.value = false;
    error.value = e;
  }
};
</script>
