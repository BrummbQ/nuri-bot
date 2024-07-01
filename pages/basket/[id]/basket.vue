<template>
  <div class="flex mb-5">
    <UiHeader class="flex-grow mb-0" :level="1">Warenkorb</UiHeader>
    <UiLink :to="recipeUrl">Rezepte ändern</UiLink>
  </div>
  <BasketShoppingList
    v-if="recipes.length"
    :recipes="recipes"
    :basketId="route.params.id"
    :ingredientsWithProducts="ingredientsWithProducts"
    @updateIngredientsWithProducts="
      updateIngredientsWithProducts($event, currentBasket)
    "
  />
  <p v-else class="text-center mt-10 font-bold text-gray-500">
    <Icon name="fluent:emoji-sad-16-regular" width="50" height="50" />
    Keine Rezepte ausgewählt!
  </p>
</template>

<script setup lang="ts">
const route = useRoute("basket-id-basket");

const {
  createOrSetBasket,
  currentBasket,
  recipes,
  ingredientsWithProducts,
  updateIngredientsWithProducts,
} = useBasketStore();
const recipeUrl = computed(() => `/basket/${route.params.id}/recipe`);

await callOnce(async () => {
  createOrSetBasket(route.params.id);
});
</script>
