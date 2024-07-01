import { getBasketIngredients } from "../db";
import type { Basket, IngredientWithProducts, RecipeSchema } from "../models";

export async function getBasket(basketId: string): Promise<Basket> {
  const ingredients = await getBasketIngredients(basketId);
  const recipes: RecipeSchema[] = [];
  const ingredientsWithProducts: IngredientWithProducts[] = [];

  ingredients.forEach((ingredient) => {
    if (
      recipes.find((r) => r["@id"] === ingredient.recipe_json["@id"]) == null
    ) {
      recipes.push(ingredient.recipe_json);
    }

    const ingredientItem = ingredientsWithProducts.find(
      (iP) => iP.productName === ingredient.ingredient_json.productName,
    );

    const selectedProduct = {
      quantity: ingredient.product_quantity,
      product: ingredient.product_data,
    };
    if (ingredientItem == null) {
      ingredientsWithProducts.push({
        ...ingredient.ingredient_json,
        products: [],
        selectedProducts: [selectedProduct],
      });
    } else {
      ingredientItem.selectedProducts = [
        ...(ingredientItem.selectedProducts ?? []),
        selectedProduct,
      ];
    }
  });
  return { recipes, ingredientsWithProducts };
}
