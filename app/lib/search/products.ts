import type { Ingredient, ProductSearchResponse } from "../models";

export async function searchSimilarProducts(
  ingredient: Ingredient,
  marketId: string,
  token: string,
) {
  const result = await $fetch<ProductSearchResponse[]>(
    `${process.env.PRODUCTS_API}/api/v1/products/search`,
    {
      method: "GET",
      headers: { authorization: `Bearer ${token}` },
      query: { marketId, productName: ingredient.productName },
    },
  );
  return result;
}

export async function findProduct(id: string, token: string) {
  try {
    const result = await $fetch<ProductSearchResponse>(
      `${process.env.PRODUCTS_API}/api/v1/products/${id}`,
      {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      },
    );
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
