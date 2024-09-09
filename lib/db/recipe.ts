import { sql } from "@vercel/postgres";
import type { RecipeSchema, RecipeSource } from "../models";

export async function insertRecipe(
  r: RecipeSchema,
  source: RecipeSource,
  userId?: string,
): Promise<number> {
  const recipeInsert = await sql`
    INSERT INTO Recipe (external_id, recipe, source, created_by)
    VALUES (${r["@id"]}, ${JSON.stringify(r)}, ${source}, ${userId})
    ON CONFLICT (external_id) DO UPDATE SET recipe = EXCLUDED.recipe
    RETURNING id`;

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
  const recipeSelect =
    await sql`SELECT id FROM Recipe WHERE external_id = ${r["@id"]} LIMIT 1`;
  if (recipeSelect.rows.length) {
    return recipeSelect.rows[0].id as number;
  }
}

export async function findRecipeSchemaByExternalId(
  id: string,
): Promise<RecipeSchema | undefined> {
  const recipeSelect =
    await sql`SELECT recipe FROM Recipe WHERE external_id = ${id} LIMIT 1`;
  if (recipeSelect.rows.length) {
    return recipeSelect.rows[0].recipe as RecipeSchema;
  }
}

export async function getRecipeIdByExternalId(
  recipeId: string,
): Promise<number | undefined> {
  const recipeSelect =
    await sql`SELECT id FROM Recipe WHERE external_id = ${recipeId} LIMIT 1`;
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
    await sql`INSERT INTO AppUser_Recipe_Likes (user_id, recipe_id)
    VALUES (${userId}, ${recipeId}) ON CONFLICT (user_id, recipe_id) DO NOTHING`;
  } else {
    await sql`DELETE FROM AppUser_Recipe_Likes
    WHERE user_id = ${userId} AND recipe_id = ${recipeId}`;
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
  const likeResult = await sql`SELECT COUNT(*) > 0 AS likes
  FROM AppUser_Recipe_Likes
  WHERE user_id = ${userId} AND recipe_id = ${recipeInternalId}`;

  return likeResult.rows[0]?.likes > 0;
}

export async function getLikedRecipes(userId: string): Promise<RecipeSchema[]> {
  const recipeResult = await sql`SELECT r.recipe
  FROM AppUser_Recipe_Likes l
  JOIN recipe r ON l.recipe_id = r.id
  WHERE l.user_id = ${userId}
  LIMIT 100`;

  return recipeResult.rows.map((r) => r.recipe);
}
