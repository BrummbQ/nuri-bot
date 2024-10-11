import type { RecipeSchema } from "~/lib/models";

export default function (userId: string, recipe: RecipeSchema): string {
  return `/user/${userId}/recipe/${encodeURIComponent(encodeURIComponent(recipe["@id"]))}`;
}
