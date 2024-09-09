<template>
  <div class="flex py-5 bg-white sticky top-0">
    <UiHeader :level="1" :noMargin="true" class="flex-grow"
      >{{ selectedRecipes.length }} Ausgewählte Rezepte</UiHeader
    >
    <UiLink :to="basketUrl">Warenkorb</UiLink>
  </div>
  <div class="flex gap-6 mb-8 p-4 overflow-x-auto">
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
      />
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
