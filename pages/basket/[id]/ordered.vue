<template>
  <UiHeader class="flex-grow mb-5" :level="1">Warenkorb vollständig!</UiHeader>

  <p class="mb-4">
    Der Warenkorb wurde angelegt. Gehe zum Rewe Warenkorb, um die Bestellung
    abzuschließen.
  </p>

  <UiLink to="https://shop.rewe.de/checkout/basket" target="_blank"
    >Zum Rewe Warenkorb</UiLink
  >

  <template v-if="data">
    <UiHeader class="mt-10" :level="2">Ausgewählte Rezepte</UiHeader>
    <RecipeCardView>
      <RecipeCard
        v-for="recipe in data.basket.recipes"
        :key="recipe['@id']"
        :recipe="recipe"
      >
      </RecipeCard>
    </RecipeCardView>
    <p v-if="!data.basket.recipes.length">Warenkorb ist leer</p>
  </template>
  <p v-if="error" class="mt-5 text-center font-bold">
    Konnte Warenkorb nicht laden!
  </p>
</template>

<script setup lang="ts">
const route = useRoute("basket-id-ordered");

const { data, error } = await useFetch(`/api/basket`, {
  query: { basketId: route.params.id },
});
</script>
