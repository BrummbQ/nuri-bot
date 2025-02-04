import {
  getBasketById,
  getBasketIngredients,
  getBasketsByUserId,
  type BasketIngredientRow,
} from "../db";
import type {
  Basket,
  BasketOverview,
  IngredientWithProducts,
  ProductSearchResponse,
  RecipeSchema,
} from "../models";
import { findProduct } from "../search";

export function recipesFromIngredients(
  ingredients: BasketIngredientRow[],
): RecipeSchema[] {
  const recipes: RecipeSchema[] = [];
  ingredients.forEach((ingredient) => {
    if (
      ingredient.recipe_json != null &&
      recipes.find((r) => r["@id"] === ingredient.recipe_json!["@id"]) == null
    ) {
      recipes.push(ingredient.recipe_json);
    }
  });
  return recipes;
}

export async function collectSelectedProducts(
  ingredients: BasketIngredientRow[],
  token: string,
): Promise<Record<string, ProductSearchResponse>> {
  // collect products without duplicates
  const selectedProducts = new Set<string>();
  ingredients.forEach((i) => {
    if (i.product_id != null) {
      selectedProducts.add(i.product_id);
    }
  });

  // fetch products from api
  const products: Record<string, ProductSearchResponse> = {};
  await Promise.all(
    Array.from(selectedProducts).map(async (product_id) => {
      const product = await findProduct(product_id, token);
      if (product != null) {
        products[product_id] = product;
      }
    }),
  );
  return products;
}

export function collectIngredients(
  ingredients: BasketIngredientRow[],
  products: Record<string, ProductSearchResponse>,
) {
  const ingredientsRecord = ingredients.reduce(
    (acc, ingredient) => {
      const existingIngredient = acc[ingredient.ingredient_id];
      const existingProduct = ingredient.product_id
        ? products[ingredient.product_id]
        : null;
      const ingredientQuantity = ingredient.ingredient_json.quantity ?? 0;
      const productQuantity = ingredient.product_quantity ?? 0;

      if (existingIngredient != null && existingIngredient.quantity != null) {
        existingIngredient.quantity += ingredientQuantity;
        if (existingIngredient.selectedProducts?.length) {
          existingIngredient.selectedProducts[0].quantity += productQuantity;
        }
      } else {
        const ingredientWithProducts: IngredientWithProducts = {
          quantity: ingredient.ingredient_json.quantity,
          unit: ingredient.ingredient_json.unit,
          productName: ingredient.ingredient_json.productName,
          selectedProducts: [],
          products: [],
          recipes: [],
        };
        if (existingProduct != null) {
          const selectedProduct = {
            quantity: productQuantity,
            product: existingProduct,
          };
          ingredientWithProducts.selectedProducts = [selectedProduct];
        }

        acc[ingredient.ingredient_id] = ingredientWithProducts;
      }

      return acc;
    },
    {} as Record<string, IngredientWithProducts>,
  );
  return Object.values(ingredientsRecord);
}

export async function getBasket(
  basketId: string,
  token: string,
): Promise<Basket> {
  const basket = await getBasketById(basketId);
  if (basket == null) {
    throw new Error(`Basket with id ${basketId} not found!`);
  }
  const ingredients = await getBasketIngredients(basketId);
  const recipes = recipesFromIngredients(ingredients);
  const products = await collectSelectedProducts(ingredients, token);
  const ingredientsWithProducts = collectIngredients(ingredients, products);

  return {
    basketId: basketId,
    userId: basket.user_id,
    recipes,
    ingredientsWithProducts,
    createdAt: basket.created_at,
  };
}

export async function getBasketRecipes(
  basketId: string,
): Promise<RecipeSchema[]> {
  const ingredients = await getBasketIngredients(basketId);
  return recipesFromIngredients(ingredients);
}

export async function getBasketsOverview(
  userId: string,
): Promise<BasketOverview[]> {
  const basketsResult = await getBasketsByUserId(userId);
  const baskets = await Promise.all(
    basketsResult.rows.map(async (basket) => ({
      id: basket.id,
      recipes: await getBasketRecipes(basket.id),
    })),
  );

  return baskets.map((b) => {
    const title = b.recipes[0]?.name ?? "Leerer Warenkorb";
    let image = "/images/placeholder.svg";
    if (b.recipes.length && b.recipes[0].image.length) {
      image = b.recipes[0].image[0] + "?impolicy=recipe-card";
    }

    return {
      basketId: b.id,
      title,
      image,
      recipeCount: b.recipes.length,
    };
  });
}
