<template>
  <UiNotification v-if="recipe == null" severity="error">
    Rezept existiert nicht!
  </UiNotification>
  <template v-else>
    <div class="flex justify-between mb-4">
      <UiHeader :level="1" :noMargin="true">{{ recipe.name }}</UiHeader>
      <UiButton
        v-if="canLike"
        type="button"
        variant="outline"
        title="Rezept speichern"
        @click="emit('likeRecipe', !recipe.liked)"
        ><Icon
          :name="recipe.liked ? 'mdi:heart' : 'mdi:heart-outline'"
          class="text-2xl"
          :class="{ 'text-primary': recipe.liked }"
      /></UiButton>
    </div>

    <img
      :src="recipeImage"
      alt="Recipe Image"
      class="w-full h-48 object-cover rounded-md mb-4"
    />

    <p class="flex-1 text-gray-600 dark:text-gray-400 mb-4">
      {{ recipe.description }}
    </p>
    <div class="flex items-center gap-2">
      <UILabeledInfo
        iconName="fluent:timer-16-regular"
        :text="recipeTime ? recipeTime + ' minutes' : '-'"
      />

      <UILabeledInfo
        iconName="fluent:person-16-regular"
        :text="recipe.recipeYield"
      />
    </div>

    <ul class="mt-4">
      <li
        v-for="ingredient of recipe.recipeIngredient"
        :key="ingredient"
        class="inline-block bg-gray-300 py-1 px-2 mr-2 mb-2 rounded-md"
      >
        {{ ingredient }}
      </li>
    </ul>

    <ul class="mt-4 space-y-4">
      <li
        v-for="instruction in recipe.recipeInstructions"
        :key="instruction.name"
        class="bg-accent p-4 rounded-md"
      >
        <UiHeader :level="3">{{ instruction.name }}</UiHeader>
        <p>{{ instruction.text }}</p>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  recipe?: RecipeSchema | null;
  canLike?: boolean;
}>();
const emit = defineEmits<{
  likeRecipe: [like: boolean];
}>();

const recipeImage = computed<string>(() => {
  if (!props.recipe?.image.length) {
    return "/images/placeholder.svg";
  }
  return props.recipe.image[0] + "?impolicy=recipe-card";
});
const recipeTime = computed<number | undefined>(() =>
  totalRecipeTime(props.recipe),
);
</script>
