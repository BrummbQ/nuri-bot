import type { Ingredient, RecipeSchema } from "~/lib/models";

interface RecipeIngredient {
  ingredient: string;
  recipe: RecipeSchema;
}

function parseIngredients(ingredients: RecipeIngredient[]): Ingredient[] {
  const parsedIngredients: Ingredient[] = [];

  ingredients.forEach((item) => {
    // Extracting quantity and unit using regex
    const match = item.ingredient.match(/^(\d*\.?\d+)?\s*([^\d\s]*)?\s*(.*)/);
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

    // fix "3 Äpfel (Größe M)"
    if (productName?.startsWith("(") && unit != null) {
      productName = `${unit} ${productName}`;
      unit = undefined;
    }

    // fix "Öl für die Form"
    if (quantity == null && productName && unit) {
      productName = `${unit} ${productName}`;
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
      recipes: [item.recipe],
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
      // link recipes
      ingredient.recipes.forEach((iR) => {
        if (accIngredient.recipes.find((r) => r["@id"] === iR["@id"]) == null) {
          accIngredient.recipes.push(iR);
        }
      });
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
  return ingredients.filter(
    (i) => commonIgredients.find((cI) => i.productName.includes(cI)) == null,
  );
}

export default function (recipes: RecipeSchema[]): Ingredient[] {
  const ingredients = recipes.reduce((acc, r) => {
    const recipeIngredients = r.recipeIngredient.map((i) => ({
      ingredient: i,
      recipe: r,
    }));
    acc = acc.concat(recipeIngredients);
    return acc;
  }, [] as RecipeIngredient[]);

  const ingredientsParsed = parseIngredients(ingredients);
  const ingredientsBundled = bundleIngredients(ingredientsParsed);
  const ingredientsFiltered = filterCommonIngredients(ingredientsBundled);

  return ingredientsFiltered;
}
