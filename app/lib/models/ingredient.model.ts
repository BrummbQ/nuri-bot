import type { RecipeSchema } from "./recipe-schema.model";

export interface Ingredient {
  quantity?: number;
  unit?: string;
  note?: string;
  productName: string;
  recipes: RecipeSchema[];
  category?: string;
}

export interface ProductGrammage {
  quantity: number;
  unit: string;
}

export interface RecipeIngredient {
  ingredient: string;
  recipe: RecipeSchema;
}

export interface ProductSearchResponse {
  id: string;
  external_id: string;
  name: string;
  category_path: string;
  price?: number;
  currency?: "EUR";
  grammage?: string;
  main_image_href?: string;
  listing_id?: string;
}
