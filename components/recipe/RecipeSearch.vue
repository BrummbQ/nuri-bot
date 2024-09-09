<template>
  <RecipeSelectedCards
    v-if="recipes.length"
    :basketUrl="basketUrl"
    :basketId="basketId"
    :selectedRecipes="recipes"
    @unselect="unselectRecipe($event)"
  />

  <UiHeader class="flex-grow" :level="1">Rezepte suchen</UiHeader>

  <div class="p-4">
    <RecipeSearchInput
      :loading="loading"
      :placeholder="recipeSearch"
      @search="queryRecipes($event)"
    />
    <RecipeSearchSuggestions
      :basketId="basketId"
      @suggest="suggestRecipe($event)"
    />
    <RecipeAvailableCards
      :recipes="unselectedRecipes"
      :basketId="basketId"
      @select="selectRecipe($event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { RecipeSchema, RecipeSuggestion } from "~/lib/models";

const props = defineProps<{
  basketId: string;
}>();

const loading = ref(false);
const recipesFromSearch = ref<RecipeSchema[]>([]);
const { recipeSearch, setRecipeSearch } = await useRecipeSearchState();
const { getSearchRecipes, generateTerm } = useApi();
const { addRecipe, removeRecipe, recipes, createOrSetBasket } =
  useBasketStore();

callOnce(() => createOrSetBasket(props.basketId));

const basketUrl = computed(() => `/basket/${props.basketId}/basket`);
const unselectedRecipes = computed(() =>
  recipesFromSearch.value.filter(
    (r) => recipes.value.find((sR) => sR["@id"] === r["@id"]) == null,
  ),
);

const queryRecipes = async (query: string) => {
  loading.value = true;
  recipesFromSearch.value = [];
  setRecipeSearch(query);

  const result = await getSearchRecipes(query);
  loading.value = false;

  const mappedRecipes: RecipeSchema[] = [];
  result.recipes.forEach((r) => {
    if (r.metadata?.recipeSchema) {
      mappedRecipes.push(r.metadata.recipeSchema as unknown as RecipeSchema);
    }
  });
  recipesFromSearch.value = mappedRecipes;
};

const selectRecipe = (recipe: RecipeSchema) => {
  addRecipe(recipe, props.basketId);
};

const unselectRecipe = (recipe: RecipeSchema) => {
  removeRecipe(recipe, props.basketId);
};

const suggestRecipe = async (query: RecipeSuggestion) => {
  const result = await generateTerm(query);
  queryRecipes(result.searchTerm);
};

onMounted(() => {
  if (recipeSearch.value) {
    queryRecipes(recipeSearch.value);
  }
});
</script>
