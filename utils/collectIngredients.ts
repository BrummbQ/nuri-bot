import type { Ingredient } from "~/lib/models";
import type { RecipeSchema } from "~/lib/search";

function parseIngredients(ingredients: string[]): Ingredient[] {
  const parsedIngredients: Ingredient[] = [];

  ingredients.forEach((item) => {
    // Extracting quantity and unit using regex
    const match = item.match(/^(\d*\.?\d+)?\s*([^\d\s]*)?\s*(.*)/);
    if (match == null) {
      return;
    }
    let quantity = match[1] ? parseFloat(match[1]) : undefined;
    let unit = match[2] ? match[2].trim() : undefined;
    let productName = match[3] ? match[3].trim() : undefined;

    // fix "2 Eier"
    if (unit && productName == null) {
      productName = unit;
      unit = undefined;
    }

    // product name must be defined
    if (productName == null || productName === "") {
      return;
    }

    // add to list
    parsedIngredients.push({
      quantity: quantity,
      unit: unit,
      productName: productName,
    });
  });

  return parsedIngredients;
}

function bundleIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.reduce((acc, ingredient) => {
    const accIngredient = acc.find(
      (i) => i.productName === ingredient.productName,
    );
    if (accIngredient == null) {
      acc.push({ ...ingredient });
    } else if (accIngredient.quantity != null && ingredient.quantity != null) {
      accIngredient.quantity += ingredient.quantity;
    }
    return acc;
  }, [] as Ingredient[]);
}

/**
 * Filter common ingredients usually available at home
 */
function filterCommonIngredients(ingredients: Ingredient[]): Ingredient[] {
  const commonIgredients = [
    "Salz",
    "Pfeffer",
    "Zucker",
    "Eiswürfel",
    "Rapsöl",
    "Öl",
    "Essig",
    "Honig",
    "Sonnenblumenöl",
    "Butter",
    "Mehl",
  ];
  return ingredients.filter((i) => !commonIgredients.includes(i.productName));
}

export default function (recipes: RecipeSchema[]): Ingredient[] {
  let ingredients: string[] = [];
  recipes.forEach((r) => {
    ingredients = ingredients.concat(r.recipeIngredient);
  });

  const ingredientsParsed = parseIngredients(ingredients);
  const ingredientsBundled = bundleIngredients(ingredientsParsed);
  const ingredientsFiltered = filterCommonIngredients(ingredientsBundled);

  return ingredientsFiltered;
}
