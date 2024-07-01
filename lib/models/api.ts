import type { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import type { Ingredient } from "./ingredient.model";
import type { ReweProduct } from "./rewe.model";
import type { Metadata } from "../search";
import type { RecipeSchema } from "./recipe-schema.model";

export interface SelectedProduct {
  quantity: number;
  product: ReweProduct;
}

export interface IngredientWithProducts extends Ingredient {
  products: ReweProduct[];
  selectedProducts?: SelectedProduct[];
}

export interface IngredientsSearchResponse {
  ingredients: IngredientWithProducts[];
}

export interface IngredientsOrderBody {
  ingredients: IngredientWithProducts[];
  reweCookies: string;
}

export interface IngredientsSearchBody {
  ingredients: Ingredient[];
  market: string;
}

export interface RecipesSearchResponse {
  recipes: ScoredPineconeRecord<Metadata>[];
}

export interface CreateBasketBody {
  ingredients: IngredientWithProducts[];
}

export interface CreateBasketResponse {
  basketId: string;
}
