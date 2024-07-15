import type { RecipeSchema } from "./recipe-schema.model";

export interface Ingredient {
  quantity?: number;
  unit?: string;
  productName: string;
  recipes: RecipeSchema[];
}

export interface ProductGrammage {
  quantity: number;
  unit: string;
}

export interface RecipeIngredient {
  ingredient: string;
  recipe: RecipeSchema;
}
