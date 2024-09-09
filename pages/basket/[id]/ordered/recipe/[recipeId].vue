<template>
  <div class="flex justify-between">
    <UiLink :to="basketUrl" class="inline-flex mb-4" variant="accent"
      >Zurück</UiLink
    >
  </div>
  <RecipeDetail :recipe="data" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const route = useRoute("basket-id-recipe-recipeId");
const { data } = await useFetchRecipe(route.params.recipeId);

const basketUrl = computed(() => `/basket/${route.params.id}/ordered`);
</script>
