<template>
  <UiAccordionItem
    v-for="ingredient in props.ingredientsWithProducts"
    :key="ingredient.productName"
  >
    <template #title>
      <div class="flex items-center">
        <span class="font-bold italic">{{ ingredientTitle(ingredient) }}</span>
        <Icon
          v-if="!ingredient.selectedProducts?.length"
          name="fluent:warning-16-regular"
          class="text-2xl text-red-500 ml-2"
        />
      </div>
    </template>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <BasketProductCard
        v-for="product in ingredient.products"
        :key="product.id"
        :product="product"
        :selectedQuantity="selectedProduct(product, ingredient)?.quantity ?? 0"
        @quantityChanged="changeQuantity(product, ingredient, $event)"
      />
    </div>
    <div class="text-center" v-if="!ingredient.products.length">
      <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
      keine Produkte gefunden
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type {
  IngredientWithProducts,
  ReweProduct,
  SelectedProduct,
} from "~/lib/models";

const props = defineProps<{
  ingredientsWithProducts: IngredientWithProducts[];
}>();
const emit = defineEmits<{
  selectProduct: [
    event: {
      selectedProduct: SelectedProduct;
      ingredient: IngredientWithProducts;
    },
  ];
}>();

const selectedProduct = (
  product: ReweProduct,
  ingredient: IngredientWithProducts,
): SelectedProduct | undefined => {
  return ingredient.selectedProducts?.find((p) => p.product.id === product.id);
};

const changeQuantity = (
  product: ReweProduct,
  ingredient: IngredientWithProducts,
  quantity?: number,
) => {
  if (quantity == null) {
    quantity = calcProductQuantity(ingredient, product) ?? 1;
  }

  emit("selectProduct", {
    selectedProduct: { product, quantity },
    ingredient,
  });
};
</script>
