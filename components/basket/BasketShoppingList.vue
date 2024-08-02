<template>
  <BasketSetup />

  <UiHeader v-if="ingredientsWithProducts" :level="2" class="mt-4"
    >Zutaten</UiHeader
  >

  <div v-if="searchLoadingValue" class="text-center">
    <Icon name="line-md:loading-loop" width="50" height="50" />
  </div>
  <div v-else class="mb-4">
    <ul class="mb-2">
      <BasketIngredientItem
        v-if="ingredientsWithProducts"
        :ingredientsWithProducts="ingredientsWithProducts"
        @selectProduct="
          selectProduct($event.selectedProduct, $event.ingredient)
        "
      />
    </ul>
    <BasketOrderButton :basketId="basketId" />
  </div>
</template>

<script setup lang="ts">
import {
  type IngredientWithProducts,
  type SelectedProduct,
} from "~/lib/models";

const props = defineProps<{
  basketId: string;
}>();

const {
  searchLoadingValue,
  updateIngredientSelectedProducts,
  ingredientsWithProducts,
} = useBasketStore();

const selectProduct = (
  event: SelectedProduct,
  ingredient: IngredientWithProducts,
) => {
  updateIngredientSelectedProducts(event, ingredient, props.basketId);
};
</script>
