import { getBasketById, getBasketIngredients, getBasketsByUserId } from "../db";
import type {
  Basket,
  BasketOverview,
  IngredientWithProducts,
  RecipeSchema,
} from "../models";

export async function getBasket(basketId: string): Promise<Basket> {
  const basket = await getBasketById(basketId);
  if (basket == null) {
    throw new Error(`Basket with id ${basketId} not found!`);
  }
  const ingredients = await getBasketIngredients(basketId);
  const recipes: RecipeSchema[] = [];
  const ingredientsWithProducts: IngredientWithProducts[] = [];

  ingredients.forEach((ingredient) => {
    if (
      ingredient.recipe_json != null &&
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
  return {
    basketId: basketId,
    userId: basket.user_id,
    recipes,
    ingredientsWithProducts,
    createdAt: basket.created_at,
  };
}

export async function getBasketsOverview(
  userId: string,
): Promise<BasketOverview[]> {
  const basketsResult = await getBasketsByUserId(userId);
  const baskets = await Promise.all(
    basketsResult.rows.map((basket) => getBasket(basket.id)),
  );

  return baskets.map((b) => {
    const title = b.recipes[0]?.name ?? "Leerer Warenkorb";
    let image = "/images/placeholder.svg";
    if (b.recipes.length && b.recipes[0].image.length) {
      image = b.recipes[0].image[0] + "?impolicy=recipe-card";
    }

    return {
      basketId: b.basketId,
      title,
      image,
      recipeCount: b.recipes.length,
    };
  });
}
