import { sql } from "@vercel/postgres";
import type { IngredientWithProducts } from "../models";

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
  productId: number,
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
