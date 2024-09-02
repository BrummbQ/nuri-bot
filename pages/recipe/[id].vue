<template>
  <UiNotification v-if="data == null" severity="error">
    Rezept existiert nicht!
  </UiNotification>
  <div class="max-w-xl" v-else>
    <UiHeader :level="1">{{ data.name }}</UiHeader>

    <img
      :src="recipeImage"
      alt="Recipe Image"
      class="w-full h-48 object-cover rounded-md mb-4"
    />

    <p class="flex-1 text-gray-600 dark:text-gray-400 mb-4">
      {{ data.description }}
    </p>
    <div class="flex items-center gap-2">
      <UILabeledInfo
        iconName="fluent:timer-16-regular"
        :text="recipeTime ? recipeTime + ' minutes' : '-'"
      />

      <UILabeledInfo
        iconName="fluent:person-16-regular"
        :text="data.recipeYield"
      />
    </div>

    <ul class="mt-4">
      <li
        v-for="ingredient of data.recipeIngredient"
        :key="ingredient"
        class="inline-block bg-gray-300 py-1 px-2 mr-2 mb-2 rounded-md"
      >
        {{ ingredient }}
      </li>
    </ul>

    <ul class="mt-4 space-y-4">
      <li
        v-for="instruction in data.recipeInstructions"
        :key="instruction.name"
        class="bg-accent p-4 rounded-md"
      >
        <UiHeader :level="3">{{ instruction.name }}</UiHeader>
        <p>{{ instruction.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const route = useRoute("recipe-id");
const { data } = await useFetchRecipe(route.params.id);

const recipeImage = computed<string>(() => {
  if (!data.value?.image.length) {
    return "/images/placeholder.svg";
  }
  return data.value.image[0] + "?impolicy=recipe-card";
});
const recipeTime = computed<number | undefined>(() =>
  totalRecipeTime(data.value),
);
</script>
