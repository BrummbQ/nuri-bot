<template>
  <BasketSetup @buildBasket="searchIngedients()" />

  <UiHeader v-if="ingredientsWithProducts.length" :level="2" class="mt-4"
    >Zutaten</UiHeader
  >

  <ul class="mb-4">
    <UiAccordionItem
      v-for="ingredient in ingredientsWithProducts"
      :key="ingredient.productName"
    >
      <template #title>
        <div class="flex items-center">
          <span class="font-bold italic">{{
            ingredientTitle(ingredient)
          }}</span>
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
          :selectedQuantity="
            selectedProduct(product, ingredient)?.quantity ?? 0
          "
          @quantityChanged="
            selectProduct({ product, quantity: $event }, ingredient)
          "
        />
      </div>
      <div class="text-center" v-if="!ingredient.products.length">
        <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
        keine Produkte gefunden
      </div>
    </UiAccordionItem>
  </ul>

  <div class="flex gap-4">
    <UiButton
      v-if="ingredientsWithProducts && basketDirty"
      :loading="orderLoading"
      @click="orderBasket()"
      >Bestellen</UiButton
    >
    <UiLink
      v-if="ingredientsWithProducts && !basketDirty"
      href="https://shop.rewe.de/checkout/basket"
      >Zum Rewe Warenkorb</UiLink
    >
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/search";
import type {
  IngredientWithProducts,
  SelectedProduct,
} from "~/server/api/ingredients-search.post";
import type { ReweProduct } from "~/lib/models";

const props = defineProps<{ recipes: RecipeSchema[] }>();

const ingredients = computed(() => {
  return collectIngredients(props.recipes);
});
const ingredientsWithProducts = ref<IngredientWithProducts[]>([]);
const orderLoading = ref(false);
const basketDirty = ref(false);

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

const selectedProduct = (
  product: ReweProduct,
  ingredient: IngredientWithProducts,
): SelectedProduct | undefined => {
  return ingredient.selectedProducts?.find((p) => p.product.id === product.id);
};

const searchIngedients = async () => {
  const result = await $fetch("/api/ingredients-search", {
    method: "POST",
    body: { ingredients: ingredients.value, market: "4040426" },
  });
  // auto select first product for each ingredient
  result.ingredients.forEach((i) => {
    if (i.products.length) {
      i.selectedProducts = [{ product: i.products[0], quantity: 1 }];
    }
  });
  ingredientsWithProducts.value = result.ingredients;
  basketDirty.value = true;
};

const orderBasket = async () => {
  orderLoading.value = true;
  await $fetch("/api/ingredients-order", {
    method: "POST",
    body: { ingredients: ingredientsWithProducts.value },
  });
  orderLoading.value = false;
  basketDirty.value = false;
};
</script>
