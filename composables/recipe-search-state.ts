const searchStateKey = "recipeSearch";

export const useRecipeSearchState = async () => {
  const recipeSearch = useCookie<string | undefined>(searchStateKey);

  function setRecipeSearch(search: string) {
    recipeSearch.value = search;
  }

  if (recipeSearch.value == null) {
    const { data } = await useFetchGenerateSearchTerm();
    if (data.value?.searchTerm) {
      setRecipeSearch(data.value?.searchTerm);
    }
  }

  return { recipeSearch, setRecipeSearch };
};
