<template>
  <UiCardView>
    <RecipeCard
      v-for="recipe in props.recipes"
      :key="recipe['@id']"
      :recipe="recipe"
      :recipeLink="basketRecipeUrl(basketId, recipe)"
    >
      <UiButton
        class="mt-4"
        iconName="fluent:checkmark-16-regular"
        variant="accent"
        @click="emit('select', recipe)"
        >Auswählen</UiButton
      >
    </RecipeCard>
  </UiCardView>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  recipes: RecipeSchema[];
  basketId: string;
}>();
const emit = defineEmits<{
  select: [RecipeSchema];
}>();
</script>
