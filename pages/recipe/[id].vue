<template>
  <RecipeDetail :recipe="data" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "narrow",
});

const route = useRoute("recipe-id");
const { data } = await useFetchRecipe(route.params.id);
</script>
