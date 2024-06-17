<template>
  <RecipesSearchInput :loading="loading" @search="queryRecipes($event)" />
  <RecipesView>
    <RecipesCard
      v-for="recipe in recipes"
      :key="recipe['@id']"
      :recipe="recipe"
    />
  </RecipesView>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/search";

const loading = ref(false);
const recipes = ref<RecipeSchema[]>([]);

const queryRecipes = async (query: string) => {
  loading.value = true;
  recipes.value = [];

  const result = await $fetch("/api/recipes", {
    method: "POST",
    body: { query },
  });
  loading.value = false;

  const mappedRecipes: RecipeSchema[] = [];
  result.recipes.forEach((r) => {
    if (r.metadata?.recipeSchema) {
      mappedRecipes.push(r.metadata.recipeSchema as unknown as RecipeSchema);
    }
  });
  recipes.value = mappedRecipes;
};
</script>
