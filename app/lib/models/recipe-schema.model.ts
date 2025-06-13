import type { RecipeCategorization } from "./recipe-category.model";

export type RecipeSchema = {
  "@id": string;
  description: string;
  image: string[];
  keywords: string;
  name: string;
  recipeCategory: string;
  recipeIngredient: string[];
  recipeInstructions: { name: string; text: string; url: string }[];
  recipeYield: number;
  totalTime?: string;
  prepTime?: string;
  cookTime?: string;
  categorization?: RecipeCategorization;

  // defined by user recipe like relation
  liked?: boolean;
};

export type RecipeSource = "REWE" | "GENERATED";
