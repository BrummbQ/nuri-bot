import { describe, expect, expectTypeOf, it } from "vitest";
import { collectRecipes } from "./collect-recipes";

describe("Collect recipes", () => {
  it("should collect recipes", async () => {
    const result = await collectRecipes();
    expect(result.length).toBe(20);
    result.forEach((r) => {
      expect(r).toBeDefined();
      expectTypeOf(r[0]).toBeObject();
      expectTypeOf(r[1]).toBeString();
    });
  });
});
