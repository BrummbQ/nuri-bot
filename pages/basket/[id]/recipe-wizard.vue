<template>
  <div class="max-w-xs">
    <UiHeader class="flex-grow" :level="1">Neues Rezept</UiHeader>
    <p class="mb-2">Erstelle ein neues Rezept mit Deinen Zutaten</p>
    <form class="flex items-center mb-4" @submit.prevent="addIngredient(query)">
      <UiInput
        class="rounded-r-none"
        placeholder="Zutat hinzufügen"
        v-model="query"
      />
      <UiButton
        class="rounded-l-none w-16"
        iconName="mdi:add"
        title="Zutat hinzufügen"
      ></UiButton>
    </form>
    <ul class="space-y-2">
      <li
        v-for="ingredient of ingredients"
        :key="ingredient.productName"
        class="p-2 bg-accent rounded-md flex"
      >
        <label class="grow">
          {{ ingredient.productName }}
        </label>
        <button
          type="button"
          title="Zutat entfernen"
          @click="removeIngredient(ingredient.productName)"
        >
          <Icon name="mdi:remove" class="text-2xl" />
        </button>
      </li>
    </ul>

    <UiButton
      class="w-full mt-8"
      iconName="mdi:wizard-hat"
      :loading="generateRecipeLoading"
      @click.prevent="generate()"
      >{{ recipe ? "Neu Erstellen" : "Erstellen" }}</UiButton
    >
    <UiNotification v-if="apiError" severity="error" class="mt-4">
      Fehler beim Erstellen!
    </UiNotification>

    <RecipeCard v-if="recipe" :recipe="recipe" class="mt-4">
      <UiButton
        class="mt-4"
        iconName="fluent:checkmark-16-regular"
        variant="accent"
        >Hinzufügen</UiButton
      >
    </RecipeCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-basket"],
});

const route = useRoute("basket-id-recipe-wizard");
const basketUrl = computed(() => `/basket/${route.params.id}/basket`);

const { generateRecipe } = useApi();
const generateRecipeLoading = useGenerateRecipeLoading();
const apiError = useApiError();
const {
  ingredients,
  recipe,
  query,
  addIngredient,
  removeIngredient,
  setRecipe,
} = useRecipeWizardState();

const generate = async () => {
  setRecipe(undefined);
  const response = await generateRecipe({ ingredients: ingredients.value });
  setRecipe(response?.recipe);
};
</script>
