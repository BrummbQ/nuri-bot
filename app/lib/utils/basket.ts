import type { Basket } from "../models";
import { formatDateLong } from "./date";

export function formatBasketTitle(basket: Basket): string {
  if (basket.createdAt == null) {
    return "Warenkorb";
  }
  const date = formatDateLong(new Date(basket.createdAt));
  const recipeList = basket.recipes
    .slice(0, 3)
    .map((r) => r.name)
    .join(", ");
  const recipeCount = basket.recipes.length;

  if (recipeCount === 0) {
    return `${date}`;
  }

  if (recipeCount <= 3) {
    return `${recipeList} – ${date}`;
  }

  return `${recipeCount} Rezepte – ${date}`;
}
