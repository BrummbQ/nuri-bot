<template>
  <UiCardView>
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe['@id']"
      :recipe="recipe"
      :recipeLink="userRecipeUrl(userId, recipe)"
    >
      <UiButton
        class="mt-4"
        iconName="fluent:checkmark-16-regular"
        variant="accent"
        @click="emit('select', recipe)"
        >Hinzufügen</UiButton
      >
    </RecipeCard>
  </UiCardView>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  recipes: RecipeSchema[];
  userId: string;
}>();
const emit = defineEmits<{
  select: [RecipeSchema];
}>();
</script>
