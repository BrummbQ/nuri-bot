import type { IngredientWithProducts } from "./api";
import type { RecipeSchema } from "./recipe-schema.model";

export interface Basket {
  recipes: RecipeSchema[];
  ingredientsWithProducts?: IngredientWithProducts[];
}
