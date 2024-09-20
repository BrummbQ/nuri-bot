<template>
  <UiHeaderRow
    class="py-5 !mb-0 bg-white sticky top-0"
    :headerText="selectedRecipes.length + ' Ausgewählte Rezepte'"
  >
    <UiLink :to="basketUrl">Warenkorb</UiLink>
  </UiHeaderRow>
  <div class="flex gap-6 mb-8 md:p-4 overflow-x-auto">
    <RecipeCard
      v-for="recipe in selectedRecipes"
      class="min-w-64 w-64"
      :key="recipe['@id']"
      :recipe="recipe"
      :recipeLink="basketRecipeUrl(basketId, recipe)"
    >
      <UiButton
        class="mt-4"
        iconName="fluent:delete-16-regular"
        variant="accent"
        @click="emit('unselect', recipe)"
        >Entfernen</UiButton
      >
    </RecipeCard>
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  selectedRecipes: RecipeSchema[];
  basketId: string;
  basketUrl: string;
}>();
const emit = defineEmits<{
  unselect: [RecipeSchema];
}>();
</script>
