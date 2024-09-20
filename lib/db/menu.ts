import { sql } from "@vercel/postgres";
import type { RecipeSchema } from "../models";

export async function insertMenu(): Promise<number> {
  const menuInsert = await sql`
      INSERT INTO Menu DEFAULT VALUES
      RETURNING id`;

  if (!menuInsert.rows.length) {
    throw new Error("Could not find inserted menu");
  }

  const menuId = menuInsert.rows[0].id as number;
  console.log("Inserted menu", menuId);
  return menuId;
}

/**
 * Find menu for provided time period
 */
export async function findLastMenuForTimePeriod(
  date: Date,
): Promise<number | undefined> {
  const lastMenu = await sql`
    SELECT id, created_at
    FROM Menu
    WHERE created_at > ${date.toISOString()}
    ORDER BY created_at DESC
    LIMIT 1`;

  if (lastMenu.rows.length) {
    return lastMenu.rows[0].id;
  }
}

export async function linkRecipeToMenu(
  menuId: number,
  recipeId: number,
  searchTerm: string,
): Promise<void> {
  await sql`
    INSERT INTO Recipe_Menu (menu_id, recipe_id, searchterm)
    VALUES (${menuId}, ${recipeId}, ${searchTerm})
    ON CONFLICT (menu_id, recipe_id) DO NOTHING
  `;
}

export async function fetchRecipesForCurrentMenu(): Promise<RecipeSchema[]> {
  const lastMenuRecipes = await sql`
    SELECT rs.recipe_id, rs.searchterm, r.external_id, r.recipe, r.source
    FROM Menu m
    JOIN Recipe_Menu rs ON m.id = rs.menu_id
    JOIN Recipe r ON rs.recipe_id = r.id
    WHERE m.id = (SELECT id FROM Menu ORDER BY created_at DESC LIMIT 1)
`;
  return lastMenuRecipes.rows.map((r) => r.recipe);
}
