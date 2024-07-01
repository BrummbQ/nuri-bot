import type { RecipeSchema } from "./recipe-schema.model";

export interface Ingredient {
  quantity?: number;
  unit?: string;
  productName: string;
  recipes: RecipeSchema[];
}
