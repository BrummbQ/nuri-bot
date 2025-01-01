import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";

import { extensionBasketDataKey } from "~/lib/models";

describe("useOrderBasket", () => {
  const basketId = "test-basket-id";

  it("should throw an error if reweCookieDataValue is null", async () => {
    const { orderBasket } = useOrderBasket(basketId);

    await expect(orderBasket()).rejects.toThrow("No REWE cookies available");
  });

  it("should throw an error if ingredientsWithProducts is null", async () => {
    localStorage.setItem(extensionBasketDataKey, "[]");
    const { orderBasket } = useOrderBasket(basketId);

    await expect(orderBasket()).rejects.toThrow("No products available");
  });

  it("should handle error when ordering ingredients", async () => {
    localStorage.setItem(extensionBasketDataKey, "[]");

    registerEndpoint("/api/load-products", () => ({}));
    registerEndpoint("/api/ingredients-search", () => ({ ingredients: [] }));
    registerEndpoint("/api/ingredients-order", () => new Error("Error"));

    const { searchIngedients } = useBasketStore();
    await searchIngedients([], "test-market-id", "test-basket-id");

    const { orderBasket, orderLoading } = useOrderBasket(basketId);

    await expect(orderBasket()).rejects.toThrow("Error ordering ingredients");
    expect(orderLoading.value).toBe(false);
    expect(localStorage.getItem(extensionBasketDataKey)).toBe(null);
  });
});
