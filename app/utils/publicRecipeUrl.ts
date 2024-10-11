import type { RecipeSchema } from "~/lib/models";

export default function (recipe: RecipeSchema): string {
  return `/recipe/${encodeURIComponent(encodeURIComponent(recipe["@id"]))}`;
}
