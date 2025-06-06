import type { Basket, ProductSearchResponse } from "~/lib/models";

export function mockProduct(grammage?: string): ProductSearchResponse {
  return {
    id: "1",
    external_id: "1",
    name: "",
    category_path: "",
    price: 179,
    currency: "EUR",
    grammage,
  };
}

export function mockBasket(): Basket {
  return {
    basketId: "1",
    userId: "user-1",
    recipes: [],
    ingredientsWithProducts: [],
    createdAt: new Date(2000, 0, 1).toISOString(),
  };
}
