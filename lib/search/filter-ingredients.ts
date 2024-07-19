import natural from "natural";
import type {
  Ingredient,
  IngredientWithProducts,
  RecipeIngredient,
  RecipeSchema,
} from "../models";

const commonIngredients = [
  "Salz",
  "Pfeffer",
  "Zucker",
  "Eiswürfel",
  "Rapsöl",
  "Öl",
  "Essig",
  "Honig",
  "Senf",
  "Sonnenblumenöl",
  "Rapsöl",
  "Butter",
  "Mehl",
].map((i) => i.toLowerCase());

const tokenizer = new natural.AggressiveTokenizerDe();

function ingredientsFromRecipes(recipes: RecipeSchema[]): RecipeIngredient[] {
  return recipes.reduce((acc, r) => {
    const recipeIngredients = r.recipeIngredient.map((i) => ({
      ingredient: i,
      recipe: r,
    }));
    acc = acc.concat(recipeIngredients);
    return acc;
  }, [] as RecipeIngredient[]);
}

/**
 * Filter common ingredients usually available at home
 */
export function filterCommonIngredients(
  recipes: RecipeSchema[],
): RecipeIngredient[] {
  const ingredients = ingredientsFromRecipes(recipes);

  return ingredients.filter((i) => {
    const ingredient = i.ingredient.trim().toLowerCase();
    const ingredientTokens = tokenizer.tokenize(ingredient);
    const hasCommonIngredient = ingredientTokens.some((iT) =>
      commonIngredients.find((cI) => iT === cI),
    );

    return ingredient && !hasCommonIngredient;
  });
}

export function linkRecipeToIngredients(
  recipes: RecipeSchema[],
  ingredients: IngredientWithProducts[],
): IngredientWithProducts[] {
  return ingredients.map((i) => {
    const r = recipes.filter((r) => {
      return r.recipeIngredient.find((rI) =>
        rI.toLowerCase().includes(i.productName.toLowerCase()),
      );
    });
    return { ...i, recipes: r };
  });
}

export function consolidateSimilarIngredients(
  ingredients: Ingredient[],
): Ingredient[] {
  return ingredients.reduce((acc, ingredient) => {
    // normalize units
    if (ingredient.unit == null) {
      ingredient.unit = "Stück";
    }

    const accIngredient = acc.find(
      (i) =>
        i.productName === ingredient.productName && i.unit === ingredient.unit,
    );
    if (accIngredient != null && ingredient.quantity != null) {
      accIngredient.quantity =
        ingredient.quantity + (accIngredient.quantity ?? 0);
    } else {
      acc.push(ingredient);
    }
    return acc;
  }, [] as Ingredient[]);
}
