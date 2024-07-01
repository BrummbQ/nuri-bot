<template>
  <div class="flex mb-5">
    <UiHeader class="flex-grow mb-0" :level="1">Rezepte suchen</UiHeader>
    <UiLink :to="basketUrl">Zum Warenkorb</UiLink>
  </div>
  <RecipeSearch
    :selectedRecipes="recipes"
    @selectedRecipesChanged="updateRecipes($event, currentBasket)"
    :basketId="route.params.id"
  />
</template>

<script setup lang="ts">
const route = useRoute("basket-id-recipe");
const { currentBasket, createOrSetBasket, updateRecipes, recipes } =
  useBasketStore();
const basketUrl = computed(() => `/basket/${route.params.id}/basket`);

await callOnce(async () => {
  createOrSetBasket(route.params.id);
});
</script>
