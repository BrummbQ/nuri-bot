import {
  findProductByExternalId,
  findRecipeByExternalId,
  insertBasket,
  insertIngredient,
  insertRecipe,
  linkIngredientToProduct,
  linkIngredientToRecipe,
} from "../db";
import type {
  IngredientWithProducts,
  RecipeSchema,
  SelectedProduct,
} from "../models";
import { linkRecipeToIngredients } from "../search";

async function getOrCreateRecipeIds(
  i: IngredientWithProducts,
): Promise<number[]> {
  return await Promise.all(
    // find or insert recipes
    i.recipes.map(async (r) => {
      let recipeId = await findRecipeByExternalId(r);
      if (!recipeId) {
        recipeId = await insertRecipe(r, "REWE");
      }

      return recipeId;
    }),
  );
}

async function linkProducts(products: SelectedProduct[], ingredientId: number) {
  await Promise.all(
    products.map(async (p) => {
      // link ingredient to product
      const productId = await findProductByExternalId(p.product);
      if (productId != null) {
        await linkIngredientToProduct(ingredientId, productId, p.quantity);
      }
    }),
  );
}

export async function createBasket(
  recipes: RecipeSchema[],
  ingredients: IngredientWithProducts[],
  userId: string,
): Promise<string> {
  // first create basket
  const basketId = await insertBasket(userId);
  ingredients = linkRecipeToIngredients(recipes, ingredients);

  await Promise.all(
    ingredients.map(async (i) => {
      const recipeIds = await getOrCreateRecipeIds(i);

      // insert ingredient
      const ingredientId = await insertIngredient(i, basketId);

      await Promise.all(
        recipeIds.map(async (recipeId) => {
          await linkIngredientToRecipe(recipeId, ingredientId);
        }),
      );

      if (i.selectedProducts) {
        await linkProducts(i.selectedProducts, ingredientId);
      }
    }),
  );

  return basketId;
}

export async function updateListingInBasket(
  listingId: string,
  quantity: number,
  cookie: string,
) {
  const headers = {
    accept: "application/vnd.com.rewe.digital.basket-v2+json",
    cookie,
  };

  return await $fetch(
    `https://shop.rewe.de/api/baskets/listings/${listingId}`,
    {
      method: "POST",
      headers,
      body: {
        quantity,
        includeTimeslot: false,
        context: "product-list-search",
      },
    },
  );
}
