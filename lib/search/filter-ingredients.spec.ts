import { describe, expect, it } from "vitest";
import type { RecipeSchema } from "~/lib/models";
import {
  consolidateSimilarIngredients,
  filterCommonIngredients,
  linkRecipeToIngredients,
} from "./filter-ingredients";

describe("Filter Ingredients", () => {
  it("filter common ingredients", () => {
    const ingredients1 = [
      "Salz",
      "Pfeffer",
      "1 TL zucker",
      "Mehl für die Arbeitsfläche",
      "1 Prise(n) Salz",
      "1 EL Öl",
      "0.5 TL Senf",
      "1 TL Honig",
      "Butter für die Form",
      "",
      "Zuckeraugen",
      "1 rote Paprika",
    ];
    const recipe1 = {
      "@id": "1",
      recipeIngredient: ingredients1,
    } as RecipeSchema;

    expect(filterCommonIngredients([recipe1])).toEqual([
      { ingredient: "Zuckeraugen", recipe: recipe1 },
      { ingredient: "1 rote Paprika", recipe: recipe1 },
    ]);
  });

  it("should link recipe to ingredients", () => {
    const ingredients1 = ["Salz", "Zuckeraugen"];
    const recipe1 = {
      "@id": "1",
      recipeIngredient: ingredients1,
    } as RecipeSchema;
    const ingredients2 = ["REWE Kokosmilch"];
    const recipe2 = {
      "@id": "2",
      recipeIngredient: ingredients2,
    } as RecipeSchema;

    const ingredients = [
      {
        productName: "Gurken",
        quantity: 400,
        unit: "g",
        recipes: [],
        products: [],
      },
      {
        productName: "Zuckeraugen",
        quantity: 4,
        unit: undefined,
        recipes: [],
        products: [],
      },
      {
        productName: "Kokosmilch",
        quantity: 4,
        unit: undefined,
        recipes: [],
        products: [],
      },
    ];

    expect(linkRecipeToIngredients([recipe1, recipe2], ingredients)).toEqual([
      {
        productName: "Gurken",
        quantity: 400,
        unit: "g",
        recipes: [],
        products: [],
      },
      {
        productName: "Zuckeraugen",
        quantity: 4,
        unit: undefined,
        recipes: [recipe1],
        products: [],
      },
      {
        productName: "Kokosmilch",
        quantity: 4,
        unit: undefined,
        recipes: [recipe2],
        products: [],
      },
    ]);
  });

  it("should consolidate similar ingredients", () => {
    const ingredients = [
      {
        productName: "Gurken",
        quantity: 400,
        unit: "g",
        recipes: [],
      },
      {
        productName: "Ei",
        quantity: 1,
        unit: undefined,
        recipes: [],
      },
      {
        productName: "Ei",
        quantity: 2,
        unit: "Stück",
        recipes: [],
      },
    ];

    expect(consolidateSimilarIngredients(ingredients)).toEqual([
      {
        productName: "Gurken",
        quantity: 400,
        unit: "g",
        recipes: [],
      },
      {
        productName: "Ei",
        quantity: 3,
        unit: undefined,
        recipes: [],
      },
    ]);
  });
});
