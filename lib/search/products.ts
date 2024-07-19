import type { ReweProduct, ReweProductsResponse } from "../models/rewe.model";
import { getEmbedding } from "./embeddings";
import {
  insertProducts,
  searchProductsByEmbedding,
  searchProductsByTsquery,
} from "../db";
import type { Ingredient } from "../models";

export function cleanupSearchQuery(search: string): string {
  return search.replace(/\s*\(.*?\)\s*/g, "");
}

export async function searchProducts(
  search: string,
  market: string,
  pageSize = 10,
  page = 1,
): Promise<ReweProductsResponse> {
  const result = await $fetch<ReweProductsResponse>(
    "https://shop.rewe.de/api/products",
    {
      query: {
        search,
        objectsPerPage: pageSize,
        serviceTypes: "PICKUP",
        sorting: "TOPSELLER_DESC",
        page,
        market,
      },
    },
  );
  return result;
}

export async function searchEmbeddedProducts(
  search: string,
  market: string,
): Promise<ReweProduct[]> {
  search = cleanupSearchQuery(search);
  const searchEmbedding = await getEmbedding(search);
  const searchQuery = `[${searchEmbedding}]`;

  const result = await searchProductsByEmbedding(market, searchQuery);

  return result.rows.map((r) => r.data);
}

export async function searchSimilarProducts(
  ingredient: Ingredient,
  market: string,
) {
  const result = await searchProductsByTsquery(market, ingredient);

  return result.rows.map((r) => r.data);
}

export async function loadProducts(marketId: string, page = 1) {
  const productResponse = await searchProducts("", marketId, 100, page);

  const products = productResponse._embedded.products;
  await insertProducts(products, marketId);
  console.log(`Inserted ${products.length} products`);

  if (productResponse.pagination.totalPages > page) {
    await loadProducts(marketId, page + 1);
  }
}
