<template>
  <RecipeDetail :recipe="data" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const route = useRoute("recipe-recipeId");
const { data } = await useFetchRecipe(route.params.recipeId);
</script>
