import type { RecipeSchema } from "~/lib/models";

export default function (basketId: string, recipe: RecipeSchema): string {
  return `/basket/${basketId}/recipe/${encodeURIComponent(encodeURIComponent(recipe["@id"]))}`;
}
