import { sql } from "@vercel/postgres";
import type {
  Ingredient,
  IngredientWithProducts,
  RecipeSchema,
} from "../models";

export async function insertIngredient(
  i: IngredientWithProducts,
  basketId: string,
): Promise<number> {
  const ingredientJson = JSON.stringify({
    productName: i.productName,
    unit: i.unit,
    quantity: i.quantity,
  });
  const ingredientInsert = await sql`
    INSERT INTO Ingredient (basket_id, ingredient)
    VALUES (${basketId}, ${ingredientJson})
    RETURNING id`;

  if (!ingredientInsert.rows.length) {
    throw new Error("Could not find inserted ingredient");
  }

  console.log("Inserted ingredient", i.productName);
  return ingredientInsert.rows[0].id;
}

export async function linkIngredientToRecipe(
  recipeId: number,
  ingredientId: number,
) {
  await sql`
    INSERT INTO Ingredient_Recipe (recipe_id, ingredient_id)
    VALUES (${recipeId}, ${ingredientId})`;
  console.log("Linked ingredient to recipe", ingredientId, recipeId);
}

export async function linkIngredientToProduct(
  ingredientId: number,
  productId: string,
  quantity: number,
) {
  await sql`
    INSERT INTO Ingredient_Product (ingredient_id, product_id, quantity)
    VALUES (${ingredientId}, ${productId}, ${quantity})`;
  console.log(
    "Linked ingredient to product",
    ingredientId,
    productId,
    quantity,
  );
}

export interface BasketIngredientRow {
  basket_id: string;
  ingredient_id: number;
  ingredient_json: Ingredient;
  product_id?: string;
  product_quantity?: number;
}

export async function getBasketIngredients(
  basketId: string,
): Promise<BasketIngredientRow[]> {
  const result = await sql`
    SELECT 
      b.id AS basket_id,
      i.id AS ingredient_id,
      i.ingredient AS ingredient_json,
      ip.product_id AS product_id,
      ip.quantity AS product_quantity
    FROM Basket b
    JOIN Ingredient i ON b.id = i.basket_id
    LEFT JOIN Ingredient_Product ip ON i.id = ip.ingredient_id
    WHERE b.id = ${basketId};
    `;
  return result.rows as BasketIngredientRow[];
}
