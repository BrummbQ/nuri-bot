import type { Ingredient } from "~/lib/models";

export default function ingredientTitle(ingredient: Ingredient): string {
  return [ingredient.quantity, ingredient.unit, ingredient.productName]
    .filter(Boolean)
    .join(" ");
}
