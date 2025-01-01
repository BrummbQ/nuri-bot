import { describe, it, expect } from "vitest";
import { extensionBasketDataKey } from "~/lib/models";

describe("clearExtensionBasketData", () => {
  it("should remove item from localStorage if running on client", () => {
    localStorage.setItem(extensionBasketDataKey, "test");
    clearExtensionBasketData();
    expect(localStorage.getItem(extensionBasketDataKey)).toBeNull();
  });
});
