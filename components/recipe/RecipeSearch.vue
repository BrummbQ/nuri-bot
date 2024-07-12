<template>
  <RecipeSearchInput
    :loading="loading"
    :placeholder="searchTerm"
    @search="queryRecipes($event)"
  />
  <RecipeSearchSuggestions @suggest="suggestRecipe($event)" />
  <RecipeAvailableCards :recipes="recipes" @select="selectRecipe($event)" />

  <template v-if="selectedRecipes.length > 0">
    <RecipeSelectedCards
      :selectedRecipes="selectedRecipes"
      @unselect="unselectRecipe($event)"
    />

    <UiLink :to="basketUrl">Zum Warenkorb</UiLink>
  </template>
</template>

<script setup lang="ts">
import { getSearchRecipes } from "~/lib/api";
import type {
  RecipeSchema,
  RecipeSuggestion,
  SearchGenerateTermResponse,
} from "~/lib/models";

const props = defineProps<{
  basketId: string;
  selectedRecipes: RecipeSchema[];
}>();
const emit = defineEmits<{
  selectedRecipesChanged: [recipes: RecipeSchema[]];
}>();

const loading = ref(false);
const recipes = ref<RecipeSchema[]>([]);
const searchTerm = ref<string>();
const { data } = await useFetch<SearchGenerateTermResponse>(
  `/api/search/generate-term`,
);

const basketUrl = computed(() => `/basket/${props.basketId}/basket`);

const queryRecipes = async (query: string) => {
  loading.value = true;
  recipes.value = [];

  const result = await getSearchRecipes(query);
  loading.value = false;

  const mappedRecipes: RecipeSchema[] = [];
  result.recipes.forEach((r) => {
    if (r.metadata?.recipeSchema) {
      mappedRecipes.push(r.metadata.recipeSchema as unknown as RecipeSchema);
    }
  });
  recipes.value = mappedRecipes;
};

const selectRecipe = (recipe: RecipeSchema) => {
  recipes.value = recipes.value.filter((r) => r["@id"] !== recipe["@id"]);
  emit("selectedRecipesChanged", [...props.selectedRecipes, recipe]);
};

const unselectRecipe = (recipe: RecipeSchema) => {
  const filteredSelectedRecipes = props.selectedRecipes.filter(
    (r) => r["@id"] !== recipe["@id"],
  );
  emit("selectedRecipesChanged", filteredSelectedRecipes);
  recipes.value.push(recipe);
};

const suggestRecipe = async ({ seed, dietType }: RecipeSuggestion) => {
  const result = await $fetch("/api/search/generate-term", {
    query: { seed, dietType },
  });
  searchTerm.value = result.searchTerm;
  queryRecipes(result.searchTerm);
};

watchEffect(() => {
  if (data.value?.searchTerm) {
    queryRecipes(data.value?.searchTerm);
    searchTerm.value = data.value?.searchTerm;
  }
});
</script>
