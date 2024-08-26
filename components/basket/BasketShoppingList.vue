<template>
  <BasketSetup />

  <UiHeader v-if="ingredientsWithProducts" :level="2" class="mt-4"
    >Zutaten</UiHeader
  >

  <UiNotification v-if="searchError" severity="error">
    Fehler beim Laden der Produkte!
  </UiNotification>
  <div v-if="searchLoading" class="text-center">
    <Icon name="line-md:loading-loop" width="50" height="50" />
  </div>
  <div v-if="!searchLoading && !searchError" class="mb-4">
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
  searchLoading,
  searchError,
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
