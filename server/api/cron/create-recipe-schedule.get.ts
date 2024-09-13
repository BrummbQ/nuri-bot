import {
  findLastScheduleForTimePeriod,
  insertRecipe,
  insertSchedule,
  linkRecipeToSchedule,
} from "~/lib/db";
import { collectRecipes } from "~/lib/search";
import { daysAgo } from "~/lib/utils/date";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // find schedule for current period or create new one
  const oneWeekAgo = daysAgo(7);
  const lastSchedule = await findLastScheduleForTimePeriod(oneWeekAgo);
  if (lastSchedule != null) {
    // schedule found, no action
    return;
  }

  // no schedule, create new one and populate it
  const scheduleId = await insertSchedule();
  const recipes = await collectRecipes();
  // insert found recipes and link to schedule
  await Promise.all(
    recipes.map(async ([r, s]) => {
      const recipeId = await insertRecipe(r, "REWE");
      await linkRecipeToSchedule(scheduleId, recipeId, s);
    }),
  );
});
