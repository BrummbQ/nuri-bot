import { sql } from "@vercel/postgres";
import type { RecipeSchema } from "../models";

export async function insertSchedule(): Promise<number> {
  const scheduleInsert = await sql`
      INSERT INTO Schedule DEFAULT VALUES
      RETURNING id`;

  if (!scheduleInsert.rows.length) {
    throw new Error("Could not find inserted schedule");
  }

  const scheduleId = scheduleInsert.rows[0].id as number;
  console.log("Inserted schedule", scheduleId);
  return scheduleId;
}

/**
 * Find schedule for provided time period
 */
export async function findLastScheduleForTimePeriod(
  date: Date,
): Promise<number | undefined> {
  const lastSchedule = await sql`
    SELECT id, created_at
    FROM Schedule
    WHERE created_at > ${date.toISOString()}
    ORDER BY created_at DESC
    LIMIT 1`;

  if (lastSchedule.rows.length) {
    return lastSchedule.rows[0].id;
  }
}

export async function linkRecipeToSchedule(
  scheduleId: number,
  recipeId: number,
  searchTerm: string,
): Promise<void> {
  await sql`
    INSERT INTO Recipe_Schedule (schedule_id, recipe_id, searchterm)
    VALUES (${scheduleId}, ${recipeId}, ${searchTerm})
    ON CONFLICT (schedule_id, recipe_id) DO NOTHING
  `;
}

export async function fetchRecipesForCurrentSchedule(): Promise<
  RecipeSchema[]
> {
  const lastScheduleRecipes = await sql`
    SELECT rs.recipe_id, rs.searchterm, r.external_id, r.recipe, r.source
    FROM Schedule s
    JOIN Recipe_Schedule rs ON s.id = rs.schedule_id
    JOIN Recipe r ON rs.recipe_id = r.id
    WHERE s.id = (SELECT id FROM Schedule ORDER BY created_at DESC LIMIT 1)
`;
  return lastScheduleRecipes.rows.map((r) => r.recipe);
}
