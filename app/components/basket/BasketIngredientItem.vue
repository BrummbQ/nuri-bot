<template>
  <UiAccordionItem
    v-for="ingredient in props.ingredientsWithProducts"
    :key="ingredient.productName"
    :modelValue="expandedIngredient?.productName === ingredient.productName"
    @update:modelValue="toggled($event, ingredient)"
  >
    <template #title>
      <div class="flex flex-1 items-center pr-4 min-h-8">
        <span class="font-bold md:min-w-36 lg:min-w-48 mr-4">{{
          ingredientTitle(ingredient)
        }}</span>
        <template
          v-if="
            ingredient.selectedProducts?.length &&
            ingredient.selectedProducts[0].quantity
          "
        >
          <span>{{ ingredient.selectedProducts[0].product.name }}</span>
          <div class="flex-1"></div>
          <UiButton
            size="small"
            variant="outline"
            title="Zutat entfernen"
            @click.stop="unselectProducts(ingredient)"
            ><Icon name="fluent:delete-16-regular" class="text-xl my-1"
          /></UiButton>
        </template>
        <div class="flex items-center text-red-500" v-else>
          <span class="italic">Keine Auswahl</span>
          <Icon name="fluent:warning-16-regular" class="text-2xl ml-2" />
        </div>
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
  ProductSearchResponse,
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

const expandedIngredient = ref<IngredientWithProducts>();

const selectedProduct = (
  product: ProductSearchResponse,
  ingredient: IngredientWithProducts,
): SelectedProduct | undefined => {
  return ingredient.selectedProducts?.find((p) => p.product.id === product.id);
};

const changeQuantity = (
  product: ProductSearchResponse,
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

function unselectProducts(ingredient: IngredientWithProducts) {
  if (ingredient.selectedProducts?.length) {
    emit("selectProduct", {
      selectedProduct: {
        product: ingredient.selectedProducts[0].product,
        quantity: 0,
      },
      ingredient,
    });
  }
}

function toggled(toggle: boolean, ingredient: IngredientWithProducts) {
  expandedIngredient.value = toggle ? ingredient : undefined;
}
</script>
