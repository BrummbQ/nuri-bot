import type { RecipeSchema } from "~/lib/models";

function parseTimeInMinutes(recipeTime: string): number | undefined {
  const [_, minutesString] = recipeTime.split("PT");
  if (minutesString != null) {
    return parseInt(minutesString);
  }
  return undefined;
}

export default function (recipe?: RecipeSchema | null): number | undefined {
  if (recipe == null) {
    return undefined;
  }
  let totalTime: number | undefined = undefined;
  if (recipe.totalTime) {
    totalTime = parseTimeInMinutes(recipe.totalTime);
    return totalTime;
  }
  if (recipe.prepTime) {
    totalTime = parseTimeInMinutes(recipe.prepTime);
  }
  if (recipe.cookTime) {
    const cookTime = parseTimeInMinutes(recipe.cookTime);
    if (totalTime != null && cookTime != null) {
      totalTime += cookTime;
    } else {
      totalTime = cookTime;
    }
  }
  return totalTime;
}
