<template>
  <RecipeCardView>
    <RecipeCard
      v-for="recipe in props.recipes"
      :key="recipe['@id']"
      :recipe="recipe"
    >
      <UiButton
        class="mt-4"
        iconName="fluent:checkmark-16-regular"
        variant="accent"
        @click="emit('select', recipe)"
      />
    </RecipeCard>
  </RecipeCardView>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  recipes: RecipeSchema[];
}>();
const emit = defineEmits<{
  select: [RecipeSchema];
}>();
</script>
