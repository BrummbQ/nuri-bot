import type { ProductGrammage, ProductSearchResponse } from "../models";

export function parseGrammage(
  product: ProductSearchResponse,
): ProductGrammage | undefined {
  if (product.grammage != null) {
    const match = product.grammage?.match(/^(\d+)\s*([a-zA-ZäöüÄÖÜß]*)/);
    if (match == null) {
      return;
    }

    const quantity = parseInt(match[1]);
    const unit = match[2].trim();

    if (!unit) {
      return;
    }

    return { unit, quantity };
  }
}
