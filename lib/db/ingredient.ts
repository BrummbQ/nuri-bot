import { sql } from "@vercel/postgres";
import type {
  Ingredient,
  IngredientWithProducts,
  RecipeSchema,
  ReweProduct,
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

interface BasketIngredientRow {
  basket_id: string;
  ingredient_id: number;
  ingredient_json: Ingredient;
  recipe_id: number;
  recipe_external_id: string;
  recipe_json: RecipeSchema;
  product_id: number;
  product_name: string;
  product_data: ReweProduct;
  product_quantity: number;
}

export async function getBasketIngredients(
  basketId: string,
): Promise<BasketIngredientRow[]> {
  const result = await sql`
    SELECT 
      b.id AS basket_id,
      i.id AS ingredient_id,
      i.ingredient AS ingredient_json,
      r.id AS recipe_id,
      r.external_id AS recipe_external_id,
      r.recipe AS recipe_json,
      p.id AS product_id,
      p.product_name AS product_name,
      p.data AS product_data,
      ip.quantity AS product_quantity
    FROM 
        Basket b
    JOIN 
        Ingredient i ON b.id = i.basket_id
    LEFT JOIN 
        Ingredient_Recipe ir ON i.id = ir.ingredient_id
    LEFT JOIN 
        Recipe r ON ir.recipe_id = r.id
    LEFT JOIN 
        Ingredient_Product ip ON i.id = ip.ingredient_id
    LEFT JOIN 
        Product p ON ip.product_id = p.id
    WHERE 
        b.id = ${basketId};
    `;
  return result.rows as BasketIngredientRow[];
}
