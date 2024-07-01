<template>
  <RecipeSearchInput :loading="loading" @search="queryRecipes($event)" />
  <RecipeCardView>
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe['@id']"
      :recipe="recipe"
      :selectable="true"
      @select="selectRecipe($event)"
    />
  </RecipeCardView>

  <template v-if="selectedRecipes.length > 0">
    <UiHeader :level="2">Ausgewählte Rezepte</UiHeader>
    <RecipeCardView>
      <RecipeCard
        v-for="recipe in selectedRecipes"
        :key="recipe['@id']"
        :recipe="recipe"
        @unselect="unselectRecipe($event)"
      />
    </RecipeCardView>
  </template>
</template>

<script setup lang="ts">
import { getSearchRecipes } from "~/lib/api";
import type { RecipeSchema } from "~/lib/models";

const loading = ref(false);
const recipes = ref<RecipeSchema[]>([]);
const selectedRecipes = defineModel<RecipeSchema[]>({ required: true });

const queryRecipes = async (query: string) => {
  loading.value = true;
  recipes.value = [];

  const result = await getSearchRecipes(query);
  loading.value = false;

  const mappedRecipes: RecipeSchema[] = [];
  result.recipes.forEach((r) => {
    if (r.metadata?.recipeSchema) {
      mappedRecipes.push(r.metadata.recipeSchema as unknown as RecipeSchema);
    }
  });
  recipes.value = mappedRecipes;
};

const selectRecipe = (recipe: RecipeSchema) => {
  recipes.value = recipes.value.filter((r) => r["@id"] !== recipe["@id"]);
  selectedRecipes.value.push(recipe);
};

const unselectRecipe = (recipe: RecipeSchema) => {
  selectedRecipes.value = selectedRecipes.value.filter(
    (r) => r["@id"] !== recipe["@id"],
  );
  recipes.value.push(recipe);
};
</script>
