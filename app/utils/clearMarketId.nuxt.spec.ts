import { describe, it, expect } from "vitest";
import { marketIdKey } from "~/lib/models";

describe("clearMarketId", () => {
  it("should remove item from localStorage if running on client", () => {
    localStorage.setItem(marketIdKey, "test");
    clearMarketId();
    expect(localStorage.getItem(marketIdKey)).toBeNull();
  });
});
