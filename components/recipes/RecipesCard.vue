<template>
  <article class="flex flex-col bg-white rounded-lg overflow-hidden shadow-lg">
    <img
      :src="recipeImage"
      alt="Recipe Image"
      width="{300}"
      height="{200}"
      class="w-full h-48 object-cover"
    />
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="text-lg text-gray-600 font-bold mb-2">
        {{ props.recipe.name }}
      </h3>
      <p class="flex-1 text-gray-600 dark:text-gray-400 mb-4">
        {{ props.recipe.description }}
      </p>
      <div class="flex items-center gap-2">
        <Icon name="fluent:timer-16-regular" />
        <span class="text-gray-500 dark:text-gray-400">
          <template v-if="recipeTime">{{ recipeTime }} minutes</template>
          <template v-else>-</template>
        </span>
        <Icon name="fluent:person-16-regular" />
        <span class="text-gray-500 dark:text-gray-400">{{
          props.recipe.recipeYield
        }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/search";

const props = defineProps<{
  recipe: RecipeSchema;
}>();

function parseTimeInMinutes(recipeTime: string): number | undefined {
  const [_, minutesString] = recipeTime.split("PT");
  if (minutesString != null) {
    return parseInt(minutesString);
  }
  return undefined;
}

const recipeImage = computed<string>(() => {
  if (!props.recipe.image.length) {
    return "/assets/placeholder.svg";
  }
  return props.recipe.image[0];
});

const recipeTime = computed<number | undefined>(() => {
  let totalTime: number | undefined = undefined;
  if (props.recipe.totalTime) {
    totalTime = parseTimeInMinutes(props.recipe.totalTime);
    return totalTime;
  }
  if (props.recipe.prepTime) {
    totalTime = parseTimeInMinutes(props.recipe.prepTime);
  }
  if (props.recipe.cookTime) {
    const cookTime = parseTimeInMinutes(props.recipe.cookTime);
    if (totalTime != null && cookTime != null) {
      totalTime += cookTime;
    } else {
      totalTime = cookTime;
    }
  }
  return totalTime;
});
</script>
