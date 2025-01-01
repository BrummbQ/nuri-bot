<template>
  <BasketSetup />

  <UiNotification v-if="searchError" severity="error">
    Fehler beim Laden der Produkte!
  </UiNotification>
  <UiLoadingIndicator v-if="searchLoading" class="mt-32" />
  <div v-if="!searchLoading && !searchError" class="mb-4">
    <ul class="mt-4">
      <BasketIngredientItem
        v-if="ingredientsWithProducts"
        :ingredientsWithProducts="ingredientsWithProducts"
        @selectProduct="
          selectProduct($event.selectedProduct, $event.ingredient)
        "
      />
    </ul>
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
