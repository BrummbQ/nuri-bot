import type { Ingredient, RecipeSchema } from "~/lib/models";

type RecipeWizardState = {
  ingredients: Record<string, Ingredient>;
  recipe?: RecipeSchema;
};

const recipeWizardSessionKey = "recipewizard";
const defaultState = () => ({ ingredients: {} });

export const useRecipeWizard = () =>
  useState<RecipeWizardState>("wizardIngredients", () => defaultState());

export const useRecipeWizardState = () => {
  const state = useRecipeWizard();
  const query = ref("");
  const { getItem, setItem } = useSessionStorage<RecipeWizardState>();

  onMounted(() => {
    state.value = getItem(recipeWizardSessionKey) ?? defaultState();
  });

  const ingredients = computed(() => Object.values(state.value.ingredients));
  const recipe = computed(() => state.value.recipe);

  function addIngredient(i: string) {
    if (i.length > 1) {
      state.value.ingredients[i] = { productName: i, recipes: [] };
      query.value = "";
      setItem(recipeWizardSessionKey, state.value);
    }
  }

  function removeIngredient(i: string) {
    delete state.value.ingredients[i];
    setItem(recipeWizardSessionKey, state.value);
  }

  function setRecipe(r?: RecipeSchema) {
    state.value.recipe = r;
    setItem(recipeWizardSessionKey, state.value);
  }

  function clearWizard() {
    state.value = defaultState();
    setItem(recipeWizardSessionKey, state.value);
  }

  return {
    ingredients,
    recipe,
    query,
    addIngredient,
    removeIngredient,
    setRecipe,
    clearWizard,
  };
};
