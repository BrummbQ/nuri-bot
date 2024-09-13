import type { RecipeSchema } from "../models";
import { generateSearchTerm } from "./generate-search-term";
import { searchRecipes } from "./recipes";

type RecipeSearchTerm = [RecipeSchema, string];

/**
 * Search recipes with generated queries from predefined seeds
 */
export async function collectRecipes(): Promise<RecipeSearchTerm[]> {
  const recipeRequirements = [
    "Vegetarisch",
    "Vegetarisch",
    "Fleisch",
    "Fisch",
    "Burger",
    "Gesund",
    "Einfach",
    "Schnell",
    "Aufwendig",
    "Exotisch",
    "Burger",
    "Asiatisch",
    "Mexikanisch",
    "Italienisch",
    "Salat",
    "Hausmannskost",
    "Pizza",
    "Kalorienarm",
    "Saisonal",
    "Preiswert",
  ];
  return (
    await Promise.all(
      recipeRequirements.map(async (r) => {
        const searchTerm = await generateSearchTerm(r);
        const searchResults = await searchRecipes(searchTerm);
        const randomResult =
          searchResults[Math.floor(Math.random() * searchResults.length)];
        if (randomResult.metadata?.recipeSchema) {
          return [
            JSON.parse(randomResult.metadata?.recipeSchema),
            searchTerm,
          ] as RecipeSearchTerm;
        }
      }),
    )
  ).filter((r) => r != null && r[0] != null) as RecipeSearchTerm[];
}
