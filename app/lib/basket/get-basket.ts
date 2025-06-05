import {
  getBasketById,
  getBasketByShareToken,
  getBasketIngredients,
  getBasketsByUserId,
  getRecipesByBasket,
  type BasketIngredientRow,
} from "../db";
import type {
  Basket,
  BasketOverview,
  IngredientWithProducts,
  ProductSearchResponse,
} from "../models";
import { findProduct } from "../search";

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
  return ingredients.map((ingredient) => {
    const ingredientWithProducts: IngredientWithProducts = {
      quantity: ingredient.ingredient_json.quantity,
      unit: ingredient.ingredient_json.unit,
      productName: ingredient.ingredient_json.productName,
      selectedProducts: [],
      products: [],
      recipes: [],
    };

    // find product for ingredient
    const existingProduct = ingredient.product_id
      ? products[ingredient.product_id]
      : null;
    const productQuantity = ingredient.product_quantity ?? 0;
    // add product to ingredient
    if (existingProduct != null) {
      const selectedProduct = {
        quantity: productQuantity,
        product: existingProduct,
      };
      ingredientWithProducts.selectedProducts = [selectedProduct];
    }

    return ingredientWithProducts;
  });
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
  const recipes = await getRecipesByBasket(basketId);
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

export async function getBasketsOverview(
  userId: string,
): Promise<BasketOverview[]> {
  const basketsResult = await getBasketsByUserId(userId);
  const baskets = await Promise.all(
    basketsResult.rows.map(async (basket) => ({
      id: basket.id,
      recipes: await getRecipesByBasket(basket.id),
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

export async function getSharedBasket(
  shareToken: string,
  sessionToken: string,
): Promise<Basket> {
  const basket = await getBasketByShareToken(shareToken);
  if (basket == null) {
    throw new Error(`Basket share ${shareToken} not found or expired!`);
  }

  return await getBasket(basket.id, sessionToken);
}
