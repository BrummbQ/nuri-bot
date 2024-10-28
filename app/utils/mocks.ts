import type { ProductSearchResponse } from "~/lib/models";

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
