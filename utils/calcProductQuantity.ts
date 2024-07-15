import type { IngredientWithProducts, ReweProduct } from "~/lib/models";
import { parseGrammage } from "~/lib/search/parse-grammage";

export default function (
  ingredient: IngredientWithProducts,
  product: ReweProduct,
): number | undefined {
  const grammage = parseGrammage(product);
  if (grammage == null || ingredient.quantity == null) {
    return;
  }

  const ingredientUnit = ingredient.unit;
  const grammageUnit = grammage.unit.toLowerCase();
  if (
    ingredientUnit?.toLowerCase() === grammageUnit ||
    (ingredientUnit == null && grammageUnit === "stück")
  ) {
    return Math.max(1, Math.round(ingredient.quantity / grammage.quantity));
  }
}
