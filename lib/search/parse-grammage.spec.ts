import { describe, it, expect } from "vitest";
import { parseGrammage } from "./parse-grammage";

describe("Parse Grammage", () => {
  it("should parse grammage", () => {
    expect(parseGrammage(mockProduct("250g (1 kg = 7,16 €)"))).toEqual({
      quantity: 250,
      unit: "g",
    });
    expect(parseGrammage(mockProduct("1000g"))).toEqual({
      quantity: 1000,
      unit: "g",
    });
    expect(parseGrammage(mockProduct("100 g"))).toEqual({
      quantity: 100,
      unit: "g",
    });
    expect(parseGrammage(mockProduct("1 Stück"))).toEqual({
      quantity: 1,
      unit: "Stück",
    });
    expect(parseGrammage(mockProduct("1000"))).toBeUndefined();
    expect(parseGrammage(mockProduct(undefined))).toBeUndefined();
  });
});
