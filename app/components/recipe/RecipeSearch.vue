<template>
  <h1 class="text-xl font-semibold text-gray-400">Menü {{ menuPeriod }}</h1>

  <RecipeSelectedCards
    v-if="recipes.length"
    :basketUrl="basketUrl"
    :basketId="basketId"
    :selectedRecipes="recipes"
    @unselect="unselectRecipe($event)"
  />

  <RecipeAvailableCards
    :recipes="unselectedRecipes"
    :basketId="basketId"
    @select="selectRecipe($event)"
  />
</template>

<script setup lang="ts">
import type { RecipeSchema } from "~/lib/models";
import { formatDateShort, lastSunday } from "~/lib/utils/date";

const props = defineProps<{
  basketId: string;
}>();

const recipesFromSearch = ref<RecipeSchema[]>([]);
const recipesData = await useFetchMenuRecipes();
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
const menuPeriod = computed(() => {
  const lastSundayDate = lastSunday();
  const nextSundayDate = lastSunday();
  nextSundayDate.setDate(nextSundayDate.getDate() + 7);
  return `${formatDateShort(lastSundayDate)} - ${formatDateShort(nextSundayDate)}`;
});

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
