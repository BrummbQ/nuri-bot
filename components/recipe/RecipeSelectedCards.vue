<template>
  <UiHeader :level="2">Ausgewählte Rezepte</UiHeader>
  <RecipeCardView>
    <RecipeCard
      v-for="recipe in props.selectedRecipes"
      :key="recipe['@id']"
      :recipe="recipe"
    >
      <UiButton
        class="mt-4"
        iconName="fluent:delete-16-regular"
        variant="accent"
        @click="emit('unselect', recipe)"
      />
    </RecipeCard>
  </RecipeCardView>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  selectedRecipes: RecipeSchema[];
}>();
const emit = defineEmits<{
  unselect: [RecipeSchema];
}>();
</script>
