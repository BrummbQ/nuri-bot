import { describe, expect, it } from "vitest";
import type {
  IngredientWithProducts,
  ProductSearchResponse,
} from "~/lib/models";

function mockIngredient(
  products: ProductSearchResponse[],
  quantity?: number,
  unit?: string,
): IngredientWithProducts {
  return {
    quantity,
    unit,
    products,
  } as IngredientWithProducts;
}

describe("Product Quantity", () => {
  it("should calculate quantity", () => {
    expect(
      calcProductQuantity(mockIngredient([]), mockProduct()),
    ).toBeUndefined();

    expect(
      calcProductQuantity(mockIngredient([], 600, "g"), mockProduct("250g")),
    ).toBe(2);

    expect(
      calcProductQuantity(mockIngredient([], 4), mockProduct("1 Stück")),
    ).toBe(4);

    expect(
      calcProductQuantity(mockIngredient([], 0.25), mockProduct("1 Stück")),
    ).toBe(1);
  });
});
