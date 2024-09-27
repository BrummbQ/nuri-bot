<template>
  <UiHeader :level="2" class="mt-6">Einkaufsliste</UiHeader>
  <ul class="md:px-4 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
    <li
      v-for="(ingredient, index) of sortedIngredients"
      :key="ingredient.productName"
      class="bg-gray-300 py-1 px-2 rounded-md"
    >
      <UiCheckbox
        :id="ingredient.productName"
        :label="ingredientTitle(ingredient)"
        v-model="shoppingList[index].checked"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Basket } from "~/lib/models";

type IngredientItem = { checked: boolean };

const props = defineProps<{ basket: Basket }>();

const shoppingListKey = computed(() => {
  return props.basket.basketId + "_shopping_list";
});
const sortedIngredients = computed(() => {
  return props.basket.ingredientsWithProducts?.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );
});

const { getItem, setItem } = useSessionStorage<IngredientItem[]>();
const shoppingList = ref<IngredientItem[]>([]);

watchEffect(() => {
  const storedShoppingList = getItem(shoppingListKey.value) ?? [];
  if (props.basket.ingredientsWithProducts && !storedShoppingList.length) {
    shoppingList.value = props.basket.ingredientsWithProducts?.map(() => ({
      checked: false,
    }));
  } else {
    shoppingList.value = storedShoppingList;
  }
});

watch(shoppingList.value, () => {
  setItem(shoppingListKey.value, shoppingList.value);
});
</script>
