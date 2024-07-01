import { sql } from "@vercel/postgres";
import type { RecipeSchema } from "../models";

export async function insertRecipe(r: RecipeSchema): Promise<number> {
  const recipeInsert = await sql`
    INSERT INTO Recipe (external_id, recipe)
    VALUES (${r["@id"]}, ${JSON.stringify(r)})
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
