import {
  findLastMenuForTimePeriod,
  insertRecipe,
  insertMenu,
  linkRecipeToMenu,
} from "~/lib/db";
import { collectRecipes } from "~/lib/search";
import { lastSunday } from "~/lib/utils/date";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // find menu for current period or create new one, each sunday a new menu is created
  const lastSundayDate = lastSunday();
  const lastMenu = await findLastMenuForTimePeriod(lastSundayDate);
  if (lastMenu != null) {
    // menu found, no action
    return;
  }

  // no menu, create new one and populate it
  const menuId = await insertMenu();
  const recipes = await collectRecipes();
  // insert found recipes and link to menu
  await Promise.all(
    recipes.map(async ([r, s]) => {
      const recipeId = await insertRecipe(r, "REWE");
      await linkRecipeToMenu(menuId, recipeId, s);
    }),
  );
});
