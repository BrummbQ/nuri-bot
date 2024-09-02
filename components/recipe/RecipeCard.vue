<template>
  <article class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
    <a :href="recipeUrl" target="_blank">
      <img
        :src="recipeImage"
        alt="Recipe Image"
        class="w-full h-48 object-cover"
      />
    </a>
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="text-lg text-gray-600 font-bold mb-2">
        <a :href="recipeUrl" target="_blank">{{ props.recipe.name }}</a>
      </h3>
      <p class="flex-1 text-gray-600 dark:text-gray-400 mb-4">
        {{ props.recipe.description }}
      </p>
      <div class="flex items-center gap-2">
        <UILabeledInfo
          iconName="fluent:timer-16-regular"
          :text="recipeTime ? recipeTime + ' minutes' : '-'"
        />

        <UILabeledInfo
          iconName="fluent:person-16-regular"
          :text="props.recipe.recipeYield"
        />
      </div>

      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  recipe: RecipeSchema;
}>();

const recipeUrl = computed(
  () =>
    `/recipe/${encodeURIComponent(encodeURIComponent(props.recipe["@id"]))}`,
);
// http://localhost:3000/recipe/https%253A%252F%252Fwww.rewe.de%252Frezepte%252Fgebratene-bananen%252F

const recipeImage = computed<string>(() => {
  if (!props.recipe.image.length) {
    return "/images/placeholder.svg";
  }
  return props.recipe.image[0] + "?impolicy=recipe-card";
});

const recipeTime = computed<number | undefined>(() =>
  totalRecipeTime(props.recipe),
);
</script>
