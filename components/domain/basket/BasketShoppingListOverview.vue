<template>
  <UiHeader :level="2">Einkaufsliste</UiHeader>
  <ul>
    <li
      v-for="(ingredient, index) of props.basket.ingredientsWithProducts"
      :key="ingredient.productName"
      class="my-2"
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
