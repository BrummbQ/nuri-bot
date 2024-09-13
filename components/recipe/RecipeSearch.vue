<template>
  <RecipeSelectedCards
    v-if="recipes.length"
    :basketUrl="basketUrl"
    :basketId="basketId"
    :selectedRecipes="recipes"
    @unselect="unselectRecipe($event)"
  />

  <div class="flex">
    <UiHeader class="flex-grow" :level="1">Rezepte auswählen</UiHeader>
    <UiLink :to="wizardUrl" size="small"
      ><Icon name="mdi:wizard-hat" class="text-2xl mr-2" /> Eigenes
      Rezept</UiLink
    >
  </div>

  <div class="p-4">
    <RecipeAvailableCards
      :recipes="unselectedRecipes"
      :basketId="basketId"
      @select="selectRecipe($event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";

const props = defineProps<{
  basketId: string;
}>();

const recipesFromSearch = ref<RecipeSchema[]>([]);
const recipesData = await useFetchScheduleRecipes();
const { addRecipe, removeRecipe, recipes, createOrSetBasket } =
  useBasketStore();
const { recipe } = useRecipeWizardState();

callOnce(() => createOrSetBasket(props.basketId));

const wizardUrl = computed(() => `/basket/${props.basketId}/recipe-wizard`);
const basketUrl = computed(() => `/basket/${props.basketId}/basket`);
const unselectedRecipes = computed(() =>
  recipesFromSearch.value.filter(
    (r) => recipes.value.find((sR) => sR["@id"] === r["@id"]) == null,
  ),
);

const selectRecipe = (recipe: RecipeSchema) => {
  addRecipe(recipe, props.basketId);
};

const unselectRecipe = (recipe: RecipeSchema) => {
  removeRecipe(recipe, props.basketId);
};

onMounted(() => {
  if (recipesData.value) {
    recipesFromSearch.value = recipesData.value.recipes;
  }
  // add recipe from wizard
  if (recipe.value) {
    recipesFromSearch.value.push(recipe.value);
  }
});
</script>
