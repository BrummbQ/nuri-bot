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
