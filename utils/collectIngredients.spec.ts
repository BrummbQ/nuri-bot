import { describe, expect, it } from "vitest";
import type { RecipeSchema } from "~/lib/models";

describe("Collect Ingredients", () => {
  it("should collect ingredients", () => {
    const ingredients1 = [
      "400 g Brioche",
      "2 Eier",
      "Salz",
      "",
      "100 g frischer Bärlauch",
      "1 Päckchen Trockenhefe",
      "0.5 Würfel Hefe",
      "Basilikum",
      "3 Äpfel (Größe M)",
      "Öl für die Form",
      "Kokosfett für die Form",
    ];
    const ingredients2 = ["Salz", "2 Eier", "100 ml Milch", "1 Würfel Hefe"];
    const recipe1 = { recipeIngredient: ingredients1 } as RecipeSchema;
    const recipe2 = { recipeIngredient: ingredients2 } as RecipeSchema;

    const parsedIngredients = collectIngredients([recipe1, recipe2]);
    expect(parsedIngredients).toEqual([
      {
        productName: "Brioche",
        quantity: 400,
        unit: "g",
        recipes: [recipe1],
      },
      {
        productName: "Eier",
        quantity: 4,
        unit: undefined,
        recipes: [recipe1, recipe2],
      },
      {
        productName: "frischer Bärlauch",
        quantity: 100,
        unit: "g",
        recipes: [recipe1],
      },
      {
        productName: "Trockenhefe",
        quantity: 1,
        unit: "Päckchen",
        recipes: [recipe1],
      },

      {
        productName: "Hefe",
        quantity: 1.5,
        unit: "Würfel",
        recipes: [recipe1, recipe2],
      },
      {
        productName: "Basilikum",
        quantity: undefined,
        unit: undefined,
        recipes: [recipe1],
      },
      {
        productName: "Äpfel (Größe M)",
        quantity: 3,
        unit: undefined,
        recipes: [recipe1],
      },
      {
        productName: "Kokosfett für die Form",
        quantity: undefined,
        unit: undefined,
        recipes: [recipe1],
      },
      {
        productName: "Milch",
        quantity: 100,
        unit: "ml",
        recipes: [recipe2],
      },
    ]);
  });
});
