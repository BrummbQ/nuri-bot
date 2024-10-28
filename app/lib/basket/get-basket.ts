import {
  getBasketById,
  getBasketIngredients,
  getBasketsByUserId,
  type BasketIngredientRow,
} from "../db";
import type {
  Basket,
  BasketOverview,
  IngredientWithProducts,
  RecipeSchema,
  SelectedProduct,
} from "../models";
import { findProduct } from "../search";

export function recipesFromIngredients(
  ingredients: BasketIngredientRow[],
): RecipeSchema[] {
  const recipes: RecipeSchema[] = [];
  ingredients.forEach((ingredient) => {
    if (
      ingredient.recipe_json != null &&
      recipes.find((r) => r["@id"] === ingredient.recipe_json!["@id"]) == null
    ) {
      recipes.push(ingredient.recipe_json);
    }
  });
  return recipes;
}

export async function getBasket(
  basketId: string,
  token: string,
): Promise<Basket> {
  const basket = await getBasketById(basketId);
  if (basket == null) {
    throw new Error(`Basket with id ${basketId} not found!`);
  }
  const ingredients = await getBasketIngredients(basketId);
  const recipes = recipesFromIngredients(ingredients);
  const ingredientsWithProducts: IngredientWithProducts[] = [];

  await Promise.all(
    ingredients.map(async (ingredient) => {
      const product = ingredient.product_id
        ? await findProduct(ingredient.product_id, token)
        : undefined;
      let selectedProduct: SelectedProduct | undefined;
      if (product != null && ingredient.product_quantity != null) {
        selectedProduct = {
          quantity: ingredient.product_quantity,
          product: product,
        };
      }

      const ingredientItem = ingredientsWithProducts.find(
        (iP) => iP.productName === ingredient.ingredient_json.productName,
      );
      if (ingredientItem == null) {
        const selectedProducts =
          selectedProduct == null ? [] : [selectedProduct];
        ingredientsWithProducts.push({
          ...ingredient.ingredient_json,
          products: [],
          selectedProducts,
        });
      } else if (selectedProduct != null) {
        ingredientItem.selectedProducts = [
          ...(ingredientItem.selectedProducts ?? []),
          selectedProduct,
        ];
      }
    }),
  );
  return {
    basketId: basketId,
    userId: basket.user_id,
    recipes,
    ingredientsWithProducts,
    createdAt: basket.created_at,
  };
}

export async function getBasketRecipes(
  basketId: string,
): Promise<RecipeSchema[]> {
  const ingredients = await getBasketIngredients(basketId);
  return recipesFromIngredients(ingredients);
}

export async function getBasketsOverview(
  userId: string,
): Promise<BasketOverview[]> {
  const basketsResult = await getBasketsByUserId(userId);
  const baskets = await Promise.all(
    basketsResult.rows.map(async (basket) => ({
      id: basket.id,
      recipes: await getBasketRecipes(basket.id),
    })),
  );

  return baskets.map((b) => {
    const title = b.recipes[0]?.name ?? "Leerer Warenkorb";
    let image = "/images/placeholder.svg";
    if (b.recipes.length && b.recipes[0].image.length) {
      image = b.recipes[0].image[0] + "?impolicy=recipe-card";
    }

    return {
      basketId: b.id,
      title,
      image,
      recipeCount: b.recipes.length,
    };
  });
}
