import type { IngredientWithProducts } from "./api";
import type { RecipeSchema } from "./recipe-schema.model";

export interface Basket {
  basketId: string;
  recipes: RecipeSchema[];
  ingredientsWithProducts?: IngredientWithProducts[];
  createdAt?: string;
}

export interface BasketOverview {
  basketId: string;
  title: string;
  image: string;
  recipeCount: number;
}
