import type { Ingredient, ProductSearchResponse } from "./ingredient.model";
import type { Basket, BasketOverview } from "./basket-store.model";
import type { RecipeSchema } from "./recipe-schema.model";

export interface SelectedProduct {
  quantity: number;
  product: ProductSearchResponse;
}

export interface IngredientWithProducts extends Ingredient {
  products: ProductSearchResponse[];
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
  recipes: RecipeSchema[];
  market: string;
}

export interface MenuRecipesResponse {
  recipes: RecipeSchema[];
}

export interface CreateBasketBody {
  basketId: string;
  ingredients: IngredientWithProducts[];
  recipes: RecipeSchema[];
}

export interface CreateBasketResponse {
  basketId: string;
}

export interface ShareBasketResponse {
  shareUrl: string;
}

export interface GetBasketResponse {
  basket: Basket;
}

export interface GetBasketsResponse {
  baskets: BasketOverview[];
}

export interface SearchGenerateRecipeBody {
  ingredients: Ingredient[];
}

export interface SearchGenerateRecipeResponse {
  recipe: RecipeSchema;
}

export interface LikeRecipeBody {
  like: boolean;
}

export interface LikedRecipesResponse {
  recipes: RecipeSchema[];
}
