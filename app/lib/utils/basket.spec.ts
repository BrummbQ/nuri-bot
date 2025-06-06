import { describe, it, expect } from "vitest";
import type { Basket } from "../models";
import { formatBasketTitle } from "./basket";

describe("formatBasketTitle", () => {
  it("returns just the date if no recipes", () => {
    const result = formatBasketTitle({ ...mockBasket(), recipes: [] });
    expect(result).toBe("1. Jan. 00");
  });

  it("returns recipe names if 1–3 recipes", () => {
    const result = formatBasketTitle({
      ...mockBasket(),
      recipes: [{ name: "Pasta" }, { name: "Tacos" }, { name: "Salat" }],
    } as Basket);
    expect(result).toBe("Pasta, Tacos, Salat – 1. Jan. 00");
  });

  it("returns count if more than 3 recipes", () => {
    const result = formatBasketTitle({
      ...mockBasket(),
      recipes: [
        { name: "Pasta" },
        { name: "Tacos" },
        { name: "Salat" },
        { name: "Curry" },
      ],
    } as Basket);
    expect(result).toBe("4 Rezepte – 1. Jan. 00");
  });

  it("returns 'Warenkorb' if no date", () => {
    const result = formatBasketTitle({ ...mockBasket(), createdAt: undefined });
    expect(result).toBe("Warenkorb");
  });
});
