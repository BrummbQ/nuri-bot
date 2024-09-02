<template>
  <RecipeSelectedCards
    v-if="recipes.length"
    :basketUrl="basketUrl"
    :selectedRecipes="recipes"
    @unselect="unselectRecipe($event)"
  />

  <div class="flex mb-5">
    <UiHeader class="flex-grow mb-0" :level="1">Rezepte suchen</UiHeader>
  </div>

  <RecipeSearchInput
    :loading="loading"
    :placeholder="data?.searchTerm"
    @search="queryRecipes($event)"
  />
  <RecipeSearchSuggestions @suggest="suggestRecipe($event)" />
  <RecipeAvailableCards
    :recipes="recipesFromSearch"
    @select="selectRecipe($event)"
  />
</template>

<script setup lang="ts">
import type { RecipeSchema, RecipeSuggestion } from "~/lib/models";

const props = defineProps<{
  basketId: string;
}>();

const loading = ref(false);
const recipesFromSearch = ref<RecipeSchema[]>([]);
const { data } = await useFetchGenerateSearchTerm();
const { getSearchRecipes, generateTerm } = useApi();
const { updateRecipes, recipes, createOrSetBasket } = useBasketStore();

callOnce(() => createOrSetBasket(props.basketId));

const basketUrl = computed(() => `/basket/${props.basketId}/basket`);

const queryRecipes = async (query: string) => {
  loading.value = true;
  recipesFromSearch.value = [];

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
  recipesFromSearch.value = recipesFromSearch.value.filter(
    (r) => r["@id"] !== recipe["@id"],
  );
  updateRecipes([...recipes.value, recipe], props.basketId);
};

const unselectRecipe = (recipe: RecipeSchema) => {
  const filteredSelectedRecipes = recipes.value.filter(
    (r) => r["@id"] !== recipe["@id"],
  );
  updateRecipes(filteredSelectedRecipes, props.basketId);
  recipesFromSearch.value.push(recipe);
};

const suggestRecipe = async (query: RecipeSuggestion) => {
  const result = await generateTerm(query);
  data.value = result;
  queryRecipes(result.searchTerm);
};

onMounted(() => {
  if (data.value?.searchTerm) {
    queryRecipes(data.value.searchTerm);
  }
});
</script>
