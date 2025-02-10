import { query } from "./db";
import type { RecipeSchema, RecipeSource } from "../models";

export async function getRecipesByBasket(
  basketId: string,
): Promise<RecipeSchema[]> {
  const result = await query(
    `
    SELECT DISTINCT
      r.recipe AS recipe_json
    FROM Basket b
    JOIN Ingredient i ON b.id = i.basket_id
    JOIN Ingredient_Recipe ir ON i.id = ir.ingredient_id
    JOIN Recipe r ON ir.recipe_id = r.id
    WHERE b.id = $1;
    `,
    [basketId],
  );
  return result.rows.map((row) => row.recipe_json);
}

export async function insertRecipe(
  r: RecipeSchema,
  source: RecipeSource,
  userId?: string,
): Promise<number> {
  const recipeInsert = await query(
    `
    INSERT INTO Recipe (external_id, recipe, source, created_by)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (external_id) DO UPDATE SET recipe = EXCLUDED.recipe
    RETURNING id`,
    [r["@id"], JSON.stringify(r), source, userId],
  );

  if (!recipeInsert.rows.length) {
    throw new Error("Could not find inserted recipe");
  }

  const recipeId = recipeInsert.rows[0].id as number;
  console.log("Inserted recipe", r.name, recipeId);
  return recipeId;
}

export async function findRecipeByExternalId(
  r: RecipeSchema,
): Promise<number | undefined> {
  const recipeSelect = await query(
    "SELECT id FROM Recipe WHERE external_id = $1 LIMIT 1",
    [r["@id"]],
  );
  if (recipeSelect.rows.length) {
    return recipeSelect.rows[0].id as number;
  }
}

export async function findRecipeSchemaByExternalId(
  id: string,
): Promise<RecipeSchema | undefined> {
  const recipeSelect = await query(
    "SELECT recipe FROM Recipe WHERE external_id = $1 LIMIT 1",
    [id],
  );
  if (recipeSelect.rows.length) {
    return recipeSelect.rows[0].recipe as RecipeSchema;
  }
}

export async function getRecipeIdByExternalId(
  recipeId: string,
): Promise<number | undefined> {
  const recipeSelect = await query(
    "SELECT id FROM Recipe WHERE external_id = $1 LIMIT 1",
    [recipeId],
  );
  if (recipeSelect.rows.length) {
    return recipeSelect.rows[0].id;
  }
}

export async function likeRecipe(
  recipeId: number,
  userId: string,
  like: boolean,
): Promise<void> {
  if (like) {
    await query(
      `INSERT INTO AppUser_Recipe_Likes (user_id, recipe_id)
    VALUES ($1, $2) ON CONFLICT (user_id, recipe_id) DO NOTHING`,
      [userId, recipeId],
    );
  } else {
    await query(
      `DELETE FROM AppUser_Recipe_Likes
    WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId],
    );
  }
}

export async function isRecipeLiked(
  recipeId: string,
  userId: string,
): Promise<boolean> {
  const recipeInternalId = await getRecipeIdByExternalId(recipeId);
  if (recipeInternalId == null) {
    return false;
  }
  const likeResult = await query(
    `SELECT COUNT(*) > 0 AS likes
  FROM AppUser_Recipe_Likes
  WHERE user_id = $1 AND recipe_id = $2`,
    [userId, recipeInternalId],
  );

  return likeResult.rows[0]?.likes > 0;
}

export async function getLikedRecipes(userId: string): Promise<RecipeSchema[]> {
  const recipeResult = await query(
    `SELECT r.recipe
  FROM AppUser_Recipe_Likes l
  JOIN recipe r ON l.recipe_id = r.id
  WHERE l.user_id = $1
  LIMIT 100`,
    [userId],
  );

  return recipeResult.rows.map((r) => r.recipe);
}
